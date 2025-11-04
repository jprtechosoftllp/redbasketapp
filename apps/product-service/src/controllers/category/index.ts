import { AuthError, NotfoundError, ValidationError } from "@packages/backend/errors";
import { NextFunction, Response, Request } from "express";
import { validationsCategory } from "../../utils/validations";
import postgresDB from "@packages/backend/db/postgresSql";
import { categorieSchema, subcategorieSchema } from "@packages/backend/schema/product";
import { and, eq } from "drizzle-orm";
import { groupCategoriesWithSubcategories } from "@packages/backend/helpers/SubcategoeyIncategory";

export const createCategory = async (req: any, res: Response, next: NextFunction) => {
    try {
        validationsCategory(req.body);
        const { name, description, image } = req.body;

        const admin = req.admin;

        if (!admin) {
            return next(new AuthError("Unauthorized access. Admin credentials requested."));
        }

        // Additional logic to create category in the database can be added here

        const categories = await postgresDB.select().from(categorieSchema).where(eq(categorieSchema.name, name)).limit(1);
        if (categories[0]) {
            return next(new AuthError("Category already exists,"))
        }

        const categoryCreate = await postgresDB.insert(categorieSchema).values({
            name,
            description,
            image
        });

        console.log(categoryCreate);

        return res.status(201).json({
            message: "Category is create successfully.",
            categoryCreate
        })

    } catch (error) {
        console.log("Error is product-service > controllers > category > createCategory :", error);
        return next(error);
    }
}

export const getCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const rawResults = await postgresDB
            .select()
            .from(categorieSchema)
            .leftJoin(
                subcategorieSchema,
                    eq(subcategorieSchema.categoryId, categorieSchema.id),
            )

        if (rawResults.length === 0) {
            return next(new ValidationError("No categories found."));
        }

        // Process rawResults to structure categories with their subcategories
        const categories = groupCategoriesWithSubcategories(rawResults);

        return res.status(200).json({
            categories
        });

    } catch (error) {
        console.log("Error is product-service > controllers > category > getCategory :", error);
        return next(error);
    }
}

export const updateCategory = async (req: any, res: Response, next: NextFunction) => {
    try {

        validationsCategory(req.body);

        const { category, description, image, id } = req.body;

        const admin = req.admin

        if (admin) {
            return next(new AuthError("Unauthorized access. Admin credentials requested."));
        };

        const getCategory = await postgresDB.select().from(categorieSchema).where(eq(categorieSchema.id, id)).limit(1);

        if (!getCategory) {
            return next(new NotfoundError("Category not found."))
        }

        const categoryUpdate = await postgresDB.update(categorieSchema).set({
            name: category,
            description,
            image,
        }).where(eq(categorieSchema.id, getCategory[0].id)).returning();

        return res.status(200).json({
            categoryUpdate
        })

    } catch (error) {
        console.log("Error is product-service > controllers > category > updateCategory :", error);
        return next(error);
    }
}

export const categoryDelete = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { isActive, id } = req.body;
        const admin = req.admin

        if (admin) {
            return next(new AuthError("Unauthorized access. Admin credentials requested."));
        };

        if (admin.role === 'user') {
            return next(new AuthError("Insufficient permissions to create category."));
        };

        const getCategory = await postgresDB.select().from(categorieSchema).where(eq(categorieSchema.id, id)).limit(1);

        if (!getCategory) {
            return next(new NotfoundError("Category not found."))
        }

        const categoryUpdate = await postgresDB.update(categorieSchema).set({
            isActive
        }).where(eq(categorieSchema.id, getCategory[0].id)).returning();

        return res.status(200).json({
            message: "Category status updated successfully.",
            categoryUpdate
        })
    } catch (error) {
        console.log("Error is product-service > controllers > category > categoryDelete :", error);
        return next(error);
    }
}

export const activeCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const rawResults = await postgresDB
            .select()
            .from(categorieSchema)
            .leftJoin(
                subcategorieSchema,
                and(
                    eq(subcategorieSchema.categoryId, categorieSchema.id),
                    eq(subcategorieSchema.isActive, true)
                )
            )
            .where(eq(categorieSchema.isActive, true));

        if (rawResults.length === 0) {
            return next(new NotfoundError("No active categories found."))
        }

        // Process rawResults to structure categories with their subcategories
        const categories = groupCategoriesWithSubcategories(rawResults);

        return res.status(200).json({
            categories
        })
    } catch (error) {
        console.log("Error is product-service > controllers > category > activeCategory :", error);
        return next(error);
    }
}