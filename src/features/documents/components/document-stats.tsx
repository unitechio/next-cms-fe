// Document Stats Component
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Download, FileText, TrendingUp, Clock, Users } from 'lucide-react';

interface DocumentStatsData {
    totalDocuments: number;
    totalViews: number;
    totalDownloads: number;
    recentActivity: number;
    popularDocuments: Array<{
        id: number;
        name: string;
        views: number;
        downloads: number;
    }>;
}

export function DocumentStats() {
    const [stats, setStats] = useState<DocumentStatsData>({
        totalDocuments: 0,
        totalViews: 0,
        totalDownloads: 0,
        recentActivity: 0,
        popularDocuments: [],
    });

    useEffect(() => {
        // Fetch stats from API
        // For now, using mock data
        setStats({
            totalDocuments: 156,
            totalViews: 2847,
            totalDownloads: 1234,
            recentActivity: 23,
            popularDocuments: [
                { id: 1, name: 'Project Proposal.pdf', views: 234, downloads: 89 },
                { id: 2, name: 'Q4 Report.xlsx', views: 198, downloads: 76 },
                { id: 3, name: 'Design Mockup.png', views: 167, downloads: 54 },
            ],
        });
    }, []);

    return (
        <div className="space-y-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalDocuments}</div>
                        <p className="text-xs text-muted-foreground">
                            +12% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            +18% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
                        <Download className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalDownloads.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            +7% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.recentActivity}</div>
                        <p className="text-xs text-muted-foreground">
                            In the last 24 hours
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Popular Documents */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Popular Documents
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {stats.popularDocuments.map((doc, index) => (
                            <div key={doc.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        #{index + 1}
                                    </span>
                                    <span className="text-sm font-medium truncate">{doc.name}</span>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Eye className="h-3 w-3" />
                                        {doc.views}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Download className="h-3 w-3" />
                                        {doc.downloads}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
