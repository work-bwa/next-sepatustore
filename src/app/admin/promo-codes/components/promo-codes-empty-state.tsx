"use client";

import { useState } from "react";
import { Ticket, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PromoCodeFormDialog } from "./promo-code-form-dialog";

export function PromoCodesEmptyState() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center md:p-12">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <Ticket className="h-6 w-6 text-primary" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">No promo codes yet</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Get started by creating your first promo code.
      </p>
      <Button onClick={() => setOpen(true)} className="mt-4">
        <Plus className="mr-2 h-4 w-4" />
        Add Promo Code
      </Button>
      <PromoCodeFormDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
