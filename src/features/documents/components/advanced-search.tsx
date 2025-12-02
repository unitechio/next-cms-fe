// Advanced Search Component
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface AdvancedSearchProps {
    onSearch: (filters: SearchFilters) => void;
}

export interface SearchFilters {
    query?: string;
    tags?: string[];
    dateFrom?: Date;
    dateTo?: Date;
    fileType?: string;
    minSize?: number;
    maxSize?: number;
}

export function AdvancedSearch({ onSearch }: AdvancedSearchProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [dateFrom, setDateFrom] = useState<Date>();
    const [dateTo, setDateTo] = useState<Date>();
    const [fileType, setFileType] = useState('all');
    const [minSize, setMinSize] = useState('');
    const [maxSize, setMaxSize] = useState('');

    const handleSearch = () => {
        const filters: SearchFilters = {
            query: query || undefined,
            dateFrom,
            dateTo,
            fileType: fileType !== 'all' ? fileType : undefined,
            minSize: minSize ? parseInt(minSize) : undefined,
            maxSize: maxSize ? parseInt(maxSize) : undefined,
        };
        onSearch(filters);
        setOpen(false);
    };

    const handleReset = () => {
        setQuery('');
        setDateFrom(undefined);
        setDateTo(undefined);
        setFileType('all');
        setMinSize('');
        setMaxSize('');
        onSearch({});
    };

    const hasFilters = query || dateFrom || dateTo || fileType !== 'all' || minSize || maxSize;

    return (
        <div className="flex gap-2">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search documents..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSearch();
                    }}
                    className="pl-9"
                />
            </div>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="icon">
                        <SlidersHorizontal className="w-4 h-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                    <div className="space-y-4">
                        <h4 className="font-medium">Advanced Search</h4>

                        {/* Date Range */}
                        <div className="space-y-2">
                            <Label>Date Range</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" size="sm" className="justify-start text-left font-normal">
                                            {dateFrom ? format(dateFrom, 'PP') : 'From'}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={dateFrom}
                                            onSelect={setDateFrom}
                                        />
                                    </PopoverContent>
                                </Popover>

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" size="sm" className="justify-start text-left font-normal">
                                            {dateTo ? format(dateTo, 'PP') : 'To'}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={dateTo}
                                            onSelect={setDateTo}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        {/* File Type */}
                        <div className="space-y-2">
                            <Label>File Type</Label>
                            <Select value={fileType} onValueChange={setFileType}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="image/">Images</SelectItem>
                                    <SelectItem value="application/pdf">PDF</SelectItem>
                                    <SelectItem value="application/msword">Word</SelectItem>
                                    <SelectItem value="application/vnd.ms-excel">Excel</SelectItem>
                                    <SelectItem value="video/">Videos</SelectItem>
                                    <SelectItem value="audio/">Audio</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* File Size */}
                        <div className="space-y-2">
                            <Label>File Size (MB)</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Input
                                    type="number"
                                    placeholder="Min"
                                    value={minSize}
                                    onChange={(e) => setMinSize(e.target.value)}
                                />
                                <Input
                                    type="number"
                                    placeholder="Max"
                                    value={maxSize}
                                    onChange={(e) => setMaxSize(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <Button className="flex-1" onClick={handleSearch}>
                                Search
                            </Button>
                            {hasFilters && (
                                <Button variant="outline" onClick={handleReset}>
                                    <X className="w-4 h-4 mr-2" />
                                    Reset
                                </Button>
                            )}
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
