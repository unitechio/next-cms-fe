'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
    Users,
    Activity,
    Shield,
    TrendingUp,
    TrendingDown,
    Clock,
    CheckCircle,
    XCircle
} from 'lucide-react';

interface AnalyticsStat {
    label: string;
    value: number;
    change: number;
    trend: 'up' | 'down';
    icon: any;
}

interface ActivityStat {
    category: string;
    count: number;
    percentage: number;
}

export function AnalyticsDashboard() {
    const [stats, setStats] = useState<AnalyticsStat[]>([
        {
            label: 'Total Users',
            value: 1234,
            change: 12.5,
            trend: 'up',
            icon: Users,
        },
        {
            label: 'Active Sessions',
            value: 89,
            change: -5.2,
            trend: 'down',
            icon: Activity,
        },
        {
            label: 'Total Roles',
            value: 12,
            change: 0,
            trend: 'up',
            icon: Shield,
        },
        {
            label: 'Permissions',
            value: 156,
            change: 8.3,
            trend: 'up',
            icon: CheckCircle,
        },
    ]);

    const [activityStats, setActivityStats] = useState<ActivityStat[]>([
        { category: 'User Management', count: 245, percentage: 35 },
        { category: 'Content Creation', count: 189, percentage: 27 },
        { category: 'Role Changes', count: 123, percentage: 18 },
        { category: 'System Settings', count: 87, percentage: 12 },
        { category: 'Others', count: 56, percentage: 8 },
    ]);

    const [recentActivities] = useState([
        {
            id: 1,
            user: 'John Doe',
            action: 'Created new user',
            time: '2 minutes ago',
            status: 'success',
        },
        {
            id: 2,
            user: 'Jane Smith',
            action: 'Updated role permissions',
            time: '15 minutes ago',
            status: 'success',
        },
        {
            id: 3,
            user: 'Bob Johnson',
            action: 'Failed login attempt',
            time: '1 hour ago',
            status: 'error',
        },
        {
            id: 4,
            user: 'Alice Brown',
            action: 'Exported user data',
            time: '2 hours ago',
            status: 'success',
        },
    ]);

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.label}
                                </CardTitle>
                                <Icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    {stat.trend === 'up' ? (
                                        <TrendingUp className="h-3 w-3 text-green-600" />
                                    ) : (
                                        <TrendingDown className="h-3 w-3 text-red-600" />
                                    )}
                                    <span className={stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                                        {Math.abs(stat.change)}%
                                    </span>
                                    <span>from last month</span>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                    <TabsTrigger value="users">Users</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Activity Distribution */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Activity Distribution</CardTitle>
                                <CardDescription>
                                    Breakdown of activities by category
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {activityStats.map((stat, index) => (
                                        <div key={index} className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="font-medium">{stat.category}</span>
                                                <span className="text-muted-foreground">
                                                    {stat.count} ({stat.percentage}%)
                                                </span>
                                            </div>
                                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                                                <div
                                                    className="h-full bg-primary transition-all"
                                                    style={{ width: `${stat.percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Activities */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Activities</CardTitle>
                                <CardDescription>
                                    Latest system activities
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentActivities.map((activity) => (
                                        <div key={activity.id} className="flex items-start gap-3">
                                            <div className={`mt-1 ${activity.status === 'success'
                                                    ? 'text-green-600'
                                                    : 'text-red-600'
                                                }`}>
                                                {activity.status === 'success' ? (
                                                    <CheckCircle className="h-4 w-4" />
                                                ) : (
                                                    <XCircle className="h-4 w-4" />
                                                )}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="text-sm font-medium">{activity.action}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    by {activity.user}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                {activity.time}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="activity" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Activity Timeline</CardTitle>
                            <CardDescription>
                                System activity over the last 7 days
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                                Chart placeholder - Integrate with charting library
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="users" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <CardTitle>User Growth</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">+234</div>
                                <p className="text-xs text-muted-foreground">
                                    New users this month
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Active Users</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">892</div>
                                <p className="text-xs text-muted-foreground">
                                    Active in last 30 days
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>User Roles</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Admin</span>
                                        <Badge variant="secondary">12</Badge>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Editor</span>
                                        <Badge variant="secondary">45</Badge>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Viewer</span>
                                        <Badge variant="secondary">1177</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
