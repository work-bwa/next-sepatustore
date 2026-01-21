import { Receipt, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export function ProductTransactionsEmptyState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Receipt className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No transactions yet</h3>
        <p className="mt-2 text-center text-sm text-muted-foreground max-w-sm">
          You haven&apos;t received any transactions yet. Create your first
          transaction to get started.
        </p>
        <Button asChild className="mt-6">
          <Link href="/admin/transactions/create">
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
