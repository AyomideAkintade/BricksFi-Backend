import jwt from "jsonwebtoken";
import pool from "../db/connect";
import Table from "../db/query"
import APIResponse from "../interface/api.interface";
import { env } from "../utils/env";
import { comparePassword, hashPassword } from "../utils/password";
import { createRandomCode, isEmpty, isValidEmail, isValidPassword, isValidPhone } from "../utils/utils";
import Mail from "./Mail";
import { PoolClient } from "pg";
import { AccountState } from "../interface/users.interface";

export default class Login {
    table: Table
    constructor(){
        this.table = new Table("users");   
    }

    async login({email, password}: {email: string, password: string}) : Promise<APIResponse> {
        const result = await this.table.select({
            conditions: {
                compulsory: [
                    {
                        key: "email",
                        value: email
                    },
                ]
            }
        });

        if(isEmpty(result)) {
            return {
                message: "Invalid email or password",
                success: false,
                data: {}
            }
        }

        const hashedPassword = result[0]['password'];
        const isMatch = await comparePassword(password, hashedPassword);

        if(!isMatch) {
            return {
                message: "Invalid email or password",
                success: false,
                data: {}
            }
        }
        
        switch (result[0]['status']) {
            case AccountState.DISABLED:
                if(!result[0]['is_verified']){
                    const currentTime = new Date();

                    const expiryTime = new Date(currentTime.getTime() + (2 * 60 * 60 * 1000));

                    const expiryTimeString = expiryTime.toISOString();

                    const verificationCode = createRandomCode();


                    this.table.update(
                        [
                            "verification_code",
                            "code_expires"
                        ],
                        [
                            verificationCode,
                            expiryTimeString
                        ],
                        {
                            compulsory: [
                                {
                                    key: "email",
                                    value: email
                                }
                            ]
                        }
                    );

                    const mail = new Mail(email);
                    await mail.sendRegisterCode(verificationCode);

                    return {
                        message: "Account isn't verified. Check emaiil for verification code.",
                        success: false,
                        data: {}
                    }
                }
            //other cases if they're added
        
            default:
                break;
        }

        const date = new Date();
        const currentDate = date.toISOString();

        const bearerToken = this.generateLoginToken(
            {
                userId: result[0]["id"],
                email: email

            }, 30*24*60*60); // expires 30 days = 30*24*60*60
        
        await this.table.update(
            [
                'last_login',
                'last_updated'
            ],
            [
                currentDate,
                currentDate
            ],
            {
                compulsory: [
                    {
                        key: "email",
                        value: email
                    },
                    {
                        key: "id",
                        value: result[0]['id']
                    }
                ]
            }
        );

        return {
            message: 'success',
            data: {
                token: bearerToken,
                expires_in: 30*24*60*60,
                token_type: "jwt",
            },
            success: true
        };

    }

    async register(params: RegisterParams): Promise<APIResponse> {
        let client: PoolClient;
        try {
            const { email, password, first_name: firstName, last_name: lastName, phone_number: phoneNumber } = params;

            if(!isValidEmail(email) || !isValidPassword(password) || isEmpty(firstName) || isEmpty(lastName) ||  !isValidPhone(phoneNumber)){
                return {
                    success: false,
                    message: "Invalid parameters",
                    data: {}
                };
            }

            const result = await this.table.select({
                conditions: {
                    compulsory: [
                        {
                            key: "email",
                            value: email
                        },
                    ]
                }
            });

            if(!isEmpty(result)) {
                return {
                    message: "Email address already exists.",
                    success: false,
                    data: {}
                }
            }

            const hashedPassword = await hashPassword(password);

            

            const currentTime = new Date();

            const expiryTime = new Date(currentTime.getTime() + (2 * 60 * 60 * 1000));

            const expiryTimeString = expiryTime.toISOString();

            const verificationCode = createRandomCode();

            client = await pool.connect();
            await client.query('BEGIN');


            this.table.insert(
                [
                    "email",
                    "password",
                    "first_name",
                    "last_name",
                    "phone_number",
                    "verification_code",
                    "code_expires"
                ],
                [
                    email,
                    hashedPassword,
                    firstName,
                    lastName,
                    phoneNumber,
                    verificationCode,
                    expiryTimeString
                ]
            );

            await client.query('COMMIT');

            // sendmail

            const mail = new Mail(email);
            await mail.sendRegisterCode(verificationCode);

            return {
                success: true,
                message: "Account successfully created",
                data: {}
            }

            
        }
        catch (error) {
            if (client) {
                await client.query('ROLLBACK');
            }
            console.error(error);
            throw new Error(error);
        }
        finally {
            if(client){
                client.release();
            }
        }
    }


    async verify({email, code} : {email: string, code: number | string}) : Promise<APIResponse> {
        let client: PoolClient
        try {
            email = email.trim();
            code = code.toString().trim();

            client = await pool.connect();
            await client.query('BEGIN');

            const result = await this.table.customQuery("SELECT * FROM users WHERE is_verified=false AND status='inactive' AND verification_code=$1 AND email=$2 AND code_expires >= NOW()", [code, email]);


            if(isEmpty(result['rows'] as any[])) {
                await client.query('ROLLBACK');
                return {
                    success: false,
                    message: "Failed to verify account. Invalid data provided or code has expired.",
                    data: {}
                }
            }

            const currentTime = new Date();
            const currentIsoTime = currentTime.toISOString();

            const compulsoryConditions = [{
                key: "is_verified",
                value: false
            },
            {
                key: "status",
                value: "inactive"
            },
            {
                key: "verification_code",
                value: code
            },
            {
                key: "email",
                value: email
            }]

            this.table.update(
                [
                    "is_verified",
                    "verification_time",
                    "status",
                    "code_expires",
                ], [
                    true,
                    currentIsoTime,
                    'active',
                    currentIsoTime
                ], {
                  compulsory: compulsoryConditions  
                }
            )

            await client.query('COMMIT');

            return {
                success: true,
                message: "Successfully verified account",
                data: {}
            }

        }
        catch(error) {
            if (client) {
                await client.query('ROLLBACK');
                console.error("Error verifying user", error);
                throw new Error("An error occured while verifying user");
            }
        }
        finally {
            if (client) {
                client.release(); // Release client back to the pool
            }
        }
    }
    private generateLoginToken(data: any, expiresIn?: number) : string {
        const token = jwt.sign(data, env.SECURE_USER_AUTH_KEY, expiresIn && {expiresIn});
        return token;
    }

}


interface RegisterParams {
    email: string,
    password: string,
    first_name: string,
    last_name: string,
    phone_number: string
}