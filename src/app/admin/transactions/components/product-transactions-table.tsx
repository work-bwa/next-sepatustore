"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Eye,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Copy,
  Check,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ProductTransaction } from "../transaction.type";
import { ProductTransactionDeleteDialog } from "./product-transaction-delete-dialog";
import { ProductTransactionApproveDialog } from "./product-transaction-approve-dialog";
import { ProductTransactionDetailDialog } from "./product-transaction-detail-dialog";

interface ProductTransactionsTableProps {
  transactions: ProductTransaction[];
  search?: string;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ProductTransactionsTable({
  transactions,
  search,
}: ProductTransactionsTableProps) {
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    transaction: ProductTransaction | null;
  }>({ open: false, transaction: null });

  const [approveDialog, setApproveDialog] = useState<{
    open: boolean;
    transaction: ProductTransaction | null;
  }>({ open: false, transaction: null });

  const [detailDialog, setDetailDialog] = useState<{
    open: boolean;
    transaction: ProductTransaction | null;
  }>({ open: false, transaction: null });

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (transactions.length === 0 && search) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">
            No transactions found for &quot;{search}&quot;
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>
            {transactions.length} transaction{transactions.length !== 1 && "s"}{" "}
            found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Booking ID</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {transaction.shoe?.thumbnail && (
                          <div className="relative h-12 w-12 overflow-hidden rounded-lg border">
                            <Image
                              src={transaction.shoe.thumbnail}
                              alt={transaction.shoe.name || "Product"}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <p className="font-medium line-clamp-1">
                            {transaction.shoe?.name || "Unknown Product"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Size: {transaction.shoeSize} • Qty:{" "}
                            {transaction.quantity}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{transaction.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">
                          {transaction.bookingTrxId}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() =>
                            copyToClipboard(
                              transaction.bookingTrxId,
                              transaction.id,
                            )
                          }
                        >
                          {copiedId === transaction.id ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div>
                        <p className="font-medium">
                          {formatCurrency(transaction.grandTotalAmount)}
                        </p>
                        {transaction.discountAmount &&
                          transaction.discountAmount > 0 && (
                            <p className="text-xs text-green-600">
                              -{formatCurrency(transaction.discountAmount)}
                            </p>
                          )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {transaction.isPaid ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Paid
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                        >
                          <XCircle className="mr-1 h-3 w-3" />
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              setDetailDialog({
                                open: true,
                                transaction,
                              })
                            }
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/admin/transactions/${transaction.id}/edit`}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          {!transaction.isPaid && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  setApproveDialog({
                                    open: true,
                                    transaction,
                                  })
                                }
                                className="text-green-600"
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Approve Payment
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              setDeleteDialog({
                                open: true,
                                transaction,
                              })
                            }
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-4 md:hidden">
            {transactions.map((transaction) => (
              <MobileTransactionCard
                key={transaction.id}
                transaction={transaction}
                onViewDetails={() =>
                  setDetailDialog({ open: true, transaction })
                }
                onApprove={() => setApproveDialog({ open: true, transaction })}
                onDelete={() => setDeleteDialog({ open: true, transaction })}
                onCopy={(text) => copyToClipboard(text, transaction.id)}
                isCopied={copiedId === transaction.id}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <ProductTransactionDeleteDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog({ open, transaction: deleteDialog.transaction })
        }
        transaction={deleteDialog.transaction}
      />

      <ProductTransactionApproveDialog
        open={approveDialog.open}
        onOpenChange={(open) =>
          setApproveDialog({ open, transaction: approveDialog.transaction })
        }
        transaction={approveDialog.transaction}
      />

      <ProductTransactionDetailDialog
        open={detailDialog.open}
        onOpenChange={(open) =>
          setDetailDialog({ open, transaction: detailDialog.transaction })
        }
        transaction={detailDialog.transaction}
      />
    </>
  );
}

interface MobileTransactionCardProps {
  transaction: ProductTransaction;
  onViewDetails: () => void;
  onApprove: () => void;
  onDelete: () => void;
  onCopy: (text: string) => void;
  isCopied: boolean;
}

function MobileTransactionCard({
  transaction,
  onViewDetails,
  onApprove,
  onDelete,
  onCopy,
  isCopied,
}: MobileTransactionCardProps) {
  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {transaction.shoe?.thumbnail && (
            <div className="relative h-14 w-14 overflow-hidden rounded-lg border">
              <Image
                src={transaction.shoe.thumbnail}
                alt={transaction.shoe.name || "Product"}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div>
            <p className="font-medium line-clamp-1">
              {transaction.shoe?.name || "Unknown Product"}
            </p>
            <p className="text-sm text-muted-foreground">
              Size: {transaction.shoeSize} • Qty: {transaction.quantity}
            </p>
          </div>
        </div>
        {transaction.isPaid ? (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle className="mr-1 h-3 w-3" />
            Paid
          </Badge>
        ) : (
          <Badge
            variant="secondary"
            className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
          >
            Pending
          </Badge>
        )}
      </div>

      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Customer</span>
          <span className="font-medium">{transaction.name}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Booking ID</span>
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="font-mono text-xs">
              {transaction.bookingTrxId}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onCopy(transaction.bookingTrxId)}
            >
              {isCopied ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total</span>
          <span className="font-medium">
            {formatCurrency(transaction.grandTotalAmount)}
          </span>
        </div>
      </div>

      <div className="flex gap-2 pt-2 border-t">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={onViewDetails}
        >
          <Eye className="mr-2 h-4 w-4" />
          Details
        </Button>
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <Link href={`/admin/transactions/${transaction.id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
        {!transaction.isPaid && (
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-green-600 hover:text-green-700"
            onClick={onApprove}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Approve
          </Button>
        )}
        <Button
          variant="outline"
          size="icon"
          className="text-destructive hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
