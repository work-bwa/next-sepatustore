"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { PromoCode } from "../promo-code.type";
import { createPromoCode, updatePromoCode } from "../actions";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

const promoCodeSchema = z.object({
  code: z
    .string()
    .min(1, "Code is required")
    .max(255)
    .regex(/^[A-Za-z0-9]+$/, "Code can only contain letters and numbers"),
  discountAmount: z
    .string()
    .min(1, "Discount amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Discount must be greater than 0",
    }),
});

type FormData = z.infer<typeof promoCodeSchema>;

interface PromoCodeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  promoCode?: PromoCode | null;
}

export function PromoCodeFormDialog({
  open,
  onOpenChange,
  promoCode,
}: PromoCodeFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!promoCode;

  const form = useForm<FormData>({
    resolver: zodResolver(promoCodeSchema),
    defaultValues: {
      code: "",
      discountAmount: "",
    },
  });

  // Reset form when dialog opens/closes or promoCode changes
  useEffect(() => {
    if (open) {
      form.reset({
        code: promoCode?.code || "",
        discountAmount: promoCode?.discountAmount?.toString() || "",
      });
    }
  }, [open, promoCode, form]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    try {
      const formData = {
        code: data.code,
        discountAmount: Number(data.discountAmount),
      };

      if (isEditing && promoCode) {
        const result = await updatePromoCode(promoCode.id, formData);
        if (result.error) {
          toast.error("Failed to update promo code", {
            description: result.error,
          });
          return;
        }
        toast.success("Promo code updated successfully");
      } else {
        const result = await createPromoCode(formData);
        if (result.error) {
          toast.error("Failed to create promo code", {
            description: result.error,
          });
          return;
        }
        toast.success("Promo code created successfully");
      }

      onOpenChange(false);
    } catch (error) {
      console.error("Error saving promo code:", error);
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Promo Code" : "Add Promo Code"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the promo code information below."
              : "Create a new discount promo code."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="SUMMER2024"
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value.toUpperCase())
                      }
                      className="font-mono uppercase tracking-wider"
                    />
                  </FormControl>
                  <FormDescription>
                    Letters and numbers only, no spaces
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discountAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Amount (IDR)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="50000" {...field} />
                  </FormControl>
                  <FormDescription>
                    Fixed discount amount in Rupiah
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Save Changes" : "Create Promo Code"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
