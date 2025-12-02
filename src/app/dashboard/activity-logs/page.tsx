'use client';

import { useState } from 'react';
import { ActivityLog } from '@/features/activity-logs/types';
import { ActivityLogList } from '@/features/activity-logs/components/activity-log-list';
import { ActivityLogDetail } from '@/features/activity-logs/components/activity-log-detail';
import { ActivityTimeline } from '@/features/activity-logs/components/activity-timeline';
import { ActivityFilters } from '@/features/activity-logs/components/activity-filters';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, List } from 'lucide-react';

export default function ActivityLogsPage() {
    const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);
    const [filters, setFilters] = useState({});

    const handleViewDetails = (log: ActivityLog) => {
        setSelectedLog(log);
        setDetailOpen(true);
    };

    const handleFilterChange = (newFilters: any) => {
        setFilters(newFilters);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Activity Logs</h1>
                    <p className="text-muted-foreground">
                        Track and monitor all user activities in the system
                    </p>
                </div>
                <ActivityFilters onFilterChange={handleFilterChange} />
            </div>

            {/* Tabs */}
            <Tabs defaultValue="list" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="list" className="gap-2">
                        <List className="h-4 w-4" />
                        List View
                    </TabsTrigger>
                    <TabsTrigger value="timeline" className="gap-2">
                        <Activity className="h-4 w-4" />
                        Timeline View
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="list" className="space-y-4">
                    <ActivityLogList onViewDetails={handleViewDetails} />
                </TabsContent>

                <TabsContent value="timeline" className="space-y-4">
                    <ActivityTimeline limit={20} showLoadMore={true} />
                </TabsContent>
            </Tabs>

            {/* Detail Modal */}
            <ActivityLogDetail
                log={selectedLog}
                open={detailOpen}
                onOpenChange={setDetailOpen}
            />
        </div>
    );
}
