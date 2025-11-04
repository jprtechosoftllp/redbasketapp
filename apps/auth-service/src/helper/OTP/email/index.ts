import { NextFunction } from "express";
import crypto from 'crypto'
import dotenv from 'dotenv';
import { ValidationError } from "@packages/backend/errors";
import redis from "@packages/backend/db/redis";
import sendEmail from "../../../utils/emails/send-email/index";

dotenv.config()


export const otpRestrictionsEmail = async (email: string, next: NextFunction) => {
    try {

        // Check account is lock due to multiple attempts
        if (await redis.get(`otp_lock:${email}`)) {
            return next(new ValidationError(
                "Account locked due to multiple failed attempts! Try again after 30 minutes"
            ));
        };

        // Check send otp agian and agian due to (google, email, facebook, etc)
        if (await redis.get(`otp_spem_lock:${email}`)) {
            return next(new ValidationError(
                "Too many OTP requests! Please wait 1 hour before requesting agian"
            ))
        }

        if (await redis.get(`otp_cooldown:${email}`)) {
            return next(new ValidationError(
                "Please wait 1minute befor requesting a new OTP!"
            ))
        }
    } catch (error) {
        console.log("Error is otpRestrictions", error);
        return next(error)
    }
}

export const teackOtpRequestEmail = async (email: string, next: NextFunction) => {
    try {
        const otpRequestKey = `otp_request_count:${email}`;
        let otpRequest = parseInt((await redis.get(otpRequestKey)) || "0");

        if (otpRequest >= Number(process.env.OTP_COUNT_LIMIT)) {
            // locked account one hour
            await redis.set(`otp_spam_lock:${email}`, "locked", "EX", 3600);
            return next(new ValidationError("Too many OTP requests. Please wait 1 hour before requesting agian!"))
        }

        // track otp 
        await redis.set(otpRequestKey, otpRequest + 1, "EX", 3600)
    } catch (error) {
        console.log("Error is tackOtpRequest", error);
        return next(error);
    }
}

export const sendOtpEmail = async (email: string, name: string, template: string, next: NextFunction) => {
    try {
        const otp = crypto.randomInt(1000, 9999).toString();
        await sendEmail(email, "Verify Your Email", template, { otp, name }, next)
        await redis.set(`otp:${email}`, otp, "EX", 300);  // otp valid for 5 minutes
        await redis.set(`otp_cooldown:${email}`, "true", "EX", 60) // otp send agian after one minute
    } catch (error) {
        console.log("Error is sendOtp", error);
        return next(error)
    }

}


export const verifyOtpEmail = async (email: string, otp: string, next: NextFunction) => {
    try {
        const storedOtp = await redis.get(`otp:${email}`);

        if (!storedOtp) {
            return next(new ValidationError(
                "Invalid or expired OTP"
            ));
        }

        const failedOtpKey = `otp_attempts:${email}`

        const failedAttempts = parseInt((await redis.get(failedOtpKey)) || "0");

        if (storedOtp !== otp) {
            if (failedAttempts >= Number(process.env.OTP_COUNT_LIMIT)) {
                await redis.set(`otp_lock:${email}`, "locked", "EX", 1800); // account lock for 30 minutes
                await redis.del(`otp:${email}`, failedOtpKey)
                return next(new ValidationError("Too many failed attempts. Your account is locked for 30 minutes"))
            }
            await redis.set(failedOtpKey, failedAttempts + 1, "EX", 300)
            return next(new ValidationError(
                `Incorrect OTP. ${Number(process.env.OTP_COUNT_LIMIT) - failedAttempts} attempts left`
            ));
        };

        await redis.del(`otp:${email}`, failedOtpKey);

        return true;
    } catch (error) {
        console.log("Error is verifyOtp", error);
        return next(error)
    }
}