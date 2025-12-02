'use client';

import { useState, useEffect } from 'react';
import { DocumentPermission, DocumentPermissionLevel } from '../types';
import { documentService } from '../services/document.service';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Edit, Eye, Lock, Trash2, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface DocumentPermissionsProps {
    documentId: number;
    userPermission: DocumentPermissionLevel;
}

export function DocumentPermissions({ documentId, userPermission }: DocumentPermissionsProps) {
    const [permissions, setPermissions] = useState<DocumentPermission[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddingPermission, setIsAddingPermission] = useState(false);
    const [addDialogOpen, setAddDialogOpen] = useState(false);

    // Form state
    const [userId, setUserId] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [permissionLevel, setPermissionLevel] = useState<DocumentPermissionLevel>('view');
    const [permissionType, setPermissionType] = useState<'user' | 'role'>('user');

    const canManagePermissions = userPermission === 'owner';

    useEffect(() => {
        fetchPermissions();
    }, [documentId]);

    const fetchPermissions = async () => {
        setIsLoading(true);
        try {
            const data = await documentService.getPermissions(documentId);
            setPermissions(data);
        } catch (error) {
            console.error('Failed to fetch permissions:', error);
            toast.error('Failed to load permissions');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddPermission = async () => {
        if (permissionType === 'user' && !userId) {
            toast.error('Please enter a user ID');
            return;
        }
        if (permissionType === 'role' && !jobTitle) {
            toast.error('Please enter a job title');
            return;
        }

        setIsAddingPermission(true);
        try {
            const newPermission = await documentService.addPermission({
                document_id: documentId,
                user_id: permissionType === 'user' ? userId : undefined,
                job_title: permissionType === 'role' ? jobTitle : undefined,
                permission_level: permissionLevel,
            });
            setPermissions([...permissions, newPermission]);
            toast.success('Permission added successfully');
            setAddDialogOpen(false);
            resetForm();
        } catch (error) {
            console.error('Failed to add permission:', error);
            toast.error('Failed to add permission');
        } finally {
            setIsAddingPermission(false);
        }
    };

    const handleDeletePermission = async (permissionId: number) => {
        if (!confirm('Are you sure you want to remove this permission?')) return;

        try {
            await documentService.deletePermission(permissionId);
            setPermissions(permissions.filter(p => p.id !== permissionId));
            toast.success('Permission removed successfully');
        } catch (error) {
            console.error('Failed to delete permission:', error);
            toast.error('Failed to remove permission');
        }
    };

    const resetForm = () => {
        setUserId('');
        setJobTitle('');
        setPermissionLevel('view');
        setPermissionType('user');
    };

    const getPermissionIcon = (level: DocumentPermissionLevel) => {
        switch (level) {
            case 'owner':
                return <Shield className="w-3 h-3" />;
            case 'edit':
                return <Edit className="w-3 h-3" />;
            case 'comment':
                return <Lock className="w-3 h-3" />;
            case 'view':
                return <Eye className="w-3 h-3" />;
        }
    };

    const getPermissionColor = (level: DocumentPermissionLevel) => {
        switch (level) {
            case 'owner':
                return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20';
            case 'edit':
                return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
            case 'comment':
                return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20';
            case 'view':
                return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20';
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Permissions</h4>
                {canManagePermissions && (
                    <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Permission
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Permission</DialogTitle>
                                <DialogDescription>
                                    Grant access to a user or role for this document.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 py-4">
                                {/* Permission Type */}
                                <div className="space-y-2">
                                    <Label>Permission Type</Label>
                                    <Select value={permissionType} onValueChange={(v) => setPermissionType(v as 'user' | 'role')}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="user">Specific User</SelectItem>
                                            <SelectItem value="role">Job Title/Role</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* User ID or Job Title */}
                                {permissionType === 'user' ? (
                                    <div className="space-y-2">
                                        <Label htmlFor="userId">User ID (UUID)</Label>
                                        <Input
                                            id="userId"
                                            placeholder="Enter user UUID"
                                            value={userId}
                                            onChange={(e) => setUserId(e.target.value)}
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Label htmlFor="jobTitle">Job Title</Label>
                                        <Input
                                            id="jobTitle"
                                            placeholder="e.g., Editor, Manager"
                                            value={jobTitle}
                                            onChange={(e) => setJobTitle(e.target.value)}
                                        />
                                    </div>
                                )}

                                {/* Permission Level */}
                                <div className="space-y-2">
                                    <Label>Permission Level</Label>
                                    <Select value={permissionLevel} onValueChange={(v) => setPermissionLevel(v as DocumentPermissionLevel)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="view">View - Read only</SelectItem>
                                            <SelectItem value="comment">Comment - Can add comments</SelectItem>
                                            <SelectItem value="edit">Edit - Can modify</SelectItem>
                                            <SelectItem value="owner">Owner - Full control</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleAddPermission} disabled={isAddingPermission}>
                                    {isAddingPermission && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Add Permission
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            {/* Permissions List */}
            {isLoading ? (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
            ) : permissions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                    No permissions set. Only the owner can access this document.
                </p>
            ) : (
                <div className="space-y-2">
                    {permissions.map((permission) => (
                        <div
                            key={permission.id}
                            className="flex items-center justify-between p-3 rounded-lg border bg-card"
                        >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <Badge variant="secondary" className={cn('gap-1', getPermissionColor(permission.permission_level))}>
                                    {getPermissionIcon(permission.permission_level)}
                                    {permission.permission_level}
                                </Badge>
                                <div className="flex-1 min-w-0">
                                    {permission.user ? (
                                        <p className="text-sm font-medium truncate">{permission.user.name}</p>
                                    ) : (
                                        <p className="text-sm font-medium truncate">Role: {permission.job_title}</p>
                                    )}
                                    {permission.user && (
                                        <p className="text-xs text-muted-foreground truncate">{permission.user.email}</p>
                                    )}
                                </div>
                            </div>
                            {canManagePermissions && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                    onClick={() => handleDeletePermission(permission.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
