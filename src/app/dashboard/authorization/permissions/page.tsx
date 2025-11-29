"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { roleService } from "@/features/roles/services/role.service";
import { Permission } from "@/features/roles/types";
import { Shield } from "lucide-react";

export default function PermissionsPage() {
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const response = await roleService.getPermissions();
                // Assuming response is { data: Permission[] } or just Permission[]
                // Based on previous checks, it seems to return the data directly or wrapped.
                // roleService.getPermissions returns response.data.
                // If response.data is { data: Permission[] }, then we need (response as any).data.
                // If response.data is Permission[], then we use response.
                // Let's assume it's { data: Permission[] } based on other services.
                const data = (response as any).data || response;
                setPermissions(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch permissions:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPermissions();
    }, []);

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
