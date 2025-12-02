'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { EntityType } from '../types';

interface DocumentFiltersProps {
    onFilterChange: (filters: {
        search?: string;
        entityType?: string;
        documentType?: string;
        sortBy?: string;
        sortDir?: string;
    }) => void;
}

export function DocumentFilters({ onFilterChange }: DocumentFiltersProps) {
    const [search, setSearch] = useState('');
    const [entityType, setEntityType] = useState<string>('all');
    const [documentType, setDocumentType] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('created_at');
    const [sortDir, setSortDir] = useState<string>('desc');

    const handleSearchChange = (value: string) => {
        setSearch(value);
        applyFilters({ search: value });
    };

    const handleEntityTypeChange = (value: string) => {
        setEntityType(value);
        applyFilters({ entityType: value });
    };

    const handleDocumentTypeChange = (value: string) => {
        setDocumentType(value);
        applyFilters({ documentType: value });
    };

    const handleSortByChange = (value: string) => {
        setSortBy(value);
        applyFilters({ sortBy: value });
    };

    const handleSortDirChange = (value: string) => {
        setSortDir(value);
        applyFilters({ sortDir: value });
    };

    const applyFilters = (updates: {
        search?: string;
        entityType?: string;
        documentType?: string;
        sortBy?: string;
        sortDir?: string;
    }) => {
        const filters = {
            search,
            entityType: entityType !== 'all' ? entityType : undefined,
            documentType: documentType !== 'all' ? documentType : undefined,
            sortBy,
            sortDir,
            ...updates,
        };

        // Remove undefined values
        const cleanFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v !== undefined && v !== '')
        );

        onFilterChange(cleanFilters);
    };

    const handleClearFilters = () => {
        setSearch('');
        setEntityType('all');
        setDocumentType('all');
        setSortBy('created_at');
        setSortDir('desc');
        onFilterChange({});
    };

    const hasActiveFilters = search || entityType !== 'all' || documentType !== 'all';

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search documents..."
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pl-9"
                    />
                </div>

                {/* Entity Type Filter */}
                <Select value={entityType} onValueChange={handleEntityTypeChange}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Entity Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="post">Posts</SelectItem>
                        <SelectItem value="order">Orders</SelectItem>
                        <SelectItem value="customer">Customers</SelectItem>
                        <SelectItem value="contract">Contracts</SelectItem>
                        <SelectItem value="invoice">Invoices</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                </Select>

                {/* Document Type Filter */}
                <Select value={documentType} onValueChange={handleDocumentTypeChange}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="File Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Files</SelectItem>
                        <SelectItem value="image/">Images</SelectItem>
                        <SelectItem value="application/pdf">PDF</SelectItem>
                        <SelectItem value="application/msword">Word</SelectItem>
                        <SelectItem value="application/vnd.ms-excel">Excel</SelectItem>
                        <SelectItem value="text/">Text</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                {/* Sort Options */}
                <div className="flex gap-2 w-full sm:w-auto">
                    <Select value={sortBy} onValueChange={handleSortByChange}>
                        <SelectTrigger className="w-full sm:w-[160px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="created_at">Date Created</SelectItem>
                            <SelectItem value="updated_at">Date Modified</SelectItem>
                            <SelectItem value="document_name">Name</SelectItem>
                            <SelectItem value="file_size">Size</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={sortDir} onValueChange={handleSortDirChange}>
                        <SelectTrigger className="w-full sm:w-[140px]">
                            <SelectValue placeholder="Order" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="desc">Newest First</SelectItem>
                            <SelectItem value="asc">Oldest First</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearFilters}
                        className="w-full sm:w-auto"
                    >
                        <X className="w-4 h-4 mr-2" />
                        Clear Filters
                    </Button>
                )}
            </div>
        </div>
    );
}
