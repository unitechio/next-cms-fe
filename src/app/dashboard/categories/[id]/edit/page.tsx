"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CategoryForm } from "@/features/categories/components/category-form";
import { categoryService } from "@/features/categories/services/category.service";
import { Category } from "@/features/categories/types";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function EditCategoryPage() {
    const params = useParams();
    const [category, setCategory] = useState<Category | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const id = parseInt(params.id as string);
                const data = await categoryService.getCategory(id);
                setCategory(data);
            } catch (error) {
                console.error("Failed to fetch category:", error);
                toast.error("Failed to load category");
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) {
            fetchCategory();
        }
    }, [params.id]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!category) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Category not found</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Edit Category</h1>
                <p className="text-muted-foreground">
                    Update category information
                </p>
            </div>

            <div className="max-w-3xl">
                <CategoryForm initialData={category} />
            </div>
        </div>
    );
}
