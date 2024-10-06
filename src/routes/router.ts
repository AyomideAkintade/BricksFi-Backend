import express from 'express';
import { excludeFromAuth } from './auth/middleware';
import { apiRouter } from './api/router';
import { loginRouter } from './login/router';

const endpointsRouter = express.Router();

endpointsRouter.use(excludeFromAuth(['/auth/login', '/auth/register', '/auth/verify']));
endpointsRouter.use('/auth', loginRouter);
endpointsRouter.use('/api', apiRouter);


export { endpointsRouter };