"use client";

import { usePathname } from "next/navigation";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Custom labels untuk segment tertentu
const segmentLabels: Record<string, string> = {
  admin: "Dashboard",
  brands: "Brands",
  categories: "Categories",
  transactions: "Product Transactions",
  "promo-codes": "Promo Codes",
  shoes: "Shoes",
  settings: "Settings",
  create: "Create",
  edit: "Edit",
};

// Segment yang di-skip (tidak ditampilkan di breadcrumb)
const skipSegments = ["admin"];

export function DynamicBreadcrumb() {
  const pathname = usePathname();

  // Split path menjadi segments
  const segments = pathname.split("/").filter(Boolean);

  // Build breadcrumb items
  const breadcrumbItems = segments
    .map((segment, index) => {
      // Skip segment tertentu (tapi tetap include dalam href)
      const shouldSkip = skipSegments.includes(segment) && index === 0;

      // Build href untuk segment ini
      const href = "/" + segments.slice(0, index + 1).join("/");

      // Get label (gunakan custom label atau capitalize segment)
      const label = segmentLabels[segment] || formatSegment(segment);

      // Check apakah ini segment terakhir
      const isLast = index === segments.length - 1;

      return {
        segment,
        href,
        label,
        isLast,
        shouldSkip,
      };
    })
    .filter((item) => !item.shouldSkip);

  // Jika tidak ada items atau hanya di /admin, tampilkan default
  if (breadcrumbItems.length === 0) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Dashboard link (selalu ada) */}
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>

        {breadcrumbItems.map((item, index) => (
          <Fragment key={item.href}>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem className={index === 0 ? "" : "hidden md:block"}>
              {item.isLast ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

// Helper: Format segment menjadi readable label
// "promo-codes" -> "Promo Codes"
// "123e4567-e89b" -> "123e4567..." (UUID)
function formatSegment(segment: string): string {
  // Check if it's a UUID
  if (isUUID(segment)) {
    return segment.slice(0, 8) + "...";
  }

  // Replace dashes with spaces and capitalize each word
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Helper: Check if string is UUID
function isUUID(str: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}
