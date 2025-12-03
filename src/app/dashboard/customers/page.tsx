'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/ui/data-table';
import { customerService } from '@/features/customers/services/customer.service';
import { Customer } from '@/features/customers/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, MoreVertical } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import Link from 'next/link';
import { format } from 'date-fns';

export default function CustomersPage() {
    const router = useRouter();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({});

    const fetchCustomers = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await customerService.getCustomers({
                page,
                limit: pageSize,
                ...filters,
            });
            setCustomers(response.data || []);
            setTotalPages(response.totalPages || 1);
        } catch (error) {
            console.error('Failed to fetch customers:', error);
            toast.error('Failed to fetch customers');
            setCustomers([]);
        } finally {
            setIsLoading(false);
        }
    }, [page, pageSize, filters]);

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchCustomers();
        }, 300);
        return () => clearTimeout(debounce);
    }, [fetchCustomers]);

    const handleDelete = async (customerId: number) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try {
                await customerService.deleteCustomer(customerId);
                toast.success('Customer deleted successfully');
                fetchCustomers();
            } catch (error) {
                toast.error('Failed to delete customer');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Customers</h1>
                    <p className="text-muted-foreground">Manage your customer database.</p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/customers/new">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Customer
                    </Link>
                </Button>
            </div>

            <DataTable
                data={customers}
                isLoading={isLoading}
                pagination={{
                    currentPage: page,
                    totalPages: totalPages,
                    onPageChange: setPage,
                    pageSize: pageSize,
                    onPageSizeChange: (size) => {
                        setPageSize(size);
                        setPage(1);
                    },
                    showPageSize: true,
                    showFirstLast: true,
                }}
                columns={[
                    {
                        header: 'Name',
                        cell: (customer) => (
                            <div>
                                <div className="font-medium">
                                    {customer.first_name} {customer.last_name}
                                </div>
                                <div className="text-sm text-muted-foreground">{customer.email}</div>
                            </div>
                        ),
                    },
                    {
                        header: 'Company',
                        cell: (customer) => (
                            <span className="text-sm">{customer.company || '-'}</span>
                        ),
                    },
                    {
                        header: 'Phone',
                        cell: (customer) => (
                            <span className="text-sm">{customer.phone || '-'}</span>
                        ),
                    },
                    {
                        header: 'Status',
                        cell: (customer) => (
                            <Badge
                                variant={
                                    customer.status === 'active'
                                        ? 'default'
                                        : customer.status === 'inactive'
                                            ? 'secondary'
                                            : 'outline'
                                }
                                className="capitalize"
                            >
                                {customer.status}
                            </Badge>
                        ),
                    },
                    {
                        header: 'Created',
                        cell: (customer) => (
                            <span className="text-sm text-muted-foreground">
                                {format(new Date(customer.created_at), 'MMM d, yyyy')}
                            </span>
                        ),
                    },
                    {
                        header: 'Actions',
                        cell: (customer) => (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem
                                        onClick={() => router.push(`/dashboard/customers/${customer.id}`)}
                                    >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-destructive"
                                        onClick={() => handleDelete(customer.id)}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ),
                    },
                ]}
            />
        </div>
    );
}
