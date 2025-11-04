import { pgTable, varchar, text, timestamp, integer, json } from "drizzle-orm/pg-core";

const vendorSchema = pgTable('vendors', {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  email: varchar().unique().notNull(),
  password: varchar().notNull(),
  username: varchar().notNull(),
  phone: varchar().notNull().unique(),
  shop_address: text().notNull(),
  shop_name: text().notNull(),
  gst_number: varchar().notNull(),
  shop_city: varchar().notNull(),
  shop_state: varchar().notNull(),
  shop_pinCode: varchar().notNull(),
  bank_account: varchar().notNull(),
  ifsc_code: varchar().notNull(),
  fssai_license: varchar().notNull(),
  commission_rate: varchar(),
  product_Id: json().$type<number[]>(),
  status: varchar().notNull().default('active'),
  oreders: varchar(),
  rejected_orderds: varchar(),
  createdAt: timestamp().defaultNow(),
  updatedAt: varchar(),
});

export default vendorSchema;