import postgresDB from "@packages/backend/db/postgresSql";
import { NotfoundError, ValidationError } from "@packages/backend/errors";
import vendorSchema from "@packages/backend/schema/vendor";
import { count, eq } from "drizzle-orm";
import { NextFunction, Request, Response } from "express";


const payload ={
    id: vendorSchema.id,
    email: vendorSchema.email,
    username: vendorSchema.username,
    phone: vendorSchema.phone,
    shop_address: vendorSchema.shop_address,
    shop_name: vendorSchema.shop_name,
    gst_number: vendorSchema.gst_number,
    shop_city: vendorSchema.shop_city,
    shop_state: vendorSchema.shop_state,
    shop_pinCode: vendorSchema.shop_pinCode,
    bank_account: vendorSchema.bank_account,
    ifsc_code: vendorSchema.ifsc_code,
    fssai_license: vendorSchema.fssai_license,
    commission_rate: vendorSchema.commission_rate,
    status: vendorSchema.status,
    oreders: vendorSchema.oreders,
    rejected_orderds: vendorSchema.rejected_orderds,
    createdAt: vendorSchema.createdAt,
    updatedAt: vendorSchema.updatedAt,
}

export const getVendorsActive = async (
    req: Request, // ✅ define query type here
    res: Response,
    next: NextFunction
) => {
    try {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const totalCountResult = await postgresDB
            .select({ count: count() })
            .from(vendorSchema)
            .where(eq(vendorSchema.status, 'active'));

        const totalCount = totalCountResult[0]?.count ?? 0;
        const totalPages = Math.ceil(totalCount / limit);

        const vendors = await postgresDB
            .select(payload)
            .from(vendorSchema)
            .where(eq(payload.status, 'active'))
            .limit(limit)
            .offset(offset);

        if (!vendors || vendors.length === 0) {
            return next(new ValidationError('Vendors are not listed!'));
        }

        const hasMore = page < totalPages;
        const nextPage = hasMore ? page + 1 : undefined;

        return res.status(200).json({
            vendors,
            hasMore,
            nextPage,
            totalPages
        });
    } catch (error) {
        console.error("Error in admin-service > controller > getManagers:", error);
        return next(error);
    }
};

export const getVendorsPending = async (
    req: Request, // ✅ define query type here
    res: Response,
    next: NextFunction
) => {
    try {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const totalCountResult = await postgresDB
            .select({ count: count() })
            .from(vendorSchema)
            .where(eq(vendorSchema.status, 'pending'));

        const totalCount = totalCountResult[0]?.count ?? 0;
        const totalPages = Math.ceil(totalCount / limit);

        const vendors = await postgresDB
            .select(payload)
            .from(vendorSchema)
            .where(eq(payload.status, 'pending'))
            .limit(limit)
            .offset(offset);

        if (!vendors || vendors.length === 0) {
            return next(new ValidationError('Vendors are not listed!'));
        }

        const hasMore = page < totalPages;
        const nextPage = hasMore ? page + 1 : undefined;

        return res.status(200).json({
            vendors,
            hasMore,
            nextPage,
            totalPages
        });
    } catch (error) {
        console.error("Error in admin-service > controller > getManagers:", error);
        return next(error);
    }
};

export const getVendorsRejected = async (
    req: Request, // ✅ define query type here
    res: Response,
    next: NextFunction
) => {
    try {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const totalCountResult = await postgresDB
            .select({ count: count() })
            .from(vendorSchema)
            .where(eq(vendorSchema.status, 'pending'));

        const totalCount = totalCountResult[0]?.count ?? 0;
        const totalPages = Math.ceil(totalCount / limit);

        const vendors = await postgresDB
            .select(payload)
            .from(vendorSchema)
            .where(eq(payload.status, 'pending'))
            .limit(limit)
            .offset(offset);

        if (!vendors || vendors.length === 0) {
            return next(new ValidationError('Vendors are not listed!'));
        }

        const hasMore = page < totalPages;
        const nextPage = hasMore ? page + 1 : undefined;

        return res.status(200).json({
            vendors,
            hasMore,
            nextPage,
            totalPages
        });
    } catch (error) {
        console.error("Error in admin-service > controller > Vendors > getVendorsRejected:", error);
        return next(error);
    }
};

export const getAllActiveVendors = async (
    req: Request, // ✅ define query type here
    res: Response,
    next: NextFunction
) =>{
    try {
        const vendors = await postgresDB
            .select(payload)
            .from(vendorSchema)
            .where(eq(vendorSchema.status, 'active'));

            if(vendors.length === 0){
                return next(new NotfoundError("Vendors are not listed!"))
            }

            return res.status(200).json({
                vendors
            })
    } catch (error) {
        console.error("Error in admin-service > controller > Vendors > getAllActiveVendors:", error);
        return next(error);
    }
}