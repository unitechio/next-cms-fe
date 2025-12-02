'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Role {
    id: string;
    name: string;
    description: string;
    permissions: Array<{
        id: string;
        name: string;
        resource: string;
    }>;
}

interface RoleCloneProps {
    role: Role;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: (newRole: Role) => void;
}

export function RoleClone({ role, open, onOpenChange, onSuccess }: RoleCloneProps) {
    const [name, setName] = useState(`${role.name} (Copy)`);
    const [description, setDescription] = useState(role.description);
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
        role.permissions.map(p => p.id)
    );
    const [cloning, setCloning] = useState(false);

    const handleTogglePermission = (permissionId: string) => {
        setSelectedPermissions(prev =>
            prev.includes(permissionId)
                ? prev.filter(id => id !== permissionId)
                : [...prev, permissionId]
        );
    };

    const handleSelectAll = () => {
        if (selectedPermissions.length === role.permissions.length) {
            setSelectedPermissions([]);
        } else {
            setSelectedPermissions(role.permissions.map(p => p.id));
        }
    };

    const handleClone = async () => {
        if (!name.trim()) {
            toast.error('Please enter a role name');
            return;
        }

        if (selectedPermissions.length === 0) {
            toast.error('Please select at least one permission');
            return;
        }

        setCloning(true);

        try {
            // TODO: Replace with actual API call
            // const response = await roleService.cloneRole(role.id, {
            //   name,
            //   description,
            //   permissions: selectedPermissions,
            // });

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            const newRole: Role = {
                id: Date.now().toString(),
                name,
                description,
                permissions: role.permissions.filter(p => selectedPermissions.includes(p.id)),
            };

            toast.success(`Role "${name}" created successfully`);
            onSuccess?.(newRole);
            onOpenChange(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to clone role');
        } finally {
            setCloning(false);
        }
    };

    // Group permissions by resource
    const groupedPermissions = role.permissions.reduce((acc, perm) => {
        if (!acc[perm.resource]) {
            acc[perm.resource] = [];
        }
        acc[perm.resource].push(perm);
        return acc;
    }, {} as Record<string, typeof role.permissions>);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Copy className="h-5 w-5" />
                        Clone Role: {role.name}
                    </DialogTitle>
                    <DialogDescription>
                        Create a new role based on this one
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Role Name</Label>
                        <Input
                            id="name"
                            placeholder="Enter role name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Enter role description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        />
                    </div>

                    {/* Permissions */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label>Permissions ({selectedPermissions.length}/{role.permissions.length})</Label>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleSelectAll}
                            >
                                {selectedPermissions.length === role.permissions.length ? 'Deselect All' : 'Select All'}
                            </Button>
                        </div>

                        <ScrollArea className="h-[300px] rounded-md border p-4">
                            <div className="space-y-4">
                                {Object.entries(groupedPermissions).map(([resource, permissions]) => (
                                    <div key={resource} className="space-y-2">
                                        <div className="font-medium text-sm capitalize flex items-center gap-2">
                                            {resource}
                                            <Badge variant="secondary" className="text-xs">
                                                {permissions.filter(p => selectedPermissions.includes(p.id)).length}/{permissions.length}
                                            </Badge>
                                        </div>
                                        <div className="space-y-2 pl-4">
                                            {permissions.map((permission) => (
                                                <div key={permission.id} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={permission.id}
                                                        checked={selectedPermissions.includes(permission.id)}
                                                        onCheckedChange={() => handleTogglePermission(permission.id)}
                                                    />
                                                    <label
                                                        htmlFor={permission.id}
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                    >
                                                        {permission.name}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleClone} disabled={cloning}>
                        {cloning ? (
                            <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                                Cloning...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Clone Role
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
