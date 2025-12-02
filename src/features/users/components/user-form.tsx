"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { userService } from "../services/user.service";
import { roleService } from "@/features/roles/services/role.service";
import { User, CreateUserRequest, UpdateUserRequest } from "../types";
import { Role } from "@/features/roles/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, UserPlus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

import { authorizationService } from "@/features/authorization/authorization.service";
import { Department } from "@/features/authorization/types";

// Create schema factory function to handle conditional password validation
const createUserFormSchema = (isEdit: boolean) => z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: isEdit
    ? z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal(""))
    : z.string().min(6, "Password must be at least 6 characters"),
  role_ids: z.array(z.union([z.string(), z.number()])).min(1, "Select at least one role"),
  status: z.enum(["active", "inactive", "banned"]),
  phone: z.string().optional(),
  department: z.string().optional(),
  position: z.string().optional(),
});

// For backwards compatibility
const UserFormSchema = createUserFormSchema(false);

interface UserFormProps {
  initialData?: User;
  isEdit?: boolean;
}

export function UserForm({ initialData, isEdit = false }: UserFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(true);

  const form = useForm<z.infer<typeof UserFormSchema>>({
    resolver: zodResolver(createUserFormSchema(isEdit)),
    defaultValues: {
      first_name: initialData?.first_name || "",
      last_name: initialData?.last_name || "",
      email: initialData?.email || "",
      password: "",
      role_ids: initialData?.roles?.map((r) => r.id) || [],
      status: initialData?.status || "active",
      phone: initialData?.phone || "",
      department: typeof initialData?.department === 'object'
        ? (initialData.department as any).code
        : (initialData?.department || ""),
      position: initialData?.position || "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesResponse, departmentsResponse] = await Promise.all([
          roleService.getRoles({ page: 1, limit: 100 }),
          authorizationService.getActiveDepartments(),
        ]);
        setRoles(rolesResponse.data || []);
        const depts = Array.isArray(departmentsResponse)
          ? departmentsResponse
          : (departmentsResponse as any).data || [];
        setDepartments(depts);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to load form data");
      } finally {
        setIsLoadingRoles(false);
        setIsLoadingDepartments(false);
      }
    };
    fetchData();
  }, []);

  // Debug: Log form errors and notify user
  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      console.log("Form validation errors:", form.formState.errors);
      toast.error("Please fix the errors in the form");
    }
  }, [form.formState.errors]);

  const onSubmit = async (data: z.infer<typeof UserFormSchema>) => {
    console.log("✅ Form submitted with data:", data);
    console.log("📋 Is Edit Mode:", isEdit);
    setIsLoading(true);
    try {
      // Prepare payload
      const payload: any = {
        ...data,
        // Convert role_ids to numbers if backend expects numbers
        role_ids: data.role_ids.map(id => Number(id))
      };

      // Clean up optional fields
      if (!payload.department || payload.department === "none") {
        delete payload.department;
      }
      if (!payload.position || payload.position.trim() === "") {
        delete payload.position;
      }
      if (!payload.phone || payload.phone.trim() === "") {
        delete payload.phone;
      }

      // IMPORTANT: Only remove password if we're editing AND password is empty
      // For new users, password should always be included (validated by schema)
      if (isEdit && (!payload.password || payload.password.trim() === "")) {
        delete payload.password;
      }

      console.log("📤 Sending payload:", payload);
      console.log("🔑 Password in payload:", payload.password ? "YES (length: " + payload.password.length + ")" : "NO");

      if (isEdit && initialData) {
        await userService.updateUser(
          initialData.id,
          payload as UpdateUserRequest,
        );
        toast.success("User updated successfully");
      } else {
        const result = await userService.createUser(
          payload as CreateUserRequest,
        );
        console.log("✅ Create user result:", result);
        toast.success("User created successfully");
      }
      router.push("/dashboard/users");
      router.refresh();
    } catch (error: any) {
      console.error("❌ Failed to save user:", error);

      // Detailed error logging
      if (error.response) {
        console.error("Error Response Data:", error.response.data);
        console.error("Error Status:", error.response.status);
      }

      // Extract error message safely
      let errorMessage = "Failed to save user";
      const responseData = error.response?.data;

      if (responseData) {
        if (typeof responseData.message === 'string') {
          errorMessage = responseData.message;
        } else if (typeof responseData.error === 'string') {
          errorMessage = responseData.error;
        } else if (responseData.error && typeof responseData.error === 'object') {
          errorMessage = responseData.error.message || JSON.stringify(responseData.error);
        }
      }

      toast.error(errorMessage);

      // Handle field-specific validation errors from backend
      if (error.response?.data?.details) {
        const details = error.response.data.details;
        console.error("Validation Details:", details);

        // Set form errors for specific fields if backend provides them
        if (Array.isArray(details)) {
          details.forEach((detail: any) => {
            if (detail.field && detail.message) {
              form.setError(detail.field as any, {
                type: "manual",
                message: detail.message,
              });
              toast.error(`${detail.field}: ${detail.message}`);
            }
          });
        } else if (typeof details === 'object') {
          // Handle object format: { field: "message" }
          Object.keys(details).forEach((field) => {
            const message = details[field];
            form.setError(field as any, {
              type: "manual",
              message: typeof message === 'string' ? message : JSON.stringify(message),
            });
            toast.error(`${field}: ${message}`);
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Debug: Log when submit button is clicked
  const handleSubmitClick = () => {
    console.log("🔘 Submit button clicked");
    console.log("Form values:", form.getValues());
    console.log("Form is valid:", form.formState.isValid);
    console.log("Form errors:", form.formState.errors);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Error Summary - Show all validation errors */}
        {Object.keys(form.formState.errors).length > 0 && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <svg
                  className="h-5 w-5 text-destructive"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-destructive mb-2">
                  Please fix the following errors:
                </h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-destructive/90">
                  {Object.entries(form.formState.errors).map(([field, error]) => (
                    <li key={field}>
                      <span className="font-medium capitalize">
                        {field.replace(/_/g, " ")}
                      </span>
                      : {error?.message?.toString() || "Invalid value"}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john.doe@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Password {isEdit && "(leave blank to keep current)"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={isEdit ? "••••••••" : "Enter password"}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 234 567 8900" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Role & Status */}
          <Card>
            <CardHeader>
              <CardTitle>Role & Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="banned">Banned</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role_ids"
                render={() => (
                  <FormItem>
                    <FormLabel>Roles</FormLabel>
                    <FormDescription>
                      Select one or more roles for this user
                    </FormDescription>
                    {isLoadingRoles ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      </div>
                    ) : (
                      <div className="space-y-2 border rounded-md p-4 max-h-64 overflow-y-auto">
                        {roles.map((role) => (
                          <FormField
                            key={role.id}
                            control={form.control}
                            name="role_ids"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={role.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(role.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                            ...field.value,
                                            role.id,
                                          ])
                                          : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== role.id,
                                            ),
                                          );
                                      }}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="font-normal">
                                      {role.name}
                                    </FormLabel>
                                    {role.description && (
                                      <FormDescription className="text-xs">
                                        {role.description}
                                      </FormDescription>
                                    )}
                                  </div>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingDepartments ? (
                          <div className="flex items-center justify-center py-4">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        ) : departments.length > 0 ? (
                          departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.code}>
                              {dept.name} ({dept.code})
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>
                            No departments available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Software Engineer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" asChild>
            <Link href="/dashboard/users">Cancel</Link>
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            onClick={handleSubmitClick}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : isEdit ? (
              <Save className="w-4 h-4 mr-2" />
            ) : (
              <UserPlus className="w-4 h-4 mr-2" />
            )}
            {isEdit ? "Update User" : "Create User"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export { UserFormSchema };
