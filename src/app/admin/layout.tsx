// src/app/(admin)/layout.tsx
import { AdminShell } from "@/components/shared/admin-shell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
