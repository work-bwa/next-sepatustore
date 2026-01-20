"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandFormDialog } from "./brands-form-dialog";

export function BrandsHeader() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Brands
        </h1>
        <p className="text-muted-foreground">
          Manage shoe brands for your store
        </p>
      </div>
      <Button onClick={() => setOpen(true)} className="w-full sm:w-auto">
        <Plus className="mr-2 h-4 w-4" />
        Add Brand
      </Button>
      <BrandFormDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
