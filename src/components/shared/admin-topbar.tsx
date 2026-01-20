// src/components/shared/admin-topbar.tsx
"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export const AdminTopbar = () => {
  return (
    <header className="flex h-14 items-center gap-4 border-b px-6">
      <SidebarTrigger />
      <div className="ml-auto">
        <Button size="sm" variant="outline">
          Logout
        </Button>
      </div>
    </header>
  );
};
