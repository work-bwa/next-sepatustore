import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ShoppingCart,
  Award,
  FolderTree,
  Footprints,
  Ticket,
  TrendingUp,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Selamat datang di admin dashboard Shoes Store
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shoes</CardTitle>
            <Footprints className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +20.1% dari bulan lalu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Brands</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">+5 brand baru</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <FolderTree className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Semua kategori aktif
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Promos</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              3 akan berakhir minggu ini
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Transaksi Terbaru</CardTitle>
            <CardDescription>Daftar 5 transaksi terakhir</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  id: "TRX001",
                  customer: "John Doe",
                  amount: "Rp 1.250.000",
                  status: "Completed",
                },
                {
                  id: "TRX002",
                  customer: "Jane Smith",
                  amount: "Rp 890.000",
                  status: "Pending",
                },
                {
                  id: "TRX003",
                  customer: "Bob Wilson",
                  amount: "Rp 2.100.000",
                  status: "Completed",
                },
                {
                  id: "TRX004",
                  customer: "Alice Brown",
                  amount: "Rp 750.000",
                  status: "Processing",
                },
                {
                  id: "TRX005",
                  customer: "Charlie Davis",
                  amount: "Rp 1.800.000",
                  status: "Completed",
                },
              ].map((trx) => (
                <div key={trx.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{trx.customer}</p>
                      <p className="text-xs text-muted-foreground">{trx.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{trx.amount}</p>
                    <p className="text-xs text-muted-foreground">
                      {trx.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top Selling Shoes</CardTitle>
            <CardDescription>Produk terlaris bulan ini</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Nike Air Max 90", sales: 234, trend: "+12%" },
                { name: "Adidas Ultraboost", sales: 189, trend: "+8%" },
                { name: "New Balance 574", sales: 156, trend: "+15%" },
                { name: "Puma RS-X", sales: 142, trend: "+5%" },
                { name: "Converse Chuck 70", sales: 128, trend: "+10%" },
              ].map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
                      {index + 1}
                    </div>
                    <p className="text-sm font-medium">{product.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {product.sales} sold
                    </span>
                    <span className="flex items-center text-xs text-green-600">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      {product.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
