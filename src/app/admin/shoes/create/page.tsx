import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getBrandsForSelect, getCategoriesForSelect } from "../actions";
import { ShoeForm } from "../components/shoe-form";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Add Shoe | Admin Dashboard",
  description: "Add a new shoe product",
};

export default async function CreateShoePage() {
  const [brandsResult, categoriesResult] = await Promise.all([
    getBrandsForSelect(),
    getCategoriesForSelect(),
  ]);

  const brands = brandsResult.data || [];
  const categories = categoriesResult.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/shoes">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Add Shoe
          </h1>
          <p className="text-muted-foreground">
            Create a new shoe product for your store
          </p>
        </div>
      </div>

      <ShoeForm brands={brands} categories={categories} />
    </div>
  );
}
