// src/lib/constants/admin-menu.ts
import { LayoutDashboard, Store, Tags, Package } from "lucide-react";

export const adminMenu = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Catalog",
    items: [
      {
        title: "Brands",
        href: "/admin/brands",
        icon: Tags,
      },
      {
        title: "Categories",
        href: "/admin/categories",
        icon: Package,
      },
      {
        title: "Shoes",
        href: "/admin/shoes",
        icon: Store,
      },
    ],
  },
];
