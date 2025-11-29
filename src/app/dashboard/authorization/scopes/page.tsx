"use client";

import { useEffect, useState, useCallback } from "react";
import { Scope, ScopeLevel } from "@/features/authorization/types";
import { authorizationService } from "@/features/authorization/authorization.service";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScopeForm } from "@/features/authorization/components/scope-form";
import { CreateScopeRequest, UpdateScopeRequest } from "@/features/authorization/types";

export default function ScopesPage() {
    const [scopes, setScopes] = useState<Scope[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedScope, setSelectedScope] = useState<Scope | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchScopes = useCallback(async () => {
        try {
            setLoading(true);
            const result = await authorizationService.getScopes({
                page,
                limit: 10,
                search
            });
            setScopes(result.data);
            setTotalPages(result.meta?.total_pages || 1);
        } catch (error) {
            console.error("Failed to fetch scopes:", error);
            toast.error("Failed to load scopes");
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchScopes();
        }, 300);
        return () => clearTimeout(debounce);
    }, [fetchScopes]);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this scope?")) return;
        try {
            await authorizationService.deleteScope(id);
            toast.success("Scope deleted successfully");
            fetchScopes();
        } catch (error) {
            console.error("Failed to delete scope:", error);
            toast.error("Failed to delete scope");
        }
    };

    const handleCreate = () => {
        setSelectedScope(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (scope: Scope) => {
        setSelectedScope(scope);
        setIsDialogOpen(true);
    };

    const handleSubmit = async (data: CreateScopeRequest | UpdateScopeRequest) => {
        try {
            setIsSubmitting(true);
            if (selectedScope) {
                await authorizationService.updateScope(selectedScope.id, data as UpdateScopeRequest);
                toast.success("Scope updated successfully");
            } else {
                await authorizationService.createScope(data as CreateScopeRequest);
                toast.success("Scope created successfully");
            }
            setIsDialogOpen(false);
            fetchScopes();
        } catch (error) {
            console.error("Failed to save scope:", error);
            toast.error("Failed to save scope");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getLevelBadgeColor = (level: ScopeLevel) => {
        switch (level) {
            case ScopeLevel.ORGANIZATION:
                return "bg-purple-100 text-purple-800 border-purple-200";
            case ScopeLevel.DEPARTMENT:
                return "bg-blue-100 text-blue-800 border-blue-200";
            case ScopeLevel.TEAM:
                return "bg-green-100 text-green-800 border-green-200";
            case ScopeLevel.PERSONAL:
                return "bg-gray-100 text-gray-800 border-gray-200";
            default:
                return "";
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold">Permission Scopes</h2>
                    <p className="text-muted-foreground">Manage permission scopes and levels.</p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Scope
                </Button>
            </div>

            <DataTable
                data={scopes}
                isLoading={loading}
                search={{
                    value: search,
                    onChange: setSearch,
                    placeholder: "Search scopes...",
                }}
                pagination={{
                    currentPage: page,
                    totalPages: totalPages,
                    onPageChange: setPage,
                }}
                columns={[
                    {
                        header: "Code",
                        accessorKey: "code",
                        cell: (scope) => <span className="font-medium">{scope.code}</span>
                    },
                    {
                        header: "Name",
                        accessorKey: "name",
                        cell: (scope) => scope.display_name || scope.name
                    },
                    {
                        header: "Level",
                        accessorKey: "level",
                        cell: (scope) => (
                            <Badge variant="outline" className={getLevelBadgeColor(scope.level)}>
                                {scope.level}
                            </Badge>
                        )
                    },
                    {
                        header: "Priority",
                        accessorKey: "priority",
                    },
                    {
                        header: "Description",
                        accessorKey: "description",
                    },
                    {
                        header: "System",
                        accessorKey: "is_system",
                        cell: (scope) => scope.is_system && (
                            <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                                System
                            </Badge>
                        )
                    },
                    {
                        header: "Actions",
                        cell: (scope) => (
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEdit(scope)}
                                >
                                    <Edit className="w-4 h-4" />
                                </Button>
                                {!scope.is_system && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => handleDelete(scope.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        )
                    }
                ]}
            />

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedScope ? "Edit Scope" : "Create Scope"}</DialogTitle>
                    </DialogHeader>
                    <ScopeForm
                        initialData={selectedScope}
                        onSubmit={handleSubmit}
                        isLoading={isSubmitting}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
