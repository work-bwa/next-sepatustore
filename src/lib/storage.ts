import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Storage bucket name
const BUCKET_NAME = "images";

interface UploadResult {
  url: string | null;
  error: string | null;
}

/**
 * Upload image to Supabase Storage
 */
export async function uploadImage(
  file: File,
  folder: string = "brands",
): Promise<UploadResult> {
  try {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      return { url: null, error: "File must be an image" };
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return { url: null, error: "File size must be less than 5MB" };
    }

    // Generate unique filename
    const ext = file.name.split(".").pop();
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filename, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return { url: null, error: error.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    return { url: urlData.publicUrl, error: null };
  } catch (error) {
    console.error("Upload error:", error);
    return { url: null, error: "Failed to upload image" };
  }
}

/**
 * Delete image from Supabase Storage
 */
export async function deleteImage(
  url: string,
): Promise<{ success: boolean; error: string | null }> {
  try {
    // Extract path from URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split(
      `/storage/v1/object/public/${BUCKET_NAME}/`,
    );

    if (pathParts.length < 2) {
      return { success: false, error: "Invalid image URL" };
    }

    const filePath = pathParts[1];

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error("Supabase delete error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Delete error:", error);
    return { success: false, error: "Failed to delete image" };
  }
}

/**
 * Get signed URL for private bucket (if needed)
 */
export async function getSignedUrl(
  path: string,
  expiresIn: number = 3600,
): Promise<{ url: string | null; error: string | null }> {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(path, expiresIn);

    if (error) {
      return { url: null, error: error.message };
    }

    return { url: data.signedUrl, error: null };
  } catch (error) {
    console.error("Signed URL error:", error);
    return { url: null, error: "Failed to get signed URL" };
  }
}
