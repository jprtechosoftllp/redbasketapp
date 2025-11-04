import postgresDB from "@packages/backend/db/postgresSql";
import { ValidationError } from "@packages/backend/errors";
import vendorSchema from "@packages/backend/schema/vendor";
import { NextFunction, Response } from "express";

export const getVendor = async (
    req: any, // ✅ define query type here
    res: Response,
    next: NextFunction
) => {
    try {

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const offset = (page - 1) * limit;

        const vendors = await postgresDB
            .select()
            .from(vendorSchema)
            .limit(limit)
            .offset(offset);

        if (vendors.length === 0) {
            return next(new ValidationError('Managers are not listed!'));
        }

        return res.status(200).json({
            success: true,
            vendors
        });
    } catch (error) {
        console.error("Error in manager-service > controller > vendor > getVendor:", error);
        return next(error);
    }
};
