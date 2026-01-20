import {
  pgTable,
  varchar,
  integer,
  boolean,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import {
  brands,
  categories,
  productTransactions,
  shoePhotos,
  shoeSizes,
} from ".";

export const shoes = pgTable("shoes", {
  id: uuid("id").primaryKey().defaultRandom(),

  name: varchar("name", { length: 255 }).notNull(),
  price: integer("price").notNull(),
  thumbnail: varchar("thumbnail", { length: 255 }).notNull(),
  about: text("about").notNull(),

  isPopular: boolean("is_popular").default(false),
  stock: integer("stock").notNull(),

  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id),

  brandId: uuid("brand_id")
    .notNull()
    .references(() => brands.id),
}).enableRLS();

export const shoeRelations = relations(shoes, ({ one, many }) => ({
  category: one(categories, {
    fields: [shoes.categoryId],
    references: [categories.id],
  }),

  brand: one(brands, {
    fields: [shoes.brandId],
    references: [brands.id],
  }),

  photos: many(shoePhotos),
  sizes: many(shoeSizes),
  transactions: many(productTransactions),
}));
