"use client";

import { useState } from "react";
import { CategoryTree } from "../types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ChevronDown,
    ChevronRight,
    Edit,
    Trash2,
    Plus,
    GripVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CategoryTreeViewProps {
    categories: CategoryTree[];
    onEdit?: (category: CategoryTree) => void;
    onDelete?: (category: CategoryTree) => void;
    onAddChild?: (parent: CategoryTree) => void;
    level?: number;
}

export function CategoryTreeView({
    categories,
    onEdit,
    onDelete,
    onAddChild,
    level = 0,
}: CategoryTreeViewProps) {
    const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

    const toggleExpand = (id: number) => {
        const newExpanded = new Set(expandedIds);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedIds(newExpanded);
    };

    if (categories.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <p>No categories found</p>
                <p className="text-sm mt-2">Create your first category to get started</p>
            </div>
        );
    }

    return (
        <div className="space-y-1">
            {categories.map((category) => {
                const hasChildren = category.children && category.children.length > 0;
                const isExpanded = expandedIds.has(category.id);

                return (
                    <div key={category.id}>
                        <div
                            className={cn(
                                "group flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors",
                                level > 0 && "ml-6"
                            )}
                            style={{ paddingLeft: `${level * 1.5}rem` }}
                        >
                            {/* Expand/Collapse Button */}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => toggleExpand(category.id)}
                                disabled={!hasChildren}
                            >
                                {hasChildren ? (
                                    isExpanded ? (
                                        <ChevronDown className="h-4 w-4" />
                                    ) : (
                                        <ChevronRight className="h-4 w-4" />
                                    )
                                ) : (
                                    <div className="h-4 w-4" />
                                )}
                            </Button>

                            {/* Drag Handle */}
                            <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />

                            {/* Category Info */}
                            <div className="flex-1 flex items-center gap-3">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium truncate">{category.name}</span>
                                        <Badge
                                            variant={category.status === "active" ? "default" : "secondary"}
                                            className="text-xs"
                                        >
                                            {category.status}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs capitalize">
                                            {category.type}
                                        </Badge>
                                    </div>
                                    <div className="text-xs text-muted-foreground truncate">
                                        /{category.slug}
                                        {hasChildren && (
                                            <span className="ml-2">
                                                ({category.children.length} {category.children.length === 1 ? "child" : "children"})
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={() => onAddChild?.(category)}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => onEdit?.(category)}>
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onAddChild?.(category)}>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add Child
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="text-destructive"
                                                onClick={() => onDelete?.(category)}
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </div>

                        {/* Render Children */}
                        {hasChildren && isExpanded && (
                            <CategoryTreeView
                                categories={category.children}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onAddChild={onAddChild}
                                level={level + 1}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
