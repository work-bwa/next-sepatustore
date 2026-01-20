import {
  pgTable,
  varchar,
  integer,
  boolean,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { promoCodes, shoes } from ".";

export const productTransactions = pgTable("product_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),

  shoeId: uuid("shoe_id")
    .notNull()
    .references(() => shoes.id),

  promoCodeId: uuid("promo_code_id").references(() => promoCodes.id),

  shoeSize: varchar("shoe_size", { length: 50 }).notNull(),
  quantity: integer("quantity").notNull(),

  price: integer("price").notNull(),
  subTotalAmount: integer("sub_total_amount").notNull(),
  discountAmount: integer("discount_amount").default(0),
  grandTotalAmount: integer("grand_total_amount").notNull(),

  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  address: text("address").notNull(),
  city: varchar("city", { length: 255 }).notNull(),
  postCode: varchar("post_code", { length: 255 }).notNull(),

  bookingTrxId: varchar("booking_trx_id", { length: 255 }).notNull(),
  isPaid: boolean("is_paid").default(false),
  proof: varchar("proof", { length: 255 }),
}).enableRLS();

export const productTransactionRelations = relations(
  productTransactions,
  ({ one }) => ({
    shoe: one(shoes, {
      fields: [productTransactions.shoeId],
      references: [shoes.id],
    }),

    promoCode: one(promoCodes, {
      fields: [productTransactions.promoCodeId],
      references: [promoCodes.id],
    }),
  }),
);
