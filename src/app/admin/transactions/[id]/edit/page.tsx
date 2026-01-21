import { notFound } from "next/navigation";
import {
  getProductTransactionById,
  getShoesForSelect,
  getPromoCodesForSelect,
} from "../../actions";
import { ProductTransactionForm } from "../../components/product-transaction-form";

interface EditProductTransactionPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Edit Transaction | Admin Dashboard",
  description: "Edit transaction product",
};

export default async function EditProductTransactionPage({
  params,
}: EditProductTransactionPageProps) {
  const { id } = await params;

  const [transaction, shoes, promoCodes] = await Promise.all([
    getProductTransactionById(id),
    getShoesForSelect(),
    getPromoCodesForSelect(),
  ]);

  if (!transaction) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Transaction</h1>
        <p className="text-sm text-muted-foreground">
          Update transaction details for{" "}
          <span className="font-mono">{transaction.bookingTrxId}</span>
        </p>
      </div>

      <ProductTransactionForm
        shoes={shoes}
        promoCodes={promoCodes}
        transaction={transaction}
      />
    </div>
  );
}
