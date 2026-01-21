"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { uploadImage, deleteImage } from "@/lib/storage";
import { createProductTransaction, updateProductTransaction } from "../actions";
import type {
  ProductTransaction,
  ProductTransactionFormData,
  ShoeOption,
  PromoCodeOption,
  ImageFile,
} from "../transaction.type";
import { ProductPriceStep } from "./steps/product-price-step";
import { CustomerInfoStep } from "./steps/customer-info-step";
import { PaymentInfoStep } from "./steps/payment-info-step";
import { Spinner } from "@/components/ui/spinner";

interface ProductTransactionFormProps {
  shoes: ShoeOption[];
  promoCodes: PromoCodeOption[];
  transaction?: ProductTransaction;
}

const steps = [
  {
    id: 1,
    title: "Product & Price",
    description: "Select product and quantity",
  },
  {
    id: 2,
    title: "Customer Info",
    description: "Customer details and address",
  },
  { id: 3, title: "Payment Info", description: "Payment status and proof" },
];

export function ProductTransactionForm({
  shoes,
  promoCodes,
  transaction,
}: ProductTransactionFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<ProductTransactionFormData>({
    shoeId: transaction?.shoeId || "",
    promoCodeId: transaction?.promoCodeId || null,
    shoeSize: transaction?.shoeSize || "",
    quantity: transaction?.quantity || 1,
    price: transaction?.price || 0,
    subTotalAmount: transaction?.subTotalAmount || 0,
    discountAmount: transaction?.discountAmount || 0,
    grandTotalAmount: transaction?.grandTotalAmount || 0,
    name: transaction?.name || "",
    phone: transaction?.phone || "",
    email: transaction?.email || "",
    address: transaction?.address || "",
    city: transaction?.city || "",
    postCode: transaction?.postCode || "",
    bookingTrxId: transaction?.bookingTrxId || "",
    isPaid: transaction?.isPaid || false,
    proof: transaction?.proof || null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Image file state
  const [imageFile, setImageFile] = useState<ImageFile>({
    file: null,
    preview: "",
    isExisting: false,
  });

  // Track original image URL untuk perbandingan saat update
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);

  // Initialize image state when editing
  useEffect(() => {
    if (transaction?.proof) {
      setImageFile({
        file: null,
        preview: transaction.proof,
        isExisting: true,
      });
      setOriginalImageUrl(transaction.proof);
    }
  }, [transaction]);

  // Cleanup blob URL when component unmounts
  useEffect(() => {
    return () => {
      if (imageFile.preview && !imageFile.isExisting) {
        URL.revokeObjectURL(imageFile.preview);
      }
    };
  }, [imageFile]);

  const updateFormData = (data: Partial<ProductTransactionFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    const newErrors = { ...errors };
    Object.keys(data).forEach((key) => {
      delete newErrors[key];
    });
    setErrors(newErrors);
  };

  const handleImageChange = (value: ImageFile) => {
    setImageFile(value);
    // Clear proof error when image changes
    if (errors.proof) {
      const newErrors = { ...errors };
      delete newErrors.proof;
      setErrors(newErrors);
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.shoeId) newErrors.shoeId = "Please select a product";
      if (!formData.shoeSize) newErrors.shoeSize = "Please select a size";
      if (formData.quantity < 1)
        newErrors.quantity = "Quantity must be at least 1";
    }

    if (step === 2) {
      if (!formData.name.trim()) newErrors.name = "Name is required";
      if (!formData.phone.trim()) newErrors.phone = "Phone is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Invalid email format";
      }
      if (!formData.address.trim()) newErrors.address = "Address is required";
      if (!formData.city.trim()) newErrors.city = "City is required";
      if (!formData.postCode.trim())
        newErrors.postCode = "Post code is required";
    }

    if (step === 3) {
      if (formData.isPaid && !imageFile.preview) {
        newErrors.proof = "Payment proof is required when marked as paid";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);

    try {
      let proofUrl = imageFile.isExisting ? imageFile.preview : null;
      let shouldDeleteOldImage = false;

      // Check if image changed (new file uploaded)
      const hasNewImage = imageFile.file && !imageFile.isExisting;

      // Check if we need to delete old image
      // Only delete if: editing + has original image + (image changed OR image removed)
      const isEditing = !!transaction;
      const imageRemoved = !imageFile.preview && originalImageUrl;

      if (isEditing && originalImageUrl && (hasNewImage || imageRemoved)) {
        shouldDeleteOldImage = true;
      }

      // Upload new image if there's a file to upload
      if (hasNewImage) {
        const uploadResult = await uploadImage(imageFile.file!, "transactions");

        if (uploadResult.error || !uploadResult.url) {
          toast.error("Failed to upload image", {
            description: uploadResult.error || "Unknown error",
          });
          setIsSubmitting(false);
          return;
        }

        proofUrl = uploadResult.url;
      }

      // Prepare form data with proof URL
      const submitData: ProductTransactionFormData = {
        ...formData,
        proof: proofUrl,
      };

      let result;
      if (transaction) {
        result = await updateProductTransaction(transaction.id, submitData);
      } else {
        result = await createProductTransaction(submitData);
      }

      if (result.success) {
        // Delete old image from storage after successful save
        if (shouldDeleteOldImage && originalImageUrl) {
          try {
            await deleteImage(originalImageUrl);
          } catch (error) {
            console.error("Failed to delete old image:", error);
          }
        }

        toast.success(
          transaction
            ? "Transaction updated successfully"
            : "Transaction created successfully",
        );
        router.push("/admin/transactions");
      } else {
        toast.error(result.error || "Failed to save transaction");
      }
    } catch (error) {
      console.error("Error saving transaction:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToStep = (step: number) => {
    if (step <= currentStep) {
      setCurrentStep(step);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stepper */}
      <div className="hidden sm:block">
        <nav aria-label="Progress">
          <ol className="flex items-center">
            {steps.map((step, index) => (
              <li
                key={step.id}
                className={cn(
                  "relative",
                  index !== steps.length - 1 && "flex-1 pr-8",
                )}
              >
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => goToStep(step.id)}
                    disabled={step.id > currentStep}
                    className={cn(
                      "relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                      step.id < currentStep &&
                        "border-primary bg-primary text-primary-foreground",
                      step.id === currentStep &&
                        "border-primary bg-primary text-primary-foreground",
                      step.id > currentStep &&
                        "border-muted bg-background text-muted-foreground",
                    )}
                  >
                    {step.id < currentStep ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </button>
                  {index !== steps.length - 1 && (
                    <div
                      className={cn(
                        "absolute left-10 top-5 h-0.5 w-[calc(100%-2.5rem)]",
                        step.id < currentStep ? "bg-primary" : "bg-muted",
                      )}
                    />
                  )}
                </div>
                <div className="mt-2">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      step.id <= currentStep
                        ? "text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground hidden lg:block">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Mobile Stepper */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step) => (
            <button
              key={step.id}
              type="button"
              onClick={() => goToStep(step.id)}
              disabled={step.id > currentStep}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                step.id < currentStep && "bg-primary text-primary-foreground",
                step.id === currentStep && "bg-primary text-primary-foreground",
                step.id > currentStep && "bg-muted text-muted-foreground",
              )}
            >
              {step.id < currentStep ? <Check className="h-4 w-4" /> : step.id}
            </button>
          ))}
        </div>
        <p className="text-sm font-medium">{steps[currentStep - 1].title}</p>
        <p className="text-xs text-muted-foreground">
          {steps[currentStep - 1].description}
        </p>
      </div>

      {/* Form Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && (
            <ProductPriceStep
              formData={formData}
              updateFormData={updateFormData}
              shoes={shoes}
              promoCodes={promoCodes}
              errors={errors}
            />
          )}
          {currentStep === 2 && (
            <CustomerInfoStep
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />
          )}
          {currentStep === 3 && (
            <PaymentInfoStep
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
              imageFile={imageFile}
              onImageChange={handleImageChange}
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={currentStep === 1 ? () => router.back() : handlePrevious}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {currentStep === 1 ? "Cancel" : "Previous"}
        </Button>

        {currentStep < 3 ? (
          <Button type="button" onClick={handleNext}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                {transaction ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                {transaction ? "Update Transaction" : "Create Transaction"}
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
