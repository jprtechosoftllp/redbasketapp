import { Request, Response, NextFunction } from 'express'
import { ValidationError } from "@packages/backend/errors";
import { otpRestrictionsEmail, sendOtpEmail, teackOtpRequestEmail, verifyOtpEmail } from '../../helper/OTP/email';
import vendorSchema from "@packages/backend/schema/vendor";
import postgresDB from "@packages/backend/db/postgresSql";
import bcryptjs from 'bcryptjs'
import { and, eq } from 'drizzle-orm';
import setCookies from '../../utils/cookies/commen';
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format
import jwt from 'jsonwebtoken'
import { loginValidation } from '../../utils/validations/admin';

export const sendOTpEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, username, phone, formType } = req.body;

        if (!emailRegex.test(email)) {
            return next(new ValidationError("Invalid email format."))
        }

        await otpRestrictionsEmail(email, next);
        await teackOtpRequestEmail(email, next);

        const users = await postgresDB.select().from(vendorSchema).where(and(
            eq(vendorSchema.email, email),
            eq(vendorSchema.phone, phone)
        )

        ).limit(1);
        const user = users[0]

        if (formType === 'register') {
            if (user) {
                return next(new ValidationError("User already exits with this email!."))
            }
        }

        if (formType === 'forgot-password') {
            if (!user) {
                return next(new ValidationError("User dose not exits with this email!."))
            }
        }

        const templateName = formType === 'register' ? "vendor-activation-mail" : "forgot-password-vendor-mail"

        await sendOtpEmail(email, username, templateName, next);

        return res.status(201).json({
            message: `OTP send to this email. Please verify your account`
        })

    } catch (error) {
        console.log("Error is admin > controllers > vendor > sendOTpEmail :", error);
        return next(error);
    }
}

export const createVendor = async (req: any, res: Response, next: NextFunction) => {
    try {

        const { email, phone, username, otp, password, shop_address, shop_pinCode,
            shop_name, shop_city, shop_state, bank_account,
            ifsc_code, gst_number, fssai_license
        } = req.body;

        await otpRestrictionsEmail(email, next);
        await teackOtpRequestEmail(email, next);

        await verifyOtpEmail(email, otp, next);

        const users = await postgresDB.select().from(vendorSchema).where(and(
            eq(vendorSchema.phone, phone),
            eq(vendorSchema.email, email)
        )).limit(1);

        const user = users[0]

        if (user) {
            return next(new ValidationError("User already esits with this Phone and email!."))
        }

        const salt = await bcryptjs.genSalt(10);
        const hasPassword = await bcryptjs.hash(password, salt);

        const vendor = await postgresDB.insert(vendorSchema).values({
            phone,
            password: hasPassword,
            username,
            shop_address,
            shop_city,
            shop_pinCode,
            shop_name,
            shop_state,
            bank_account,
            ifsc_code,
            gst_number,
            fssai_license,
            email
        });

        return res.status(201).json({
            message: "Vendor created Successfully!",
            vendor
        })

    } catch (error) {
        console.log("Error is admin > controllers > admin > register :", error);
        return next(error);
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        loginValidation(req.body);

        const { email, password } = req.body;

        const users = await postgresDB.select().from(vendorSchema).where(eq(vendorSchema.email, email)).limit(1);
        const user = users[0]

        if (!user) {
            return next(new ValidationError("User dosn't exists with these email and password!"))
        }

        const isMatch = await bcryptjs.compare(password, user.password);

        if (!isMatch) {
            return next(new ValidationError("User dosn't exists with these email and password!"))
        }

        // Generate Token

        const accessToken = jwt.sign(
            { id: user.id, email: user.email },
            process.env.ACCESS_TOKEN_JWT_SECRET as string,
            { expiresIn: '7d' }
        )

        const refreshToken = jwt.sign(
            { id: user.id, email: user.email },
            process.env.REFRESH_TOKEN_JWT_SECRET! as string,
            {
                expiresIn: "7d"
            }
        );

        // store the refresh and access token in httpOnly secure cookie

        setCookies(res, "vendor_refresh_token", refreshToken);
        setCookies(res, "vendor_access_token", accessToken);

        return res.status(200).json({
            message: "LogIn successfully",
            user: { id: user.id, email: user.email, status: user.status }
        });

    } catch (error) {
        console.log("Error is auth-service > controllers > admin > login :", error);
        return next(error)
    }
}

// User Logout
export const logOut = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie("vendor_access_token", {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });
        res.clearCookie("vendor_refresh_token", {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        })

        return res.status(200).json({
            message: "Logout successfully."
        })

    } catch (error) {
        console.log("Error in user logOut controller:", error);
        return next(error)
    }
}