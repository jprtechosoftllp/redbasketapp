import express from 'express';
import { sendOTP, userLoginOTP } from '../../controllers/user';

const userRouter = express.Router();

userRouter.post('/login', userLoginOTP)
userRouter.post('/send-otp', sendOTP)

export default userRouter;