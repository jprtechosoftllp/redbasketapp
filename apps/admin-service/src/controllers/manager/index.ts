import postgresDB from "@packages/backend/db/postgresSql";
import { ValidationError } from "@packages/backend/errors";
import managerSchema from "@packages/backend/schema/manager";
import { eq, count } from "drizzle-orm";
import { NextFunction, Response } from "express";

const payload = {
    id: managerSchema.id,
    username: managerSchema.username,
    email: managerSchema.email,
    role: managerSchema.role,
    photo: managerSchema.photo,
    phone: managerSchema.phone,
    createdAt: managerSchema.createdAt,
    updatedAt: managerSchema.updatedAt
}

export const getManagersActive = async (
    req: any, // ✅ define query type here
    res: Response,
    next: NextFunction
) => {
    try {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const totalCountResult = await postgresDB
            .select({ count: count() })
            .from(managerSchema)
            .where(eq(managerSchema.role, 'manager'));

        const totalCount = totalCountResult[0]?.count ?? 0;
        const totalPages = Math.ceil(totalCount / limit);

        const managers = await postgresDB
            .select(payload)
            .from(managerSchema)
            .where(eq(managerSchema.role, 'manager'))
            .limit(limit)
            .offset(offset);

        if (!managers || managers.length === 0) {
            return next(new ValidationError('Managers are not listed!'));
        }

        const hasMore = page < totalPages;
        const nextPage = hasMore ? page + 1 : undefined;

        return res.status(200).json({
            managers,
            hasMore,
            nextPage,
            totalPages
        });
    } catch (error) {
        console.error("Error in admin-service > controller > getManagers:", error);
        return next(error);
    }
};

export const getManagersArchived = async (
    req: any, // ✅ define query type here
    res: Response,
    next: NextFunction
) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const totalCountResult = await postgresDB
            .select({ count: count() })
            .from(managerSchema)
            .where(eq(managerSchema.role, 'archived'));

        const totalCount = totalCountResult[0]?.count ?? 0;
        const totalPages = Math.ceil(totalCount / limit);

        const managers = await postgresDB
            .select(payload)
            .from(managerSchema)
            .where(eq(managerSchema.role, 'archived'))
            .limit(limit)
            .offset(offset);

        if (!managers || managers.length === 0) {
            return next(new ValidationError('Managers are not listed!'));
        }

        const hasMore = page < totalPages;
        const nextPage = hasMore ? page + 1 : undefined;

        return res.status(200).json({
            managers,
            hasMore,
            nextPage,
            totalPages
        });
    } catch (error) {
        console.error("Error in admin-service > controller > getManagers:", error);
        return next(error);
    }
};