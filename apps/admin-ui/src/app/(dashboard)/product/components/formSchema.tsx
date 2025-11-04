import z from "zod";

export const formSchema = z.object({
    product_name: z.string().min(2, {
        message: "Category must be at least 2 characters.",
    }),
    description: z.string().max(500, {
        message: 'Description must be 1000 characters or fewer',
    }).min(100, {
        message: 'Description must be at least 100 characters long',
    }),
    images:
        z.array(
            z.object({
                url: z.string().trim().url({ message: '🖼️ Image URL must be valid' }),
                public_Id: z.string().min(1, { message: '🖼️ Image ID is required' }),
            }, {
                message: "🖼️ Image object is required"
            })
        ),
    category: z
        .string()
        .trim()
        .min(3, { message: "📂 Category is required and must be at least 3 characters" }),

    subCategory: z
        .string()
        .trim()
        .min(3, { message: "📂 Category is required and must be at least 3 characters" }),

    base_price: z
        .coerce
        .number()
        .min(10, {
            message: "Price must be at least ₹10",
        })
        .max(300000, {
            message: "Price cannot exceed ₹3,00,000",
        })
        .positive({
            message: "Price must be a positive number",
        }),

    vendor_Id: z.string().min(1, { message: "Vendor is required" }),

    discount_price: z
        .coerce
        .number()
        .min(10, {
            message: "Sale price must be at least ₹10",
        })
        .max(300000, {
            message: "Sale price cannot exceed ₹3,00,000",
        })
        .positive({
            message: "Sale price must be a positive number",
        }),

    fssai_certified: z.coerce.boolean().optional(),
    // hygiene_verified_by_meato: z.string().optional(),
    is_halal: z.coerce.boolean().optional(),
    net_weight: z.coerce
        .number()
        .min(10, {
            message: "Protein per 100g must be required",
        })
        .max(300000, {
            message: "Sale price cannot exceed ₹3,00,000",
        })
        .positive({
            message: "Protein per 100g must be a positive number",
        }),
    gross_weight: z.coerce
        .number()
        .min(10, {
            message: "Protein per 100g must be required",
        })
        .max(300000, {
            message: "Sale price cannot exceed ₹3,00,000",
        })
        .positive({
            message: "Protein per 100g must be a positive number",
        }),
    protein_per_100g: z.coerce
        .number()
        .min(10, {
            message: "Protein per 100g must be required",
        })
        .max(300000, {
            message: "Sale price cannot exceed ₹3,00,000",
        })
        .positive({
            message: "Protein per 100g must be a positive number",
        }),

    calories_per_100g: z
        .coerce
        .number()
        .min(10, {
            message: "Calories per 100g must be required",
        })
        .max(300000, {
            message: "Sale price cannot exceed ₹3,00,000",
        })
        .positive({
            message: "Calories per 100g must be a positive number",
        }),
});

export const productValidationType = {
    images: [],
    id: "",
    product_name: "",
    descripton: "",
    category: "",
    subCategory: "",
    base_price: "",
    discount_price: "",
    protein_per_100g: "",
    calories_per_100g: "",
    vendor_Id: "",
    fssai_certified: "",
    is_halal: "",
    net_weight: "",
    gross_weight: "",
};