import { isAuthenticatedAdmin } from "@packages/backend/middlewares/auth";
import express, { Router } from "express";
import {
    createSubCategory,
    deleteSubCategory,
    updateSubCategory
} from "../../controllers/subCategory";

const subCategoryRouter: Router = express.Router();

subCategoryRouter.post('/create-sub-category', isAuthenticatedAdmin, createSubCategory);
subCategoryRouter.post('/update-sub-category', isAuthenticatedAdmin, updateSubCategory);
subCategoryRouter.post('/delete-sub-category', isAuthenticatedAdmin, deleteSubCategory);
export default subCategoryRouter;