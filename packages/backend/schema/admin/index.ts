import { pgTable, varchar, integer, timestamp } from "drizzle-orm/pg-core";

const adminsSchema = pgTable('admins', {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    email: varchar().unique().notNull(),
    password: varchar().notNull(),
    username: varchar(),
    phone: varchar().notNull().unique(),
    photo: varchar(),
    role: varchar().notNull().default('user'),
    createdAt: timestamp().defaultNow(),
    updatedAt: varchar(),
});

export default adminsSchema;