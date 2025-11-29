"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { roleService } from "../services/role.service";
import { Permission, Role } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

export const RoleSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().optional(),
    permission_ids: z.array(z.string()).min(1, "Select at least one permission"),
});

interface RoleFormProps {
    initialData?: Role;
    isEdit?: boolean;
}

export function RoleForm({ initialData, isEdit = false }: RoleFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);

    const form = useForm<z.infer<typeof RoleSchema>>({
        resolver: zodResolver(RoleSchema),
        defaultValues: {
            name: initialData?.name || "",
            description: initialData?.description || "",
            permission_ids: initialData?.permissions?.map((p) => p.id) || [],
        },
    });

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const response = await roleService.getPermissions();
                setPermissions(response.data || []);
            } catch (error) {
                console.error("Failed to fetch permissions:", error);
                toast.error("Failed to load permissions");
            } finally {
                setIsLoadingPermissions(false);
            }
        };
        fetchPermissions();
    }, []);

    const groupedPermissions = useMemo(() => {
        const groups: Record<string, Permission[]> = {};
        permissions.forEach((perm) => {
            const resource = perm.resource || "Other";
            if (!groups[resource]) {
                groups[resource] = [];
            }
            groups[resource].push(perm);
        });
        return groups;
    }, [permissions]);

    const onSubmit = async (data: z.infer<typeof RoleSchema>) => {
        setIsLoading(true);
        try {
            if (isEdit && initialData) {
                await roleService.updateRole(initialData.id, data);
                toast.success("Role updated successfully");
            } else {
                await roleService.createRole(data);
                toast.success("Role created successfully");
            }
            router.push("/dashboard/roles");
            router.refresh();
        } catch (error) {
            console.error("Failed to save role:", error);
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || "Failed to save role");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleGroup = (resource: string, checked: boolean) => {
        const current = form.getValues("permission_ids");
        const groupPermIds = groupedPermissions[resource].map((p) => p.id);

        let newIds: string[];
        if (checked) {
            // Add all missing ids from this group
            const toAdd = groupPermIds.filter((id) => !current.includes(id));
            newIds = [...current, ...toAdd];
        } else {
            // Remove all ids from this group
            newIds = current.filter((id) => !groupPermIds.includes(id));
        }
        form.setValue("permission_ids", newIds, { shouldDirty: true, shouldValidate: true });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Role Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Role Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Content Editor" {...field} />
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
                                            <Textarea
                                                placeholder="Describe what this role can do..."
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Card className="md:row-span-2">
                        <CardHeader>
                            <CardTitle>Permissions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoadingPermissions ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="permission_ids"
                                        render={() => (
                                            <FormItem>
                                                {Object.entries(groupedPermissions).map(([resource, perms]) => {
                                                    const currentIds = form.watch("permission_ids");
                                                    const groupIds = perms.map(p => p.id);
                                                    const allSelected = groupIds.every(id => currentIds.includes(id));

                                                    return (
                                                        <div key={resource} className="space-y-3">
                                                            <div className="flex items-center justify-between">
                                                                <h4 className="font-medium capitalize">{resource}</h4>
                                                                <div className="flex items-center space-x-2">
                                                                    <Checkbox
                                                                        checked={allSelected}
                                                                        onCheckedChange={(checked) => toggleGroup(resource, checked as boolean)}
                                                                        id={`group-${resource}`}
                                                                    />
                                                                    <label
                                                                        htmlFor={`group-${resource}`}
                                                                        className="text-xs text-muted-foreground cursor-pointer"
                                                                    >
                                                                        Select All
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-1 gap-2 pl-2 border-l-2 border-muted">
                                                                {perms.map((perm) => (
                                                                    <FormField
                                                                        key={perm.id}
                                                                        control={form.control}
                                                                        name="permission_ids"
                                                                        render={({ field }) => {
                                                                            return (
                                                                                <FormItem
                                                                                    key={perm.id}
                                                                                    className="flex flex-row items-start space-x-3 space-y-0"
                                                                                >
                                                                                    <FormControl>
                                                                                        <Checkbox
                                                                                            checked={field.value?.includes(perm.id)}
                                                                                            onCheckedChange={(checked) => {
                                                                                                return checked
                                                                                                    ? field.onChange([...field.value, perm.id])
                                                                                                    : field.onChange(
                                                                                                        field.value?.filter(
                                                                                                            (value) => value !== perm.id
                                                                                                        )
                                                                                                    );
                                                                                            }}
                                                                                        />
                                                                                    </FormControl>
                                                                                    <div className="space-y-1 leading-none">
                                                                                        <FormLabel className="font-normal">
                                                                                            {perm.name}
                                                                                        </FormLabel>
                                                                                        <FormDescription>
                                                                                            {perm.description}
                                                                                        </FormDescription>
                                                                                    </div>
                                                                                </FormItem>
                                                                            );
                                                                        }}
                                                                    />
                                                                ))}
                                                            </div>
                                                            <Separator className="my-4" />
                                                        </div>
                                                    );
                                                })}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-end gap-3">
                    <Button variant="outline" asChild>
                        <Link href="/dashboard/roles">Cancel</Link>
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4 mr-2" />
                        )}
                        {isEdit ? "Update Role" : "Create Role"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
