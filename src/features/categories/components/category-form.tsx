"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from "../types";
import { categoryService } from "../services/category.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required"),
    description: z.string().optional(),
    parent_id: z.union([z.number(), z.string()]).optional().nullable(),
    order: z.number().min(0).default(0),
    type: z.enum(["blog", "header", "footer", "sidebar"]),
    status: z.enum(["active", "inactive"]),
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
    initialData?: Category;
}

export function CategoryForm({ initialData }: CategoryFormProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
            ? {
                name: initialData.name,
                slug: initialData.slug,
                description: initialData.description || "",
                parent_id: initialData.parent_id || null,
                order: initialData.order,
                type: initialData.type,
                status: initialData.status,
            }
            : {
                name: "",
                slug: "",
                description: "",
                parent_id: null,
                order: 0,
                type: "blog",
                status: "active",
            },
    });

    // Fetch categories for parent selection
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoryService.getCategories({
                    page: 1,
                    limit: 100,
                    status: "active",
                });
                const data = Array.isArray(response) ? response : response.data || [];
                // Filter out current category to prevent self-parenting
                const filtered = initialData
                    ? data.filter((cat) => cat.id !== initialData.id)
                    : data;
                setCategories(filtered);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
                toast.error("Failed to load categories");
            } finally {
                setIsLoadingCategories(false);
            }
        };
        fetchCategories();
    }, [initialData]);

    // Auto-generate slug from name
    useEffect(() => {
        const subscription = form.watch((value, { name }) => {
            if (name === "name" && value.name && !initialData) {
                const slug = value.name
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
                    .replace(/đ/g, "d")
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)/g, "");
                form.setValue("slug", slug);
            }
        });
        return () => subscription.unsubscribe();
    }, [form, initialData]);

    const onSubmit = async (values: CategoryFormValues) => {
        setIsSaving(true);
        try {
            const payload: CreateCategoryRequest | UpdateCategoryRequest = {
                ...values,
                parent_id: values.parent_id === "null" || values.parent_id === ""
                    ? null
                    : values.parent_id ? Number(values.parent_id) : null,
            };

            if (initialData) {
                await categoryService.updateCategory(initialData.id, payload);
                toast.success("Category updated successfully");
            } else {
                await categoryService.createCategory(payload as CreateCategoryRequest);
                toast.success("Category created successfully");
            }
            router.push("/dashboard/categories");
            router.refresh();
        } catch (error: any) {
            console.error("Failed to save category:", error);
            const errorMessage = error.response?.data?.message || "Failed to save category";
            toast.error(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Technology" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Slug</FormLabel>
                                <FormControl>
                                    <Input placeholder="technology" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Auto-generated from name, but you can customize it
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Brief description of this category"
                                    {...field}
                                    rows={3}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="blog">Blog</SelectItem>
                                        <SelectItem value="header">Header Menu</SelectItem>
                                        <SelectItem value="footer">Footer Menu</SelectItem>
                                        <SelectItem value="sidebar">Sidebar Menu</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="parent_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Parent Category (Optional)</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value?.toString() || "null"}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select parent category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {isLoadingCategories ? (
                                            <div className="flex items-center justify-center py-4">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            </div>
                                        ) : (
                                            <>
                                                <SelectItem value="null">None (Root Level)</SelectItem>
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat.id} value={cat.id.toString()}>
                                                        {cat.name}
                                                    </SelectItem>
                                                ))}
                                            </>
                                        )}
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Leave empty for root level category
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="order"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Order</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min="0"
                                        {...field}
                                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Lower numbers appear first
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex gap-4">
                    <Button type="submit" disabled={isSaving}>
                        {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {initialData ? "Update Category" : "Create Category"}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/dashboard/categories")}
                        disabled={isSaving}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    );
}
