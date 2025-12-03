"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { permissionService } from "../services/permission.service";
import { Permission } from "@/features/roles/types";

const permissionSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .regex(
      /^[a-z_]+\.[a-z_]+$/,
      "Format: resource.action (e.g., users.create)",
    ),
  resource: z.string().min(1, "Resource is required"),
  action: z.string().min(1, "Action is required"),
  description: z.string().optional(),
});

type PermissionFormData = z.infer<typeof permissionSchema>;

interface PermissionFormProps {
  permission?: Permission;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function PermissionForm({
  permission,
  open,
  onOpenChange,
  onSuccess,
}: PermissionFormProps) {
  const isEdit = !!permission;

  const form = useForm<PermissionFormData>({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      name: "",
      resource: "",
      action: "",
      description: "",
    },
  });

  useEffect(() => {
    if (permission) {
      form.reset({
        name: permission.name,
        resource: permission.resource,
        action: permission.action,
        description: permission.description || "",
      });
    }
  }, [permission]);

  const onSubmit = async (data: PermissionFormData) => {
    try {
      if (isEdit) {
        await permissionService.updatePermission(Number(permission.id), data);
        toast.success("Permission updated successfully");
      } else {
        const result = await permissionService.createPermission(data);
        console.log("✅ Permission created:", result);
        toast.success("Permission created successfully");
      }
      onSuccess?.();
      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      console.error("Error response:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to save permission");
    }
  };

  // Auto-generate name from resource and action
  // Convert to lowercase and snake_case to match validation regex
  const toSnakeCase = (str: string) => {
    return str
      .replace(/([A-Z])/g, "_$1") // Add underscore before capital letters
      .toLowerCase()
      .replace(/^_/, ""); // Remove leading underscore
  };

  const handleResourceOrActionChange = () => {
    if (isEdit) return;

    const resource = form.watch("resource");
    const action = form.watch("action");
    if (resource && action) {
      const normalizedResource = toSnakeCase(resource);
      const normalizedAction = toSnakeCase(action);
      form.setValue("name", `${normalizedResource}.${normalizedAction}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Permission" : "Create Permission"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update permission details"
              : "Add a new permission to the system"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="resource"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resource</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="users"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleResourceOrActionChange();
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    The resource this permission applies to (e.g., users, posts,
                    roles)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="action"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Action</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="create"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleResourceOrActionChange();
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    The action allowed (e.g., create, read, update, delete)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Permission Name</FormLabel>
                  <FormControl>
                    <Input placeholder="users.create" {...field} readOnly />
                  </FormControl>
                  <FormDescription>
                    Auto-generated from resource and action
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what this permission allows"
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="cursor-pointer"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEdit ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
