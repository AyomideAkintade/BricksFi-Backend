import Table from "../db/query";
import APIResponse from "../interface/api.interface";

export class Users {
    table: Table;
    constructor(){
        this.table = new Table("users");
    }

    async all() {
        const response = await this.table.select({
            cols: ["id", "email", "first_name", "last_name", "phone_number", "status", "is_verified", "account_key"]
        });

        return response;
    }

}

export class User extends Users {
    id: string;
    constructor(id: string){
        super();
        if(!id){
            throw new Error("Error constructing class");
        }
        this.id = id;
    }

    async init(): Promise<void> {
        const user = await this.fetch();
        if (!user) {
            throw new Error("User doesn't exist");
        }
    }


    async fetch(){
        try {
            const response = await this.table.select({
                cols: ["id", "email", "first_name", "last_name", "phone_number", "status", "is_verified", "account_key"],
                conditions: {
                    compulsory: [
                        {
                            key: "id",
                            value: this.id
                        }
                    ]
                }
            });

            if(!response) return

            return response[0];
        }
        catch (error) {
            console.error(error);
            throw "Internal server error";
        }
    }

    async updateAccountKey(newKey){
        try {
            const user = await this.fetch();
            if(!user) return

            await this.table.update(
                ["account_key"],
                [newKey],
                {
                    compulsory: [
                        {
                            key: "id",
                            value: this.id
                        }
                    ]
                }
            )
        }
        catch(error){
            throw error;
        }
    }
}