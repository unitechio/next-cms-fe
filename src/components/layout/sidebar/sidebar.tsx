"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    FileText,
    Settings,
    Shield,
    Activity,
    LogOut,
    Menu,
    Database,
    Lock,
    Bell,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { User } from "@/features/auth/types";

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Users",
        href: "/dashboard/users",
        icon: Users,
    },
    {
        title: "Content",
        href: "/dashboard/posts",
        icon: FileText,
    },
    {
        title: "Media",
        href: "/dashboard/media",
        icon: Database,
    },
    {
        title: "Roles & Permissions",
        href: "/dashboard/roles",
        icon: Shield,
    },
    {
        title: "Authorization",
        href: "/dashboard/authorization/modules",
        icon: Lock,
    },
    {
        title: "Audit Logs",
        href: "/dashboard/audit-logs",
        icon: Activity,
    },
    {
        title: "Notifications",
        href: "/dashboard/notifications",
        icon: Bell,
    },
    {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
    },
];

function SidebarContent({
    pathname,
    user,
    logout,
    setOpen,
}: {
    pathname: string;
    user: User | null;
    logout: () => void;
    setOpen: (open: boolean) => void;
}) {
    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                    <span className="font-bold text-primary-foreground">G</span>
                </div>
                <span className="font-bold text-xl tracking-tight">GoCMS</span>
            </div>

            <Separator />

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group",
                                isActive
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                    : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "w-5 h-5 transition-colors",
                                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                )}
                            />
                            {item.title}
                        </Link>
                    );
                })}
            </nav>

            <Separator />

            {/* User Profile & Logout */}
            <div className="p-4">
                <Link href="/dashboard/profile">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-sidebar-accent/50 mb-2 hover:bg-sidebar-accent transition-colors cursor-pointer">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://avatar.vercel.sh/${user?.email}`} />
                            <AvatarFallback>
                                {user?.first_name?.[0]}
                                {user?.last_name?.[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                                {user?.first_name} {user?.last_name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                        </div>
                    </div>
                </Link>
                <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={logout}
                >
                    <LogOut className="w-5 h-5 mr-2" />
                    Sign Out
                </Button>
            </div>
        </div>
    );
}

export function Sidebar() {
    const pathname = usePathname();
    const { logout, user } = useAuth();
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Mobile Sidebar */}
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="lg:hidden fixed top-4 left-4 z-50">
                        <Menu className="w-6 h-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72 bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
                    <SidebarContent pathname={pathname} user={user} logout={logout} setOpen={setOpen} />
                </SheetContent>
            </Sheet>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:block fixed top-0 left-0 z-50 h-screen w-72 bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
                <SidebarContent pathname={pathname} user={user} logout={logout} setOpen={setOpen} />
            </aside>
        </>
    );
}
