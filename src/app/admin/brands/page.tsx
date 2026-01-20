import { Suspense } from "react";
import { getBrands } from "./actions";
import { BrandsHeader } from "./components/brands-header";
import { BrandsTable } from "./components/brands-table";
import { BrandsTableSkeleton } from "./components/brands-table-skeleton";

export const metadata = {
  title: "Brands | Admin Dashboard",
  description: "Manage shoe brands",
};

export default async function BrandsPage() {
  return (
    <div className="space-y-6">
      <BrandsHeader />
      <Suspense fallback={<BrandsTableSkeleton />}>
        <BrandsContent />
      </Suspense>
    </div>
  );
}

async function BrandsContent() {
  const { data: brands, error } = await getBrands();

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  return <BrandsTable brands={brands || []} />;
}
