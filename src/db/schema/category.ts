import { pgTable, varchar, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { shoes } from ".";

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  icon: varchar("icon", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}).enableRLS();

export const categoryRelations = relations(categories, ({ many }) => ({
  shoes: many(shoes),
}));
