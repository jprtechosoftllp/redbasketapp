import express, { Router } from 'express';
import { getUserProfile, logOut, sendOTP, updateUserAddress, updateUserProfile, userLoginOTP } from '../controllers/user';
import { isAuthenticatedManager, isAuthenticatedUser } from '@packages/backend/middlewares/auth';
import { forgotPasseord, getAdmin, login, refreshTokenAdmin, register, sendOTpEmail } from "../controllers/admin";
import { isAuthenticatedAdmin } from "@packages/backend/middlewares/auth";
import { createVendor } from '../controllers/vendor';
import { createManager, getManager, sendOTpEmailManager } from '../controllers/manager';

const router:Router = express.Router();

router.post('/user/login', userLoginOTP)
router.post('/user/send-otp', sendOTP)
router.get('/user/logout', logOut)
router.get('/user/get-user', isAuthenticatedUser, getUserProfile)
router.post('/user/update', isAuthenticatedUser, updateUserProfile)
router.post('/user/update-address', isAuthenticatedUser, updateUserAddress)


router.post('/admin/sign-up', register);
router.post('/admin/send-otp', sendOTpEmail);
router.post('/admin/forgot-password', forgotPasseord);
router.post('/admin/login', login);
router.get('/admin/logged-in', isAuthenticatedAdmin, getAdmin);
router.post('/admin/refresh-token', refreshTokenAdmin)

router.post('/vendor/send-otp', sendOTpEmail);
router.post('/vendor/create-vendor', isAuthenticatedManager, createVendor);
router.post('/vendor/create-vendor-admin', isAuthenticatedAdmin, createVendor)

router.post('/manager/login', login);
router.post('/manager/forgot-password', forgotPasseord);
router.get('/manager/logged-in', isAuthenticatedManager, getManager);
router.post('/manager/create-manager', isAuthenticatedAdmin, createManager);
router.post('/manager/send-otp', sendOTpEmailManager)

export default router;