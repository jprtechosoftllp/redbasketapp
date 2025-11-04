import { NextFunction, Request, Response } from 'express'
import { and, eq } from 'drizzle-orm';
import bcryptjs from 'bcryptjs';
import { forgotPasswordValidation, loginValidation, registerValidation } from '../../utils/validations/admin';
import { otpRestrictionsEmail, sendOtpEmail, teackOtpRequestEmail, verifyOtpEmail } from '../../helper/OTP/email';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { AuthError, ValidationError } from '@packages/backend/errors';
import postgresDB from '@packages/backend/db/postgresSql';
import adminsSchema from '@packages/backend/schema/admin';
import setCookies from '../../utils/cookies/commen';
// import vendorManagerSchema from '@packages/backend/schema/manager';
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format

export const sendOTpEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, username, formType } = req.body;

        if (!emailRegex.test(email)) {
            throw new ValidationError("Invalid email format.")
        }
        const users = await postgresDB.select().from(adminsSchema).where(
            eq(adminsSchema.email, email),
        ).limit(1);
        const user = users[0]


        if (formType === 'register') {
            if (user) {
                return next(new ValidationError("User already exits with this email!."));
            }
        }

        if (formType === 'forgot-password') {
            if (!user) {
                return next(new ValidationError("User dose not exits with this email!."));
            }
        }

        await otpRestrictionsEmail(email, next);
        await teackOtpRequestEmail(email, next);

        const templateName = formType === 'register' ? "admin-activation-mail" : "forgot-password-admin-mail"

        await sendOtpEmail(email, username, templateName, next);

        return res.status(201).json({
            message: `OTP send to this email. Please verify your account`
        })

    } catch (error) {
        console.log("Error is admin > controllers > admin > register :", error);
        return next(error);
    }
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        registerValidation(req.body);


        const { email, password, phone, photo, username, otp } = req.body;

        const users = await postgresDB.select().from(adminsSchema).where(and(
            eq(adminsSchema.email, email),
            eq(adminsSchema.phone, phone)
        )).limit(1);

        const user = users[0]

        const salt = await bcryptjs.genSalt(10);
        const hasPassword = await bcryptjs.hash(password, salt);

        if (user) {
            return next(new ValidationError("User already esits with this Phone and email!."))
        }

        await otpRestrictionsEmail(email, next);
        await teackOtpRequestEmail(email, next);

        await verifyOtpEmail(email, otp, next);

        await postgresDB.insert(adminsSchema).values({
            email,
            phone,
            password: hasPassword,
            photo,
            role: 'admin',
            username
        });

        return res.status(201).json({
            message: `OTP send to this email. Please verify your account`
        })

    } catch (error) {
        console.log("Error is admin > controllers > admin > register :", error);
        return next(error)
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        loginValidation(req.body);
        const { email, password } = req.body;

        const users = await postgresDB.select().from(adminsSchema).where(eq(adminsSchema.email, email)).limit(1);
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
            { id: user.id, email: user.email, role: user.role },
            process.env.ACCESS_TOKEN_JWT_SECRET as string,
            { expiresIn: '7d' }
        )

        const refreshToken = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.REFRESH_TOKEN_JWT_SECRET! as string,
            {
                expiresIn: "7d"
            }
        );

        // store the refresh and access token in httpOnly secure cookie

        setCookies(res, "admin_refresh_token", refreshToken);
        setCookies(res, "admin_access_token", accessToken);

        return res.status(200).json({
            message: "LogIn successfully",
            user: { id: user.id, email: user.email, role: user.role }
        });

    } catch (error) {
        console.log("Error is auth-service > controllers > admin > login :", error);
        return next(error)
    }
}

// User Logout
export const logOut = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie("admin_access_token", {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });
        res.clearCookie("admin_refresh_token", {
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

export const forgotPasseord = async (req: Request, res: Response, next: NextFunction) => {
    try {

        forgotPasswordValidation(req.body);
        const { password, email, otp } = req.body;

        await otpRestrictionsEmail(email, next);
        await teackOtpRequestEmail(email, next);

        await verifyOtpEmail(email, otp, next);

        const users = await postgresDB.select().from(adminsSchema).where(eq(adminsSchema.email, email));

        const user = users[0];

        if (!user) {
            return next(new ValidationError("User dosn't exists with this email!"))
        }

        const hashPassword = await bcryptjs.hash(password, 10);

        await postgresDB.update(adminsSchema).set({
            password: hashPassword,
            updatedAt: new Date().toISOString()
        });

        return res.status(201).json({
            message: "Password successfully update"
        });

    } catch (error) {
        console.log("Error is auth-service > controllers > admin > forgotPasseord :", error);
        return next(error)
    }
}

export const getAdmin = async (req: any, res: Response, next: NextFunction) => {
    try {
        const admin = req.admin;

        return res.status(200).json({
            message: "Get user successfully!",
            admin,
            success: true
        })
    } catch (error) {
        console.log("Error is auth-service > controllers > admin > getAdmin :", error);
        return next(error)
    }
}

// refresh token
export const refreshTokenAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Use the correct cookie name
        const refresh_token = req.cookies['admin_refresh_token'];

        if (!refresh_token) {
            return next(new ValidationError("Unauthorized! No refresh token."))
        }
        const decoded = jwt.verify(
            refresh_token,
            process.env.REFRESH_TOKEN_JWT_SECRET as string
        ) as { id: number, email: string, role: string }

        if (!decoded || !decoded.id || !decoded.email || !decoded.role) {
            return next(new JsonWebTokenError("Forbidden Invalid refresh token"));
        }

        const users = await postgresDB.select().from(adminsSchema).where(eq(adminsSchema.id, Number(decoded.id))).limit(1);
        const user = users[0]

        if (!user) {
            return next(new AuthError("Forbidden! User/Admin not found"))
        }

        const newAccessToken = jwt.sign({
            id: decoded.id, emial: decoded.email
        }, process.env.ACCESS_TOKEN_JWT_SECRET!, { expiresIn: "7d" })

        setCookies(res, "admin_access_token", newAccessToken);
        return res.status(201).json({ success: true })
    } catch (error) {
        console.log(`[Error is auth > controllers > admin > refreshToken], ${error}`);
        return next(error);
    }
}