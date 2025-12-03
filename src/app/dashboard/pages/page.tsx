'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Pencil, Trash2, Copy, Layout } from 'lucide-react';
import { pageService } from '@/features/pages/services/page.service';
import { Page } from '@/features/pages/types';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function PagesPage() {
    const router = useRouter();
    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [pageToDelete, setPageToDelete] = useState<string | null>(null);

    const loadPages = async () => {
        try {
            setLoading(true);
            const response = await pageService.getPages({
                page,
                limit: pageSize,
                search: search || undefined,
            });
            setPages(response.data || []);
            setTotalPages(response.meta?.total_pages || 1);
        } catch (error) {
            toast.error('Failed to load pages');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPages();
    }, [page, pageSize, search]);

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setPage(1);
    };

    const handleDelete = async () => {
        if (!pageToDelete) return;

        try {
            await pageService.deletePage(pageToDelete);
            toast.success('Page deleted successfully');
            loadPages();
        } catch (error) {
            toast.error('Failed to delete page');
            console.error(error);
        } finally {
            setDeleteDialogOpen(false);
            setPageToDelete(null);
        }
    };

    const handleDuplicate = async (id: string) => {
        try {
            await pageService.duplicatePage(id);
            toast.success('Page duplicated successfully');
            loadPages();
        } catch (error) {
            toast.error('Failed to duplicate page');
            console.error(error);
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
            accessorKey: 'title',
            header: 'Title',
            cell: ({ row }: any) => (
                <div>
                    <div className="font-medium">{row.original.title}</div>
                    <div className="text-sm text-muted-foreground">/{row.original.slug}</div>
                </div>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }: any) => (
                <Badge variant={row.original.status === 'published' ? 'default' : 'secondary'}>
                    {row.original.status}
                </Badge>
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
                        onClick={() => router.push(`/dashboard/pages/${row.original.id}/builder`)}
                    >
                        <Layout className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/dashboard/pages/${row.original.id}/edit`)}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDuplicate(row.original.id)}
                    >
                        <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setPageToDelete(row.original.id);
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
                    <h1 className="text-3xl font-bold">Pages</h1>
                    <p className="text-muted-foreground">Manage your website pages</p>
                </div>
                <Button onClick={() => router.push('/dashboard/pages/new')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Page
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search pages..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            <DataTable
                columns={columns}
                data={pages}
                isLoading={loading}
                pagination={{
                    currentPage: page,
                    totalPages: totalPages,
                    onPageChange: setPage,
                    pageSize: pageSize,
                    onPageSizeChange: handlePageSizeChange,
                    showPageSize: true,
                    showFirstLast: true,
                }}
            />

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Page</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this page? This action cannot be undone.
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
