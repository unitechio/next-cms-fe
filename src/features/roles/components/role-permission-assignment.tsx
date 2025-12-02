'use client';

import { useState, useEffect } from 'react';
import { roleService } from '../services/role.service';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Loader2, Search } from 'lucide-react';
import { Permission } from '../types';

interface RolePermissionAssignmentProps {
    roleId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function RolePermissionAssignment({
    roleId,
    open,
    onOpenChange,
    onSuccess,
}: RolePermissionAssignmentProps) {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
    const [assignedPermissions, setAssignedPermissions] = useState<Set<string>>(new Set());
    const [pendingChanges, setPendingChanges] = useState<{
        toAdd: Set<string>;
        toRemove: Set<string>;
    }>({ toAdd: new Set(), toRemove: new Set() });

    useEffect(() => {
        if (open) {
            loadData();
        }
    }, [open, roleId]);

    const loadData = async () => {
        setLoading(true);
        try {
            // Load all permissions
            const allPermsResponse = await roleService.getPermissions();
            const allPerms = allPermsResponse.data || [];
            setAllPermissions(allPerms);

            // Load role's current permissions
            const rolePermsResponse = await roleService.getRolePermissions(roleId);
            const rolePerms = rolePermsResponse.data || [];
            const assignedIds = new Set(rolePerms.map((p: Permission) => p.id));
            setAssignedPermissions(assignedIds);

            // Reset pending changes
            setPendingChanges({ toAdd: new Set(), toRemove: new Set() });
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to load permissions');
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePermission = (permissionId: string) => {
        const isCurrentlyAssigned = assignedPermissions.has(permissionId);
        const isInToAdd = pendingChanges.toAdd.has(permissionId);
        const isInToRemove = pendingChanges.toRemove.has(permissionId);

        const newToAdd = new Set(pendingChanges.toAdd);
        const newToRemove = new Set(pendingChanges.toRemove);

        if (isCurrentlyAssigned) {
            // Permission is currently assigned
            if (isInToRemove) {
                // Cancel removal
                newToRemove.delete(permissionId);
            } else {
                // Mark for removal
                newToRemove.add(permissionId);
            }
        } else {
            // Permission is not currently assigned
            if (isInToAdd) {
                // Cancel addition
                newToAdd.delete(permissionId);
            } else {
                // Mark for addition
                newToAdd.add(permissionId);
            }
        }

        setPendingChanges({ toAdd: newToAdd, toRemove: newToRemove });
    };

    const isPermissionChecked = (permissionId: string) => {
        const isCurrentlyAssigned = assignedPermissions.has(permissionId);
        const isInToAdd = pendingChanges.toAdd.has(permissionId);
        const isInToRemove = pendingChanges.toRemove.has(permissionId);

        if (isCurrentlyAssigned) {
            return !isInToRemove;
        } else {
            return isInToAdd;
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Process removals
            for (const permId of pendingChanges.toRemove) {
                await roleService.removePermission(roleId, Number(permId));
            }

            // Process additions
            for (const permId of pendingChanges.toAdd) {
                await roleService.assignPermission(roleId, Number(permId));
            }

            toast.success('Permissions updated successfully');

            await loadData();
            onSuccess?.();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update permissions');
        } finally {
            setSaving(false);
        }
    };

    // Filter and group permissions
    const filteredPermissions = allPermissions.filter((perm) =>
        perm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        perm.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
        perm.action.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const groupedPermissions = filteredPermissions.reduce((acc, perm) => {
        const resource = perm.resource || 'Other';
        if (!acc[resource]) {
            acc[resource] = [];
        }
        acc[resource].push(perm);
        return acc;
    }, {} as Record<string, Permission[]>);

    const hasChanges = pendingChanges.toAdd.size > 0 || pendingChanges.toRemove.size > 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Manage Role Permissions</DialogTitle>
                    <DialogDescription>
                        Select permissions to assign to this role
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search permissions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    {/* Stats */}
                    <div className="flex gap-4 text-sm">
                        <div>
                            <span className="text-muted-foreground">Assigned:</span>{' '}
                            <Badge variant="secondary">
                                {assignedPermissions.size - pendingChanges.toRemove.size + pendingChanges.toAdd.size}
                            </Badge>
                        </div>
                        {hasChanges && (
                            <>
                                {pendingChanges.toAdd.size > 0 && (
                                    <div>
                                        <span className="text-muted-foreground">To Add:</span>{' '}
                                        <Badge variant="default">{pendingChanges.toAdd.size}</Badge>
                                    </div>
                                )}
                                {pendingChanges.toRemove.size > 0 && (
                                    <div>
                                        <span className="text-muted-foreground">To Remove:</span>{' '}
                                        <Badge variant="destructive">{pendingChanges.toRemove.size}</Badge>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Permissions List */}
                    <ScrollArea className="h-[400px] pr-4">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : Object.keys(groupedPermissions).length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-sm text-muted-foreground">
                                    No permissions found
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {Object.entries(groupedPermissions).map(([resource, perms]) => (
                                    <div key={resource}>
                                        <h4 className="text-sm font-semibold mb-3 text-foreground sticky top-0 bg-background py-2">
                                            {resource}
                                        </h4>
                                        <div className="space-y-2">
                                            {perms.map((perm) => {
                                                const isChecked = isPermissionChecked(perm.id);
                                                const isPending = pendingChanges.toAdd.has(perm.id) || pendingChanges.toRemove.has(perm.id);

                                                return (
                                                    <div
                                                        key={perm.id}
                                                        className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${isPending ? 'bg-accent border-primary' : 'bg-card hover:bg-accent/50'
                                                            }`}
                                                    >
                                                        <Checkbox
                                                            id={`perm-${perm.id}`}
                                                            checked={isChecked}
                                                            onCheckedChange={() => handleTogglePermission(perm.id)}
                                                        />
                                                        <label
                                                            htmlFor={`perm-${perm.id}`}
                                                            className="flex-1 cursor-pointer"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-medium text-sm">{perm.name}</span>
                                                                <Badge variant="outline" className="text-xs">
                                                                    {perm.action}
                                                                </Badge>
                                                                {isPending && (
                                                                    <Badge variant={pendingChanges.toAdd.has(perm.id) ? 'default' : 'destructive'} className="text-xs">
                                                                        {pendingChanges.toAdd.has(perm.id) ? 'Adding' : 'Removing'}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            {perm.description && (
                                                                <p className="text-xs text-muted-foreground mt-1">
                                                                    {perm.description}
                                                                </p>
                                                            )}
                                                        </label>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={!hasChanges || saving}>
                        {saving ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
