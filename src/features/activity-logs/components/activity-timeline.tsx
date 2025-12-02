'use client';

import { useState, useEffect } from 'react';
import { activityLogService } from '../services/activity-log.service';
import { ActivityLog, getActivityIcon, getActivityColor } from '../types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

interface ActivityTimelineProps {
    userId?: string;
    limit?: number;
    showLoadMore?: boolean;
}

export function ActivityTimeline({
    userId,
    limit = 10,
    showLoadMore = true
}: ActivityTimelineProps) {
    const [activities, setActivities] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [page, setPage] = useState(1);

    const fetchActivities = async (pageNum: number, append: boolean = false) => {
        if (append) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }

        try {
            const response = userId
                ? await activityLogService.getUserActivities(userId, limit * pageNum)
                : await activityLogService.getActivityLogs({
                    page: pageNum,
                    limit,
                });

            const newActivities = response.data || [];

            if (append) {
                setActivities(prev => [...prev, ...newActivities]);
            } else {
                setActivities(newActivities);
            }

            setHasMore(newActivities.length === limit);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to load activities');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchActivities(1);
    }, [userId, limit]);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchActivities(nextPage, true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (activities.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-sm text-muted-foreground">No activities found</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-[21px] top-0 bottom-0 w-0.5 bg-border" />

                {/* Activities */}
                <div className="space-y-6">
                    {activities.map((log, index) => (
                        <div key={log.id} className="relative flex gap-4">
                            {/* Timeline dot */}
                            <div className="relative z-10 flex-shrink-0">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-card shadow-sm">
                                    <span className="text-lg">{getActivityIcon(log.activity)}</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 pb-6">
                                <div className="rounded-lg border bg-card p-4 shadow-sm">
                                    {/* Header */}
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                        <div className="flex items-center gap-2 flex-1">
                                            {log.user && (
                                                <Avatar className="h-6 w-6">
                                                    <AvatarImage src={log.user.avatar_url || `https://avatar.vercel.sh/${log.user.email}`} />
                                                    <AvatarFallback className="text-xs">
                                                        {log.user.first_name?.[0]}
                                                        {log.user.last_name?.[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                            )}
                                            <span className="font-medium text-sm">
                                                {log.user ? `${log.user.first_name} ${log.user.last_name}` : 'System'}
                                            </span>
                                        </div>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                                            {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                                        </span>
                                    </div>

                                    {/* Activity */}
                                    <div className="space-y-2">
                                        <div className={`font-medium text-sm ${getActivityColor(log.activity)}`}>
                                            {log.activity}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {log.description}
                                        </p>
                                    </div>

                                    {/* Metadata */}
                                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                                        <div className="mt-3 pt-3 border-t">
                                            <div className="flex flex-wrap gap-2">
                                                {Object.entries(log.metadata).slice(0, 3).map(([key, value]) => (
                                                    <Badge key={key} variant="secondary" className="text-xs">
                                                        {key}: {String(value)}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Footer */}
                                    <div className="mt-3 pt-3 border-t flex items-center gap-4 text-xs text-muted-foreground">
                                        {log.ip_address && (
                                            <span className="font-mono">{log.ip_address}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Load More */}
            {showLoadMore && hasMore && (
                <div className="flex justify-center pt-4">
                    <Button
                        variant="outline"
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                    >
                        {loadingMore ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Loading...
                            </>
                        ) : (
                            'Load More'
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}
