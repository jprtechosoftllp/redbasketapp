import { ValidationError } from "@packages/backend/errors";

export const validationsCategory = (data: any) => {
    const { description, image, name } = data;

    if (!name) {
        throw new ValidationError("Category name is required and should be at least 3 characters long.")
    }
    if (description && (description.length < 100 || description.length > 500)) {
        throw new ValidationError("Description must be between 100 and 500 characters long.");
    }

    if (!image || !image.url || !image.public_Id) {
        throw new ValidationError("Valid image object with 'url' and 'public_Id' is required,");
    }
}

export const validationsSubCategory = (data: any) => {
    const { name, description, image, category } = data;

    if (!name) {
        throw new ValidationError("Sub category name is required and should be at least 3 characters long.")
    }

    if (!category || !category.name) {
        throw new ValidationError("Category name is required and should be at least 3 characters long.")
    }

    if (!category || !category.id) {
        throw new ValidationError("Category ID is required to create a sub-category.");
    }

    if (description && (description.length < 100 || description.length > 500)) {
        throw new ValidationError("Description must be between 100 and 500 characters long.");
    }

    if (!image || !image.url || !image.public_Id) {
        throw new ValidationError("Valid image object with 'url' and 'public_Id' is required,");
    }
}

export const validationsProduct = (data: any) => {
    const {
        product_name, description, images, category,
        subCategory, base_price, vendor_Id, discount_price,
        fssai_certified, is_halal, net_weight, gross_weight,
        protein_per_100g, calories_per_100g
    } = data;


    // Product Name
    if (!product_name || product_name.trim().length < 2) {
        throw new ValidationError("Product name must be at least 2 characters.")
    }

    // Description
    if (!description || description.trim().length < 100) {
        throw new ValidationError("Description must be at least 100 characters long.");
    } else if (description.length > 500) {
        throw new ValidationError("Description must be 500 characters or fewer.");
    }

    // Images
    if (!Array.isArray(images) || images.length === 0) {
        throw new ValidationError("At least one image is required.")
    } else {
        images.forEach((img, index) => {
            if (!img.url || !/^https?:\/\/.+/.test(img.url)) {
                throw new ValidationError("🖼️ Image URL must be valid.")
            }
            if (!img.public_Id) {
                throw new ValidationError(`🖼️ Image ID at index ${index} is required.`);
            }
        });
    }

    // Category & Subcategory
    if (!category || category.trim().length < 3) {
        throw new ValidationError("📂 Category must be at least 3 characters.");
    }
    if (!subCategory || subCategory.trim().length < 3) {
        throw new ValidationError("📂 Subcategory must be at least 3 characters.")
    }

    // Prices
    if (typeof base_price !== "number" || base_price < 100 || base_price > 5000) {
        throw new ValidationError("Base price must be between ₹100 and ₹5,000.")
    }
    if (typeof discount_price !== "number" || discount_price < 100 || discount_price > 5000) {
        throw new ValidationError("Discount price must be between ₹100 and ₹5,000.");
    }

    // Vendor
    if (!vendor_Id || vendor_Id.trim().length === 0) {
        throw new ValidationError("Vendor is required.")
    }

    // Weights & Nutrition
    const validateNumber = (value: any, field: string) => {
        if (typeof value !== "number" || value < 100 || value > 300000) {
            throw new ValidationError(`${field.replace(/_/g, " ")} must be between 10 and 300000.`);
        }
    };

    validateNumber(net_weight, "net_weight");
    validateNumber(gross_weight, "gross_weight");
    validateNumber(protein_per_100g, "protein_per_100g");
    validateNumber(calories_per_100g, "calories_per_100g");

    if (typeof fssai_certified !== 'boolean') {
        throw new ValidationError("fssai_certified must be a boolean value (true or false).");
    }

    if (typeof is_halal !== 'boolean') {
        throw new ValidationError("is_halal must be a boolean value (true or false).");
    }
}