"use client";

import { useEffect, useState } from "react";
import { Module } from "@/features/authorization/types";
import { authorizationService } from "@/features/authorization/authorization.service";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Loader2, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ModuleForm } from "@/features/authorization/components/module-form";
import { CreateModuleRequest, UpdateModuleRequest } from "@/features/authorization/types";

export default function ModulesPage() {
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedModule, setSelectedModule] = useState<Module | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchModules = async () => {
        try {
            setLoading(true);
            const result = await authorizationService.getModules({ page: 1, limit: 100 });
            setModules(result.data);
        } catch (error) {
            console.error("Failed to fetch modules:", error);
            toast.error("Failed to load modules");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchModules();
    }, []);

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

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">System Modules</h2>
                <Button onClick={handleCreate}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Module
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Modules List</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>System</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {modules.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            No modules found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    modules.map((module) => (
                                        <TableRow key={module.id}>
                                            <TableCell className="font-medium">{module.code}</TableCell>
                                            <TableCell>{module.display_name || module.name}</TableCell>
                                            <TableCell>{module.description}</TableCell>
                                            <TableCell>
                                                <Badge variant={module.is_active ? "default" : "secondary"}>
                                                    {module.is_active ? "Active" : "Inactive"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {module.is_system && (
                                                    <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                                                        System
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
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
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

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
