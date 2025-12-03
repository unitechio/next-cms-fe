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
    Folder,
    FolderOpen,
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
    isLastChild?: boolean;
    parentExpanded?: boolean;
}

export function CategoryTreeView({
    categories,
    onEdit,
    onDelete,
    onAddChild,
    level = 0,
    isLastChild = true,
    parentExpanded = true,
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
                <p className="text-base font-medium">No categories found</p>
                <p className="text-sm mt-2">Create your first category to get started</p>
            </div>
        );
    }

    // Get depth color based on level
    const getDepthColor = (depth: number) => {
        const colors = [
            "from-blue-500/5 to-blue-500/0",
            "from-purple-500/5 to-purple-500/0",
            "from-pink-500/5 to-pink-500/0",
            "from-orange-500/5 to-orange-500/0",
            "from-green-500/5 to-green-500/0",
        ];
        return colors[depth % colors.length];
    };

    // Get border color based on level
    const getBorderColor = (depth: number) => {
        const colors = [
            "border-blue-500/20",
            "border-purple-500/20",
            "border-pink-500/20",
            "border-orange-500/20",
            "border-green-500/20",
        ];
        return colors[depth % colors.length];
    };

    return (
        <div className="space-y-0.5">
            {categories.map((category, index) => {
                const hasChildren = category.children && category.children.length > 0;
                const isExpanded = expandedIds.has(category.id);
                const isLast = index === categories.length - 1;

                return (
                    <div
                        key={category.id}
                        className="relative"
                        style={{
                            animationDelay: `${index * 50}ms`,
                        }}
                    >
                        {/* Vertical Connection Line */}
                        {level > 0 && (
                            <div
                                className={cn(
                                    "absolute left-0 top-0 w-px bg-gradient-to-b transition-all duration-300",
                                    getBorderColor(level - 1),
                                    isLast ? "h-6" : "h-full"
                                )}
                                style={{
                                    left: `${(level - 1) * 1.5 + 0.75}rem`,
                                }}
                            />
                        )}

                        {/* Horizontal Connection Line */}
                        {level > 0 && (
                            <div
                                className={cn(
                                    "absolute top-6 h-px bg-gradient-to-r transition-all duration-300",
                                    getBorderColor(level - 1)
                                )}
                                style={{
                                    left: `${(level - 1) * 1.5 + 0.75}rem`,
                                    width: "0.75rem",
                                }}
                            />
                        )}

                        <div
                            className={cn(
                                "group relative flex items-center gap-2 p-3 rounded-lg transition-all duration-300",
                                "hover:shadow-md hover:scale-[1.01] hover:z-10",
                                "border border-transparent hover:border-border",
                                "bg-gradient-to-r",
                                getDepthColor(level)
                            )}
                            style={{
                                marginLeft: level > 0 ? `${level * 1.5}rem` : "0",
                            }}
                        >
                            {/* Expand/Collapse Button with Animation */}
                            <Button
                                variant="ghost"
                                size="sm"
                                className={cn(
                                    "h-7 w-7 p-0 transition-all duration-300",
                                    hasChildren && "hover:bg-primary/10 hover:scale-110"
                                )}
                                onClick={() => toggleExpand(category.id)}
                                disabled={!hasChildren}
                            >
                                {hasChildren ? (
                                    <ChevronRight
                                        className={cn(
                                            "h-4 w-4 transition-all duration-300",
                                            isExpanded && "rotate-90"
                                        )}
                                    />
                                ) : (
                                    <div className="h-4 w-4" />
                                )}
                            </Button>

                            {/* Folder Icon */}
                            <div className="flex-shrink-0">
                                {hasChildren ? (
                                    isExpanded ? (
                                        <FolderOpen className="h-5 w-5 text-primary transition-all duration-300" />
                                    ) : (
                                        <Folder className="h-5 w-5 text-muted-foreground transition-all duration-300" />
                                    )
                                ) : (
                                    <div className="h-5 w-5 rounded border-2 border-dashed border-muted-foreground/30" />
                                )}
                            </div>

                            {/* Drag Handle */}
                            <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-grab active:cursor-grabbing" />

                            {/* Category Info */}
                            <div className="flex-1 flex items-center gap-3 min-w-0">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-semibold truncate text-foreground">
                                            {category.name}
                                        </span>
                                        <Badge
                                            variant={category.status === "active" ? "default" : "secondary"}
                                            className="text-xs font-medium transition-all duration-300 hover:scale-105"
                                        >
                                            {category.status}
                                        </Badge>
                                        <Badge
                                            variant="outline"
                                            className="text-xs capitalize font-medium transition-all duration-300 hover:scale-105"
                                        >
                                            {category.type}
                                        </Badge>
                                        {hasChildren && (
                                            <Badge
                                                variant="secondary"
                                                className="text-xs font-medium bg-primary/10 text-primary transition-all duration-300 hover:scale-105"
                                            >
                                                {category.children.length} {category.children.length === 1 ? "child" : "children"}
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="text-xs text-muted-foreground truncate mt-1 font-mono">
                                        /{category.slug}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-110"
                                        onClick={() => onAddChild?.(category)}
                                        title="Add child category"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-110"
                                        onClick={() => onEdit?.(category)}
                                        title="Edit category"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive transition-all duration-300 hover:scale-110"
                                        onClick={() => onDelete?.(category)}
                                        title="Delete category"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Render Children with Smooth Animation */}
                        {hasChildren && (
                            <div
                                className={cn(
                                    "overflow-hidden transition-all duration-500 ease-in-out",
                                    isExpanded ? "max-h-[10000px] opacity-100" : "max-h-0 opacity-0"
                                )}
                            >
                                <div className={cn(
                                    "pt-1 transition-all duration-300",
                                    isExpanded && "animate-in slide-in-from-top-2"
                                )}>
                                    <CategoryTreeView
                                        categories={category.children}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                        onAddChild={onAddChild}
                                        level={level + 1}
                                        isLastChild={isLast}
                                        parentExpanded={isExpanded}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
