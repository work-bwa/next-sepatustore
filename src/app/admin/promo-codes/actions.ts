"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { promoCodes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { PromoCodeFormData } from "./promo-code.type";

// Get all promo codes
export async function getPromoCodes() {
  try {
    const data = await db.select().from(promoCodes).orderBy(promoCodes.code);
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching promo codes:", error);
    return { data: null, error: "Failed to fetch promo codes" };
  }
}

// Get single promo code by ID
export async function getPromoCodeById(id: string) {
  try {
    const [data] = await db
      .select()
      .from(promoCodes)
      .where(eq(promoCodes.id, id))
      .limit(1);
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching promo code:", error);
    return { data: null, error: "Failed to fetch promo code" };
  }
}

// Create new promo code
export async function createPromoCode(formData: PromoCodeFormData) {
  try {
    // Check if code already exists
    const [existing] = await db
      .select()
      .from(promoCodes)
      .where(eq(promoCodes.code, formData.code.toUpperCase()))
      .limit(1);

    if (existing) {
      return { data: null, error: "Promo code already exists" };
    }

    const [data] = await db
      .insert(promoCodes)
      .values({
        code: formData.code.toUpperCase(),
        discountAmount: formData.discountAmount,
      })
      .returning();

    revalidatePath("/admin/promo-codes");
    return { data, error: null };
  } catch (error) {
    console.error("Error creating promo code:", error);
    return { data: null, error: "Failed to create promo code" };
  }
}

// Update promo code
export async function updatePromoCode(id: string, formData: PromoCodeFormData) {
  try {
    // Check if code already exists (excluding current)
    const [existing] = await db
      .select()
      .from(promoCodes)
      .where(eq(promoCodes.code, formData.code.toUpperCase()))
      .limit(1);

    if (existing && existing.id !== id) {
      return { data: null, error: "Promo code already exists" };
    }

    const [data] = await db
      .update(promoCodes)
      .set({
        code: formData.code.toUpperCase(),
        discountAmount: formData.discountAmount,
      })
      .where(eq(promoCodes.id, id))
      .returning();

    revalidatePath("/admin/promo-codes");
    return { data, error: null };
  } catch (error) {
    console.error("Error updating promo code:", error);
    return { data: null, error: "Failed to update promo code" };
  }
}

// Delete promo code
export async function deletePromoCode(id: string) {
  try {
    await db.delete(promoCodes).where(eq(promoCodes.id, id));
    revalidatePath("/admin/promo-codes");
    return { success: true, error: null };
  } catch (error) {
    console.error("Error deleting promo code:", error);
    return { success: false, error: "Failed to delete promo code" };
  }
}
