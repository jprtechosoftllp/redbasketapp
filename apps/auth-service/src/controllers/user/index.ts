import { Response, Request, NextFunction } from "express";
import {
    loginValidation,
    updateUserValidation,
    // registerValidation
} from "../../utils/validations/user";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { ValidationError } from "@packages/backend/errors";
import postgresDB from "@packages/backend/db/postgresSql";
import usersSchema from "@packages/backend/schema/user";
import { otpRestrictionsPhone, sendNumberOTPPhone, teackOtpRequestPhone, verifyOTPPhone } from "../../helper/OTP/phone";
import storeSetCookies from "../../utils/cookies/store";

// const phoneRegex = /^\+?[1-9]\d{1,14}$/;  // E.164 international phone number format
const phoneRegex = /^[6-9]\d{9}$/; // Indian phone number format


// // User Registration
// export const userRegister = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         registerValidation(req.body);
//         const { email, password, username, phone, city, state, address, pinCode } = req.body;
//         const users = await postgresDB.select().from(usersSchema).where(eq(usersSchema.phone, phone)).limit(1);
//         const user = users[0];

//         if (user && user.isVerified === true) {
//             throw new ValidationError("User already exists with this phone number.")
//         }

//         // Hash password
//         const salt = await bcryptjs.genSalt(10);
//         const hashPassword = await bcryptjs.hash(password, salt);

//         if (user && user.isVerified === false) {
//             // Update existing unverified user logic here
//             await postgresDB.update(usersSchema).set({
//                 email,
//                 password: hashPassword,
//                 username,
//                 city,
//                 state,
//                 default_address: address,
//                 pinCode,
//                 updatedAt: new Date().toISOString(),
//             }).where(eq(usersSchema.phone, phone));

//             // Check OTP restrictions
//             await otpRestrictionsPhone(Number(phone), next);
//             // track OTP request count
//             await teackOtpRequestPhone(Number(phone), next)

//             // Call function to send OTP
//             await senNumberdOTPPhone(phone, next);

//             return res.status(200).json({
//                 message: "Unverified user found. Details updated. OTP sent to phone for verification."
//             })
//         }

//         // Create new user logic here
//         const createdAt = new Date().toISOString();
//         await postgresDB.insert(usersSchema).values({
//             email,
//             password: hashPassword,
//             username,
//             phone,
//             default_address: address,
//             city,
//             state,
//             pinCode,
//             createdAt,
//         });

//         // Check OTP restrictions
//         await otpRestrictionsPhone(Number(phone), next);
//         // track OTP request count
//         await teackOtpRequestPhone(Number(phone), next)

//         // Call function to send OTP
//         await senNumberdOTPPhone(phone, next);

//         return res.status(201).json({
//             message: "Admin registered successfully. OTP sent to phone for verification."
//         });
//     } catch (error) {
//         console.log("Error in user registration controller:", error);
//         return next(error)
//     }
// }

// Resend User OTP
export const sendOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            return next(new ValidationError("Phone number is required"))
        };

        if (!phoneRegex.test(phone)) {
            return next(new ValidationError("Invalid phone number format."))
        };

        // Check OTP restrictions
        await otpRestrictionsPhone(Number(phone), next);
        // track OTP request count
        await teackOtpRequestPhone(Number(phone), next);

        // Call function to send OTP
        const otp = await sendNumberOTPPhone(Number(phone), next);

        return res.status(200).json({
            ststus: true,
            message: "OTP resent successfully to the provided phone number.",
            otp
        })

    } catch (error) {
        console.log("Error in user resendUserOTP controller:", error);
        return next(error)
    }
}


