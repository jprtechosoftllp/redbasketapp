import { pgTable, varchar, text, json, decimal, boolean, integer, date, timestamp } from "drizzle-orm/pg-core";

export const productSchema = pgTable('products', {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  product_name: varchar().notNull(),
  category: varchar().notNull(),
  sub_category: varchar(),
  description: text().notNull(),
  image_urls: json().$type<string[]>(), // array of image URLs
  net_weight: varchar(),
  gross_weight: varchar(),
  base_price: decimal(),
  discount_price: decimal(),
  vendor_Id: varchar(),
  slaughter_date: date(),
  expiry_date: date(),
  freshness_grade: varchar(),
  is_halal: boolean().notNull(),
  packaging_type: varchar(),
  estimated_prep_time: varchar(),
  delivery_time_estimate: varchar(),
  protein_per_100g: varchar(),
  calories_per_100g: varchar(),
  review_Id: json().$type<string[]>(), // array of review IDs (foreign keys from reviews table)
  reviews_count: text(),
  fssai_certified: boolean(),
  hygiene_verified_by_meato: boolean(),
  createdAt: timestamp().defaultNow(),
  updatedAt: varchar(),
});

// schema/categories.ts

export const categorieSchema = pgTable("categories", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull().unique(),
  description: text(),
  image: json(), // ✅ stores { url, public_Id } as a JSON object
  isActive: boolean().default(true),
  createdAt: timestamp().defaultNow(),
});

export const subcategorieSchema = pgTable("subcategories", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  categoryId: integer("categoryId").notNull().references(() => categorieSchema.id),
  categoryName: varchar().notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text(),
  isActive: boolean().default(true),
  image: json(), // ✅ stores { url, public_Id } as a JSON object
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviewSchema = pgTable("reviews", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  productId: integer("product_id").references(() => productSchema.id),
  userId: varchar("user_id", { length: 50 }),
  rating: integer("rating"),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});