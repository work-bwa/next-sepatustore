"use client";

import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  ProductTransactionFormData,
  ShoeOption,
  PromoCodeOption,
} from "../../transaction.type";

interface ProductPriceStepProps {
  formData: ProductTransactionFormData;
  updateFormData: (data: Partial<ProductTransactionFormData>) => void;
  shoes: ShoeOption[];
  promoCodes: PromoCodeOption[];
  errors: Record<string, string>;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ProductPriceStep({
  formData,
  updateFormData,
  shoes,
  promoCodes,
  errors,
}: ProductPriceStepProps) {
  const selectedShoe = shoes.find((s) => s.id === formData.shoeId);
  const selectedPromo = promoCodes.find((p) => p.id === formData.promoCodeId);

  const calculatePrices = (
    shoe: ShoeOption | undefined,
    quantity: number,
    promo: PromoCodeOption | undefined,
  ) => {
    const price = shoe?.price || 0;
    const subTotalAmount = price * quantity;
    const discountAmount = promo?.discountAmount || 0;
    const grandTotalAmount = Math.max(0, subTotalAmount - discountAmount);

    return { price, subTotalAmount, discountAmount, grandTotalAmount };
  };

  const handleShoeChange = (shoeId: string) => {
    const shoe = shoes.find((s) => s.id === shoeId);
    const prices = calculatePrices(shoe, formData.quantity, selectedPromo);
    updateFormData({
      shoeId,
      shoeSize: "", // Reset size when shoe changes
      ...prices,
    });
  };

  const handleSizeChange = (size: string) => {
    updateFormData({ shoeSize: size });
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = Math.max(1, parseInt(e.target.value) || 1);
    const prices = calculatePrices(selectedShoe, quantity, selectedPromo);
    updateFormData({ quantity, ...prices });
  };

  const handlePromoChange = (promoId: string) => {
    const promo =
      promoId === "none" ? undefined : promoCodes.find((p) => p.id === promoId);
    const prices = calculatePrices(selectedShoe, formData.quantity, promo);
    updateFormData({
      promoCodeId: promoId === "none" ? null : promoId,
      ...prices,
    });
  };

  return (
    <div className="space-y-6">
      {/* Product Selection */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="shoeId">
            Product <span className="text-destructive">*</span>
          </Label>
          <Select value={formData.shoeId} onValueChange={handleShoeChange}>
            <SelectTrigger
              className={errors.shoeId ? "border-destructive" : ""}
            >
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              {shoes.map((shoe) => (
                <SelectItem key={shoe.id} value={shoe.id}>
                  <div className="flex items-center gap-2">
                    <span>{shoe.name}</span>
                    <span className="text-muted-foreground">
                      - {formatCurrency(shoe.price)}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.shoeId && (
            <p className="text-sm text-destructive">{errors.shoeId}</p>
          )}
        </div>

        {/* Selected Product Preview */}
        {selectedShoe && (
          <div className="sm:col-span-2 rounded-lg border p-4">
            <div className="flex gap-4">
              {selectedShoe.thumbnail && (
                <div className="relative h-20 w-20 overflow-hidden rounded-lg border shrink-0">
                  <Image
                    src={selectedShoe.thumbnail}
                    alt={selectedShoe.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <p className="font-medium">{selectedShoe.name}</p>
                <p className="text-lg font-bold text-primary">
                  {formatCurrency(selectedShoe.price)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedShoe.sizes.length} sizes available
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="shoeSize">
            Size <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.shoeSize}
            onValueChange={handleSizeChange}
            disabled={!selectedShoe}
          >
            <SelectTrigger
              className={errors.shoeSize ? "border-destructive" : ""}
            >
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {selectedShoe?.sizes.map((size) => (
                <SelectItem key={size.id} value={size.size}>
                  {size.size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.shoeSize && (
            <p className="text-sm text-destructive">{errors.shoeSize}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">
            Quantity <span className="text-destructive">*</span>
          </Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            value={formData.quantity}
            onChange={handleQuantityChange}
            className={errors.quantity ? "border-destructive" : ""}
          />
          {errors.quantity && (
            <p className="text-sm text-destructive">{errors.quantity}</p>
          )}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="promoCodeId">Promo Code (Optional)</Label>
          <Select
            value={formData.promoCodeId || "none"}
            onValueChange={handlePromoChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select promo code" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No promo code</SelectItem>
              {promoCodes.map((promo) => (
                <SelectItem key={promo.id} value={promo.id}>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{promo.code}</span>
                    <span className="text-green-600">
                      -{formatCurrency(promo.discountAmount)}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Price Summary */}
      <div className="rounded-lg bg-muted p-4 space-y-2">
        <h4 className="font-medium">Price Summary</h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Price × {formData.quantity}
            </span>
            <span>{formatCurrency(formData.subTotalAmount)}</span>
          </div>
          {formData.discountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount ({selectedPromo?.code})</span>
              <span>-{formatCurrency(formData.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t font-medium text-base">
            <span>Grand Total</span>
            <span>{formatCurrency(formData.grandTotalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
