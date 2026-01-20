"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Brand } from "../brand.type";
import { createBrand, updateBrand } from "../actions";
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

const brandSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
});

type FormData = z.infer<typeof brandSchema>;

interface BrandFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brand?: Brand | null;
}

export function BrandFormDialog({
  open,
  onOpenChange,
  brand,
}: BrandFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<ImageFile>({
    file: null,
    preview: "",
    isExisting: false,
  });
  const [imageError, setImageError] = useState<string | null>(null);

  // Track original image URL untuk perbandingan saat update
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);

  const isEditing = !!brand;

  const form = useForm<FormData>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
    },
  });

  // Reset form when dialog opens/closes or brand changes
  useEffect(() => {
    if (open) {
      form.reset({
        name: brand?.name || "",
      });

      // Set existing image if editing
      if (brand?.logo) {
        setImageFile({
          file: null,
          preview: brand.logo,
          isExisting: true,
        });
        setOriginalImageUrl(brand.logo);
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
  }, [open, brand, form]);

  // Cleanup blob URL when component unmounts
  useEffect(() => {
    return () => {
      if (imageFile.preview && !imageFile.isExisting) {
        URL.revokeObjectURL(imageFile.preview);
      }
    };
  }, [imageFile]);

  const handleOpenChange = (newOpen: boolean) => {
    // Cleanup blob URL when closing
    if (!newOpen && imageFile.preview && !imageFile.isExisting) {
      URL.revokeObjectURL(imageFile.preview);
    }
    onOpenChange(newOpen);
  };

  const onSubmit = async (data: FormData) => {
    // Validate image
    if (!imageFile.preview) {
      setImageError("Logo is required");
      return;
    }

    setIsLoading(true);
    setImageError(null);

    try {
      let logoUrl = imageFile.preview;
      let shouldDeleteOldImage = false;

      // Check if image changed (new file uploaded)
      const hasNewImage = imageFile.file && !imageFile.isExisting;

      // Check if we need to delete old image
      // Only delete if: editing + has original image + image changed
      if (isEditing && originalImageUrl && hasNewImage) {
        shouldDeleteOldImage = true;
      }

      // Upload new image if there's a file to upload
      if (hasNewImage) {
        const uploadResult = await uploadImage(imageFile.file!, "brands");

        if (uploadResult.error || !uploadResult.url) {
          toast.error("Failed to upload image", {
            description: uploadResult.error || "Unknown error",
          });
          setIsLoading(false);
          return;
        }

        logoUrl = uploadResult.url;
      }

      // Create or update brand
      if (isEditing && brand) {
        const result = await updateBrand(brand.id, {
          name: data.name,
          logo: logoUrl,
        });

        if (result.error) {
          toast.error("Failed to update brand", {
            description: result.error,
          });
          return;
        }

        // Delete old image from storage after successful update
        if (shouldDeleteOldImage && originalImageUrl) {
          try {
            await deleteImage(originalImageUrl);
          } catch (error) {
            // Log error but don't fail the operation
            console.error("Failed to delete old image:", error);
          }
        }

        toast.success("Brand updated successfully");
      } else {
        const result = await createBrand({
          name: data.name,
          logo: logoUrl,
        });

        if (result.error) {
          toast.error("Failed to create brand", {
            description: result.error,
          });
          return;
        }

        toast.success("Brand created successfully");
      }

      handleOpenChange(false);
    } catch (error) {
      console.error("Error saving brand:", error);
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Brand" : "Add Brand"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the brand information below."
              : "Add a new shoe brand to your store."}
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
                    <Input placeholder="Nike" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Upload - handled separately from react-hook-form */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Logo
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
                {isEditing ? "Save Changes" : "Create Brand"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
