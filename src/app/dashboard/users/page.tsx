"use client";

import { useEffect, useState, useCallback } from "react";
import { DataTable } from "@/components/ui/data-table";
import { userService } from "@/features/users/services/user.service";
import { User } from "@/features/users/types";
import { MoreVertical, Plus, Shield, UserCog } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { parseApiResponse } from "@/lib/api-utils";
import { toast } from "sonner";
import { UserRoleAssignment } from "@/features/users/components/user-role-assignment";
import { UserPermissionsView } from "@/features/users/components/user-permissions-view";


export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState("");
    const [totalPages, setTotalPages] = useState(1);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await userService.getUsers({
                page,
                limit: pageSize,
                search,
            });
            const { data, totalPages: pages } = parseApiResponse<User>(response);
            setUsers(data);
            setTotalPages(pages);
        } catch (error) {
            console.error("Failed to fetch users:", error);
            toast.error("Failed to load users");
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    }, [page, pageSize, search]);

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchUsers();
        }, 300);
        return () => clearTimeout(debounce);
    }, [fetchUsers]);

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setPage(1); // Reset to first page when changing page size
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Users</h1>
                    <p className="text-muted-foreground">Manage system users and their roles.</p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/users/new">
                        <Plus className="w-4 h-4 mr-2" />
                        Add User
                    </Link>
                </Button>
            </div>

            <DataTable
                data={users}
                isLoading={isLoading}
                search={{
                    value: search,
                    onChange: setSearch,
                    placeholder: "Search users...",
                }}
                pagination={{
                    currentPage: page,
                    totalPages: totalPages,
                    onPageChange: setPage,
                    pageSize: pageSize,
                    onPageSizeChange: handlePageSizeChange,
                    showPageSize: true,
                    showFirstLast: true,
                }}
                columns={[
                    {
                        header: "User",
                        cell: (user) => (
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={`https://avatar.vercel.sh/${user.email}`} />
                                    <AvatarFallback>
                                        {user.first_name?.[0]}
                                        {user.last_name?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-medium">
                                        {user.first_name} {user.last_name}
                                    </div>
                                    <div className="text-xs text-muted-foreground">{user.email}</div>
                                </div>
                            </div>
                        ),
                    },
                    {
                        header: "Roles",
                        cell: (user) => (
                            <div className="flex flex-wrap gap-1">
                                {user.roles && user.roles.length > 0 ? (
                                    user.roles.map((role) => (
                                        <Badge key={role.id} variant="outline" className="capitalize">
                                            {role.name}
                                        </Badge>
                                    ))
                                ) : (
                                    <span className="text-xs text-muted-foreground">No roles</span>
                                )}
                            </div>
                        ),
                    },
                    {
                        header: "Status",
                        accessorKey: "status",
                        cell: (user) => (
                            <Badge
                                variant={user.status === "active" ? "default" : "secondary"}
                                className="capitalize"
                            >
                                {user.status}
                            </Badge>
                        ),
                    },
                    {
                        header: "Joined",
                        accessorKey: "created_at",
                        cell: (user) => (
                            <span className="text-muted-foreground text-sm">
                                {user.created_at ? format(new Date(user.created_at), "MMM d, yyyy") : "-"}
                            </span>
                        ),
                    },
                    {
                        header: "Actions",
                        cell: (user) => (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem
                                        onClick={() => navigator.clipboard.writeText(user.id.toString())}
                                    >
                                        Copy User ID
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href={`/dashboard/users/${user.id}/edit`}>Edit User</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">
                                        Delete User
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
