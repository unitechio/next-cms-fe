'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboard } from "@/config/nav";
import { cn } from "@/lib/utils";

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden md:block md:w-64 bg-background border-r">
            <div className="py-4 px-6">
                <h2 className="text-lg font-semibold tracking-tight">Dashboard</h2>
            </div>
            <nav className="px-3">
                <ul className="space-y-1">
                    {dashboard.map((item) => (
                        <li key={item.path}>
                            <Link
                                href={item.path}
                                className={cn(
                                    "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                                    pathname === item.path
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-muted"
                                )}
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}
