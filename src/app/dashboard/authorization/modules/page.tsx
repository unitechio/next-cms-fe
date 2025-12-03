"use client";

import { useEffect, useState, useCallback } from "react";
import { Module } from "@/features/authorization/types";
import { authorizationService } from "@/features/authorization/authorization.service";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ModuleForm } from "@/features/authorization/components/module-form";
import { CreateModuleRequest, UpdateModuleRequest } from "@/features/authorization/types";
import { parseApiResponse } from "@/lib/api-utils";

export default function ModulesPage() {
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedModule, setSelectedModule] = useState<Module | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchModules = useCallback(async () => {
        try {
            setLoading(true);
            const response = await authorizationService.getModules({
                page,
                limit: pageSize,
                search
            });
            const { data, totalPages: pages } = parseApiResponse<Module>(response);
            setModules(data);
            setTotalPages(pages);
        } catch (error) {
            console.error("Failed to fetch modules:", error);
            toast.error("Failed to load modules");
            setModules([]);
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, search]);

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchModules();
        }, 300);
        return () => clearTimeout(debounce);
    }, [fetchModules]);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this module?")) return;
        try {
            await authorizationService.deleteModule(id);
            toast.success("Module deleted successfully");
            fetchModules();
        } catch (error) {
            console.error("Failed to delete module:", error);
            toast.error("Failed to delete module");
        }
    };

    const handleCreate = () => {
        setSelectedModule(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (module: Module) => {
        setSelectedModule(module);
        setIsDialogOpen(true);
    };

    const handleSubmit = async (data: CreateModuleRequest | UpdateModuleRequest) => {
        try {
            setIsSubmitting(true);
            if (selectedModule) {
                await authorizationService.updateModule(selectedModule.id, data as UpdateModuleRequest);
                toast.success("Module updated successfully");
            } else {
                await authorizationService.createModule(data as CreateModuleRequest);
                toast.success("Module created successfully");
            }
            setIsDialogOpen(false);
            fetchModules();
        } catch (error) {
            console.error("Failed to save module:", error);
            toast.error("Failed to save module");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setPage(1);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold">System Modules</h2>
                    <p className="text-muted-foreground">Manage system modules and their configurations.</p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Module
                </Button>
            </div>

            <DataTable
                data={modules}
                isLoading={loading}
                search={{
                    value: search,
                    onChange: setSearch,
                    placeholder: "Search modules...",
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
                        header: "Code",
                        accessorKey: "code",
                        cell: (module) => <span className="font-medium">{module.code}</span>
                    },
                    {
                        header: "Name",
                        accessorKey: "name",
                        cell: (module) => module.display_name || module.name
                    },
                    {
                        header: "Description",
                        accessorKey: "description",
                    },
                    {
                        header: "Status",
                        accessorKey: "is_active",
                        cell: (module) => (
                            <Badge variant={module.is_active ? "default" : "secondary"}>
                                {module.is_active ? "Active" : "Inactive"}
                            </Badge>
                        )
                    },
                    {
                        header: "System",
                        accessorKey: "is_system",
                        cell: (module) => module.is_system && (
                            <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                                System
                            </Badge>
                        )
                    },
                    {
                        header: "Actions",
                        cell: (module) => (
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEdit(module)}
                                >
                                    <Edit className="w-4 h-4" />
                                </Button>
                                {!module.is_system && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => handleDelete(module.id)}
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
                        <DialogTitle>{selectedModule ? "Edit Module" : "Create Module"}</DialogTitle>
                    </DialogHeader>
                    <ModuleForm
                        initialData={selectedModule}
                        onSubmit={handleSubmit}
                        isLoading={isSubmitting}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
