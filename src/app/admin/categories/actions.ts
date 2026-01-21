"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { CategoryFormData } from "./category.type";
import { deleteImage } from "@/lib/storage";

// Get all categories
export async function getCategories() {
  try {
    const data = await db
      .select()
      .from(categories)
      .orderBy(categories.createdAt);
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { data: null, error: "Failed to fetch categories" };
  }
}

// Get single category by ID
export async function getCategoryById(id: string) {
  try {
    const [data] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching category:", error);
    return { data: null, error: "Failed to fetch category" };
  }
}

// Create new category
export async function createCategory(formData: CategoryFormData) {
  try {
    const [data] = await db
      .insert(categories)
      .values({
        name: formData.name,
        icon: formData.icon,
      })
      .returning();

    revalidatePath("/admin/categories");
    return { data, error: null };
  } catch (error) {
    console.error("Error creating category:", error);
    return { data: null, error: "Failed to create category" };
  }
}

// Update category
export async function updateCategory(id: string, formData: CategoryFormData) {
  try {
    const [data] = await db
      .update(categories)
      .set({
        name: formData.name,
        icon: formData.icon,
      })
      .where(eq(categories.id, id))
      .returning();

    revalidatePath("/admin/categories");
    return { data, error: null };
  } catch (error) {
    console.error("Error updating category:", error);
    return { data: null, error: "Failed to update category" };
  }
}

// Delete category
export async function deleteCategory(id: string) {
  try {
    // Get category first to get the icon URL
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);

    if (!category) {
      return { success: false, error: "Category not found" };
    }

    // Delete category from database
    await db.delete(categories).where(eq(categories.id, id));

    // Delete icon from Supabase storage
    if (category.icon) {
      try {
        await deleteImage(category.icon);
      } catch (error) {
        console.error("Failed to delete category icon:", error);
      }
    }

    revalidatePath("/admin/categories");
    return { success: true, error: null };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: "Failed to delete category" };
  }
}
