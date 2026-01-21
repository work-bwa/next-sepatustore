"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Search,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Shoe } from "../shoe.type";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShoeDeleteDialog } from "./shoe-delete-dialog";
import { ShoesEmptyState } from "./shoes-empty-state";
import { formatCurrency } from "@/lib/utils";

interface ShoesTableProps {
  shoes: Shoe[];
}

export function ShoesTable({ shoes }: ShoesTableProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [deleteShoe, setDeleteShoe] = useState<Shoe | null>(null);

  // Get unique categories for filter
  const uniqueCategories = Array.from(
    new Map(
      shoes.filter((s) => s.category).map((s) => [s.category!.id, s.category!]),
    ).values(),
  );

  // Filter shoes based on search and category
  const filteredShoes = shoes.filter((shoe) => {
    const matchesSearch = shoe.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || shoe.categoryId === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (shoes.length === 0) {
    return <ShoesEmptyState />;
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search shoes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-45">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {uniqueCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="hidden sm:table-cell">Price</TableHead>
              <TableHead className="hidden lg:table-cell">Stock</TableHead>
              <TableHead className="hidden sm:table-cell">Popular</TableHead>
              <TableHead className="w-17.5">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredShoes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No shoes found.
                </TableCell>
              </TableRow>
            ) : (
              filteredShoes.map((shoe) => (
                <TableRow key={shoe.id}>
                  <TableCell>
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg border bg-muted">
                      <Image
                        src={shoe.thumbnail}
                        alt={shoe.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{shoe.name}</p>
                      <p className="text-sm text-muted-foreground md:hidden">
                        {shoe.category?.name}
                      </p>
                      <p className="text-sm text-muted-foreground sm:hidden">
                        {formatCurrency(shoe.price)}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline">{shoe.category?.name}</Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {formatCurrency(shoe.price)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Badge
                      variant={shoe.stock > 10 ? "default" : "destructive"}
                    >
                      {shoe.stock}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {shoe.isPopular ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-muted-foreground" />
                    )}
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
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/shoes/${shoe.id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteShoe(shoe)}
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

      {/* Delete Dialog */}
      <ShoeDeleteDialog
        open={!!deleteShoe}
        onOpenChange={(open) => !open && setDeleteShoe(null)}
        shoe={deleteShoe}
      />
    </div>
  );
}
