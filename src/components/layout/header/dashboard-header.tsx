"use client";

import { NotificationBell } from "@/features/notifications/components/notification-bell";
import { ThemeToggle } from "@/components/theme-toggle";
import { usePathname } from "next/navigation";

export function DashboardHeader() {
    const pathname = usePathname();

    // Simple breadcrumb or title based on pathname
    const getTitle = () => {
        const segments = pathname.split("/").filter(Boolean);
        if (segments.length <= 1) return "Dashboard";

        const lastSegment = segments[segments.length - 1];
        return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace(/-/g, " ");
    };

    return (
        <header className="flex items-center justify-between px-6 py-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
            <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold">{getTitle()}</h2>
            </div>
            <div className="flex items-center gap-4">
                <ThemeToggle />
                <NotificationBell />
            </div>
        </header>
    );
}
