export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational : boolean;
    public readonly details?: any;
    constructor(message:string, statusCode:number, isOperational = true, details?: any){
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.details = details;
        Error.captureStackTrace(this)
    }
};

// not found
export class NotfoundError extends AppError{
    constructor(message = "Resource not found"){
        super(message, 404)
    }
};

// Validation error link(Joi/zod/react-hook-from validation error)
export class ValidationError extends AppError{
    constructor(message = "Invalid request data", details?:any){
        super(message, 400, details)
    }
}

// Authentacation error
export class AuthError extends AppError{
    constructor(message = "Unauthorized user"){
        super(message, 401)
    }
};

//Forbidden Error (for Insufficient Permissions)
export class ForbiddeeError extends AppError{
    constructor( message= "Forbidden access"){
        super(message, 403)
    }
}

// Database error
export class DatabasError extends AppError{
    constructor(message= "Database error", detaild?:any){
        super(message, 500, true, detaild)
    }
}

// reate limit error (if user exceeds API limits)
export class RateLimitError extends AppError {
    constructor(message = "Too many request, please try again later."){
        super(message, 429)
    }
}

