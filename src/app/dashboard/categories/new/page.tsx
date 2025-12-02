import { CategoryForm } from "@/features/categories/components/category-form";

export default function NewCategoryPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Create Category</h1>
                <p className="text-muted-foreground">
                    Add a new category for organizing your content
                </p>
            </div>

            <div className="max-w-3xl">
                <CategoryForm />
            </div>
        </div>
    );
}
