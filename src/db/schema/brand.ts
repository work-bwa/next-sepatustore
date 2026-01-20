import { pgTable, varchar, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { shoes } from ".";

export const brands = pgTable("brands", {
  id: uuid("id").primaryKey().defaultRandom(),

  name: varchar("name", { length: 255 }).notNull(),
  logo: varchar("logo", { length: 255 }).notNull(),

  createdAt: timestamp("created_at").defaultNow(),
}).enableRLS();

export const brandRelations = relations(brands, ({ many }) => ({
  shoes: many(shoes),
}));
