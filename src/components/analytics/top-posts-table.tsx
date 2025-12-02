"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TopPost } from "@/features/analytics/types";
import { Eye, Clock, TrendingUp, MessageSquare, Share2 } from "lucide-react";
import Link from "next/link";

interface TopPostsTableProps {
    posts: TopPost[];
}

export function TopPostsTable({ posts }: TopPostsTableProps) {
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}m ${secs}s`;
    };

    const getTrafficSourceColor = (source: string) => {
        switch (source) {
            case "organic":
                return "bg-green-500/10 text-green-400";
            case "social":
                return "bg-blue-500/10 text-blue-400";
            case "direct":
                return "bg-purple-500/10 text-purple-400";
            case "referral":
                return "bg-orange-500/10 text-orange-400";
            default:
                return "bg-gray-500/10 text-gray-400";
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Top Performing Posts</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {posts.map((post, index) => (
                        <Link
                            key={post.id}
                            href={`/dashboard/posts/${post.id}`}
                            className="block"
                        >
                            <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
                                {/* Rank */}
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-sm font-bold text-primary">
                                        #{index + 1}
                                    </span>
                                </div>

                                {/* Featured Image */}
                                {post.featured_image && (
                                    <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-muted overflow-hidden">
                                        <img
                                            src={post.featured_image}
                                            alt={post.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                {/* Post Info */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium group-hover:text-primary transition-colors truncate">
                                        {post.title}
                                    </h4>
                                    <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Eye className="w-3 h-3" />
                                            <span>{post.views.toLocaleString()} views</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            <span>{formatTime(post.avg_time_on_page)}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" />
                                            <span>{post.bounce_rate}% bounce</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MessageSquare className="w-3 h-3" />
                                            <span>{post.comments_count}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Share2 className="w-3 h-3" />
                                            <span>{post.shares_count}</span>
                                        </div>
                                    </div>

                                    {/* Traffic Sources */}
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {post.traffic_sources.slice(0, 3).map((source) => (
                                            <Badge
                                                key={source.source}
                                                variant="outline"
                                                className={getTrafficSourceColor(source.source)}
                                            >
                                                {source.source}: {source.percentage}%
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
