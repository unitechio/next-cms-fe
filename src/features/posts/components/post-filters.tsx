'use client';

import { useState, useEffect } from 'react';
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
import { PostFilters as FilterType } from '../types';
import { userService } from '@/features/users/services/user.service';
import { User } from '@/features/users/types';

interface PostFiltersProps {
    onFilterChange: (filters: Partial<FilterType>) => void;
}

export function PostFilters({ onFilterChange }: PostFiltersProps) {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<string>('all');
    const [authorId, setAuthorId] = useState<string>('all');
    const [authors, setAuthors] = useState<User[]>([]);

    useEffect(() => {
        const fetchAuthors = async () => {
            try {
                const response = await userService.getUsers({ page: 1, limit: 100 });
                // Handle both array and paginated response formats
                const users = Array.isArray(response) ? response : (response as any).data || [];
                setAuthors(users);
            } catch (error) {
                console.error('Failed to fetch authors:', error);
            }
        };
        fetchAuthors();
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        onFilterChange({ search: e.target.value });
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        onFilterChange({ status: value === 'all' ? undefined : value });
    };

    const handleAuthorChange = (value: string) => {
        setAuthorId(value);
        onFilterChange({ author_id: value === 'all' ? undefined : value });
    };

    const clearFilters = () => {
        setSearch('');
        setStatus('all');
        setAuthorId('all');
        onFilterChange({ search: '', status: undefined, author_id: undefined });
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search posts..."
                    value={search}
                    onChange={handleSearchChange}
                    className="pl-9"
                />
            </div>
            <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
            </Select>
            <Select value={authorId} onValueChange={handleAuthorChange}>
                <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Author" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Authors</SelectItem>
                    {authors.map((author) => (
                        <SelectItem key={author.id} value={author.id}>
                            {author.first_name} {author.last_name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {(search || status !== 'all' || authorId !== 'all') && (
                <Button variant="ghost" onClick={clearFilters} className="px-3">
                    <X className="w-4 h-4 mr-2" />
                    Clear
                </Button>
            )}
        </div>
    );
}
