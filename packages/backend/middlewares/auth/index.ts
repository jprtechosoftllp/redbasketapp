import { Response, NextFunction } from "express"
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { eq } from "drizzle-orm";
import usersSchema from "@packages/backend/schema/user";
import postgresDB from "@packages/backend/db/postgresSql";
import adminsSchema from "@packages/backend/schema/admin";
import vendorSchema from "@packages/backend/schema/vendor";
import managerSchema from "@packages/backend/schema/manager";

dotenv.config()

export const isAuthenticatedUser = async (req: any, res: Response, next: NextFunction) => {

    try {

        const token = req.cookies.access_token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Unauthorized Token missing." })
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_JWT_SECRET!) as {
            id: number, phone: string
        }

        if (!decoded) {
            return res.status(401).json({
                message: "Unauthorized Invalid token"
            })
        }

        const users = await postgresDB.select().from(usersSchema).where(eq(usersSchema.id, Number(decoded.id))).limit(1);

        const user = users[0];

        if (!user) {
            return res.status(401).json({
                message: "Account not found"
            })
        }

        req.user = user;
        return next();
        // }
        // return res.status(403).json({ message: "Forbidden! You don't have access to this resource." });
    } catch (error) {
        console.log("Error is isAuthicated", error);
        return res.status(401).json({ message: "Unauthorized! Token expired or invalid." });
    }
}

export const isAuthenticatedAdmin = async (req: any, res: Response, next: NextFunction) => {

    try {

        const token = req.cookies.admin_access_token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Unauthoristringzed Token missing." })
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_JWT_SECRET!) as {
            id: number, email: string, role: string
        }

        if(decoded.role === "user"){
            return res.status(403).json({ message: "Forbidden! You don't have access to this resource." });
        }

        if (!decoded) {
            return res.status(401).json({
                message: "Unauthorized Invalid token"
            })
        }

        const users = await postgresDB
            .select()
            .from(adminsSchema)
            .where(eq(adminsSchema.id, Number(decoded.id)))
            .limit(1);

        const user = users[0];

        if (!user) {
            return res.status(401).json({
                message: "Account not found"
            })
        }

        req.admin = { id: user.id, email: user.email, username: user.username, phone: user.phone, role: user.role, createAt: user.createdAt, updateAt: user.updatedAt };
        return next();
        // return res.status(403).json({ message: "Forbidden! You don't have access to this resource." });
    } catch (error) {
        console.log("Error is isAuthicated", error);
        return res.status(401).json({ message: "Unauthorized! Token expired or invalid." });
    }
}

export const isAuthenticatedManager = async (req: any, res: Response, next: NextFunction) => {

    try {

        const token = req.cookies.manager_access_token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Unauthorized Token missing." })
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_JWT_SECRET!) as {
            id: number, email: string, role: string
        }

        if (!decoded) {
            return res.status(401).json({
                message: "Unauthorized Invalid token"
            })
        }

        const users = await postgresDB.select().from(managerSchema).where(eq(managerSchema.id, Number(decoded.id)));

        const user = users[0];

        if (!user) {
            return res.status(401).json({
                message: "Account not found"
            })
        }

        req.manager = { id: user.id, email: user.email, username: user.username, phone: user.phone, role: user.role, createAt: user.createdAt, updateAt: user.updatedAt };;
        return next();
        // return res.status(403).json({ message: "Forbidden! You don't have access to this resource." });
    } catch (error) {
        console.log("Error is isAuthicated", error);
        return res.status(401).json({ message: "Unauthorized! Token expired or invalid." });
    }
}

export const isAuthenticatedVendor = async (req: any, res: Response, next: NextFunction) => {

    try {

        const token = req.cookies.manager_access_token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Unauthorized Token missing." })
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_JWT_SECRET!) as {
            id: number, email: string
        }

        if (!decoded) {
            return res.status(401).json({
                message: "Unauthorized Invalid token"
            })
        }

        const users = await postgresDB.select().from(vendorSchema).where(eq(vendorSchema.id, decoded.id)).limit(1);

        const user = users[0];

        if (!user) {
            return res.status(401).json({
                message: "Account not found"
            })
        }

        // req.manager = {id: user.id, email: user.email, username: user.username, phone: user.phone,  createAt: user.createdAt, updateAt: user.updatedAt};
        return next();
        // return res.status(403).json({ message: "Forbidden! You don't have access to this resource." });
    } catch (error) {
        console.log("Error is isAuthicated", error);
        return res.status(401).json({ message: "Unauthorized! Token expired or invalid." });
    }
}