import { getShoesForSelect, getPromoCodesForSelect } from "../actions";
import { ProductTransactionForm } from "../components/product-transaction-form";

export const metadata = {
  title: "Add Transaction | Admin Dashboard",
  description: "Add a new transaction product",
};

export default async function CreateProductTransactionPage() {
  const [shoes, promoCodes] = await Promise.all([
    getShoesForSelect(),
    getPromoCodesForSelect(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Create Transaction
        </h1>
        <p className="text-sm text-muted-foreground">
          Add a new product transaction
        </p>
      </div>

      <ProductTransactionForm shoes={shoes} promoCodes={promoCodes} />
    </div>
  );
}
