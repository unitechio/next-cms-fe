"use client";

import { useEffect, useState, useCallback } from "react";
import { Service } from "@/features/authorization/types";
import { authorizationService } from "@/features/authorization/authorization.service";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ServiceForm } from "@/features/authorization/components/service-form";
import { CreateServiceRequest, UpdateServiceRequest } from "@/features/authorization/types";
import { parseApiResponse } from "@/lib/api-utils";


export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchServices = useCallback(async () => {
        try {
            setLoading(true);
            const response = await authorizationService.getServices({
                page,
                limit: 10,
                search
            });
            const { data, totalPages: pages } = parseApiResponse<Service>(response);
            setServices(data);
            setTotalPages(pages);
        } catch (error) {
            console.error("Failed to fetch services:", error);
            toast.error("Failed to load services");
            setServices([]);
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchServices();
        }, 300);
        return () => clearTimeout(debounce);
    }, [fetchServices]);

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
                <div>
                    <h2 className="text-xl font-semibold">Services</h2>
                    <p className="text-muted-foreground">Manage system services and endpoints.</p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Service
                </Button>
            </div>

            <DataTable
                data={services}
                isLoading={loading}
                search={{
                    value: search,
                    onChange: setSearch,
                    placeholder: "Search services...",
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
                        cell: (service) => <span className="font-medium">{service.code}</span>
                    },
                    {
                        header: "Name",
                        accessorKey: "name",
                        cell: (service) => service.display_name || service.name
                    },
                    {
                        header: "Department",
                        accessorKey: "department",
                        cell: (service) => service.department ? (
                            <Badge variant="outline">{service.department.code}</Badge>
                        ) : (
                            <span className="text-muted-foreground">-</span>
                        )
                    },
                    {
                        header: "Endpoint",
                        accessorKey: "endpoint",
                        cell: (service) => <span className="font-mono text-xs">{service.endpoint || "-"}</span>
                    },
                    {
                        header: "Status",
                        accessorKey: "is_active",
                        cell: (service) => (
                            <Badge variant={service.is_active ? "default" : "secondary"}>
                                {service.is_active ? "Active" : "Inactive"}
                            </Badge>
                        )
                    },
                    {
                        header: "System",
                        accessorKey: "is_system",
                        cell: (service) => service.is_system && (
                            <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                                System
                            </Badge>
                        )
                    },
                    {
                        header: "Actions",
                        cell: (service) => (
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
                        )
                    }
                ]}
            />

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
