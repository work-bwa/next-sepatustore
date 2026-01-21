import { Suspense } from "react";
import { getPromoCodes } from "./actions";
import { PromoCodesHeader } from "./components/promo-codes-header";
import { PromoCodesTable } from "./components/promo-codes-table";
import { PromoCodesTableSkeleton } from "./components/promo-codes-table-skeleton";

export const metadata = {
  title: "Promo Codes | Admin Dashboard",
  description: "Manage promo codes",
};

export default async function PromoCodesPage() {
  return (
    <div className="space-y-6">
      <PromoCodesHeader />
      <Suspense fallback={<PromoCodesTableSkeleton />}>
        <PromoCodesContent />
      </Suspense>
    </div>
  );
}

async function PromoCodesContent() {
  const { data: promoCodes, error } = await getPromoCodes();

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  return <PromoCodesTable promoCodes={promoCodes || []} />;
}
