import { LayoutDashboard, Newspaper, Settings, Users, Bell, Shield, Lock, FolderTree, BarChart3, FileText, Box } from "lucide-react";

export const dashboard = [
    {
        label: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "Analytics",
        path: "/dashboard/analytics",
        icon: BarChart3,
    },
    {
        label: "Posts",
        path: "/dashboard/posts",
        icon: Newspaper,
    },
    {
        label: "Pages",
        path: "/dashboard/pages",
        icon: FileText,
    },
    {
        label: "Blocks",
        path: "/dashboard/blocks",
        icon: Box,
    },
    {
        label: "Categories",
        path: "/dashboard/categories",
        icon: FolderTree,
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
