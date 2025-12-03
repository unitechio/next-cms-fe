"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { Fragment } from "react";

export function Breadcrumbs() {
    const pathname = usePathname();

    // Split pathname and remove empty strings
    const segments = pathname.split("/").filter(Boolean);

    // If we are just at /dashboard, we don't need to show breadcrumbs or just show Home
    if (segments.length === 0) return null;

    // We want to map the segments to breadcrumbs.
    // Assuming the structure is always /dashboard/..., we can treat 'dashboard' as Home.

    const breadcrumbItems = segments.map((segment, index) => {
        // Build the url for this segment
        const href = `/${segments.slice(0, index + 1).join("/")}`;

        // Format the label: replace hyphens with spaces and capitalize
        // Special handling for "dashboard" to be "Home" or just hidden if we use the icon
        const label = segment === "dashboard"
            ? "Dashboard"
            : segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

        const isLast = index === segments.length - 1;

        return {
            href,
            label,
            isLast,
            isDashboard: segment === "dashboard"
        };
    });

    return (
        <nav aria-label="Breadcrumb" className="flex items-center text-sm text-muted-foreground">
            {breadcrumbItems.map((item, index) => (
                <Fragment key={item.href}>
                    {index > 0 && (
                        <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground/50" />
                    )}

                    {item.isLast ? (
                        <span className="font-medium text-foreground">
                            {item.label}
                        </span>
                    ) : (
                        <Link
                            href={item.href}
                            className="hover:text-foreground transition-colors flex items-center gap-1"
                        >
                            {item.isDashboard ? <Home className="h-4 w-4" /> : item.label}
                        </Link>
                    )}
                </Fragment>
            ))}
        </nav>
    );
}
