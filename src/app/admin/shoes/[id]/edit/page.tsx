import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import {
  getShoeById,
  getBrandsForSelect,
  getCategoriesForSelect,
} from "../../actions";
import { ShoeForm } from "../../components/shoe-form";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Edit Shoe | Admin Dashboard",
  description: "Edit shoe product",
};

interface EditShoePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditShoePage({ params }: EditShoePageProps) {
  const { id } = await params;

  const [shoeResult, brandsResult, categoriesResult] = await Promise.all([
    getShoeById(id),
    getBrandsForSelect(),
    getCategoriesForSelect(),
  ]);

  if (!shoeResult.data) {
    notFound();
  }

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
            Edit Shoe
          </h1>
          <p className="text-muted-foreground">
            Update shoe product information
          </p>
        </div>
      </div>

      <ShoeForm
        shoe={shoeResult.data}
        brands={brands}
        categories={categories}
      />
    </div>
  );
}
