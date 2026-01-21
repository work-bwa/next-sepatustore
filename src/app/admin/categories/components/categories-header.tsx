"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryFormDialog } from "./category-form-dialog";

export function CategoriesHeader() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Categories
        </h1>
        <p className="text-muted-foreground">
          Manage shoe categories for your store
        </p>
      </div>
      <Button onClick={() => setOpen(true)} className="w-full sm:w-auto">
        <Plus className="mr-2 h-4 w-4" />
        Add Category
      </Button>
      <CategoryFormDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
