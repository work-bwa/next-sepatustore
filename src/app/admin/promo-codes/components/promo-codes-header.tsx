"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PromoCodeFormDialog } from "./promo-code-form-dialog";

export function PromoCodesHeader() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Promo Codes
        </h1>
        <p className="text-muted-foreground">
          Manage discount promo codes for your store
        </p>
      </div>
      <Button onClick={() => setOpen(true)} className="w-full sm:w-auto">
        <Plus className="mr-2 h-4 w-4" />
        Add Promo Code
      </Button>
      <PromoCodeFormDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
