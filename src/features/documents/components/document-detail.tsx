'use client';

import { Document } from '../types';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Eye, Shield, Edit, Lock, File as FileIcon, Calendar, User, HardDrive } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DocumentPermissions } from './document-permissions';
import { DocumentComments } from './document-comments';
import { DocumentVersions } from './document-versions';

interface DocumentDetailProps {
    document: Document | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDownload?: (document: Document) => void;
    onDelete?: (document: Document) => void;
}

export function DocumentDetail({
    document,
    open,
    onOpenChange,
    onDownload,
    onDelete,
}: DocumentDetailProps) {
    if (!document) return null;

    const getPermissionIcon = (permission: string) => {
        switch (permission) {
            case 'owner':
                return <Shield className="w-4 h-4" />;
            case 'edit':
                return <Edit className="w-4 h-4" />;
            case 'comment':
                return <Lock className="w-4 h-4" />;
            case 'view':
                return <Eye className="w-4 h-4" />;
            default:
                return null;
        }
    };

    const getPermissionColor = (permission: string) => {
        switch (permission) {
            case 'owner':
                return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20';
            case 'edit':
                return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
            case 'comment':
                return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20';
            case 'view':
                return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20';
            default:
                return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20';
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-[600px] overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Document Details</SheetTitle>
                    <SheetDescription>
                        View and manage document information
                    </SheetDescription>
                </SheetHeader>

                <Tabs defaultValue="info" className="mt-6">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="info">Info</TabsTrigger>
                        <TabsTrigger value="permissions">Permissions</TabsTrigger>
                        <TabsTrigger value="comments">Comments</TabsTrigger>
                        <TabsTrigger value="versions">Versions</TabsTrigger>
                    </TabsList>

                    {/* Info Tab */}
                    <TabsContent value="info" className="space-y-6 mt-6">
                        {/* Preview */}
                        <div className="aspect-video rounded-lg bg-muted overflow-hidden relative">
                            {document.document_type.startsWith('image/') ? (
                                <Image
                                    src={document.document_path}
                                    alt={document.document_name}
                                    fill
                                    className="object-contain"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                                    <FileIcon className="w-20 h-20 mb-2" />
                                    <p className="text-sm">{document.document_type}</p>
                                </div>
                            )}
                        </div>

                        {/* Document Name */}
                        <div>
                            <h3 className="text-lg font-semibold break-words">{document.document_name}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Code: {document.document_code}
                            </p>
                        </div>

                        <Separator />

                        {/* Metadata */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-medium">Information</h4>

                            <div className="grid gap-3">
                                {/* Permission */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Your Permission</span>
                                    <Badge
                                        variant="secondary"
                                        className={cn('gap-1', getPermissionColor(document.user_permission))}
                                    >
                                        {getPermissionIcon(document.user_permission)}
                                        {document.user_permission}
                                    </Badge>
                                </div>

                                {/* Entity Type */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Entity Type</span>
                                    <Badge variant="outline">{document.entity_type}</Badge>
                                </div>

                                {/* File Size */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                                        <HardDrive className="w-4 h-4" />
                                        File Size
                                    </span>
                                    <span className="text-sm font-medium">{formatSize(document.file_size)}</span>
                                </div>

                                {/* Uploaded By */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        Uploaded By
                                    </span>
                                    <span className="text-sm font-medium">{document.uploader_name || 'Unknown'}</span>
                                </div>

                                {/* Created At */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Created
                                    </span>
                                    <span className="text-sm font-medium">
                                        {format(new Date(document.created_at), 'PPP')}
                                    </span>
                                </div>

                                {/* Updated At */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Modified
                                    </span>
                                    <span className="text-sm font-medium">
                                        {format(new Date(document.updated_at), 'PPP')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Actions */}
                        <div className="space-y-2">
                            <Button
                                className="w-full"
                                onClick={() => onDownload?.(document)}
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                            </Button>

                            {(document.user_permission === 'owner' || document.user_permission === 'edit') && (
                                <Button
                                    variant="destructive"
                                    className="w-full"
                                    onClick={() => {
                                        if (confirm('Are you sure you want to delete this document?')) {
                                            onDelete?.(document);
                                            onOpenChange(false);
                                        }
                                    }}
                                >
                                    Delete Document
                                </Button>
                            )}
                        </div>
                    </TabsContent>

                    {/* Permissions Tab */}
                    <TabsContent value="permissions" className="mt-6">
                        <DocumentPermissions
                            documentId={document.id}
                            userPermission={document.user_permission}
                        />
                    </TabsContent>

                    {/* Comments Tab */}
                    <TabsContent value="comments" className="mt-6">
                        <DocumentComments
                            documentId={document.id}
                            canComment={['owner', 'edit', 'comment'].includes(document.user_permission)}
                        />
                    </TabsContent>

                    {/* Versions Tab */}
                    <TabsContent value="versions" className="mt-6">
                        <DocumentVersions
                            documentId={document.id}
                            canEdit={['owner', 'edit'].includes(document.user_permission)}
                        />
                    </TabsContent>
                </Tabs>
            </SheetContent>
        </Sheet>
    );
}
