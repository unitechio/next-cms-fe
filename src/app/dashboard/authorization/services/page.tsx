"use client";

import { useEffect, useState } from "react";
import { Service } from "@/features/authorization/types";
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
import { ServiceForm } from "@/features/authorization/components/service-form";
import { CreateServiceRequest, UpdateServiceRequest } from "@/features/authorization/types";

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const result = await authorizationService.getServices({ page: 1, limit: 100 });
            setServices(result.data);
        } catch (error) {
            console.error("Failed to fetch services:", error);
            toast.error("Failed to load services");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this service?")) return;
        try {
            await authorizationService.deleteService(id);
            toast.success("Service deleted successfully");
            fetchServices();
        } catch (error) {
            console.error("Failed to delete service:", error);
            toast.error("Failed to delete service");
        }
    };

    const handleCreate = () => {
        setSelectedService(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (service: Service) => {
        setSelectedService(service);
        setIsDialogOpen(true);
    };

    const handleSubmit = async (data: CreateServiceRequest | UpdateServiceRequest) => {
        try {
            setIsSubmitting(true);
            if (selectedService) {
                await authorizationService.updateService(selectedService.id, data as UpdateServiceRequest);
                toast.success("Service updated successfully");
            } else {
                await authorizationService.createService(data as CreateServiceRequest);
                toast.success("Service created successfully");
            }
            setIsDialogOpen(false);
            fetchServices();
        } catch (error) {
            console.error("Failed to save service:", error);
            toast.error("Failed to save service");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Services</h2>
                <Button onClick={handleCreate}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Service
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Services List</CardTitle>
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
                                    <TableHead>Department</TableHead>
                                    <TableHead>Endpoint</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>System</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {services.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                            No services found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    services.map((service) => (
                                        <TableRow key={service.id}>
                                            <TableCell className="font-medium">{service.code}</TableCell>
                                            <TableCell>{service.display_name || service.name}</TableCell>
                                            <TableCell>
                                                {service.department ? (
                                                    <Badge variant="outline">{service.department.code}</Badge>
                                                ) : (
                                                    <span className="text-muted-foreground">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="font-mono text-xs">{service.endpoint || "-"}</TableCell>
                                            <TableCell>
                                                <Badge variant={service.is_active ? "default" : "secondary"}>
                                                    {service.is_active ? "Active" : "Inactive"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {service.is_system && (
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
                                                        onClick={() => handleEdit(service)}
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    {!service.is_system && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                            onClick={() => handleDelete(service.id)}
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
                        <DialogTitle>{selectedService ? "Edit Service" : "Create Service"}</DialogTitle>
                    </DialogHeader>
                    <ServiceForm
                        initialData={selectedService}
                        onSubmit={handleSubmit}
                        isLoading={isSubmitting}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
