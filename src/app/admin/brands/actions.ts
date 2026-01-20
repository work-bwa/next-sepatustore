"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { brands } from "@/db/schema";
import { eq } from "drizzle-orm";
import { BrandFormData } from "./brand.type";

// Get all brands
export async function getBrands() {
  try {
    const data = await db.select().from(brands).orderBy(brands.createdAt);
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching brands:", error);
    return { data: null, error: "Failed to fetch brands" };
  }
}

// Get single brand by ID
export async function getBrandById(id: string) {
  try {
    const [data] = await db
      .select()
      .from(brands)
      .where(eq(brands.id, id))
      .limit(1);
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching brand:", error);
    return { data: null, error: "Failed to fetch brand" };
  }
}

// Create new brand
export async function createBrand(formData: BrandFormData) {
  try {
    const [data] = await db
      .insert(brands)
      .values({
        name: formData.name,
        logo: formData.logo,
      })
      .returning();

    revalidatePath("/admin/brands");
    return { data, error: null };
  } catch (error) {
    console.error("Error creating brand:", error);
    return { data: null, error: "Failed to create brand" };
  }
}

// Update brand
export async function updateBrand(id: string, formData: BrandFormData) {
  try {
    const [data] = await db
      .update(brands)
      .set({
        name: formData.name,
        logo: formData.logo,
      })
      .where(eq(brands.id, id))
      .returning();

    revalidatePath("/admin/brands");
    return { data, error: null };
  } catch (error) {
    console.error("Error updating brand:", error);
    return { data: null, error: "Failed to update brand" };
  }
}

// Delete brand
export async function deleteBrand(id: string) {
  try {
    await db.delete(brands).where(eq(brands.id, id));
    revalidatePath("/admin/brands");
    return { success: true, error: null };
  } catch (error) {
    console.error("Error deleting brand:", error);
    return { success: false, error: "Failed to delete brand" };
  }
}
