'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Plus, Trash2, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface PermissionTemplate {
    id: string;
    name: string;
    description: string;
    permissions: string[];
    usageCount: number;
}

interface PermissionTemplatesProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onApplyTemplate?: (permissions: string[]) => void;
}

const PREDEFINED_TEMPLATES: PermissionTemplate[] = [
    {
        id: '1',
        name: 'Content Editor',
        description: 'Full access to content management',
        permissions: [
            'posts.create',
            'posts.read',
            'posts.update',
            'posts.delete',
            'posts.publish',
            'media.upload',
            'media.delete',
        ],
        usageCount: 45,
    },
    {
        id: '2',
        name: 'User Manager',
        description: 'Manage users and basic roles',
        permissions: [
            'users.create',
            'users.read',
            'users.update',
            'users.list',
            'roles.read',
            'roles.assign',
        ],
        usageCount: 23,
    },
    {
        id: '3',
        name: 'Viewer',
        description: 'Read-only access to all resources',
        permissions: [
            'posts.read',
            'users.read',
            'roles.read',
            'permissions.read',
            'settings.read',
        ],
        usageCount: 156,
    },
    {
        id: '4',
        name: 'Administrator',
        description: 'Full system access',
        permissions: [
            'users.*',
            'roles.*',
            'permissions.*',
            'posts.*',
            'media.*',
            'settings.*',
            'audit.*',
        ],
        usageCount: 8,
    },
];

export function PermissionTemplates({
    open,
    onOpenChange,
    onApplyTemplate
}: PermissionTemplatesProps) {
    const [templates, setTemplates] = useState<PermissionTemplate[]>(PREDEFINED_TEMPLATES);
    const [creating, setCreating] = useState(false);
    const [newTemplate, setNewTemplate] = useState({
        name: '',
        description: '',
        permissions: [] as string[],
    });

    const handleApplyTemplate = (template: PermissionTemplate) => {
        onApplyTemplate?.(template.permissions);
        toast.success(`Applied template: ${template.name}`);
        onOpenChange(false);
    };

    const handleCreateTemplate = () => {
        if (!newTemplate.name) {
            toast.error('Please enter a template name');
            return;
        }

        const template: PermissionTemplate = {
            id: Date.now().toString(),
            name: newTemplate.name,
            description: newTemplate.description,
            permissions: newTemplate.permissions,
            usageCount: 0,
        };

        setTemplates([...templates, template]);
        setNewTemplate({ name: '', description: '', permissions: [] });
        setCreating(false);
        toast.success('Template created successfully');
    };

    const handleDeleteTemplate = (id: string) => {
        setTemplates(templates.filter(t => t.id !== id));
        toast.success('Template deleted');
    };

    const handleDuplicateTemplate = (template: PermissionTemplate) => {
        const duplicate: PermissionTemplate = {
            ...template,
            id: Date.now().toString(),
            name: `${template.name} (Copy)`,
            usageCount: 0,
        };
        setTemplates([...templates, duplicate]);
        toast.success('Template duplicated');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>Permission Templates</DialogTitle>
                    <DialogDescription>
                        Apply predefined permission sets or create your own templates
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {!creating ? (
                        <>
                            <div className="flex justify-end">
                                <Button onClick={() => setCreating(true)} size="sm">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Template
                                </Button>
                            </div>

                            <ScrollArea className="h-[400px] pr-4">
                                <div className="space-y-3">
                                    {templates.map((template) => (
                                        <Card key={template.id}>
                                            <CardHeader className="pb-3">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <CardTitle className="text-base">{template.name}</CardTitle>
                                                        <CardDescription className="text-sm mt-1">
                                                            {template.description}
                                                        </CardDescription>
                                                    </div>
                                                    <Badge variant="secondary" className="ml-2">
                                                        {template.usageCount} uses
                                                    </Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                <div className="flex flex-wrap gap-1">
                                                    {template.permissions.slice(0, 5).map((perm, index) => (
                                                        <Badge key={index} variant="outline" className="text-xs">
                                                            {perm}
                                                        </Badge>
                                                    ))}
                                                    {template.permissions.length > 5 && (
                                                        <Badge variant="outline" className="text-xs">
                                                            +{template.permissions.length - 5} more
                                                        </Badge>
                                                    )}
                                                </div>

                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleApplyTemplate(template)}
                                                        className="flex-1"
                                                    >
                                                        Apply Template
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleDuplicateTemplate(template)}
                                                    >
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
                                                    {template.usageCount === 0 && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleDeleteTemplate(template.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </ScrollArea>
                        </>
                    ) : (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Template Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., Content Manager"
                                    value={newTemplate.name}
                                    onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe what this template is for"
                                    value={newTemplate.description}
                                    onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Permissions</Label>
                                <Input
                                    placeholder="Enter permissions (comma-separated)"
                                    onChange={(e) =>
                                        setNewTemplate({
                                            ...newTemplate,
                                            permissions: e.target.value.split(',').map(p => p.trim()).filter(Boolean)
                                        })
                                    }
                                />
                                <p className="text-xs text-muted-foreground">
                                    Example: users.create, users.update, posts.read
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <Button onClick={handleCreateTemplate} className="flex-1">
                                    Create Template
                                </Button>
                                <Button variant="outline" onClick={() => setCreating(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
