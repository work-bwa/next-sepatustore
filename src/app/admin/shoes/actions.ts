"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { shoes, shoePhotos, shoeSizes, brands, categories } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { deleteImage } from "@/lib/storage";

// Get all shoes with relations
export async function getShoes() {
  try {
    const data = await db
      .select({
        id: shoes.id,
        name: shoes.name,
        price: shoes.price,
        thumbnail: shoes.thumbnail,
        about: shoes.about,
        isPopular: shoes.isPopular,
        stock: shoes.stock,
        categoryId: shoes.categoryId,
        brandId: shoes.brandId,
        categoryName: categories.name,
        brandName: brands.name,
      })
      .from(shoes)
      .leftJoin(categories, eq(shoes.categoryId, categories.id))
      .leftJoin(brands, eq(shoes.brandId, brands.id))
      .orderBy(desc(shoes.id));

    // Transform to include nested objects
    const transformed = data.map((shoe) => ({
      ...shoe,
      category: shoe.categoryName
        ? { id: shoe.categoryId, name: shoe.categoryName }
        : null,
      brand: shoe.brandName ? { id: shoe.brandId, name: shoe.brandName } : null,
    }));

    return { data: transformed, error: null };
  } catch (error) {
    console.error("Error fetching shoes:", error);
    return { data: null, error: "Failed to fetch shoes" };
  }
}

// Get single shoe by ID with photos and sizes
export async function getShoeById(id: string) {
  try {
    const [shoe] = await db
      .select({
        id: shoes.id,
        name: shoes.name,
        price: shoes.price,
        thumbnail: shoes.thumbnail,
        about: shoes.about,
        isPopular: shoes.isPopular,
        stock: shoes.stock,
        categoryId: shoes.categoryId,
        brandId: shoes.brandId,
        categoryName: categories.name,
        brandName: brands.name,
      })
      .from(shoes)
      .leftJoin(categories, eq(shoes.categoryId, categories.id))
      .leftJoin(brands, eq(shoes.brandId, brands.id))
      .where(eq(shoes.id, id))
      .limit(1);

    if (!shoe) {
      return { data: null, error: "Shoe not found" };
    }

    // Get photos
    const photos = await db
      .select()
      .from(shoePhotos)
      .where(eq(shoePhotos.shoeId, id));

    // Get sizes
    const sizes = await db
      .select()
      .from(shoeSizes)
      .where(eq(shoeSizes.shoeId, id));

    const data = {
      ...shoe,
      category: shoe.categoryName
        ? { id: shoe.categoryId, name: shoe.categoryName }
        : null,
      brand: shoe.brandName ? { id: shoe.brandId, name: shoe.brandName } : null,
      photos,
      sizes,
    };

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching shoe:", error);
    return { data: null, error: "Failed to fetch shoe" };
  }
}

// Create new shoe
export async function createShoe(data: {
  name: string;
  price: number;
  thumbnail: string;
  about: string;
  isPopular: boolean;
  stock: number;
  categoryId: string;
  brandId: string;
  photos: string[];
  sizes: string[];
}) {
  try {
    // Insert shoe
    const [shoe] = await db
      .insert(shoes)
      .values({
        name: data.name,
        price: data.price,
        thumbnail: data.thumbnail,
        about: data.about,
        isPopular: data.isPopular,
        stock: data.stock,
        categoryId: data.categoryId,
        brandId: data.brandId,
      })
      .returning();

    // Insert photos
    if (data.photos.length > 0) {
      await db.insert(shoePhotos).values(
        data.photos.map((photo) => ({
          shoeId: shoe.id,
          photo,
        })),
      );
    }

    // Insert sizes
    if (data.sizes.length > 0) {
      await db.insert(shoeSizes).values(
        data.sizes.map((size) => ({
          shoeId: shoe.id,
          size,
        })),
      );
    }

    revalidatePath("/admin/shoes");
    return { data: shoe, error: null };
  } catch (error) {
    console.error("Error creating shoe:", error);
    return { data: null, error: "Failed to create shoe" };
  }
}

