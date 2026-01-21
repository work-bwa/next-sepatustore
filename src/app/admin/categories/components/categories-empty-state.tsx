"use client";

import { useState } from "react";
import { FolderTree, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryFormDialog } from "./category-form-dialog";

export function CategoriesEmptyState() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center md:p-12">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <FolderTree className="h-6 w-6 text-primary" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">No categories yet</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Get started by adding your first shoe category.
      </p>
      <Button onClick={() => setOpen(true)} className="mt-4">
        <Plus className="mr-2 h-4 w-4" />
        Add Category
      </Button>
      <CategoryFormDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
