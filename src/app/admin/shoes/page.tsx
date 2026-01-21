import { Suspense } from "react";
import { getShoes } from "./actions";
import { ShoesHeader } from "./components/shoes-header";
import { ShoesTable } from "./components/shoes-table";
import { ShoesTableSkeleton } from "./components/shoes-table-skeleton";

export const metadata = {
  title: "Shoes | Admin Dashboard",
  description: "Manage shoes products",
};

export default async function ShoesPage() {
  return (
    <div className="space-y-6">
      <ShoesHeader />
      <Suspense fallback={<ShoesTableSkeleton />}>
        <ShoesContent />
      </Suspense>
    </div>
  );
}

async function ShoesContent() {
  const { data: shoes, error } = await getShoes();

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  return <ShoesTable shoes={shoes || []} />;
}
