'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Filter, X } from 'lucide-react';
import { format } from 'date-fns';
import { ActivityTypes, ActivityCategories } from '../types';

interface ActivityFiltersProps {
    onFilterChange: (filters: {
        activity?: string;
        category?: string;
        startDate?: string;
        endDate?: string;
    }) => void;
}

export function ActivityFilters({ onFilterChange }: ActivityFiltersProps) {
    const [activity, setActivity] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const [isOpen, setIsOpen] = useState(false);

    const handleApply = () => {
        onFilterChange({
            activity: activity || undefined,
            category: category || undefined,
            startDate: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
            endDate: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
        });
        setIsOpen(false);
    };

    const handleReset = () => {
        setActivity('');
        setCategory('');
        setStartDate(undefined);
        setEndDate(undefined);
        onFilterChange({});
    };

    const hasFilters = activity || category || startDate || endDate;

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="relative">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {hasFilters && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                            {[activity, category, startDate, endDate].filter(Boolean).length}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">Filters</h4>
                        {hasFilters && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleReset}
                                className="h-auto p-1 text-xs"
                            >
                                <X className="h-3 w-3 mr-1" />
                                Clear
                            </Button>
                        )}
                    </div>

                    {/* Activity Type */}
                    <div className="space-y-2">
                        <Label htmlFor="activity">Activity Type</Label>
                        <Select value={activity} onValueChange={setActivity}>
                            <SelectTrigger id="activity">
                                <SelectValue placeholder="All activities" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All activities</SelectItem>
                                {Object.entries(ActivityTypes).map(([key, value]) => (
                                    <SelectItem key={key} value={value}>
                                        {value}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger id="category">
                                <SelectValue placeholder="All categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All categories</SelectItem>
                                {Object.entries(ActivityCategories).map(([key, value]) => (
                                    <SelectItem key={key} value={value}>
                                        {value}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Date Range */}
                    <div className="space-y-2">
                        <Label>Date Range</Label>
                        <div className="grid gap-2">
                            <div className="space-y-1">
                                <Label htmlFor="start-date" className="text-xs text-muted-foreground">
                                    Start Date
                                </Label>
                                <Input
                                    id="start-date"
                                    type="date"
                                    value={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
                                    onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : undefined)}
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="end-date" className="text-xs text-muted-foreground">
                                    End Date
                                </Label>
                                <Input
                                    id="end-date"
                                    type="date"
                                    value={endDate ? format(endDate, 'yyyy-MM-dd') : ''}
                                    onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : undefined)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                        <Button onClick={handleApply} className="flex-1">
                            Apply Filters
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