// User Login with OTP
export const userLoginOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {

        loginValidation(req.body);

        const { phone, otp } = req.body;
        await verifyOTPPhone(phone, otp, next);

        const checkUsers = await postgresDB.select().from(usersSchema).where(eq(usersSchema.phone, phone)).limit(1);

        const checkUser = checkUsers[0];
        if (!checkUser) {
            await postgresDB.insert(usersSchema).values({
                phone
            });
        }
        const users = await postgresDB.select().from(usersSchema).where(eq(usersSchema.phone, phone)).limit(1);

        const user = users[0]

        // Generate Token
        const accessToken = jwt.sign(
            { id: user.id, phone: user.phone },
            process.env.ACCESS_TOKEN_JWT_SECRET as string,
        )
        const refreshToken = jwt.sign(
            { id: user.id, phone: user.phone, },
            process.env.REFRESH_TOKEN_JWT_SECRET! as string,
        )

        // store the refresh and access token in httpOnly secure cookie
        storeSetCookies(res, "refresh_token", refreshToken);
        storeSetCookies(res, "access_token", accessToken);

        return res.status(200).json({
            message: "Login successfully.",
            status: true,
            access_token: accessToken,
            user: {
                id: user.id,
                phoneNumber: user.phone,
                username: user?.username,
                default_address: user?.default_address,
                loyalty_points: user.loyalty_points,
                wallet_balance: user.wallet_balance,
                city: user?.city,
                state: user?.state,
                pinCode: user?.pinCode
            }
        })

    } catch (error) {
        console.log("Error in user userLoginOTP controller:", error);
        return next(error)
    }
}

// User Logout
export const logOut = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });
        res.clearCookie("refresh_token", {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        })

        return res.status(200).json({
            status: true,
            message: "Logout successfully."
        })

    } catch (error) {
        console.log("Error in user logOut controller:", error);
        return next(error)
    }
}

// Get User Profile
export const getUserProfile = async (req: any, res: Response, next: NextFunction) => {
    try {

        const userId = req.user.id;

        const users = await postgresDB.select().from(usersSchema).where(eq(usersSchema.id, userId)).limit(1);
        const user = users[0];
        if (!user) {
            return next(new ValidationError("User not found."))
        }
        return res.status(200).json({
            status: true,
            user: {
                id: user.id, phone: user.phone, username: user.username,
                email: user.email, city: user.city,
                state: user.state, address: user.default_address, pinCode: user.pinCode,
                wallet: user.wallet_balance, loyalty_points: user.loyalty_points,
                createdAt: user.createdAt
            }
        })
    } catch (error) {
        console.log("Error in user getUserProfile controller:", error);
        return next(error)
    }
}

// Update User Profile
export const updateUserProfile = async (req: any, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;
        updateUserValidation(req.body)
        const { email, username, default_address, city, state, pinCode } = req.body;
        // Perform the update (do not assume the update returns the updated row)
        const [user] = await postgresDB.update(usersSchema)
            .set({
                username,
                email,
                city,
                state,
                default_address,
                pinCode,
                updatedAt: new Date().toISOString()
            })
            .where(eq(usersSchema.id, userId))
            .returning(); // returns updated row(s)

        if (!user) {
            return next(new ValidationError("User not found."))
        }

        return res.status(200).json({
            message: "User updated successfully.",
            status: true,
            user: {
                id: user.id,
                phoneNumber: user.phone,
                username: user.username ?? username,
                default_address: user.default_address ?? default_address,
                loyalty_points: user.loyalty_points,
                wallet_balance: user.wallet_balance,
                city: user.city ?? city,
                state: user.state ?? state,
                pinCode: user.pinCode ?? pinCode
            }
        })
    } catch (error) {
        console.log("Error in user updateUserProfile controller:", error);
        return next(error)
    }
}

// Update User Address
export const updateUserAddress = async (req: any, res: Response, next: NextFunction) => {
    try {

    } catch (error) {
        console.log("Error in user updateUserAddress controller:", error);
        return next(error);
    }
}

// Delete User Address
export const deleteUserAddress = async (req: any, res: Response, next: NextFunction) => {
    try {

    } catch (error) {
        console.log("Error in user deleteUserAddress controller:", error);
        return next(error);
    }
}

// List User Address
export const listUserAddress = async (req: any, res: Response, next: NextFunction) => {
    try {

    } catch (error) {
        console.log("Error in user listUserAddress controller:", error);
        return next(error);
    }
}

// Set Default User Address
export const setDefaultUserAddress = async (req: any, res: Response, next: NextFunction) => {
    try {

    } catch (error) {
        console.log("Error in user setDefaultUserAddress controller:", error);
        return next(error);
    }
}

// Add User Address// 
export const addUserAddress = async (req: any, res: Response, next: NextFunction) => {
    try {

    } catch (error) {
        console.log("Error in user setDefaultUserAddress controller:", error);
        return next(error);
    }
}

// Delete User Account
export const deleteUserAccount = async (req: any, res: Response, next: NextFunction) => {
    try {

    } catch (error) {
        console.log("Error in user deleteUserAccount controller:", error);
        return next(error);
    }
}