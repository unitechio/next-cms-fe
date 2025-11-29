"use client";

import { useEffect, useState, useCallback } from "react";
import { DataTable } from "@/components/ui/data-table";
import { roleService } from "@/features/roles/services/role.service";
import { Permission } from "@/features/roles/types";
import { Shield } from "lucide-react";
import { toast } from "sonner";

export default function PermissionsPage() {
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [totalPages, setTotalPages] = useState(1);

    const fetchPermissions = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await roleService.getPermissions();
            const data = (response as any).data || response;
            const permissionsArray = Array.isArray(data) ? data : [];

            // Client-side filtering and pagination
            let filtered = permissionsArray;
            if (search) {
                const searchLower = search.toLowerCase();
                filtered = permissionsArray.filter((perm: Permission) =>
                    perm.name.toLowerCase().includes(searchLower) ||
                    perm.resource?.toLowerCase().includes(searchLower) ||
                    perm.action?.toLowerCase().includes(searchLower)
                );
            }

            const limit = 20;
            const total = Math.ceil(filtered.length / limit);
            setTotalPages(total);

            const start = (page - 1) * limit;
            const end = start + limit;
            setPermissions(filtered.slice(start, end));
        } catch (error) {
            console.error("Failed to fetch permissions:", error);
            toast.error("Failed to fetch permissions");
        } finally {
            setIsLoading(false);
        }
    }, [page, search]);

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchPermissions();
        }, 300);
        return () => clearTimeout(debounce);
    }, [fetchPermissions]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Permissions</h1>
                    <p className="text-muted-foreground">View available system permissions.</p>
                </div>
            </div>

            <DataTable
                data={permissions}
                isLoading={isLoading}
                search={{
                    value: search,
                    onChange: setSearch,
                    placeholder: "Search permissions...",
                }}
                pagination={{
                    currentPage: page,
                    totalPages: totalPages,
                    onPageChange: setPage,
                }}
                columns={[
                    {
                        header: "Permission Name",
                        cell: (perm) => (
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <Shield className="w-4 h-4" />
                                </div>
                                <div className="font-medium">{perm.name}</div>
                            </div>
                        ),
                    },
                    {
                        header: "Resource",
                        accessorKey: "resource",
                        cell: (perm) => (
                            <span className="capitalize">{perm.resource}</span>
                        ),
                    },
                    {
                        header: "Action",
                        accessorKey: "action",
                        cell: (perm) => (
                            <span className="capitalize">{perm.action}</span>
                        ),
                    },
                    {
                        header: "Description",
                        accessorKey: "description",
                    },
                ]}
            />
        </div>
    );
}
