"use client";

import { useEffect, useState, useCallback } from "react";
import { DataTable } from "@/components/ui/data-table";
import { auditLogService } from "@/features/audit-logs/services/audit-log.service";
import { AuditLog } from "@/features/audit-logs/types";
import { AuditLogDetail } from "@/features/audit-logs/components/audit-log-detail";
import { AuditLogFilters } from "@/features/audit-logs/components/audit-log-filters";
import { Activity, Eye, Download } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { parseApiResponse } from "@/lib/api-utils";
import { toast } from "sonner";

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);
    const [filters, setFilters] = useState({});

    const fetchLogs = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await auditLogService.getAuditLogs({
                page,
                limit: 20,
                search,
                ...filters,
            });
            const { data, totalPages: pages } = parseApiResponse<AuditLog>(response);
            setLogs(data);
            setTotalPages(pages);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to load audit logs");
            setLogs([]);
        } finally {
            setIsLoading(false);
        }
    }, [page, search, filters]);

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchLogs();
        }, 300);
        return () => clearTimeout(debounce);
    }, [fetchLogs]);

    const handleViewDetails = (log: AuditLog) => {
        setSelectedLog(log);
        setDetailOpen(true);
    };

    const handleExport = async () => {
        try {
            const blob = await auditLogService.exportAuditLogs({
                page: 1,
                limit: 1000,
                search,
                ...filters,
            });

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `audit-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast.success('Audit logs exported successfully');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to export audit logs');
        }
    };

    const getActionColor = (action: string) => {
        switch (action.toLowerCase()) {
            case 'create':
                return 'bg-green-500';
            case 'update':
                return 'bg-blue-500';
            case 'delete':
                return 'bg-red-500';
            case 'login':
                return 'bg-purple-500';
            case 'logout':
                return 'bg-gray-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getStatusColor = (status: number) => {
        if (status >= 200 && status < 300) return 'bg-green-500';
        if (status >= 300 && status < 400) return 'bg-blue-500';
        if (status >= 400 && status < 500) return 'bg-yellow-500';
        if (status >= 500) return 'bg-red-500';
        return 'bg-gray-500';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Audit Logs</h1>
                    <p className="text-muted-foreground">
                        Track system activities and security events
                    </p>
                </div>
                <div className="flex gap-2">
                    <AuditLogFilters onFilterChange={setFilters} />
                    <Button onClick={handleExport} variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Table */}
            <DataTable
                data={logs}
                isLoading={isLoading}
                search={{
                    value: search,
                    onChange: setSearch,
                    placeholder: "Search audit logs...",
                }}
                pagination={{
                    currentPage: page,
                    totalPages: totalPages,
                    onPageChange: setPage,
                }}
                columns={[
                    {
                        header: "Action",
                        cell: (log) => (
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full ${getActionColor(log.action)} bg-opacity-10 flex items-center justify-center`}>
                                    <Activity className="w-4 h-4" />
                                </div>
                                <div>
                                    <Badge className={`${getActionColor(log.action)} text-white`}>
                                        {log.action.toUpperCase()}
                                    </Badge>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        {log.resource}
                                        {log.resource_id && ` #${log.resource_id}`}
                                    </div>
                                </div>
                            </div>
                        ),
                    },
                    {
                        header: "User",
                        cell: (log) => (
                            <div className="text-sm">
                                {log.user ? (
                                    <>
                                        <div className="font-medium">
                                            {log.user.first_name} {log.user.last_name}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {log.user.email}
                                        </div>
                                    </>
                                ) : (
                                    <span className="text-muted-foreground">System</span>
                                )}
                            </div>
                        ),
                    },
                    {
                        header: "Request",
                        cell: (log) => (
                            <div className="text-sm">
                                <Badge variant="outline" className="mr-2">
                                    {log.method}
                                </Badge>
                                <span className="text-xs text-muted-foreground font-mono">
                                    {log.path}
                                </span>
                            </div>
                        ),
                    },
                    {
                        header: "Status",
                        cell: (log) => (
                            <Badge className={`${getStatusColor(log.status_code)} text-white`}>
                                {log.status_code}
                            </Badge>
                        ),
                    },
                    {
                        header: "Duration",
                        cell: (log) => (
                            <span className="text-sm text-muted-foreground">
                                {log.duration ? `${log.duration}ms` : '-'}
                            </span>
                        ),
                    },
                    {
                        header: "IP Address",
                        accessorKey: "ip_address",
                        cell: (log) => (
                            <span className="text-xs text-muted-foreground font-mono">
                                {log.ip_address || '-'}
                            </span>
                        ),
                    },
                    {
                        header: "Time",
                        accessorKey: "created_at",
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
                        header: "Actions",
                        cell: (log) => (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewDetails(log)}
                            >
                                <Eye className="h-4 w-4" />
                            </Button>
                        ),
                    },
                ]}
            />

            {/* Detail Modal */}
            <AuditLogDetail
                log={selectedLog}
                open={detailOpen}
                onOpenChange={setDetailOpen}
            />
        </div>
    );
}
