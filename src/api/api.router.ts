import { Router } from 'express';
import userRouter from './user/user.router';

const apiRouter = Router();

apiRouter.use('/users', userRouter);
apiRouter.use('/users', userRouter);

export default apiRouter;
