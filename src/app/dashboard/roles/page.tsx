"use client";

import { useEffect, useState, useCallback } from "react";
import { DataTable } from "@/components/ui/data-table";
import { roleService } from "@/features/roles/services/role.service";
import { Role } from "@/features/roles/types";
import { Edit, MoreVertical, Plus, Shield, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { toast } from "sonner";
import { parseApiResponse } from "@/lib/api-utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function RolesPage() {
    const router = useRouter();
    const [roles, setRoles] = useState<Role[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);

    const fetchRoles = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await roleService.getRoles({
                page,
                limit: 10,
                search,
            });
            const { data, totalPages: pages } = parseApiResponse<Role>(response);
            setRoles(data);
            setTotalPages(pages);
        } catch (error) {
            console.error("Failed to fetch roles:", error);
            toast.error("Failed to load roles");
            setRoles([]);
        } finally {
            setIsLoading(false);
        }
    }, [page, search]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this role?")) return;

        try {
            await roleService.deleteRole(id);
            toast.success("Role deleted successfully");
            fetchRoles();
        } catch (error) {
            console.error("Failed to delete role:", error);
            toast.error("Failed to delete role");
        }
    };

    const handleEdit = (id: string) => {
        router.push(`/dashboard/roles/${id}`);
    };

    const handleViewPermissions = (role: Role) => {
        setSelectedRole(role);
        setIsPermissionsDialogOpen(true);
    };

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
                        cell: (role) => {
                            const permCount = role.permissions?.length || 0;
                            const displayPerms = role.permissions?.slice(0, 2) || [];
                            const remainingCount = permCount - 2;

                            return (
                                <div className="flex items-center gap-2">
                                    {/* Permission Avatars */}
                                    <div className="flex -space-x-2">
                                        {displayPerms.map((perm, index) => {
                                            const initials = perm?.name
                                                ? perm.name.substring(0, 2).toUpperCase()
                                                : "??";

                                            return (
                                                <div
                                                    key={perm?.id || index}
                                                    className="w-7 h-7 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center"
                                                    title={perm?.name || "Unknown"}
                                                    style={{ zIndex: displayPerms.length - index }}
                                                >
                                                    <span className="text-[10px] font-semibold text-primary">
                                                        {initials}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                        {remainingCount > 0 && (
                                            <div
                                                className="w-7 h-7 rounded-full bg-muted border-2 border-background flex items-center justify-center cursor-pointer hover:bg-accent transition-colors"
                                                onClick={() => handleViewPermissions(role)}
                                                title={`${remainingCount} more permissions`}
                                            >
                                                <span className="text-[10px] font-semibold">
                                                    +{remainingCount}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* View All Button */}
                                    {permCount > 0 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 px-2 text-xs"
                                            onClick={() => handleViewPermissions(role)}
                                        >
                                            <Shield className="w-3 h-3 mr-1" />
                                            {permCount}
                                        </Button>
                                    )}

                                    {permCount === 0 && (
                                        <span className="text-xs text-muted-foreground">No permissions</span>
                                    )}
                                </div>
                            );
                        },
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
                        cell: (role) => (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => handleEdit(role.id)}>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Role
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-destructive"
                                        onClick={() => handleDelete(role.id)}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete Role
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ),
                    },
                ]}
            />

            {/* Permissions Dialog */}
            <Dialog open={isPermissionsDialogOpen} onOpenChange={setIsPermissionsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5" />
                            {selectedRole?.name} Permissions
                        </DialogTitle>
                        <DialogDescription>
                            {selectedRole?.description}
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="max-h-[60vh] pr-4">
                        {selectedRole?.permissions && selectedRole.permissions.length > 0 ? (
                            <div className="space-y-4">
                                <div className="text-sm text-muted-foreground">
                                    Total: {selectedRole.permissions.length} permissions
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {selectedRole.permissions.map((perm, index) => {
                                        const initials = perm?.name
                                            ? perm.name.substring(0, 2).toUpperCase()
                                            : "??";

                                        return (
                                            <div
                                                key={perm?.id || index}
                                                className="flex items-start gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                                            >
                                                <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-xs font-semibold text-primary">
                                                        {initials}
                                                    </span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium text-sm">{perm?.name || "Unknown Permission"}</div>
                                                    {perm?.description && (
                                                        <div className="text-xs text-muted-foreground mt-1">
                                                            {perm.description}
                                                        </div>
                                                    )}
                                                    <div className="flex gap-2 mt-2">
                                                        {perm?.resource && (
                                                            <Badge variant="outline" className="text-[10px]">
                                                                {perm.resource}
                                                            </Badge>
                                                        )}
                                                        {perm?.action && (
                                                            <Badge variant="secondary" className="text-[10px]">
                                                                {perm.action}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                No permissions assigned to this role
                            </div>
                        )}
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    );
}
