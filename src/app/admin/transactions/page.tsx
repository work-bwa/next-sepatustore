import { Suspense } from "react";
import { getProductTransactions } from "./actions";
import { ProductTransactionsHeader } from "./components/product-transactions-header";
import { ProductTransactionsTableSkeleton } from "./components/product-transactions-table-skeleton";
import { ProductTransactionsEmptyState } from "./components/product-transactions-empty-state";
import { ProductTransactionsTable } from "./components/product-transactions-table";

interface PageProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function ProductTransactionsPage({
  searchParams,
}: PageProps) {
  const { search } = await searchParams;

  return (
    <div className="space-y-6">
      <ProductTransactionsHeader />

      <Suspense fallback={<ProductTransactionsTableSkeleton />}>
        <ProductTransactionsContent search={search} />
      </Suspense>
    </div>
  );
}

async function ProductTransactionsContent({ search }: { search?: string }) {
  const transactions = await getProductTransactions(search);

  if (transactions.length === 0 && !search) {
    return <ProductTransactionsEmptyState />;
  }

  return (
    <ProductTransactionsTable transactions={transactions} search={search} />
  );
}
