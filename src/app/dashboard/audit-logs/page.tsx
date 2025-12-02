"use client";

import { useEffect, useState, useCallback } from "react";
import { DataTable } from "@/components/ui/data-table";
import { auditLogService } from "@/features/audit-logs/services/audit-log.service";
import { AuditLog } from "@/features/audit-logs/types";
import { Activity, Eye } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { parseApiResponse } from "@/lib/api-utils";
import { toast } from "sonner";
import { Pagination } from "@/components/ui/pagination";

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalPages, setTotalPages] = useState(1);

    const fetchLogs = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await auditLogService.getAuditLogs({
                page,
                limit: pageSize,
            });
            console.log("Audit logs response:", response);
            const { data, totalPages: pages } = parseApiResponse<AuditLog>(response);
            console.log("Parsed data:", data, "Total pages:", pages);
            setLogs(data);
            setTotalPages(pages);
        } catch (error) {
            console.error("Failed to fetch audit logs:", error);
            toast.error("Failed to load audit logs");
            setLogs([]);
        } finally {
            setIsLoading(false);
        }
    }, [page, pageSize]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const handlePageSizeChange = (newSize: number) => {
        setPageSize(newSize);
        setPage(1); // Reset to first page when changing page size
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Audit Logs</h1>
                    <p className="text-muted-foreground">Track system activities and security events.</p>
                </div>
            </div>

            <DataTable
                data={logs}
                isLoading={isLoading}
                columns={[
                    {
                        header: "Action",
                        cell: (log) => (
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Activity className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="font-medium">{log.action}</div>
                                    <div className="text-xs text-muted-foreground">{log.resource}</div>
                                </div>
                            </div>
                        ),
                    },
                    {
                        header: "User",
                        cell: (log) => (
                            <div className="text-sm text-muted-foreground">
                                {log.user ? `${log.user.first_name} ${log.user.last_name}` : "System"}
                            </div>
                        ),
                    },
                    {
                        header: "Details",
                        accessorKey: "details",
                        cell: (log) => (
                            <span
                                className="text-muted-foreground text-xs truncate max-w-[200px] block"
                                title={log.details}
                            >
                                {log.details}
                            </span>
                        ),
                    },
                    {
                        header: "IP Address",
                        accessorKey: "ip_address",
                        cell: (log) => (
                            <span className="text-muted-foreground text-xs font-mono">
                                {log.ip_address}
                            </span>
                        ),
                    },
                    {
                        header: "Time",
                        accessorKey: "created_at",
                        cell: (log) => (
                            <span className="text-muted-foreground text-xs">
                                {log.created_at
                                    ? format(new Date(log.created_at), "MMM d, yyyy HH:mm:ss")
                                    : "-"}
                            </span>
                        ),
                    },
                    {
                        header: "Actions",
                        cell: () => (
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Eye className="w-4 h-4" />
                            </Button>
                        ),
                    },
                ]}
            />

            {/* Custom Pagination Component */}
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                pageSize={pageSize}
                onPageSizeChange={handlePageSizeChange}
                showPageSize={true}
                showFirstLast={true}
                pageSizeOptions={[10, 20, 50, 100]}
            />
        </div>
    );
}
