"use client";

import Image from "next/image";
import { CheckCircle, XCircle, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import type { ProductTransaction } from "../transaction.type";

interface ProductTransactionDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: ProductTransaction | null;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ProductTransactionDetailDialog({
  open,
  onOpenChange,
  transaction,
}: ProductTransactionDetailDialogProps) {
  if (!transaction) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Transaction Details</span>
            {transaction.isPaid ? (
              <Badge className="bg-green-100 text-green-700">
                <CheckCircle className="mr-1 h-3 w-3" />
                Paid
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="bg-yellow-100 text-yellow-700"
              >
                <XCircle className="mr-1 h-3 w-3" />
                Pending
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Booking Info */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Booking Information
            </h4>
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Booking ID
                </span>
                <Badge variant="outline" className="font-mono">
                  {transaction.bookingTrxId}
                </Badge>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Product Information
            </h4>
            <div className="rounded-lg border p-4">
              <div className="flex gap-4">
                {transaction.shoe?.thumbnail && (
                  <div className="relative h-20 w-20 overflow-hidden rounded-lg border shrink-0">
                    <Image
                      src={transaction.shoe.thumbnail}
                      alt={transaction.shoe.name || "Product"}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="space-y-1 flex-1">
                  <p className="font-medium">
                    {transaction.shoe?.name || "Unknown Product"}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span>Size: {transaction.shoeSize}</span>
                    <span>Qty: {transaction.quantity}</span>
                    <span>@ {formatCurrency(transaction.price)}</span>
                  </div>
                  {transaction.promoCode && (
                    <Badge variant="secondary" className="text-xs">
                      Promo: {transaction.promoCode.code}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Price Summary
            </h4>
            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(transaction.subTotalAmount)}</span>
              </div>
              {transaction.discountAmount && transaction.discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(transaction.discountAmount)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Grand Total</span>
                <span>{formatCurrency(transaction.grandTotalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Customer Information
            </h4>
            <div className="rounded-lg border p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-muted-foreground">Name</span>
                  <p className="font-medium">{transaction.name}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Phone</span>
                  <p className="font-medium">{transaction.phone}</p>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-xs text-muted-foreground">Email</span>
                  <p className="font-medium">{transaction.email}</p>
                </div>
              </div>
              <Separator />
              <div>
                <span className="text-xs text-muted-foreground">
                  Shipping Address
                </span>
                <p className="font-medium">{transaction.address}</p>
                <p className="text-sm text-muted-foreground">
                  {transaction.city}, {transaction.postCode}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Proof */}
          {transaction.proof && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                Payment Proof
              </h4>
              <div className="rounded-lg border p-4">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <Image
                    src={transaction.proof}
                    alt="Payment proof"
                    fill
                    className="object-contain"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full"
                  asChild
                >
                  <a
                    href={transaction.proof}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Full Image
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
