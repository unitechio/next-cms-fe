"use client";

import { NotificationBell } from "@/features/notifications/components/notification-bell";
import { ThemeToggle } from "@/components/theme-toggle";
import { Breadcrumbs } from "./breadcrumbs";

export function DashboardHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <Breadcrumbs />
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <NotificationBell />
      </div>
    </header>
  );
}
