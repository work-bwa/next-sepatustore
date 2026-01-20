import { pgTable, varchar, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { shoes } from ".";

export const shoePhotos = pgTable("shoe_photos", {
  id: uuid("id").primaryKey().defaultRandom(),

  shoeId: uuid("shoe_id")
    .notNull()
    .references(() => shoes.id),

  photo: varchar("photo", { length: 255 }).notNull(),
}).enableRLS();

export const shoePhotoRelations = relations(shoePhotos, ({ one }) => ({
  shoe: one(shoes, {
    fields: [shoePhotos.shoeId],
    references: [shoes.id],
  }),
}));
