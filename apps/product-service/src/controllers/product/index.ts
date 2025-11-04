import { NextFunction, Request, Response } from "express";
import { validationsProduct } from "../../utils/validations";

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        validationsProduct(req.body);
        // const {
        //     product_name, description, images, category,
        //     subCategory, base_price, vendor_Id, discount_price,
        //     fssai_certified, is_halal, net_weight, gross_weight,
        //     protein_per_100g, calories_per_100g
        // } = req.body;

        console.log(req.body);

    } catch (error) {
        console.log("Error is product-service > controllers > subCategory > createSubCategory :", error);
        return next(error);
    }
}