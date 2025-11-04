import { integer, pgTable, varchar, text, timestamp } from "drizzle-orm/pg-core";

const usersSchema = pgTable('users', {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  email: varchar().unique(),
  password: varchar(),
  username: varchar(),
  phone: varchar().notNull().unique(),
  default_address: text(),
  city: varchar(),
  state: varchar(),
  pinCode: integer(),
  wallet_balance: integer().default(0),
  loyalty_points: integer().default(0),
  status: varchar().notNull().default('active'),
  createdAt: timestamp().defaultNow(),
  updatedAt: varchar(),
});

export default usersSchema;