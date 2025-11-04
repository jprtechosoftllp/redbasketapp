import { NextFunction, Request, Response } from 'express'
import { forgotPasswordValidation, loginValidation, registerValidation } from '../../utils/validations/admin';
import { AuthError, ForbiddeeError, ValidationError } from '@packages/backend/errors';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import setCookies from '../../utils/cookies/commen';
import { otpRestrictionsEmail, sendOtpEmail, teackOtpRequestEmail, verifyOtpEmail } from '../../helper/OTP/email';
import bcryptjs from 'bcryptjs';
import postgresDB from '@packages/backend/db/postgresSql';
import { and, eq } from 'drizzle-orm';
import managerSchema from '@packages/backend/schema/manager';
import vendorSchema from '@packages/backend/schema/vendor';
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format



export const sendOTpEmailManager = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { email, username, formType } = req.body;

        if (!emailRegex.test(email)) {
            return next(new ValidationError("Invalid email format."))
        }
        const users = await postgresDB.select().from(managerSchema).where(eq(managerSchema.email, email)).limit(1);

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

        await otpRestrictionsEmail(email, next);
        await teackOtpRequestEmail(email, next);

        const templateName = formType === 'register' ? "manager-activation-mail" : "forgot-password-manager-mail"

        await sendOtpEmail(email, username, templateName, next);

        return res.status(201).json({
            message: `OTP send to this email. Please verify your account`
        })

    } catch (error) {
        console.log("Error is admin > controllers > manager > sendOTpEmailManager :", error);
        return next(error);
    }
}


export const createManager = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { email, phone, password, username, otp, photo } = req.body;

        registerValidation(req.body);

        const admin = req.admin ?? "user";

        if (admin.role === "user") {
            return next(new ForbiddeeError("Access denied. Only sellers are allowed to perform this action."))
        }

        await otpRestrictionsEmail(email, next);
        await teackOtpRequestEmail(email, next);
        await verifyOtpEmail(email, otp, next);



        const users = await postgresDB.select().from(managerSchema).where(and(
            eq(managerSchema.phone, phone),
            eq(managerSchema.email, email)
        )).limit(1);

        const user = users[0]

        if (user) {
            return next(new ValidationError("User already esits with this Phone and email!."))
        }

        const salt = await bcryptjs.genSalt(10);

        const hashPassword = await bcryptjs.hash(password, salt);

        const manager = await postgresDB.insert(managerSchema).values({
            password: hashPassword,
            email,
            phone,
            role: "manager",
            photo,
            username,
        });

        return res.status(201).json({
            message: "Manager is create successfully!",
            success: true,
            manager
        })

    } catch (error) {
        console.log("Error is auth-service > controllers > manager > createManager :", error);
        return next(error)
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        loginValidation(req.body);

        const { email, password } = req.body;

        const users = await postgresDB.select().from(managerSchema).where(eq(managerSchema.email, email)).limit(1);
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

        setCookies(res, "manager_refresh_token", refreshToken);
        setCookies(res, "manager_access_token", accessToken);

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
        res.clearCookie("manager_access_token", {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });
        res.clearCookie("manager_refresh_token", {
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

        const users = await postgresDB.select().from(managerSchema).where(eq(managerSchema.email, email));

        const user = users[0];

        if (!user) {
            throw new ValidationError("User dosn't exists with this email!");
        }

        const hashPassword = await bcryptjs.hash(password, 10);

        await postgresDB.update(managerSchema).set({
            password: hashPassword,
            updatedAt: new Date().toISOString()
        });

        res.status(201).json({
            message: "Password successfully update"
        });

    } catch (error) {
        console.log("Error is auth-service > controllers > admin > forgotPasseord :", error);
        next(error)
    }
}



export const getManager = async (req: any, res: Response, next: NextFunction) => {
    try {
        const admin = req.manager;

        res.status(200).json({
            message: "Get user successfully!",
            admin,
            success: true
        })
    } catch (error) {
        console.log("Error is auth-service > controllers > admin > getAdmin :", error);
        next(error)
    }
}

// refresh token
export const refreshTokenManager = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Use the correct cookie name
        const refresh_token = req.cookies['manager_refresh_token'];

        if (!refresh_token) {
            throw new ValidationError("Unauthorized! No refresh token.")
        }
        const decoded = jwt.verify(
            refresh_token,
            process.env.REFRESH_TOKEN_JWT_SECRET as string
        ) as { id: number, email: string, role: string }

        if (!decoded || !decoded.id || !decoded.email) {
            return new JsonWebTokenError("Forbidden Invalid refresh token");
        }

        const users = await postgresDB.select().from(vendorSchema).where(eq(vendorSchema.id, Number(decoded.id))).limit(1);
        const user = users[0]

        if (!user) {
            return new AuthError("Forbidden! User/Admin not found")
        }

        const newAccessToken = jwt.sign({
            id: decoded.id, emial: decoded.email
        }, process.env.ACCESS_TOKEN_JWT_SECRET!, { expiresIn: "7d" })

        setCookies(res, "manager_access_token", newAccessToken);
        res.status(201).json({ success: true })
    } catch (error) {
        console.log(`[Error is auth > controllers > admin > refreshToken], ${error}`);
        return next(error);
    }
}