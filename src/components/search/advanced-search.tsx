'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Search, Filter, X, Plus } from 'lucide-react';

interface SearchFilter {
    field: string;
    operator: string;
    value: string;
}

interface AdvancedSearchProps {
    onSearch: (query: string, filters: SearchFilter[]) => void;
    fields?: Array<{ value: string; label: string }>;
    placeholder?: string;
}

const OPERATORS = [
    { value: 'equals', label: 'Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'starts_with', label: 'Starts with' },
    { value: 'ends_with', label: 'Ends with' },
    { value: 'greater_than', label: 'Greater than' },
    { value: 'less_than', label: 'Less than' },
];

const DEFAULT_FIELDS = [
    { value: 'name', label: 'Name' },
    { value: 'email', label: 'Email' },
    { value: 'role', label: 'Role' },
    { value: 'status', label: 'Status' },
    { value: 'created_at', label: 'Created Date' },
];

export function AdvancedSearch({
    onSearch,
    fields = DEFAULT_FIELDS,
    placeholder = 'Search...'
}: AdvancedSearchProps) {
    const [query, setQuery] = useState('');
    const [filters, setFilters] = useState<SearchFilter[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [currentFilter, setCurrentFilter] = useState<SearchFilter>({
        field: fields[0]?.value || '',
        operator: 'contains',
        value: '',
    });

    const handleAddFilter = () => {
        if (currentFilter.field && currentFilter.value) {
            setFilters([...filters, currentFilter]);
            setCurrentFilter({
                field: fields[0]?.value || '',
                operator: 'contains',
                value: '',
            });
            setIsFilterOpen(false);
        }
    };

    const handleRemoveFilter = (index: number) => {
        setFilters(filters.filter((_, i) => i !== index));
    };

    const handleSearch = () => {
        onSearch(query, filters);
    };

    const handleClearAll = () => {
        setQuery('');
        setFilters([]);
        onSearch('', []);
    };

    const getFieldLabel = (value: string) => {
        return fields.find(f => f.value === value)?.label || value;
    };

    const getOperatorLabel = (value: string) => {
        return OPERATORS.find(o => o.value === value)?.label || value;
    };

    return (
        <div className="space-y-3">
            {/* Search Bar */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={placeholder}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="pl-9"
                    />
                </div>

                <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="icon" className="relative">
                            <Filter className="h-4 w-4" />
                            {filters.length > 0 && (
                                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                                    {filters.length}
                                </span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="end">
                        <div className="space-y-4">
                            <div className="font-medium text-sm">Add Filter</div>

                            <div className="space-y-3">
                                <div className="space-y-2">
                                    <Label>Field</Label>
                                    <Select
                                        value={currentFilter.field}
                                        onValueChange={(value) =>
                                            setCurrentFilter({ ...currentFilter, field: value })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {fields.map((field) => (
                                                <SelectItem key={field.value} value={field.value}>
                                                    {field.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Operator</Label>
                                    <Select
                                        value={currentFilter.operator}
                                        onValueChange={(value) =>
                                            setCurrentFilter({ ...currentFilter, operator: value })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {OPERATORS.map((op) => (
                                                <SelectItem key={op.value} value={op.value}>
                                                    {op.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Value</Label>
                                    <Input
                                        placeholder="Enter value"
                                        value={currentFilter.value}
                                        onChange={(e) =>
                                            setCurrentFilter({ ...currentFilter, value: e.target.value })
                                        }
                                    />
                                </div>
                            </div>

                            <Button onClick={handleAddFilter} className="w-full">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Filter
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>

                <Button onClick={handleSearch}>Search</Button>

                {(query || filters.length > 0) && (
                    <Button variant="ghost" size="icon" onClick={handleClearAll}>
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* Active Filters */}
            {filters.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {filters.map((filter, index) => (
                        <Badge key={index} variant="secondary" className="gap-2">
                            <span className="font-medium">{getFieldLabel(filter.field)}</span>
                            <span className="text-muted-foreground">{getOperatorLabel(filter.operator)}</span>
                            <span>{filter.value}</span>
                            <button
                                onClick={() => handleRemoveFilter(index)}
                                className="ml-1 hover:text-destructive"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    );
}
