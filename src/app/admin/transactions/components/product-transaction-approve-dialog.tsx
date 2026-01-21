"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { approveProductTransaction } from "../actions";
import type { ProductTransaction } from "../transaction.type";
import { Spinner } from "@/components/ui/spinner";

interface ProductTransactionApproveDialogProps {
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

export function ProductTransactionApproveDialog({
  open,
  onOpenChange,
  transaction,
}: ProductTransactionApproveDialogProps) {
  const [isApproving, setIsApproving] = useState(false);

  const handleApprove = async () => {
    if (!transaction) return;

    setIsApproving(true);
    try {
      const result = await approveProductTransaction(transaction.id);

      if (result.success) {
        toast.success("Payment approved successfully");
        onOpenChange(false);
      } else {
        toast.error(result.error || "Failed to approve payment");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Approve Payment</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-2">
              <p>Are you sure you want to approve this payment?</p>
              {transaction && (
                <div className="rounded-lg bg-muted p-3 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Booking ID:</span>
                    <span className="font-mono font-medium text-foreground">
                      {transaction.bookingTrxId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Customer:</span>
                    <span className="font-medium text-foreground">
                      {transaction.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-medium text-foreground">
                      {formatCurrency(transaction.grandTotalAmount)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isApproving}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleApprove}
            disabled={isApproving}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            {isApproving ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Approving...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
