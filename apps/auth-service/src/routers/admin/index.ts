import express from "express";
import { forgotPasseord, getAdmin, login, refreshTokenAdmin, register, sendOTpEmail } from "../../controllers/admin";
import { isAuthenticatedAdmin } from "@packages/backend/middlewares/auth";

const adminRouter = express.Router();

adminRouter.post('/sign-up', register);
adminRouter.post('/send-otp', sendOTpEmail);
adminRouter.post('/forgot-password', forgotPasseord);
adminRouter.post('/login', login);
adminRouter.get('/logged-in', isAuthenticatedAdmin, getAdmin);
adminRouter.post('/refresh-token', refreshTokenAdmin)

export default adminRouter;