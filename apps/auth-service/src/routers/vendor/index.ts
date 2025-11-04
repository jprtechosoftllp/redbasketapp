import express, { Router } from 'express';
import { createVendor, sendOTpEmail } from '../../controllers/vendor';
import { isAuthenticatedAdmin, isAuthenticatedManager } from '@packages/backend/middlewares/auth';

const vendorRouter:Router = express.Router();

vendorRouter.post('/send-otp', sendOTpEmail);
vendorRouter.post('/create-vendor', isAuthenticatedManager, createVendor);
vendorRouter.post('/create-vendor-admin', isAuthenticatedAdmin, createVendor)

export default vendorRouter;