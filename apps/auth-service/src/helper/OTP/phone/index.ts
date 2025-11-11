import { NextFunction } from "express";
import crypto from 'crypto';
import { ValidationError } from "@packages/backend/errors";
import redis from "@packages/backend/db/redis";
import axios from 'axios';

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

        otpRestrictionsPhone(phone, next)

        await redis.set(`otp_cooldown:${phone}`, "true", "EX", 60) // otp send agian after one minute

        await axios.get("https://www.fast2sms.com/dev/bulkV2", {
            params: {
                authorization: process.env.OTP_FAST2SMS_API_KEY, // use env var for safety
                route: process.env.OTP_ROUTE,
                sender_id: process.env.OTP_SENDER_ID,
                message: process.env.OTP_MESSAGE,
                variables_values: otp,
                flash: 0,
                numbers: phone,
                schedule_time: '',
            },
        });

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

export const verifyOTPPhone = async (phone: Number, otp: string, next: NextFunction) => {
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

// https://www.fast2sms.com/dev/bulkV2?authorization=X9oMRUQTPd7z4LNSgVvjyekFiEWufnIq6c3HDbwA8tYhZsK02a7qH8COV03E6wADJlBdXhfQcFYjMevI&route=dlt&sender_id=JPRTCH&message=189415&variables_values={otp}&flash=0&numbers={number}&schedule_time= 