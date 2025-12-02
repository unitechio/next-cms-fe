'use client';

import { useState, useEffect } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { parseApiResponse } from '@/lib/api-utils';
import { permissionService } from '@/features/permissions/services/permission.service';
import { PermissionForm } from '@/features/permissions/components/permission-form';
import { Permission } from '@/features/roles/types';
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

export default function PermissionsPage() {
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const [formOpen, setFormOpen] = useState(false);
    const [selectedPermission, setSelectedPermission] = useState<Permission | undefined>();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [permissionToDelete, setPermissionToDelete] = useState<Permission | null>(null);

    const fetchPermissions = async () => {
        setLoading(true);
        try {
            const response = await permissionService.getPermissions({ page, limit: 100, search });
            const { data, totalPages: pages } = parseApiResponse<Permission>(response);
            setPermissions(data);
            setTotalPages(pages);
        } catch (error: any) {
            toast.error('Failed to load permissions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPermissions();
    }, [page, search]);

    const handleCreate = () => {
        setSelectedPermission(undefined);
        setFormOpen(true);
    };

    const handleEdit = (permission: Permission) => {
        setSelectedPermission(permission);
        setFormOpen(true);
    };

    const handleDeleteClick = (permission: Permission) => {
        setPermissionToDelete(permission);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!permissionToDelete) return;

        try {
            await permissionService.deletePermission(Number(permissionToDelete.id));
            toast.success('Permission deleted successfully');
            fetchPermissions();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete permission');
        } finally {
            setDeleteDialogOpen(false);
            setPermissionToDelete(null);
        }
    };

    const groupedPermissions = permissions.reduce((acc, perm) => {
        if (!acc[perm.resource]) {
            acc[perm.resource] = [];
        }
        acc[perm.resource].push(perm);
        return acc;
    }, {} as Record<string, Permission[]>);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Permissions</h1>
                    <p className="text-muted-foreground">
                        Manage system permissions and access control
                    </p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Permission
                </Button>
            </div>

            {/* Grouped by Resource */}
            <div className="space-y-6">
                {Object.entries(groupedPermissions).map(([resource, perms]) => (
                    <div key={resource} className="space-y-4">
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-semibold capitalize">{resource}</h2>
                            <Badge variant="secondary">{perms.length} permissions</Badge>
                        </div>

                        <DataTable
                            data={perms}
                            isLoading={loading}
                            columns={[
                                {
                                    header: 'Name',
                                    accessorKey: 'name',
                                    cell: (perm) => (
                                        <div className="font-mono text-sm">{perm.name}</div>
                                    ),
                                },
                                {
                                    header: 'Action',
                                    accessorKey: 'action',
                                    cell: (perm) => (
                                        <Badge variant="outline" className="capitalize">
                                            {perm.action}
                                        </Badge>
                                    ),
                                },
                                {
                                    header: 'Description',
                                    accessorKey: 'description',
                                    cell: (perm) => (
                                        <span className="text-sm text-muted-foreground">
                                            {perm.description || '-'}
                                        </span>
                                    ),
                                },
                                {
                                    header: 'Actions',
                                    cell: (perm) => (
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => handleEdit(perm)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(perm)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    ),
                                },
                            ]}
                        />
                    </div>
                ))}

                {permissions.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">No permissions found</p>
                        <Button onClick={handleCreate}>
                            <Plus className="h-4 w-4 mr-2" />
                            Create First Permission
                        </Button>
                    </div>
                )}
            </div>

            {/* Permission Form Dialog */}
            <PermissionForm
                permission={selectedPermission}
                open={formOpen}
                onOpenChange={setFormOpen}
                onSuccess={fetchPermissions}
            />

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Permission</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete the permission "{permissionToDelete?.name}"?
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
