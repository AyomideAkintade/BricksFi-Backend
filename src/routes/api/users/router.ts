import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { User } from '../../../models/Users';
import { PublicKey } from '@solana/web3.js';

export const userRouter = express.Router();

userRouter.get('/fetch', async (req, res) => {
    const { userId } = req['user'];
    try {
        const  user = new User(userId);

        const userResponse = await user.fetch();
        if(!userResponse){
            return res.status(StatusCodes.NOT_FOUND).json({ success:  false, message: "User was not found", data: {} })
        }
        
        res.status(StatusCodes.OK).json({
            success: true,
            message: "success",
            data: userResponse
        })
    }
    catch(error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success:  false, message: "Intenal server error", data: {} });
    }

})

userRouter.post('/update/key', async (req, res) => {
    const { userId } = req['user'];
    try {
        const { account_key } = req.body;
       const pKey = new PublicKey(account_key); // throws an error if there's a problemm

        if(!account_key){
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Invalid parameters",
                data: {}
            });
        }

        const user = new User(userId);
        await user.init();

        await user.updateAccountKey(account_key);



        return res.status(StatusCodes.OK).json({ success: true, message: "User account key updated", data: {} })

    }
    catch (error) {
        //console.error(error);
        let errorCode = StatusCodes.INTERNAL_SERVER_ERROR
        if(error.message == "User doesn't exist"){
            errorCode = StatusCodes.NOT_FOUND;
        }
        else if(error.message == "Invalid public key input"){
            errorCode = StatusCodes.BAD_REQUEST;
        }
        return res.status(errorCode).json({ success: false, message: error.message, data: {} });
    }
})