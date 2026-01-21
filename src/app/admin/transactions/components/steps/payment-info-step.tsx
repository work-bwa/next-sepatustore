"use client";

import { CheckCircle, Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type {
  ProductTransactionFormData,
  ImageFile,
} from "../../transaction.type";
import { ImageUpload } from "./image-upload";

interface PaymentInfoStepProps {
  formData: ProductTransactionFormData;
  updateFormData: (data: Partial<ProductTransactionFormData>) => void;
  errors: Record<string, string>;
  imageFile: ImageFile;
  onImageChange: (value: ImageFile) => void;
}

export function PaymentInfoStep({
  formData,
  updateFormData,
  errors,
  imageFile,
  onImageChange,
}: PaymentInfoStepProps) {
  return (
    <div className="space-y-6">
      {/* Payment Status */}
      <div className="space-y-3">
        <Label>
          Payment Status <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => updateFormData({ isPaid: false })}
            className={cn(
              "flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors",
              !formData.isPaid
                ? "border-yellow-500 bg-yellow-50"
                : "border-muted hover:border-muted-foreground/50",
            )}
          >
            <Clock
              className={cn(
                "h-8 w-8",
                !formData.isPaid ? "text-yellow-600" : "text-muted-foreground",
              )}
            />
            <span
              className={cn(
                "font-medium",
                !formData.isPaid ? "text-yellow-700" : "text-muted-foreground",
              )}
            >
              Pending
            </span>
            <span className="text-xs text-muted-foreground">
              Waiting for payment
            </span>
          </button>

          <button
            type="button"
            onClick={() => updateFormData({ isPaid: true })}
            className={cn(
              "flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors",
              formData.isPaid
                ? "border-green-500 bg-green-50"
                : "border-muted hover:border-muted-foreground/50",
            )}
          >
            <CheckCircle
              className={cn(
                "h-8 w-8",
                formData.isPaid ? "text-green-600" : "text-muted-foreground",
              )}
            />
            <span
              className={cn(
                "font-medium",
                formData.isPaid ? "text-green-700" : "text-muted-foreground",
              )}
            >
              Paid
            </span>
            <span className="text-xs text-muted-foreground">
              Payment verified
            </span>
          </button>
        </div>
      </div>

      {/* Payment Proof */}
      <div className="space-y-3">
        <Label>
          Payment Proof{" "}
          {formData.isPaid && <span className="text-destructive">*</span>}
        </Label>
        <p className="text-sm text-muted-foreground">
          Upload a screenshot or photo of the payment receipt
        </p>

        <ImageUpload
          value={imageFile}
          onChange={onImageChange}
          label="Payment Proof"
        />

        {errors.proof && (
          <p className="text-sm text-destructive">{errors.proof}</p>
        )}
      </div>

      {/* Summary Note */}
      <div className="rounded-lg bg-muted p-4">
        <h4 className="font-medium">Note</h4>
        <p className="text-sm text-muted-foreground mt-1">
          A unique booking transaction ID will be automatically generated when
          the transaction is created.
        </p>
      </div>
    </div>
  );
}
