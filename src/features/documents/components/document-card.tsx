'use client';

import { Document } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { File as FileIcon, MoreVertical, Download, Eye, Edit, Trash2, Shield, Lock, Share2 } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface DocumentCardProps {
    document: Document;
    onView?: (document: Document) => void;
    onDownload?: (document: Document) => void;
    onDelete?: (document: Document) => void;
    onPreview?: (document: Document) => void;
    onShare?: (document: Document) => void;
    selected?: boolean;
    onSelect?: (document: Document) => void;
}

export function DocumentCard({
    document,
    onView,
    onDownload,
    onDelete,
    onPreview,
    onShare,
    selected,
    onSelect,
}: DocumentCardProps) {
    const getPermissionIcon = (permission: string) => {
        switch (permission) {
            case 'owner':
                return <Shield className="w-3 h-3" />;
            case 'edit':
                return <Edit className="w-3 h-3" />;
            case 'comment':
                return <Lock className="w-3 h-3" />;
            case 'view':
                return <Eye className="w-3 h-3" />;
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
        <Card
            className={cn(
                'group relative transition-all hover:shadow-md cursor-pointer',
                selected && 'ring-2 ring-primary'
            )}
            onClick={() => onSelect?.(document)}
        >
            <CardContent className="p-4">
                {/* Preview */}
                <div className="aspect-square rounded-lg bg-muted mb-3 overflow-hidden relative">
                    {document.document_type.startsWith('image/') ? (
                        <Image
                            src={document.document_path}
                            alt={document.document_name}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <FileIcon className="w-16 h-16" />
                        </div>
                    )}

                    {/* Permission Badge */}
                    <div className="absolute top-2 right-2">
                        <Badge
                            variant="secondary"
                            className={cn('text-xs gap-1', getPermissionColor(document.user_permission))}
                        >
                            {getPermissionIcon(document.user_permission)}
                            {document.user_permission}
                        </Badge>
                    </div>

                    {/* Actions Menu */}
                    <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button variant="secondary" size="icon" className="h-8 w-8">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView?.(document); }}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Details
                                </DropdownMenuItem>
                                {onPreview && (
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onPreview(document); }}>
                                        <Eye className="w-4 h-4 mr-2" />
                                        Preview
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDownload?.(document); }}>
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                </DropdownMenuItem>
                                {onShare && (
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onShare(document); }}>
                                        <Share2 className="w-4 h-4 mr-2" />
                                        Share
                                    </DropdownMenuItem>
                                )}
                                {(document.user_permission === 'owner' || document.user_permission === 'edit') && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={(e) => { e.stopPropagation(); onDelete?.(document); }}
                                            className="text-destructive focus:text-destructive"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Info */}
                <div className="space-y-2">
                    <p className="text-sm font-medium truncate" title={document.document_name}>
                        {document.document_name}
                    </p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{formatSize(document.file_size)}</span>
                        <Badge variant="outline" className="text-xs">
                            {document.entity_type}
                        </Badge>
                    </div>

                    <div className="text-xs text-muted-foreground">
                        {format(new Date(document.created_at), 'MMM d, yyyy')}
                    </div>

                    {document.uploader_name && (
                        <div className="text-xs text-muted-foreground truncate">
                            by {document.uploader_name}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
