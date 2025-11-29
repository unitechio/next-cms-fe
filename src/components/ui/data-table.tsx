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
import { ChevronLeft, ChevronRight, Loader2, Search } from "lucide-react";
import React from "react";


interface Column<T> {
    header: string;
    accessorKey?: keyof T;
    cell?: (item: T) => React.ReactNode;
    className?: string;
}

import { Checkbox } from "@/components/ui/checkbox";

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    isLoading?: boolean;
    pagination?: {
        currentPage: number;
        totalPages: number;
        onPageChange: (page: number) => void;
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
    data,
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
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            onSelectionChange?.(data.map((item) => item.id));
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

    const allSelected = data.length > 0 && data.every((item) => selectedIds.includes(item.id));
    const someSelected = data.some((item) => selectedIds.includes(item.id)) && !allSelected;

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
                        ) : data.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length + (enableSelection ? 1 : 0)}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((item) => (
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
            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-2">
                    <div className="text-sm text-muted-foreground">
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                pagination.onPageChange(pagination.currentPage - 1)
                            }
                            disabled={pagination.currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                pagination.onPageChange(pagination.currentPage + 1)
                            }
                            disabled={pagination.currentPage === pagination.totalPages}
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
