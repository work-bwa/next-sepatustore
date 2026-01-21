"use server";

import { db } from "@/db";
import { productTransactions, shoes, promoCodes } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { deleteImage } from "@/lib/storage";
import type {
  ProductTransaction,
  ProductTransactionFormData,
  ShoeOption,
  PromoCodeOption,
} from "./transaction.type";

function generateBookingTrxId(): string {
  const prefix = "TRX";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

export async function getProductTransactions(
  search?: string,
): Promise<ProductTransaction[]> {
  const data = await db.query.productTransactions.findMany({
    with: {
      shoe: true,
      promoCode: true,
    },
    orderBy: [desc(productTransactions.bookingTrxId)],
  });

  if (search) {
    const searchLower = search.toLowerCase();
    return data.filter(
      (trx) =>
        trx.name.toLowerCase().includes(searchLower) ||
        trx.bookingTrxId.toLowerCase().includes(searchLower) ||
        trx.email.toLowerCase().includes(searchLower) ||
        trx.phone.includes(search),
    );
  }

  return data;
}

export async function getProductTransactionById(
  id: string,
): Promise<ProductTransaction | null> {
  const data = await db.query.productTransactions.findFirst({
    where: eq(productTransactions.id, id),
    with: {
      shoe: true,
      promoCode: true,
    },
  });

  return data || null;
}

export async function getShoesForSelect(): Promise<ShoeOption[]> {
  const data = await db.query.shoes.findMany({
    with: {
      sizes: true,
    },
    orderBy: [desc(shoes.name)],
  });

  return data.map((shoe) => ({
    id: shoe.id,
    name: shoe.name,
    thumbnail: shoe.thumbnail,
    price: shoe.price,
    sizes: shoe.sizes.map((size) => ({
      id: size.id,
      size: size.size,
    })),
  }));
}

export async function getPromoCodesForSelect(): Promise<PromoCodeOption[]> {
  const data = await db.query.promoCodes.findMany({
    orderBy: [desc(promoCodes.code)],
  });

  return data.map((promo) => ({
    id: promo.id,
    code: promo.code,
    discountAmount: promo.discountAmount,
  }));
}

export async function createProductTransaction(
  data: ProductTransactionFormData,
): Promise<{ success: boolean; error?: string }> {
  try {
    const bookingTrxId = generateBookingTrxId();

    await db.insert(productTransactions).values({
      shoeId: data.shoeId,
      promoCodeId: data.promoCodeId || null,
      shoeSize: data.shoeSize,
      quantity: data.quantity,
      price: data.price,
      subTotalAmount: data.subTotalAmount,
      discountAmount: data.discountAmount,
      grandTotalAmount: data.grandTotalAmount,
      name: data.name,
      phone: data.phone,
      email: data.email,
      address: data.address,
      city: data.city,
      postCode: data.postCode,
      bookingTrxId: bookingTrxId,
      isPaid: data.isPaid,
      proof: data.proof || null,
    });

    revalidatePath("/admin/transactions");
    return { success: true };
  } catch (error) {
    console.error("Error creating product transaction:", error);
    return { success: false, error: "Failed to create transaction" };
  }
}

export async function updateProductTransaction(
  id: string,
  data: ProductTransactionFormData,
): Promise<{ success: boolean; error?: string }> {
  try {
    await db
      .update(productTransactions)
      .set({
        shoeId: data.shoeId,
        promoCodeId: data.promoCodeId || null,
        shoeSize: data.shoeSize,
        quantity: data.quantity,
        price: data.price,
        subTotalAmount: data.subTotalAmount,
        discountAmount: data.discountAmount,
        grandTotalAmount: data.grandTotalAmount,
        name: data.name,
        phone: data.phone,
        email: data.email,
        address: data.address,
        city: data.city,
        postCode: data.postCode,
        isPaid: data.isPaid,
        proof: data.proof || null,
      })
      .where(eq(productTransactions.id, id));

    revalidatePath("/admin/transactions");
    return { success: true };
  } catch (error) {
    console.error("Error updating product transaction:", error);
    return { success: false, error: "Failed to update transaction" };
  }
}

export async function deleteProductTransaction(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Get transaction dulu untuk dapat proof URL
    const transaction = await db.query.productTransactions.findFirst({
      where: eq(productTransactions.id, id),
    });

    if (!transaction) {
      return { success: false, error: "Transaction not found" };
    }

    // 2. Delete transaction dari database
    await db.delete(productTransactions).where(eq(productTransactions.id, id));

    // 3. Delete image dari Supabase storage jika ada
    if (transaction.proof) {
      try {
        await deleteImage(transaction.proof);
      } catch (error) {
        // Log error tapi tidak gagalkan operasi
        console.error("Failed to delete transaction proof image:", error);
      }
    }

    revalidatePath("/admin/transactions");
    return { success: true };
  } catch (error) {
    console.error("Error deleting product transaction:", error);
    return { success: false, error: "Failed to delete transaction" };
  }
}

export async function approveProductTransaction(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await db
      .update(productTransactions)
      .set({ isPaid: true })
      .where(eq(productTransactions.id, id));

    revalidatePath("/admin/transactions");
    return { success: true };
  } catch (error) {
    console.error("Error approving product transaction:", error);
    return { success: false, error: "Failed to approve transaction" };
  }
}
