import express from 'express';
import { userRouter } from './users/router';

export const apiRouter = express.Router();

apiRouter.use('/user', userRouter);
