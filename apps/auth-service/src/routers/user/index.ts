import express, { Router } from 'express';
import { sendOTP, userLoginOTP } from '../../controllers/user';

const userRouter:Router = express.Router();

userRouter.post('/login', userLoginOTP)
userRouter.post('/send-otp', sendOTP)

export default userRouter;