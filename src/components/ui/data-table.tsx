"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import React from "react";
import { Pagination } from "@/components/ui/pagination";
import { Checkbox } from "@/components/ui/checkbox";

interface Column<T> {
    header: string;
    accessorKey?: keyof T;
    cell?: (item: T) => React.ReactNode;
    className?: string;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    isLoading?: boolean;
    pagination?: {
        currentPage: number;
        totalPages: number;
        onPageChange: (page: number) => void;
        pageSize?: number;
        onPageSizeChange?: (size: number) => void;
        showPageSize?: boolean;
        showFirstLast?: boolean;
    };
    search?: {
        value: string;
        onChange: (value: string) => void;
        placeholder?: string;
    };
    actions?: React.ReactNode;
    enableSelection?: boolean;
    selectedIds?: (string | number)[];
    onSelectionChange?: (ids: (string | number)[]) => void;
    bulkActions?: React.ReactNode;
}

export function DataTable<T extends { id: string | number }>({
    data = [], // Default to empty array
    columns,
    isLoading,
    pagination,
    search,
    actions,
    enableSelection,
    selectedIds = [],
    onSelectionChange,
    bulkActions,
}: DataTableProps<T>) {
    // Ensure data is always an array
    const safeData = Array.isArray(data) ? data : [];

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            onSelectionChange?.(safeData.map((item) => item.id));
        } else {
            onSelectionChange?.([]);
        }
    };

    const handleSelectOne = (id: string | number, checked: boolean) => {
        if (checked) {
            onSelectionChange?.([...selectedIds, id]);
        } else {
            onSelectionChange?.(selectedIds.filter((selectedId) => selectedId !== id));
        }
    };

    const allSelected = safeData.length > 0 && safeData.every((item) => selectedIds.includes(item.id));
    const someSelected = safeData.length > 0 && safeData.some((item) => selectedIds.includes(item.id)) && !allSelected;

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    {search && (
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                type="text"
                                value={search.value}
                                onChange={(e) => search.onChange(e.target.value)}
                                placeholder={search.placeholder || "Search..."}
                                className="pl-9"
                            />
                        </div>
                    )}
                    {selectedIds.length > 0 && bulkActions && (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-5">
                            <div className="h-8 w-px bg-border mx-2" />
                            {bulkActions}
                            <span className="text-sm text-muted-foreground ml-2">
                                {selectedIds.length} selected
                            </span>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {actions}
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {enableSelection && (
                                <TableHead className="w-[40px]">
                                    <Checkbox
                                        checked={allSelected}
                                        onCheckedChange={handleSelectAll}
                                        aria-label="Select all"
                                    />
                                </TableHead>
                            )}
                            {columns.map((col, i) => (
                                <TableHead key={i} className={col.className}>
                                    {col.header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length + (enableSelection ? 1 : 0)}
                                    className="h-24 text-center"
                                >
                                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                                </TableCell>
                            </TableRow>
                        ) : safeData.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length + (enableSelection ? 1 : 0)}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        ) : (
                            safeData.map((item) => (
                                <TableRow key={item.id} data-state={selectedIds.includes(item.id) ? "selected" : undefined}>
                                    {enableSelection && (
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedIds.includes(item.id)}
                                                onCheckedChange={(checked) => handleSelectOne(item.id, checked as boolean)}
                                                aria-label={`Select row ${item.id}`}
                                            />
                                        </TableCell>
                                    )}
                                    {columns.map((col, i) => (
                                        <TableCell key={i}>
                                            {col.cell
                                                ? col.cell(item)
                                                : col.accessorKey
                                                    ? (item[col.accessorKey] as React.ReactNode)
                                                    : null}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {pagination && (
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={pagination.onPageChange}
                    pageSize={pagination.pageSize || 10}
                    onPageSizeChange={pagination.onPageSizeChange}
                    showPageSize={pagination.showPageSize ?? true}
                    showFirstLast={pagination.showFirstLast ?? true}
                />
            )}
        </div>
    );
}
