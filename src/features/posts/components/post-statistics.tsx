'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Heart, MessageSquare, TrendingUp, Calendar } from 'lucide-react';
import { postService } from '../services/post.service';
import { Skeleton } from '@/components/ui/skeleton';

interface PostStats {
    total_posts: number;
    published_posts: number;
    draft_posts: number;
    total_views: number;
    total_likes: number;
    total_comments: number;
    avg_views_per_post: number;
    recent_activity: {
        date: string;
        posts_created: number;
        views: number;
    }[];
}

export function PostStatistics() {
    const [stats, setStats] = useState<PostStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // This would be a real API call
                // const data = await postService.getStatistics();

                // Mock data for now
                const mockStats: PostStats = {
                    total_posts: 45,
                    published_posts: 32,
                    draft_posts: 13,
                    total_views: 12543,
                    total_likes: 892,
                    total_comments: 234,
                    avg_views_per_post: 392,
                    recent_activity: [],
                };

                setStats(mockStats);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-4 rounded-full" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-16 mb-2" />
                            <Skeleton className="h-3 w-32" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (!stats) return null;

    const statCards = [
        {
            title: 'Total Posts',
            value: stats.total_posts,
            description: `${stats.published_posts} published, ${stats.draft_posts} drafts`,
            icon: Calendar,
            trend: '+12%',
        },
        {
            title: 'Total Views',
            value: stats.total_views.toLocaleString(),
            description: `${stats.avg_views_per_post} avg per post`,
            icon: Eye,
            trend: '+18%',
        },
        {
            title: 'Total Likes',
            value: stats.total_likes.toLocaleString(),
            description: 'Across all posts',
            icon: Heart,
            trend: '+24%',
        },
        {
            title: 'Total Comments',
            value: stats.total_comments.toLocaleString(),
            description: 'User engagement',
            icon: MessageSquare,
            trend: '+8%',
        },
    ];

    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <div className="flex items-center justify-between mt-1">
                                <p className="text-xs text-muted-foreground">
                                    {stat.description}
                                </p>
                                <div className="flex items-center text-xs text-green-600">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    {stat.trend}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Performance Overview</CardTitle>
                    <CardDescription>
                        Your content performance at a glance
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium">Publishing Rate</p>
                                <p className="text-xs text-muted-foreground">
                                    {((stats.published_posts / stats.total_posts) * 100).toFixed(1)}% of posts published
                                </p>
                            </div>
                            <div className="text-2xl font-bold">
                                {stats.published_posts}/{stats.total_posts}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium">Engagement Rate</p>
                                <p className="text-xs text-muted-foreground">
                                    Comments + Likes per view
                                </p>
                            </div>
                            <div className="text-2xl font-bold">
                                {((stats.total_comments + stats.total_likes) / stats.total_views * 100).toFixed(1)}%
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
