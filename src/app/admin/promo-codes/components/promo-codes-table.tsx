"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2, Search, Copy } from "lucide-react";
import { toast } from "sonner";
import { PromoCode } from "../promo-code.type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PromoCodeFormDialog } from "./promo-code-form-dialog";
import { PromoCodeDeleteDialog } from "./promo-code-delete-dialog";
import { PromoCodesEmptyState } from "./promo-codes-empty-state";
import { formatCurrency } from "@/lib/utils";

interface PromoCodesTableProps {
  promoCodes: PromoCode[];
}

export function PromoCodesTable({ promoCodes }: PromoCodesTableProps) {
  const [search, setSearch] = useState("");
  const [editPromoCode, setEditPromoCode] = useState<PromoCode | null>(null);
  const [deletePromoCode, setDeletePromoCode] = useState<PromoCode | null>(
    null,
  );

  // Filter promo codes based on search
  const filteredPromoCodes = promoCodes.filter((promoCode) =>
    promoCode.code.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard");
  };

  if (promoCodes.length === 0) {
    return <PromoCodesEmptyState />;
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search promo codes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead className="w-25">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPromoCodes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No promo codes found.
                </TableCell>
              </TableRow>
            ) : (
              filteredPromoCodes.map((promoCode) => (
                <TableRow key={promoCode.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="font-mono text-sm tracking-wider"
                      >
                        {promoCode.code}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleCopyCode(promoCode.code)}
                      >
                        <Copy className="h-3.5 w-3.5" />
                        <span className="sr-only">Copy code</span>
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-green-600">
                    -{formatCurrency(promoCode.discountAmount)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setEditPromoCode(promoCode)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeletePromoCode(promoCode)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <PromoCodeFormDialog
        open={!!editPromoCode}
        onOpenChange={(open) => !open && setEditPromoCode(null)}
        promoCode={editPromoCode}
      />

      {/* Delete Dialog */}
      <PromoCodeDeleteDialog
        open={!!deletePromoCode}
        onOpenChange={(open) => !open && setDeletePromoCode(null)}
        promoCode={deletePromoCode}
      />
    </div>
  );
}
