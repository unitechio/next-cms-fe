import { LayoutDashboard, Newspaper, Settings, Users, Bell, Shield, Lock, Activity, FileText, BarChart3 } from "lucide-react";

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
        label: "Permissions",
        path: "/dashboard/permissions",
        icon: Lock,
    },
    {
        label: "Activity Logs",
        path: "/dashboard/activity-logs",
        icon: Activity,
    },
    {
        label: "Audit Logs",
        path: "/dashboard/audit-logs",
        icon: FileText,
    },
    {
        label: "Analytics",
        path: "/dashboard/analytics",
        icon: BarChart3,
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
