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

const AUDIT_ACTIONS = [
    'create',
    'read',
    'update',
    'delete',
    'login',
    'logout',
    'export',
    'import',
] as const;

const RESOURCES = [
    'users',
    'roles',
    'permissions',
    'posts',
    'media',
    'settings',
    'modules',
    'departments',
    'services',
] as const;

interface AuditLogFiltersProps {
    onFilterChange: (filters: {
        action?: string;
        resource?: string;
        userId?: string;
        startDate?: string;
        endDate?: string;
        statusCode?: string;
    }) => void;
}

export function AuditLogFilters({ onFilterChange }: AuditLogFiltersProps) {
    const [action, setAction] = useState<string>('');
    const [resource, setResource] = useState<string>('');
    const [userId, setUserId] = useState<string>('');
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const [statusCode, setStatusCode] = useState<string>('');
    const [isOpen, setIsOpen] = useState(false);

    const handleApply = () => {
        onFilterChange({
            action: action || undefined,
            resource: resource || undefined,
            userId: userId || undefined,
            startDate: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
            endDate: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
            statusCode: statusCode || undefined,
        });
        setIsOpen(false);
    };

    const handleReset = () => {
        setAction('');
        setResource('');
        setUserId('');
        setStartDate(undefined);
        setEndDate(undefined);
        setStatusCode('');
        onFilterChange({});
    };

    const hasFilters = action || resource || userId || startDate || endDate || statusCode;

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="relative">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {hasFilters && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                            {[action, resource, userId, startDate, endDate, statusCode].filter(Boolean).length}
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

                    {/* Action */}
                    <div className="space-y-2">
                        <Label htmlFor="action">Action</Label>
                        <Select value={action || "all"} onValueChange={(val) => setAction(val === "all" ? "" : val)}>
                            <SelectTrigger id="action">
                                <SelectValue placeholder="All actions" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All actions</SelectItem>
                                {AUDIT_ACTIONS.map((act) => (
                                    <SelectItem key={act} value={act}>
                                        {act.charAt(0).toUpperCase() + act.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Resource */}
                    <div className="space-y-2">
                        <Label htmlFor="resource">Resource</Label>
                        <Select value={resource || "all"} onValueChange={(val) => setResource(val === "all" ? "" : val)}>
                            <SelectTrigger id="resource">
                                <SelectValue placeholder="All resources" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All resources</SelectItem>
                                {RESOURCES.map((res) => (
                                    <SelectItem key={res} value={res}>
                                        {res.charAt(0).toUpperCase() + res.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* User ID */}
                    <div className="space-y-2">
                        <Label htmlFor="userId">User ID</Label>
                        <Input
                            id="userId"
                            placeholder="Enter user ID"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                        />
                    </div>

                    {/* Status Code */}
                    <div className="space-y-2">
                        <Label htmlFor="statusCode">Status Code</Label>
                        <Select value={statusCode || "all"} onValueChange={(val) => setStatusCode(val === "all" ? "" : val)}>
                            <SelectTrigger id="statusCode">
                                <SelectValue placeholder="All status codes" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All status codes</SelectItem>
                                <SelectItem value="2xx">2xx - Success</SelectItem>
                                <SelectItem value="3xx">3xx - Redirection</SelectItem>
                                <SelectItem value="4xx">4xx - Client Error</SelectItem>
                                <SelectItem value="5xx">5xx - Server Error</SelectItem>
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
