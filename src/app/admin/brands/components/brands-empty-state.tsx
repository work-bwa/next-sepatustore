"use client";

import { useState } from "react";
import { Award, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandFormDialog } from "./brands-form-dialog";

export function BrandsEmptyState() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center md:p-12">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <Award className="h-6 w-6 text-primary" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">No brands yet</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Get started by adding your first shoe brand.
      </p>
      <Button onClick={() => setOpen(true)} className="mt-4">
        <Plus className="mr-2 h-4 w-4" />
        Add Brand
      </Button>
      <BrandFormDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
