import { LayoutDashboard, Newspaper, Settings, Users, Bell } from "lucide-react";

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
