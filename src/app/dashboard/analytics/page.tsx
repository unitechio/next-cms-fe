'use client';

import { AnalyticsDashboard } from '@/features/analytics/components/analytics-dashboard';
import { PermissionGate } from '@/lib/authorization';

export default function AnalyticsPage() {
    return (
        <PermissionGate
            anyPermission={["analytics.view", "admin.*"]}
            fallback={
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
                        <p className="text-muted-foreground">
                            You don't have permission to view analytics
                        </p>
                    </div>
                </div>
            }
            showFallback
        >
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Analytics</h1>
                    <p className="text-muted-foreground">
                        System analytics and insights
                    </p>
                </div>

                <AnalyticsDashboard />
            </div>
        </PermissionGate>
    );
}
