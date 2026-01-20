import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboardPage() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Total Brands</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold">12</CardContent>
      </Card>
    </div>
  );
}
