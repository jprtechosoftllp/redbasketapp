import express, { Router } from 'express';
import { createManager, forgotPasseord, getManager, login, sendOTpEmailManager } from '../../controllers/manager';
import { isAuthenticatedAdmin, isAuthenticatedManager } from '@packages/backend/middlewares/auth';

const managerRouter:Router = express.Router();

managerRouter.post('/login', login);
managerRouter.post('/forgot-password', forgotPasseord);
managerRouter.get('/logged-in', isAuthenticatedManager, getManager);
managerRouter.post('/create-manager', isAuthenticatedAdmin, createManager);
managerRouter.post('/send-otp', sendOTpEmailManager)

export default managerRouter;