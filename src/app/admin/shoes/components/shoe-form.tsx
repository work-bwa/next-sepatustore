"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Shoe } from "../shoe.type";
import { createShoe, updateShoe } from "../actions";
import { uploadImage, deleteImage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload, ImageFile } from "./image-upload";
import { MultiImageUpload, MultiImageFile } from "./multi-image-upload";
import { SizeInput } from "./size-input";

const shoeSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Price must be greater than 0",
    }),
  about: z.string().min(1, "Description is required"),
  stock: z
    .string()
    .min(1, "Stock is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Stock must be 0 or greater",
    }),
  isPopular: z.boolean(),
  categoryId: z.string().min(1, "Category is required"),
  brandId: z.string().min(1, "Brand is required"),
});

type FormData = z.infer<typeof shoeSchema>;

interface ShoeFormProps {
  shoe?: Shoe | null;
  brands: { id: string; name: string }[];
  categories: { id: string; name: string }[];
}

export function ShoeForm({ shoe, brands, categories }: ShoeFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Thumbnail state
  const [thumbnail, setThumbnail] = useState<ImageFile>({
    file: null,
    preview: shoe?.thumbnail || "",
    isExisting: !!shoe?.thumbnail,
  });
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const [originalThumbnail] = useState<string | null>(shoe?.thumbnail || null);

  // Photos state
  const [photos, setPhotos] = useState<MultiImageFile[]>(
    shoe?.photos?.map((p) => ({
      id: p.id,
      file: null,
      preview: p.photo,
      isExisting: true,
    })) || [],
  );
  const [deletedPhotos, setDeletedPhotos] = useState<
    { id: string; url: string }[]
  >([]);

  // Sizes state
  const [sizes, setSizes] = useState<{ id?: string; value: string }[]>(
    shoe?.sizes?.map((s) => ({ id: s.id, value: s.size })) || [],
  );
  const [deletedSizeIds, setDeletedSizeIds] = useState<string[]>([]);
  const [sizesError, setSizesError] = useState<string | null>(null);

  const isEditing = !!shoe;

  const form = useForm<FormData>({
    resolver: zodResolver(shoeSchema),
    defaultValues: {
      name: shoe?.name || "",
      price: shoe?.price?.toString() || "",
      about: shoe?.about || "",
      stock: shoe?.stock?.toString() || "0",
      isPopular: shoe?.isPopular || false,
      categoryId: shoe?.categoryId || "",
      brandId: shoe?.brandId || "",
    },
  });

  const handleRemovePhoto = (index: number) => {
    const photo = photos[index];
    if (photo.isExisting && photo.id) {
      setDeletedPhotos((prev) => [
        ...prev,
        { id: photo.id!, url: photo.preview },
      ]);
    } else if (photo.preview && !photo.isExisting) {
      URL.revokeObjectURL(photo.preview);
    }
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveSize = (index: number) => {
    const size = sizes[index];
    if (size.id) {
      setDeletedSizeIds((prev) => [...prev, size.id!]);
    }
    setSizes((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormData) => {
    // Validate thumbnail
    if (!thumbnail.preview) {
      setThumbnailError("Thumbnail is required");
      return;
    }

    // Validate sizes
    if (sizes.length === 0) {
      setSizesError("At least one size is required");
      return;
    }

    setIsLoading(true);
    setThumbnailError(null);
    setSizesError(null);

    try {
      // Convert string to number
      const price = Number(data.price);
      const stock = Number(data.stock);

      // Upload thumbnail if new
      let thumbnailUrl = thumbnail.preview;
      if (thumbnail.file && !thumbnail.isExisting) {
        const result = await uploadImage(thumbnail.file, "shoes/thumbnails");
        if (result.error || !result.url) {
          toast.error("Failed to upload thumbnail");
          setIsLoading(false);
          return;
        }
        thumbnailUrl = result.url;
      }

      // Upload new photos
      const uploadedPhotos: { id?: string; photo: string }[] = [];
      for (const photo of photos) {
        if (photo.file && !photo.isExisting) {
          const result = await uploadImage(photo.file, "shoes/photos");
          if (result.error || !result.url) {
            toast.error("Failed to upload photo");
            setIsLoading(false);
            return;
          }
          uploadedPhotos.push({ photo: result.url });
        } else if (photo.isExisting && photo.id) {
          uploadedPhotos.push({ id: photo.id, photo: photo.preview });
        }
      }

      if (isEditing && shoe) {
        // Check if thumbnail changed
        const shouldDeleteOldThumbnail =
          originalThumbnail && thumbnail.file && !thumbnail.isExisting;

        const result = await updateShoe(shoe.id, {
          name: data.name,
          price,
          about: data.about,
          stock,
          isPopular: data.isPopular,
          categoryId: data.categoryId,
          brandId: data.brandId,
          thumbnail: thumbnailUrl,
          photos: uploadedPhotos,
          sizes: sizes.map((s) => ({ id: s.id, size: s.value })),
          deletedPhotoIds: deletedPhotos.map((p) => p.id),
          deletedSizeIds,
          deletedPhotoUrls: deletedPhotos.map((p) => p.url),
        });

        if (result.error) {
          toast.error("Failed to update shoe", { description: result.error });
          return;
        }

        // Delete old thumbnail if changed
        if (shouldDeleteOldThumbnail && originalThumbnail) {
          try {
            await deleteImage(originalThumbnail);
          } catch (error) {
            console.error("Failed to delete old thumbnail:", error);
          }
        }

        toast.success("Shoe updated successfully");
      } else {
        const result = await createShoe({
          name: data.name,
          price,
          about: data.about,
          stock,
          isPopular: data.isPopular,
          categoryId: data.categoryId,
          brandId: data.brandId,
          thumbnail: thumbnailUrl,
          photos: uploadedPhotos.map((p) => p.photo),
          sizes: sizes.map((s) => s.value),
        });

        if (result.error) {
          toast.error("Failed to create shoe", { description: result.error });
          return;
        }

        toast.success("Shoe created successfully");
      }

      router.push("/admin/shoes");
    } catch (error) {
      console.error("Error saving shoe:", error);
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Nike Air Max 90" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (IDR)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="1500000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Thumbnail */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Thumbnail</label>
                <ImageUpload
                  value={thumbnail}
                  onChange={(value) => {
                    setThumbnail(value);
                    setThumbnailError(null);
                  }}
                  disabled={isLoading}
                />
                {thumbnailError && (
                  <p className="text-sm font-medium text-destructive">
                    {thumbnailError}
                  </p>
                )}
              </div>

              {/* Photos */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Photos ({photos.length})
                </label>
                <MultiImageUpload
                  value={photos}
                  onChange={setPhotos}
                  onRemove={handleRemovePhoto}
                  disabled={isLoading}
                />
              </div>

              {/* Sizes */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Sizes ({sizes.length})
                </label>
                <SizeInput
                  value={sizes}
                  onChange={setSizes}
                  onRemove={handleRemoveSize}
                  disabled={isLoading}
                />
                {sizesError && (
                  <p className="text-sm font-medium text-destructive">
                    {sizesError}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Additional Card */}
          <Card>
            <CardHeader>
              <CardTitle>Additional</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="about"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write product description..."
                        className="min-h-30"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brandId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select brand" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {brands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPopular"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Popular Product</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Mark this product as popular
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/shoes")}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Save Changes" : "Create Shoe"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
