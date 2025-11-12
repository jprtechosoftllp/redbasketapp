// import { ValidationError } from "@packages/backend/errors/index";

import { ValidationError } from "@packages/backend/errors";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format

// Minimum eight characters, at least one uppercase letter, one Lowercase letter, one number and one spacial character
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const usernameRegex = /^[a-zA-Z0-9]{3, 30}$/; // Alphanumeric, 3-30 characters
// const phoneRegex = /^\+?[1-9]\d{1,14}$/;  // E.164 international phone number format
const phoneRegex = /^[6-9]\d{9}$/; // Indian phone number format
const otpRegex = /^\d{6}$/  // 6 digit numeric OTP


// Registratoin validation
export const registerValidation = (data: any) => {
    const { email, password, username, phoneNumber:phone, confirmPassword, city, state, address } = data;
    if (!email || !password || !username || !phone || !confirmPassword || !city || !state || !address) {
        throw new ValidationError("All fields are required.");
    }

    if (!emailRegex.test(email)) {
        throw new ValidationError("Invalid email format.")
    }
    if (password !== confirmPassword) {
        throw new ValidationError("Passwords do not match.");
    }
    if (!passwordRegex.test(password)) {
        throw new ValidationError("Password must include uppercase, lowercase, number, and special character.")
    }
    if (!usernameRegex.test(username)) {
        throw new ValidationError("Username must be alphanumeric and 3-30 characters long.")
    }
    if (!phoneRegex.test(phone)) {
        throw new ValidationError("Invalid phone number format.")
    }

}

// Login validation
export const loginValidation = (data: any) => {
    const { phone, otp } = data;

    if (!phone || !otp) {
        throw new ValidationError(`Phone and OTP are required fields.`)
    }

        if (!otpRegex.test(otp)) {
            throw new ValidationError("Invalid OTP format!.")
        }
    if (!phoneRegex.test(phone)) {
        throw new ValidationError("Invalid Phone number format!")
    }
}

// Change password validation
export const changePasswordValidation = (data: any)=> {
    const { oldPassword, newPassword, confirmPassword } = data;

    if (!oldPassword || passwordRegex.test(oldPassword)){
        throw new ValidationError("Old password is required and must be valid.")
    }

    if(!newPassword || !passwordRegex.test(newPassword)){
        throw new ValidationError("New password is required and must be valid.")
    }

    if(newPassword !== confirmPassword || !confirmPassword || !passwordRegex.test(confirmPassword)){
        throw new ValidationError("Confirm password must match with new password and must be valid.")
    }
}

// Forgot password validation
export const forgotPasswordValidation = (data: any)=> {
    const { phoneNumber:phone, otp, newPassword, confirmPassword } = data;

    if(!newPassword || !passwordRegex.test(newPassword)){
        throw new ValidationError("New password is required and must be valid.")
    }

    if(newPassword !== confirmPassword || !confirmPassword || !passwordRegex.test(confirmPassword)){
        throw new ValidationError("Confirm password must match with new password and must be valid.")
    }
    if (!phone || !phoneRegex.test(phone)){
        throw new ValidationError("Valid phone number is required.")
    }
    
    if(!otp || !otpRegex.test(otp)){
        throw new ValidationError("Valid OTP is required.")
    }
}