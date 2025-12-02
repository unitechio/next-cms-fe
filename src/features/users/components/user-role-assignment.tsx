'use client';

import { useState, useEffect } from 'react';
import { userService } from '../services/user.service';
import { roleService } from '@/features/roles/services/role.service';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, Plus, X } from 'lucide-react';

interface Role {
    id: string;
    name: string;
    description: string;
}

interface UserRoleAssignmentProps {
    userId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function UserRoleAssignment({
    userId,
    open,
    onOpenChange,
    onSuccess,
}: UserRoleAssignmentProps) {
    const [loading, setLoading] = useState(false);
    const [userRoles, setUserRoles] = useState<Role[]>([]);
    const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
    const [selectedRoleId, setSelectedRoleId] = useState<string>('');
    const [removing, setRemoving] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            loadData();
        }
    }, [open, userId]);

    const loadData = async () => {
        setLoading(true);
        try {
            // Load user's current roles
            const userRolesResponse = await userService.getUserRoles(userId);
            const roles = userRolesResponse.data || [];
            setUserRoles(roles);

            // Load all available roles
            const allRolesResponse = await roleService.getRoles({ page: 1, limit: 100 });
            const allRoles = allRolesResponse.data || [];

            // Filter out roles already assigned
            const assignedRoleIds = new Set(roles.map((r: Role) => r.id));
            const available = allRoles.filter((r: Role) => !assignedRoleIds.has(r.id));
            setAvailableRoles(available);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to load roles');
        } finally {
            setLoading(false);
        }
    };

    const handleAssignRole = async () => {
        if (!selectedRoleId) return;

        setLoading(true);
        try {
            await userService.assignRole(userId, Number(selectedRoleId));
            toast.success('Role assigned successfully');
            setSelectedRoleId('');
            await loadData();
            onSuccess?.();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to assign role');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveRole = async (roleId: string) => {
        setRemoving(roleId);
        try {
            await userService.removeRole(userId, Number(roleId));
            toast.success('Role removed successfully');
            await loadData();
            onSuccess?.();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to remove role');
        } finally {
            setRemoving(null);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Manage User Roles</DialogTitle>
                    <DialogDescription>
                        Assign or remove roles for this user
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Current Roles */}
                    <div>
                        <h4 className="text-sm font-medium mb-3">Current Roles</h4>
                        {loading && userRoles.length === 0 ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : userRoles.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No roles assigned</p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {userRoles.map((role) => (
                                    <Badge key={role.id} variant="secondary" className="pr-1">
                                        <span className="mr-2">{role.name}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-4 w-4 p-0 hover:bg-transparent"
                                            onClick={() => handleRemoveRole(role.id)}
                                            disabled={removing === role.id}
                                        >
                                            {removing === role.id ? (
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                            ) : (
                                                <X className="h-3 w-3" />
                                            )}
                                        </Button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Assign New Role */}
                    <div>
                        <h4 className="text-sm font-medium mb-3">Assign New Role</h4>
                        <div className="flex gap-2">
                            <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                                <SelectTrigger className="flex-1">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableRoles.map((role) => (
                                        <SelectItem key={role.id} value={role.id}>
                                            <div>
                                                <div className="font-medium">{role.name}</div>
                                                {role.description && (
                                                    <div className="text-xs text-muted-foreground">
                                                        {role.description}
                                                    </div>
                                                )}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button
                                onClick={handleAssignRole}
                                disabled={!selectedRoleId || loading}
                            >
                                {loading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Plus className="h-4 w-4" />
                                )}
                                <span className="ml-2">Assign</span>
                            </Button>
                        </div>
                        {availableRoles.length === 0 && !loading && (
                            <p className="text-sm text-muted-foreground mt-2">
                                All available roles have been assigned
                            </p>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
