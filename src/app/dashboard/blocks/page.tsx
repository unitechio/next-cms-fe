'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { blockService } from '@/features/blocks/services/block.service';
import { Block } from '@/features/pages/types';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/dialog';

export default function BlocksPage() {
    const router = useRouter();
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState<string>('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [blockToDelete, setBlockToDelete] = useState<string | null>(null);

    const loadBlocks = async () => {
        try {
            setLoading(true);
            const response = await blockService.getBlocks({
                page,
                limit: 10,
                search: search || undefined,
                category: category || undefined,
            });
            setBlocks(response.data || []);
            setTotalPages(response.pagination?.total_pages || 1);
        } catch (error) {
            toast.error('Failed to load blocks');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBlocks();
    }, [page, search, category]);

    const handleDelete = async () => {
        if (!blockToDelete) return;

        try {
            await blockService.deleteBlock(blockToDelete);
            toast.success('Block deleted successfully');
            loadBlocks();
        } catch (error) {
            toast.error('Failed to delete block');
            console.error(error);
        } finally {
            setDeleteDialogOpen(false);
            setBlockToDelete(null);
        }
    };

    const columns = [
        {
            accessorKey: 'id',
            header: 'ID',
            cell: ({ row }: any) => (
                <span className="font-mono text-xs">{row.original.id.slice(0, 8)}</span>
            ),
        },
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }: any) => (
                <div>
                    <div className="font-medium">{row.original.name}</div>
                    <div className="text-sm text-muted-foreground">{row.original.type}</div>
                </div>
            ),
        },
        {
            accessorKey: 'category',
            header: 'Category',
            cell: ({ row }: any) => (
                <Badge variant="outline">{row.original.category}</Badge>
            ),
        },
        {
            accessorKey: 'updated_at',
            header: 'Updated',
            cell: ({ row }: any) => (
                <span className="text-sm text-muted-foreground">
                    {format(new Date(row.original.updated_at), 'MMM d, yyyy')}
                </span>
            ),
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }: any) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/dashboard/blocks/${row.original.id}/edit`)}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setBlockToDelete(row.original.id);
                            setDeleteDialogOpen(true);
                        }}
                    >
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Blocks</h1>
                    <p className="text-muted-foreground">Manage reusable content blocks</p>
                </div>
                <Button onClick={() => router.push('/dashboard/blocks/new')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Block
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search blocks..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">All Categories</SelectItem>
                        <SelectItem value="Hero">Hero</SelectItem>
                        <SelectItem value="Content">Content</SelectItem>
                        <SelectItem value="Media">Media</SelectItem>
                        <SelectItem value="Commerce">Commerce</SelectItem>
                        <SelectItem value="Custom">Custom</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <DataTable
                columns={columns}
                data={blocks}
                loading={loading}
                pagination={{
                    page,
                    totalPages,
                    onPageChange: setPage,
                }}
            />

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Block</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this block? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