// Update shoe
export async function updateShoe(
  id: string,
  data: {
    name: string;
    price: number;
    thumbnail: string;
    about: string;
    isPopular: boolean;
    stock: number;
    categoryId: string;
    brandId: string;
    photos: { id?: string; photo: string }[];
    sizes: { id?: string; size: string }[];
    deletedPhotoIds: string[];
    deletedSizeIds: string[];
    deletedPhotoUrls: string[];
  },
) {
  try {
    // Update shoe
    const [shoe] = await db
      .update(shoes)
      .set({
        name: data.name,
        price: data.price,
        thumbnail: data.thumbnail,
        about: data.about,
        isPopular: data.isPopular,
        stock: data.stock,
        categoryId: data.categoryId,
        brandId: data.brandId,
      })
      .where(eq(shoes.id, id))
      .returning();

    // Delete removed photos from database
    for (const photoId of data.deletedPhotoIds) {
      await db.delete(shoePhotos).where(eq(shoePhotos.id, photoId));
    }

    // Delete removed photos from storage
    for (const url of data.deletedPhotoUrls) {
      try {
        await deleteImage(url);
      } catch (error) {
        console.error("Failed to delete photo from storage:", error);
      }
    }

    // Delete removed sizes
    for (const sizeId of data.deletedSizeIds) {
      await db.delete(shoeSizes).where(eq(shoeSizes.id, sizeId));
    }

    // Insert new photos (without id)
    const newPhotos = data.photos.filter((p) => !p.id);
    if (newPhotos.length > 0) {
      await db.insert(shoePhotos).values(
        newPhotos.map((p) => ({
          shoeId: id,
          photo: p.photo,
        })),
      );
    }

    // Insert new sizes (without id)
    const newSizes = data.sizes.filter((s) => !s.id);
    if (newSizes.length > 0) {
      await db.insert(shoeSizes).values(
        newSizes.map((s) => ({
          shoeId: id,
          size: s.size,
        })),
      );
    }

    revalidatePath("/admin/shoes");
    revalidatePath(`/admin/shoes/${id}/edit`);
    return { data: shoe, error: null };
  } catch (error) {
    console.error("Error updating shoe:", error);
    return { data: null, error: "Failed to update shoe" };
  }
}

// Delete shoe
export async function deleteShoe(id: string) {
  try {
    // Get shoe with photos
    const [shoe] = await db
      .select()
      .from(shoes)
      .where(eq(shoes.id, id))
      .limit(1);

    if (!shoe) {
      return { success: false, error: "Shoe not found" };
    }

    // Get all photos
    const photos = await db
      .select()
      .from(shoePhotos)
      .where(eq(shoePhotos.shoeId, id));

    // Delete sizes
    await db.delete(shoeSizes).where(eq(shoeSizes.shoeId, id));

    // Delete photos from database
    await db.delete(shoePhotos).where(eq(shoePhotos.shoeId, id));

    // Delete shoe
    await db.delete(shoes).where(eq(shoes.id, id));

    // Delete thumbnail from storage
    if (shoe.thumbnail) {
      try {
        await deleteImage(shoe.thumbnail);
      } catch (error) {
        console.error("Failed to delete thumbnail:", error);
      }
    }

    // Delete photos from storage
    for (const photo of photos) {
      try {
        await deleteImage(photo.photo);
      } catch (error) {
        console.error("Failed to delete photo:", error);
      }
    }

    revalidatePath("/admin/shoes");
    return { success: true, error: null };
  } catch (error) {
    console.error("Error deleting shoe:", error);
    return { success: false, error: "Failed to delete shoe" };
  }
}

// Get brands for select
export async function getBrandsForSelect() {
  try {
    const data = await db
      .select({ id: brands.id, name: brands.name })
      .from(brands)
      .orderBy(brands.name);
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching brands:", error);
    return { data: null, error: "Failed to fetch brands" };
  }
}

// Get categories for select
export async function getCategoriesForSelect() {
  try {
    const data = await db
      .select({ id: categories.id, name: categories.name })
      .from(categories)
      .orderBy(categories.name);
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { data: null, error: "Failed to fetch categories" };
  }
}
