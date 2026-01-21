"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Shoe } from "../shoe.type";
import { deleteShoe } from "../actions";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";

interface ShoeDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shoe: Shoe | null;
}

export function ShoeDeleteDialog({
  open,
  onOpenChange,
  shoe,
}: ShoeDeleteDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!shoe) return;

    setIsLoading(true);

    try {
      const result = await deleteShoe(shoe.id);

      if (result.error) {
        toast.error("Failed to delete shoe", {
          description: result.error,
        });
        return;
      }

      toast.success("Shoe deleted successfully");
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting shoe:", error);
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
              <AlertDialogTitle>Delete Shoe</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete &quot;{shoe?.name}&quot;? This
                will also delete all photos and sizes. This action cannot be
                undone.
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
            {isLoading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
