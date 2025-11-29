"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const tabs = [
    { name: "Modules", href: "/dashboard/authorization/modules" },
    { name: "Departments", href: "/dashboard/authorization/departments" },
    { name: "Services", href: "/dashboard/authorization/services" },
    { name: "Scopes", href: "/dashboard/authorization/scopes" },
];

export default function AuthorizationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Authorization</h1>
                <p className="text-muted-foreground">
                    Manage system modules, departments, services, and permission scopes.
                </p>
            </div>

            <div className="flex items-center gap-2 border-b pb-2">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.href;
                    return (
                        <Link key={tab.href} href={tab.href}>
                            <Button
                                variant={isActive ? "secondary" : "ghost"}
                                className={cn(
                                    "h-9",
                                    isActive && "bg-muted font-medium text-primary"
                                )}
                            >
                                {tab.name}
                            </Button>
                        </Link>
                    );
                })}
            </div>

            <div className="min-h-[400px]">{children}</div>
        </div>
    );
}
