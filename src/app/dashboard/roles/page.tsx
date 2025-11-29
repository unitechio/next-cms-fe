"use client";

import { useEffect, useState, useCallback } from "react";
import { DataTable } from "@/components/ui/data-table";
import { roleService } from "@/features/roles/services/role.service";
import { Role } from "@/features/roles/types";
import { Edit, MoreVertical, Plus, Shield, Trash2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function RolesPage() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [totalPages, setTotalPages] = useState(1);

    const fetchRoles = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await roleService.getRoles({
                page,
                limit: 10,
                search,
            });
            setRoles(response.data || []);
            setTotalPages(response.meta?.total_pages || 1);
        } catch (error) {
            console.error("Failed to fetch roles:", error);
        } finally {
            setIsLoading(false);
        }
    }, [page, search]);

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchRoles();
        }, 300);
        return () => clearTimeout(debounce);
    }, [fetchRoles]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Roles & Permissions</h1>
                    <p className="text-muted-foreground">Manage user roles and access controls.</p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/roles/new">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Role
                    </Link>
                </Button>
            </div>

            <DataTable
                data={roles}
                isLoading={isLoading}
                search={{
                    value: search,
                    onChange: setSearch,
                    placeholder: "Search roles...",
                }}
                pagination={{
                    currentPage: page,
                    totalPages: totalPages,
                    onPageChange: setPage,
                }}
                columns={[
                    {
                        header: "Role Name",
                        cell: (role) => (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-medium">{role.name}</div>
                                    <div className="text-xs text-muted-foreground">{role.description}</div>
                                </div>
                            </div>
                        ),
                    },
                    {
                        header: "Permissions",
                        cell: (role) => (
                            <div className="flex flex-wrap gap-1">
                                {role.permissions?.slice(0, 3).map((perm) => (
                                    <Badge key={perm.id} variant="secondary" className="text-[10px]">
                                        {perm.name}
                                    </Badge>
                                ))}
                                {role.permissions?.length > 3 && (
                                    <Badge variant="outline" className="text-[10px]">
                                        +{role.permissions.length - 3} more
                                    </Badge>
                                )}
                            </div>
                        ),
                    },
                    {
                        header: "Created At",
                        accessorKey: "created_at",
                        cell: (role) => (
                            <span className="text-muted-foreground text-sm">
                                {role.created_at ? format(new Date(role.created_at), "MMM d, yyyy") : "-"}
                            </span>
                        ),
                    },
                    {
                        header: "Actions",
                        cell: () => (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Role
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive">
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete Role
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ),
                    },
                ]}
            />
        </div>
    );
}
