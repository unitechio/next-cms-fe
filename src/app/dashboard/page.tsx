"use client";

import { useAuth } from "@/context/auth-context";
import { motion } from "framer-motion";
import {
    Users,
    FileText,
    Eye,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OverviewChart } from "@/components/dashboard/overview-chart";

export default function DashboardPage() {
    const { user } = useAuth();

    const stats = [
        {
            title: "Total Users",
            value: "12,345",
            change: "+12%",
            trend: "up",
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            title: "Total Posts",
            value: "432",
            change: "+5%",
            trend: "up",
            icon: FileText,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
        },
        {
            title: "Total Views",
            value: "1.2M",
            change: "+24%",
            trend: "up",
            icon: Eye,
            color: "text-green-500",
            bg: "bg-green-500/10",
        },
        {
            title: "Bounce Rate",
            value: "42%",
            change: "-2%",
            trend: "down",
            icon: TrendingUp,
            color: "text-orange-500",
            bg: "bg-orange-500/10",
        },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome back, <span className="font-medium text-foreground">{user?.first_name}</span>. Here&apos;s
                        what&apos;s happening today.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline">Download Report</Button>
                    <Button>Create New Post</Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="hover:border-primary/50 transition-colors group">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <div
                                        className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${stat.trend === "up"
                                            ? "bg-green-500/10 text-green-400"
                                            : "bg-red-500/10 text-red-400"
                                            }`}
                                    >
                                        {stat.change}
                                        {stat.trend === "up" ? (
                                            <ArrowUpRight className="w-3 h-3" />
                                        ) : (
                                            <ArrowDownRight className="w-3 h-3" />
                                        )}
                                    </div>
                                </div>
                                <h3 className="text-muted-foreground text-sm font-medium mb-1">
                                    {stat.title}
                                </h3>
                                <p className="text-2xl font-bold group-hover:text-primary transition-colors">
                                    {stat.value}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Overview Chart */}
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <OverviewChart />
                </CardContent>
            </Card>

            {/* Recent Activity Section (Placeholder) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                                >
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                        <Activity className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">New user registered</p>
                                        <p className="text-xs text-muted-foreground">
                                            2 minutes ago
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Popular Posts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                                >
                                    <div className="w-12 h-12 rounded-lg bg-muted flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium">
                                            Getting Started with Go CMS
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            1.2k views • 45 comments
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function Activity(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    );
}
