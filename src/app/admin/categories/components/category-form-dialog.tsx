"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Category } from "../category.type";
import { createCategory, updateCategory } from "../actions";
import { uploadImage, deleteImage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ImageUpload, ImageFile } from "./image-upload";
import { Spinner } from "@/components/ui/spinner";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
});

type FormData = z.infer<typeof categorySchema>;

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
}: CategoryFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<ImageFile>({
    file: null,
    preview: "",
    isExisting: false,
  });
  const [imageError, setImageError] = useState<string | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);

  const isEditing = !!category;

  const form = useForm<FormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    },
  });

  // Reset form when dialog opens/closes or category changes
  useEffect(() => {
    if (open) {
      form.reset({
        name: category?.name || "",
      });

      if (category?.icon) {
        setImageFile({
          file: null,
          preview: category.icon,
          isExisting: true,
        });
        setOriginalImageUrl(category.icon);
      } else {
        setImageFile({
          file: null,
          preview: "",
          isExisting: false,
        });
        setOriginalImageUrl(null);
      }

      setImageError(null);
    }
  }, [open, category, form]);

  // Cleanup blob URL when component unmounts
  useEffect(() => {
    return () => {
      if (imageFile.preview && !imageFile.isExisting) {
        URL.revokeObjectURL(imageFile.preview);
      }
    };
  }, [imageFile]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && imageFile.preview && !imageFile.isExisting) {
      URL.revokeObjectURL(imageFile.preview);
    }
    onOpenChange(newOpen);
  };

  const onSubmit = async (data: FormData) => {
    if (!imageFile.preview) {
      setImageError("Icon is required");
      return;
    }

    setIsLoading(true);
    setImageError(null);

    try {
      let iconUrl = imageFile.preview;
      const hasNewImage = imageFile.file && !imageFile.isExisting;
      const shouldDeleteOldImage = isEditing && originalImageUrl && hasNewImage;

      // Upload new image if there's a file to upload
      if (hasNewImage) {
        const uploadResult = await uploadImage(imageFile.file!, "categories");

        if (uploadResult.error || !uploadResult.url) {
          toast.error("Failed to upload image", {
            description: uploadResult.error || "Unknown error",
          });
          setIsLoading(false);
          return;
        }

        iconUrl = uploadResult.url;
      }

      // Create or update category
      if (isEditing && category) {
        const result = await updateCategory(category.id, {
          name: data.name,
          icon: iconUrl,
        });

        if (result.error) {
          toast.error("Failed to update category", {
            description: result.error,
          });
          return;
        }

        // Delete old image from storage after successful update
        if (shouldDeleteOldImage && originalImageUrl) {
          try {
            await deleteImage(originalImageUrl);
          } catch (error) {
            console.error("Failed to delete old image:", error);
          }
        }

        toast.success("Category updated successfully");
      } else {
        const result = await createCategory({
          name: data.name,
          icon: iconUrl,
        });

        if (result.error) {
          toast.error("Failed to create category", {
            description: result.error,
          });
          return;
        }

        toast.success("Category created successfully");
      }

      handleOpenChange(false);
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Category" : "Add Category"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the category information below."
              : "Add a new shoe category to your store."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Running" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Icon
              </label>
              <ImageUpload
                value={imageFile}
                onChange={(value) => {
                  setImageFile(value);
                  setImageError(null);
                }}
                disabled={isLoading}
              />
              {imageError && (
                <p className="text-sm font-medium text-destructive">
                  {imageError}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Save Changes" : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
