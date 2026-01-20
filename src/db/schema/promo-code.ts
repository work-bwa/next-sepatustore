import { pgTable, varchar, integer, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { productTransactions } from ".";

export const promoCodes = pgTable("promo_codes", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 255 }).notNull(),
  discountAmount: integer("discount_amount").notNull(),
}).enableRLS();

export const promoCodeRelations = relations(promoCodes, ({ many }) => ({
  transactions: many(productTransactions),
}));
