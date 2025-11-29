"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Service, Department, CreateServiceRequest, UpdateServiceRequest } from "../types";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { authorizationService } from "../authorization.service";

const formSchema = z.object({
    department_id: z.string().min(1, "Department is required"),
    code: z.string().min(2, "Code must be at least 2 characters").max(50),
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    display_name: z.string().optional(),
    description: z.string().optional(),
    endpoint: z.string().optional(),
    is_active: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface ServiceFormProps {
    initialData?: Service | null;
    onSubmit: (data: CreateServiceRequest | UpdateServiceRequest) => void;
    isLoading?: boolean;
}

export function ServiceForm({ initialData, onSubmit, isLoading }: ServiceFormProps) {
    const [departments, setDepartments] = useState<Department[]>([]);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const data = await authorizationService.getActiveDepartments();
                setDepartments(data);
            } catch (error) {
                console.error("Failed to fetch departments:", error);
            }
        };
        fetchDepartments();
    }, []);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            department_id: "",
            code: "",
            name: "",
            display_name: "",
            description: "",
            endpoint: "",
            is_active: true,
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                department_id: initialData.department_id.toString(),
                code: initialData.code,
                name: initialData.name,
                display_name: initialData.display_name || "",
                description: initialData.description || "",
                endpoint: initialData.endpoint || "",
                is_active: initialData.is_active,
            });
        } else {
            form.reset({
                department_id: "",
                code: "",
                name: "",
                display_name: "",
                description: "",
                endpoint: "",
                is_active: true,
            });
        }
    }, [initialData, form]);

    const handleSubmit = (values: FormValues) => {
        onSubmit({
            ...values,
            department_id: parseInt(values.department_id),
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="department_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Department</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                value={field.value}
                                disabled={!!initialData}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a department" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {departments.map((dept) => (
                                        <SelectItem key={dept.id} value={dept.id.toString()}>
                                            {dept.display_name || dept.name} ({dept.module?.code})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Code</FormLabel>
                            <FormControl>
                                <Input placeholder="customers" {...field} disabled={!!initialData} />
                            </FormControl>
                            <FormDescription>
                                Unique identifier for the service.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Customers" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="display_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Display Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Customer Management" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="endpoint"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>API Endpoint</FormLabel>
                            <FormControl>
                                <Input placeholder="/api/v1/customers" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Service description..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Active Status</FormLabel>
                                <FormDescription>
                                    Disable to hide this service.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-2">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
                        {initialData ? "Update Service" : "Create Service"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
