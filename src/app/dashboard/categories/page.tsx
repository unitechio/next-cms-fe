"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CategoryTree, CategoryType } from "@/features/categories/types";
import { categoryService } from "@/features/categories/services/category.service";
import { CategoryTreeView } from "@/features/categories/components/category-tree";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryTree[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [deleteCategory, setDeleteCategory] = useState<CategoryTree | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const type = activeTab === "all" ? undefined : (activeTab as CategoryType);
      const data = await categoryService.getCategoryTree(type);
      setCategories(data || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast.error("Failed to fetch categories");
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleEdit = (category: CategoryTree) => {
    router.push(`/dashboard/categories/${category.id}/edit`);
  };

  const handleDelete = (category: CategoryTree) => {
    setDeleteCategory(category);
  };

  const confirmDelete = async () => {
    if (!deleteCategory) return;

    try {
      await categoryService.deleteCategory(deleteCategory.id);
      toast.success("Category deleted successfully");
      setDeleteCategory(null);
      fetchCategories();
    } catch (error: any) {
      console.error("Failed to delete category:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to delete category";
      toast.error(errorMessage);
    }
  };

  const handleAddChild = (parent: CategoryTree) => {
    router.push(`/dashboard/categories/new?parent_id=${parent.id}`);
  };

  // Filter categories by search
  const filterCategories = (cats: CategoryTree[]): CategoryTree[] => {
    if (!search) return cats;

    return cats
      .map((cat) => {
        const matchesSearch = cat.name
          .toLowerCase()
          .includes(search.toLowerCase());
        const filteredChildren = filterCategories(cat.children || []);

        if (matchesSearch || filteredChildren.length > 0) {
          return {
            ...cat,
            children: filteredChildren,
          };
        }
        return null;
      })
      .filter((cat): cat is CategoryTree => cat !== null);
  };

  const filteredCategories = filterCategories(categories);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Categories</h1>
          <p className="text-muted-foreground">
            Manage categories for blog posts and navigation menus
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/categories/new">
            <Plus className="w-4 h-4 mr-2" />
            Create Category
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="header">Header</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
          <TabsTrigger value="sidebar">Sidebar</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="border rounded-lg p-4">
              <CategoryTreeView
                categories={filteredCategories}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAddChild={handleAddChild}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteCategory}
        onOpenChange={(open) => !open && setDeleteCategory(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the category &quot;{deleteCategory?.name}&quot;.
              {deleteCategory?.children && deleteCategory.children.length > 0 && (
                <span className="block mt-2 text-destructive font-medium">
                  Warning: This category has {deleteCategory.children.length} child
                  {deleteCategory.children.length === 1 ? "" : "ren"}. They will also be
                  deleted.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
