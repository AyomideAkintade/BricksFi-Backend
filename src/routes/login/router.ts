import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Login from '../../models/Login';


export const loginRouter = express.Router();

loginRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;


        if(!email || !password) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Invalid parameters",
                data: {}
            });
        }

        const users = new Login();
        const response = await users.login(
            {
                email: email,
                password: password
            }
        );

        let statusCode: StatusCodes;

        switch(response.success){
            case true:
                statusCode = StatusCodes.OK;
                break;
            case false:
                statusCode = StatusCodes.UNAUTHORIZED;
                break;
            default:
                statusCode = StatusCodes.NOT_FOUND;
        }

        return res.status(statusCode).json(response);
    }
    catch (error){
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success:  false, message: "Intenal server error", data: {} });
    }
});



loginRouter.post('/register', async (req, res) => {
    try {
        const { email, password, first_name, last_name, phone_number } = req.body;

        if(!email || !password || !first_name || !last_name || !phone_number) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Invalid parameters",
                data: {}
            });
        }

        const users = new Login();
        const response = await users.register(
            {
                email: email,
                password: password,
                first_name: first_name,
                last_name: last_name,
                phone_number: phone_number
            }
        );

        let statusCode: StatusCodes;

        switch(response.success){
            case true:
                statusCode = StatusCodes.OK;
                break;
            case false:
                statusCode = StatusCodes.FORBIDDEN;
                break;
            default:
                statusCode = StatusCodes.NOT_FOUND;
        }

        return res.status(statusCode).json(response);
    }
    catch (error){
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success:  false, message: "Intenal server error", data: {} });
    }
});

loginRouter.post('/verify', async (req, res)=>{
    try {
        const { code, email } = req.body;
        if(!code || !email) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Invalid parameters",
                data: {}
            });
        }

        const users = new Login();
        if(typeof code != "number"){
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Code must be a number",
                data: {}
            });
        }
        const response = await users.verify(
            {
                email: email,
                code: code
            }
        );

        let statusCode: StatusCodes;

        switch(response.success){
            case true:
                statusCode = StatusCodes.OK;
                break;
            case false:
                statusCode = StatusCodes.BAD_GATEWAY;
                break;
            default:
                statusCode = StatusCodes.NOT_FOUND;
        }

        return res.status(statusCode).json(response);
    }
    catch (error){
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success:  false, message: "Intenal server error", data: {} });
    }
});