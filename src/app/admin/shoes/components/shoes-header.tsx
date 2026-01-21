import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ShoesHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Shoes</h1>
        <p className="text-muted-foreground">
          Manage shoe products for your store
        </p>
      </div>
      <Button asChild className="w-full sm:w-auto">
        <Link href="/admin/shoes/create">
          <Plus className="mr-2 h-4 w-4" />
          Add Shoe
        </Link>
      </Button>
    </div>
  );
}
