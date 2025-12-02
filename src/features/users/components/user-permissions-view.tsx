'use client';

import { useState, useEffect } from 'react';
import { userService } from '../services/user.service';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface Permission {
    id: string;
    name: string;
    description?: string;
    resource: string;
    action: string;
    source?: string; // Which role granted this permission
}

interface UserPermissionsViewProps {
    userId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function UserPermissionsView({
    userId,
    open,
    onOpenChange,
}: UserPermissionsViewProps) {
    const [loading, setLoading] = useState(false);
    const [permissions, setPermissions] = useState<Permission[]>([]);

    useEffect(() => {
        if (open) {
            loadPermissions();
        }
    }, [open, userId]);

    const loadPermissions = async () => {
        setLoading(true);
        try {
            const response = await userService.getUserPermissions(userId);
            setPermissions(response.data || []);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to load permissions');
        } finally {
            setLoading(false);
        }
    };

    // Group permissions by resource
    const groupedPermissions = permissions.reduce((acc, perm) => {
        const resource = perm.resource || 'Other';
        if (!acc[resource]) {
            acc[resource] = [];
        }
        acc[resource].push(perm);
        return acc;
    }, {} as Record<string, Permission[]>);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        User Permissions
                    </DialogTitle>
                    <DialogDescription>
                        All effective permissions granted to this user through their assigned roles
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[500px] pr-4">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : permissions.length === 0 ? (
                        <div className="text-center py-12">
                            <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-sm text-muted-foreground">
                                No permissions assigned to this user
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {Object.entries(groupedPermissions).map(([resource, perms]) => (
                                <div key={resource}>
                                    <h4 className="text-sm font-semibold mb-3 text-foreground">
                                        {resource}
                                    </h4>
                                    <div className="space-y-2">
                                        {perms.map((perm) => (
                                            <div
                                                key={perm.id}
                                                className="flex items-start justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                                            >
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-sm">
                                                            {perm.name}
                                                        </span>
                                                        <Badge variant="outline" className="text-xs">
                                                            {perm.action}
                                                        </Badge>
                                                    </div>
                                                    {perm.description && (
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            {perm.description}
                                                        </p>
                                                    )}
                                                    {perm.source && (
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            <span className="font-medium">From:</span> {perm.source}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
