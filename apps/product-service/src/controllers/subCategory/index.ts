import postgresDB from "@packages/backend/db/postgresSql";
import { AuthError, NotfoundError } from "@packages/backend/errors";
import { subcategorieSchema } from "@packages/backend/schema/product";
import { NextFunction, Response, Request } from "express";
import { validationsSubCategory } from "../../utils/validations";
import { eq, and } from "drizzle-orm";

export const createSubCategory = async (req: any, res: Response, next: NextFunction) => {
    try {

        validationsSubCategory(req.body);
        const { name, description, image, category } = req.body;

        const admin = req.admin;

        if (!admin) {
            return next(new AuthError("Unauthorized access. Admin credentials requested."));
        }

        if (admin.role === "user") {
            return next(new AuthError("Insufficient permissions to create sub category."));
        }

        // Additional logic to create category in the database can be added here

        const categories = await await postgresDB.select()
            .from(subcategorieSchema)
            .where(and(eq(subcategorieSchema.name, name),
                eq(subcategorieSchema.categoryId, category.id)))
            .limit(1)

        if (categories[0]) {
            return next(new AuthError("Suv category already exists,"))
        }

        const subCategory = await postgresDB.insert(subcategorieSchema).values({
            name,
            categoryId: category.id,
            categoryName: category.name,
            description,
            image
        });

        return res.status(201).json({
            message: "Sub category is create successfully.",
            subCategory
        })

    } catch (error) {
        console.log("Error is product-service > controllers > subCategory > createSubCategory :", error);
        return next(error);
    }
}

export const updateSubCategory = async (req: any, res: Response, next: NextFunction) => {
    try {
        validationsSubCategory(req.body);
        const { name, description, image, category, id } = req.body;

        const admin = req.admin;

        if (!admin) {
            return next(new AuthError("Unauthorized access. Admin credentials requested."));
        }

        if (admin.role === "user") {
            return next(new AuthError("Insufficient permissions to create category."));
        }

        // Additional logic to create category in the database can be added here

        const categories = await await postgresDB.select()
            .from(subcategorieSchema)
            .where(eq(subcategorieSchema.id, id))
            .limit(1)

        if (!categories[0]) {
            return next(new NotfoundError("SubCaterory is not found."))
        }

        const subCategoryUpdate = await postgresDB.update(subcategorieSchema).set({
            name,
            categoryId: category.id,
            categoryName: category.name,
            description,
            image
        }).where(eq(subcategorieSchema.id, categories[0].id))

        return res.status(201).json({
            message: "SubCategory is update successfully.",
            subCategoryUpdate
        })

    } catch (error) {
        console.log("Error is product-service > controllers > subCategory > updateSubCategory :", error);
        return next(error);
    }
}

export const deleteSubCategory = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id, category_id, isActive } = req.body;

        const admin = req.admin;

        if (!admin) {
            return next(new AuthError("Unauthorized access. Admin credentials requested."));
        }

        if (admin.role === "user") {
            return next(new AuthError("Insufficient permissions to create category."));
        }

        const category = await postgresDB.select().from(subcategorieSchema).where(and(
            eq(subcategorieSchema.id, id),
            eq(subcategorieSchema.categoryId, category_id)
        )).limit(1);

        if (!category[0]) {
            return next(new NotfoundError("SubCategory is not found."));
        }

        const subCategoryDelete = await postgresDB.update(subcategorieSchema).set({
            isActive
        }).where(eq(subcategorieSchema.id, category[0].id));

        return res.status(201).json({
            message: "Subcategory delete successfully.",
            subCategoryDelete
        })
    } catch (error) {
        console.log("Error is product-service > controllers > subCategory > deleteSubCategory :", error);
        return next(error);
    }
}

export const getSubcategory = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const subcategories = await postgresDB.select().from(subcategorieSchema)

        if (subcategories.length === 0) {
            return next(new NotfoundError("Subcategories not found"))
        }

        return res.status(200).json({
            subcategories
        })

    } catch (error) {
        console.log("Error is product-service > controllers > subCategory > getSubcategory :", error);
        return next(error);
    }
}