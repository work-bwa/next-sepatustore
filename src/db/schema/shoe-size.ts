import { pgTable, varchar, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { shoes } from ".";

export const shoeSizes = pgTable("shoe_sizes", {
  id: uuid("id").primaryKey().defaultRandom(),

  shoeId: uuid("shoe_id")
    .notNull()
    .references(() => shoes.id),

  size: varchar("size", { length: 50 }).notNull(),
}).enableRLS();

export const shoeSizeRelations = relations(shoeSizes, ({ one }) => ({
  shoe: one(shoes, {
    fields: [shoeSizes.shoeId],
    references: [shoes.id],
  }),
}));
