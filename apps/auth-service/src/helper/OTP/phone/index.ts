import { NextFunction } from "express";
import crypto from 'crypto';
import twilio from 'twilio'
import { ValidationError } from "@packages/backend/errors";
import redis from "@packages/backend/db/redis";

export const otpRestrictionsPhone = async (phone: Number, next: NextFunction) => {
    try {

        // Check account is lock due to multiple attempts
        if (await redis.get(`otp_lock:${phone}`)) {
            return next(new ValidationError(
                "Account locked due to multiple failed attempts! Try again after 30 minutes"
            ));
        }
        // Check send otp agian and agian due to (google, email, facebook, etc)
        if (await redis.get(`otp_spem_lock:${phone}`)) {
            return next(new ValidationError(
                "Too many OTP requests! Please wait 1 hour before requesting agian"
            ))
        }

        //
        if (await redis.get(`otp_cooldown:${phone}`)) {
            return next(new ValidationError(
                "Please wait 1minute befor requesting a new OTP!"
            ))
        }
    } catch (error) {
        console.log("Error is otpRestrictions", error);
        return next(error)
    }
}

export const senNumberdOTPPhone = async (phone: Number, next: NextFunction) => {
    try {
        const otp = crypto.randomInt(1000, 9999).toString();
        const formattedPhone = '+91' + phone.toString();

        await redis.set(`otp_cooldown:${phone}`, "true", "EX", 60) // otp send agian after one minute

        // await redis.set(`otp_cooldown:${phone}`, "true", "EX", 60) // otp send agian after one minute
        // Your AccountSID and Auth Token from console.twilio.com
        const accountSid = process.env.TWILIO_ACCOUNT_SID!;
        const authToken = process.env.TWILIO_ACCOUNT_AUTH_TOKEN!;

        const client = twilio(accountSid, authToken);

        client.messages
            .create({
                body: `Hello from twilio-node ${otp}`,
                to: formattedPhone, // Text your number
                from: process.env.TWILIO_PHONE_NUMBER!, // From a valid Twilio number
            })
            .then((message: any) => console.log(message.sid));

        await redis.set(`otp:${phone}`, otp, "EX", 300);  // otp valid for 5 minutes

    } catch (error) {
        throw new Error("Error in sending OTP");
        next(error)
    }
}

export const teackOtpRequestPhone = async (phone: Number, next: NextFunction) => {
    try {
        const otpRequestKey = `otp_request_count:${phone}`;
        let otpRequest = parseInt((await redis.get(otpRequestKey)) || "0");

        if (otpRequest >= Number(process.env.OTP_COUNT_LIMIT_BY_PHONE)) {
            // locked account one hour
            await redis.set(`otp_spam_lock:${phone}`, "locked", "EX", 3600);
            return next(new ValidationError("Too many OTP requests. Please wait 1 hour before requesting agian!"))
        }

        // track otp 
        await redis.set(otpRequestKey, otpRequest + 1, "EX", 3600)
    } catch (error) {
        console.log("Error is tackOtpRequest", error);
        return next(error);
    }
}

export const verifyOTPPhone = async (phone: Number, otp: string, next: NextFunction ) => {
    try {
        const storedOtp = await redis.get(`otp:${phone}`);

        if (!storedOtp) {
            return next(new ValidationError(
                "Invalid or expired OTP"
            ));
        }

        const failedOtpKey = `otp_attempts:${phone}`

        const failedAttempts = parseInt((await redis.get(failedOtpKey)) || "0");

        if (storedOtp !== otp) {
            if (failedAttempts >= Number(process.env.OTP_COUNT_LIMIT)) {
                await redis.set(`otp_lock:${phone}`, "locked", "EX", 1800); // account lock for 30 minutes
                await redis.del(`otp:${phone}`, failedOtpKey)
                throw new ValidationError("Too many failed attempts. Your account is locked for 30 minutes");
            }
            await redis.set(failedOtpKey, failedAttempts + 1, "EX", 300)
            throw new ValidationError(
                `Incorrect OTP. ${Number(process.env.OTP_COUNT_LIMIT) - failedAttempts} attempts left`
            );
        };

            await redis.del(`otp:${phone}`, failedOtpKey);

        return true;
    } catch (error) {
        console.log("Error is verifyOtp", error);
        return next(error)
    }
}