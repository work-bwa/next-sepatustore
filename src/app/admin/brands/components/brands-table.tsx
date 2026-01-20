"use client";

import { useState } from "react";
import Image from "next/image";
import { MoreHorizontal, Pencil, Trash2, Search } from "lucide-react";
import { Brand } from "../brand.type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { BrandFormDialog } from "./brands-form-dialog";
import { BrandDeleteDialog } from "./brands-delete-dialog";
import { BrandsEmptyState } from "./brands-empty-state";

interface BrandsTableProps {
  brands: Brand[];
}

export function BrandsTable({ brands }: BrandsTableProps) {
  const [search, setSearch] = useState("");
  const [editBrand, setEditBrand] = useState<Brand | null>(null);
  const [deleteBrand, setDeleteBrand] = useState<Brand | null>(null);

  // Filter brands based on search
  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (brands.length === 0) {
    return <BrandsEmptyState />;
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search brands..."
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
              <TableHead className="w-20">Logo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">Created</TableHead>
              <TableHead className="w-17.5">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBrands.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No brands found.
                </TableCell>
              </TableRow>
            ) : (
              filteredBrands.map((brand) => (
                <TableRow key={brand.id}>
                  <TableCell>
                    <div className="relative h-10 w-10 overflow-hidden rounded-lg border bg-muted">
                      <Image
                        src={brand.logo}
                        alt={brand.name}
                        fill
                        className="object-contain p-1"
                        sizes="40px"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{brand.name}</TableCell>
                  <TableCell className="hidden text-muted-foreground sm:table-cell">
                    {brand.createdAt
                      ? new Date(brand.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "-"}
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
                        <DropdownMenuItem onClick={() => setEditBrand(brand)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteBrand(brand)}
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
      <BrandFormDialog
        open={!!editBrand}
        onOpenChange={(open) => !open && setEditBrand(null)}
        brand={editBrand}
      />

      {/* Delete Dialog */}
      <BrandDeleteDialog
        open={!!deleteBrand}
        onOpenChange={(open) => !open && setDeleteBrand(null)}
        brand={deleteBrand}
      />
    </div>
  );
}
