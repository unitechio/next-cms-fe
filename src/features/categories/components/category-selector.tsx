"use client";

import { useEffect, useState } from "react";
import { Category, CategoryType } from "../types";
import { categoryService } from "../services/category.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { ChevronDown, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CategorySelectorProps {
    value?: number[];
    onChange?: (value: number[]) => void;
    type?: CategoryType;
    placeholder?: string;
    disabled?: boolean;
}

export function CategorySelector({
    value = [],
    onChange,
    type,
    placeholder = "Select categories",
    disabled = false,
}: CategorySelectorProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoryService.getCategories({
                    page: 1,
                    limit: 100,
                    status: "active",
                    type,
                });
                const data = Array.isArray(response) ? response : response.data || [];
                setCategories(data);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
                toast.error("Failed to load categories");
            } finally {
                setIsLoading(false);
            }
        };
        fetchCategories();
    }, [type]);

    const selectedCategories = categories.filter((cat) =>
        value.includes(cat.id)
    );

    const filteredCategories = categories.filter((cat) =>
        cat.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleToggle = (categoryId: number) => {
        const newValue = value.includes(categoryId)
            ? value.filter((id) => id !== categoryId)
            : [...value, categoryId];
        onChange?.(newValue);
    };

    const handleRemove = (categoryId: number) => {
        onChange?.(value.filter((id) => id !== categoryId));
    };

    const handleClear = () => {
        onChange?.([]);
    };

    return (
        <div className="space-y-2">
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={isOpen}
                        className="w-full justify-between"
                        disabled={disabled}
                    >
                        <span className="truncate">
                            {selectedCategories.length > 0
                                ? `${selectedCategories.length} selected`
                                : placeholder}
                        </span>
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                    <div className="p-2 border-b">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search categories..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto p-2">
                        {isLoading ? (
                            <div className="text-center py-4 text-sm text-muted-foreground">
                                Loading categories...
                            </div>
                        ) : filteredCategories.length === 0 ? (
                            <div className="text-center py-4 text-sm text-muted-foreground">
                                No categories found
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {filteredCategories.map((category) => (
                                    <div
                                        key={category.id}
                                        className={cn(
                                            "flex items-center space-x-2 rounded-md p-2 hover:bg-muted cursor-pointer",
                                            value.includes(category.id) && "bg-muted"
                                        )}
                                        onClick={() => handleToggle(category.id)}
                                    >
                                        <Checkbox
                                            checked={value.includes(category.id)}
                                            onCheckedChange={() => handleToggle(category.id)}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-sm truncate">
                                                {category.name}
                                            </div>
                                            <div className="text-xs text-muted-foreground truncate">
                                                /{category.slug}
                                            </div>
                                        </div>
                                        {category.type && (
                                            <Badge variant="outline" className="text-xs capitalize">
                                                {category.type}
                                            </Badge>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {selectedCategories.length > 0 && (
                        <div className="p-2 border-t">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full"
                                onClick={handleClear}
                            >
                                Clear All
                            </Button>
                        </div>
                    )}
                </PopoverContent>
            </Popover>

            {/* Selected Categories Display */}
            {selectedCategories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selectedCategories.map((category) => (
                        <Badge
                            key={category.id}
                            variant="secondary"
                            className="gap-1 pr-1"
                        >
                            {category.name}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 hover:bg-transparent"
                                onClick={() => handleRemove(category.id)}
                                disabled={disabled}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    );
}
