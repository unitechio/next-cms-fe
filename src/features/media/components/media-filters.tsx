'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import { MediaFilters as FilterType } from '../types';

interface MediaFiltersProps {
    onFilterChange: (filters: Partial<FilterType>) => void;
}

export function MediaFilters({ onFilterChange }: MediaFiltersProps) {
    const [search, setSearch] = useState('');
    const [type, setType] = useState<string>('all');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        onFilterChange({ search: e.target.value });
    };

    const handleTypeChange = (value: string) => {
        setType(value);
        onFilterChange({ type: value === 'all' ? undefined : value });
    };

    const clearFilters = () => {
        setSearch('');
        setType('all');
        onFilterChange({ search: '', type: undefined });
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search media..."
                    value={search}
                    onChange={handleSearchChange}
                    className="pl-9"
                />
            </div>
            <Select value={type} onValueChange={handleTypeChange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="File Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="image">Images</SelectItem>
                    <SelectItem value="video">Videos</SelectItem>
                    <SelectItem value="document">Documents</SelectItem>
                </SelectContent>
            </Select>
            {(search || type !== 'all') && (
                <Button variant="ghost" onClick={clearFilters} className="px-3">
                    <X className="w-4 h-4 mr-2" />
                    Clear
                </Button>
            )}
        </div>
    );
}
