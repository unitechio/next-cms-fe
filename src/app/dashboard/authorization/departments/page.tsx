"use client";

import { useEffect, useState, useCallback } from "react";
import { Department } from "@/features/authorization/types";
import { authorizationService } from "@/features/authorization/authorization.service";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DepartmentForm } from "@/features/authorization/components/department-form";
import { CreateDepartmentRequest, UpdateDepartmentRequest } from "@/features/authorization/types";
console.error("Failed to fetch departments:", error);
toast.error("Failed to load departments");
setDepartments([]);
        } finally {
    setLoading(false);
}
    }, [page, pageSize, search]);

useEffect(() => {
    const debounce = setTimeout(() => {
        fetchDepartments();
    }, 300);
    return () => clearTimeout(debounce);
}, [fetchDepartments]);

const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this department?")) return;
    try {
        await authorizationService.deleteDepartment(id);
        toast.success("Department deleted successfully");
        fetchDepartments();
    } catch (error) {
        console.error("Failed to delete department:", error);
        toast.error("Failed to delete department");
    }
};

const handleCreate = () => {
    setSelectedDepartment(null);
    setIsDialogOpen(true);
};

const handleEdit = (department: Department) => {
    setSelectedDepartment(department);
    setIsDialogOpen(true);
};

const handleSubmit = async (data: CreateDepartmentRequest | UpdateDepartmentRequest) => {
    try {
        setIsSubmitting(true);
        if (selectedDepartment) {
            await authorizationService.updateDepartment(selectedDepartment.id, data as UpdateDepartmentRequest);
            toast.success("Department updated successfully");
        } else {
            await authorizationService.createDepartment(data as CreateDepartmentRequest);
            toast.success("Department created successfully");
        }
        setIsDialogOpen(false);
        fetchDepartments();
    } catch (error) {
        console.error("Failed to save department:", error);
        toast.error("Failed to save department");
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
                <h2 className="text-xl font-semibold">Departments</h2>
                <p className="text-muted-foreground">Manage departments and their hierarchy.</p>
            </div>
            <Button onClick={handleCreate}>
                <Plus className="w-4 h-4 mr-2" />
                Add Department
            </Button>
        </div>

        <DataTable
            data={departments}
            isLoading={loading}
            search={{
                value: search,
                onChange: setSearch,
                placeholder: "Search departments...",
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
                    cell: (dept) => <span className="font-medium">{dept.code}</span>
                },
                {
                    header: "Name",
                    accessorKey: "name",
                    cell: (dept) => dept.display_name || dept.name
                },
                {
                    header: "Module",
                    accessorKey: "module",
                    cell: (dept) => dept.module ? (
                        <Badge variant="outline">{dept.module.code}</Badge>
                    ) : (
                        <span className="text-muted-foreground">-</span>
                    )
                },
                {
                    header: "Description",
                    accessorKey: "description",
                },
                {
                    header: "Status",
                    accessorKey: "is_active",
                    cell: (dept) => (
                        <Badge variant={dept.is_active ? "default" : "secondary"}>
                            {dept.is_active ? "Active" : "Inactive"}
                        </Badge>
                    )
                },
                {
                    header: "System",
                    accessorKey: "is_system",
                    cell: (dept) => dept.is_system && (
                        <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                            System
                        </Badge>
                    )
                },
                {
                    header: "Actions",
                    cell: (dept) => (
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(dept)}
                            >
                                <Edit className="w-4 h-4" />
                            </Button>
                            {!dept.is_system && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => handleDelete(dept.id)}
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
                    <DialogTitle>{selectedDepartment ? "Edit Department" : "Create Department"}</DialogTitle>
                </DialogHeader>
                <DepartmentForm
                    initialData={selectedDepartment}
                    onSubmit={handleSubmit}
                    isLoading={isSubmitting}
                />
            </DialogContent>
        </Dialog>
    </div>
);
}
