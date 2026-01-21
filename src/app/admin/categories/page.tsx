import { Suspense } from "react";
import { getCategories } from "./actions";
import { CategoriesHeader } from "./components/categories-header";
import { CategoriesTable } from "./components/categories-table";
import { CategoriesTableSkeleton } from "./components/categories-table-skeleton";

export const metadata = {
  title: "Categories | Admin Dashboard",
  description: "Manage shoe categories",
};

export default async function CategoriesPage() {
  return (
    <div className="space-y-6">
      <CategoriesHeader />
      <Suspense fallback={<CategoriesTableSkeleton />}>
        <CategoriesContent />
      </Suspense>
    </div>
  );
}

async function CategoriesContent() {
  const { data: categories, error } = await getCategories();

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  return <CategoriesTable categories={categories || []} />;
}
