import { LayoutDashboard, Newspaper, Settings, Users, Bell, Shield, Lock } from "lucide-react";

export const dashboard = [
    {
        label: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "Posts",
        path: "/dashboard/posts",
        icon: Newspaper,
    },
    {
        label: "Users",
        path: "/dashboard/users",
        icon: Users,
    },
    {
        label: "Roles",
        path: "/dashboard/roles",
        icon: Shield,
    },
    {
        label: "Authorization",
        path: "/dashboard/authorization/modules",
        icon: Lock,
    },
    {
        label: "Notifications",
        path: "/dashboard/notifications",
        icon: Bell,
    },
    {
        label: "Settings",
        path: "/dashboard/settings",
        icon: Settings,
    },
];
