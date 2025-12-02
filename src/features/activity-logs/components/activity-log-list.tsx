'use client';

import { useState, useEffect } from 'react';
import { activityLogService } from '../services/activity-log.service';
import { ActivityLog, ActivityLogFilter, getActivityCategory, getActivityIcon, getActivityColor } from '../types';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Download, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { parseApiResponse } from '@/lib/api-utils';

interface ActivityLogListProps {
    userId?: string; // Optional: filter by user
    onViewDetails?: (log: ActivityLog) => void;
}

export function ActivityLogList({ userId, onViewDetails }: ActivityLogListProps) {
    const [activities, setActivities] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [totalPages, setTotalPages] = useState(1);

    const fetchActivities = async () => {
        setLoading(true);
        try {
            const filters: ActivityLogFilter = {
                page,
                limit: 10,
                search,
                user_id: userId,
            };

            const response = await activityLogService.getActivityLogs(filters);
            const { data, totalPages: pages } = parseApiResponse<ActivityLog>(response);
            setActivities(data);
            setTotalPages(pages);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to load activity logs');
            setActivities([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchActivities();
        }, 300);
        return () => clearTimeout(debounce);
    }, [page, search, userId]);

    const handleExport = async () => {
        try {
            const blob = await activityLogService.exportActivityLogs({
                page: 1,
                limit: 1000,
                search,
                user_id: userId,
            });

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `activity-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast.success('Activity logs exported successfully');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to export activity logs');
        }
    };

    return (
        <div className="space-y-4">
            {!userId && (
                <div className="flex justify-end">
                    <Button onClick={handleExport} variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                </div>
            )}

            <DataTable
                data={activities}
                isLoading={loading}
                search={{
                    value: search,
                    onChange: setSearch,
                    placeholder: 'Search activities...',
                }}
                pagination={{
                    currentPage: page,
                    totalPages: totalPages,
                    onPageChange: setPage,
                }}
                columns={[
                    {
                        header: 'User',
                        cell: (log) => (
                            <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={log.user?.avatar_url || `https://avatar.vercel.sh/${log.user?.email}`} />
                                    <AvatarFallback>
                                        {log.user?.first_name?.[0]}
                                        {log.user?.last_name?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-medium text-sm">
                                        {log.user?.first_name} {log.user?.last_name}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {log.user?.email}
                                    </div>
                                </div>
                            </div>
                        ),
                    },
                    {
                        header: 'Activity',
                        cell: (log) => (
                            <div className="flex items-center gap-2">
                                <span className="text-lg">{getActivityIcon(log.activity)}</span>
                                <div>
                                    <div className={`font-medium text-sm ${getActivityColor(log.activity)}`}>
                                        {log.activity}
                                    </div>
                                    <div className="text-xs text-muted-foreground line-clamp-1">
                                        {log.description}
                                    </div>
                                </div>
                            </div>
                        ),
                    },
                    {
                        header: 'Category',
                        cell: (log) => (
                            <Badge variant="outline">
                                {getActivityCategory(log.activity)}
                            </Badge>
                        ),
                    },
                    {
                        header: 'IP Address',
                        accessorKey: 'ip_address',
                        cell: (log) => (
                            <span className="text-sm text-muted-foreground font-mono">
                                {log.ip_address || '-'}
                            </span>
                        ),
                    },
                    {
                        header: 'Time',
                        accessorKey: 'created_at',
                        cell: (log) => (
                            <div className="text-sm">
                                <div>{format(new Date(log.created_at), 'MMM d, yyyy')}</div>
                                <div className="text-xs text-muted-foreground">
                                    {format(new Date(log.created_at), 'HH:mm:ss')}
                                </div>
                            </div>
                        ),
                    },
                    {
                        header: 'Actions',
                        cell: (log) => (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onViewDetails?.(log)}
                            >
                                <Eye className="h-4 w-4" />
                            </Button>
                        ),
                    },
                ]}
            />
        </div>
    );
}
