import { pgTable, varchar, integer, json, timestamp } from "drizzle-orm/pg-core";

const managerSchema = pgTable('managers', {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    email: varchar().unique().notNull(),
    password: varchar().notNull(),
    username: varchar(),
    phone: varchar().notNull().unique(),
    photo: varchar(),
    vendors_Id: json().$type<number[]>(),
    role: varchar().notNull().default('user'),
    createdAt: timestamp().defaultNow(),
    updatedAt: varchar()
});

export default managerSchema;