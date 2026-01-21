"use client";

import { useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteProductTransaction } from "../actions";
import type { ProductTransaction } from "../transaction.type";

interface ProductTransactionDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: ProductTransaction | null;
}

export function ProductTransactionDeleteDialog({
  open,
  onOpenChange,
  transaction,
}: ProductTransactionDeleteDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!transaction) return;

    setIsLoading(true);

    try {
      const result = await deleteProductTransaction(transaction.id);

      if (result.error) {
        toast.error("Failed to delete transaction", {
          description: result.error,
        });
        return;
      }

      toast.success("Transaction deleted successfully");
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete transaction &quot;
                {transaction?.bookingTrxId}&quot;? This action cannot be undone.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
