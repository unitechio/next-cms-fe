'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { documentService } from '@/features/documents/services/document.service';
import { Document, EntityType } from '@/features/documents/types';
import { Search, Upload, Loader2, File as FileIcon, Check, Shield, Lock, Eye, Edit } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface DocumentLibraryModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (url: string, type: 'image' | 'file', document: Document) => void;
    entityType?: EntityType;
    entityId?: number;
}

export function DocumentLibraryModal({
    open,
    onOpenChange,
    onSelect,
    entityType = 'general',
    entityId
}: DocumentLibraryModalProps) {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [filterEntityType, setFilterEntityType] = useState<string>('all');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchDocuments = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await documentService.getDocuments({
                page: 1,
                page_size: 50,
                search_term: search || undefined,
                entity_type: filterEntityType !== 'all' ? filterEntityType : undefined,
                sort_by: 'created_at',
                sort_dir: 'desc',
            });
            setDocuments(response.data || []);
        } catch (error) {
            console.error('Failed to fetch documents:', error);
            toast.error('Failed to load documents');
            setDocuments([]);
        } finally {
            setIsLoading(false);
        }
    }, [search, filterEntityType]);

    useEffect(() => {
        if (open) {
            fetchDocuments();
        }
    }, [open, fetchDocuments]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            await documentService.uploadDocument({
                file,
                entity_type: entityType,
                entity_id: entityId || 0,
                document_name: file.name,
            });
            toast.success('Document uploaded successfully');
            fetchDocuments();
        } catch (error) {
            console.error('Failed to upload document:', error);
            toast.error('Failed to upload document');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleSelect = async () => {
        if (selectedDocument) {
            try {
                // Get presigned URL for the document
                const { url } = await documentService.getDocumentViewUrl(selectedDocument.id);
                const type = selectedDocument.document_type.startsWith('image/') ? 'image' : 'file';
                onSelect(url, type, selectedDocument);
                onOpenChange(false);
                setSelectedDocument(null);
            } catch (error) {
                console.error('Failed to get document URL:', error);
                toast.error('Failed to get document URL');
            }
        }
    };

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
                return 'bg-purple-500/10 text-purple-700 dark:text-purple-400';
            case 'edit':
                return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
            case 'comment':
                return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
            case 'view':
                return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
            default:
                return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
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
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[900px] h-[700px] flex flex-col p-0 gap-0">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle>Document Library</DialogTitle>
                </DialogHeader>

                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Filters & Actions */}
                    <div className="p-4 border-b flex items-center gap-4 bg-muted/30">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search documents..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 bg-background"
                            />
                        </div>

                        <Select value={filterEntityType} onValueChange={setFilterEntityType}>
                            <SelectTrigger className="w-[180px] bg-background">
                                <SelectValue placeholder="Filter by type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="post">Posts</SelectItem>
                                <SelectItem value="order">Orders</SelectItem>
                                <SelectItem value="customer">Customers</SelectItem>
                                <SelectItem value="contract">Contracts</SelectItem>
                                <SelectItem value="general">General</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                        >
                            {isUploading ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Upload className="w-4 h-4 mr-2" />
                            )}
                            Upload
                        </Button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleUpload}
                        />
                    </div>

                    {/* Document Grid */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : documents.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                <FileIcon className="w-12 h-12 mb-2 opacity-20" />
                                <p>No documents found</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                {documents.map((doc) => (
                                    <div
                                        key={doc.id}
                                        className={cn(
                                            "group relative flex flex-col rounded-lg border cursor-pointer overflow-hidden transition-all hover:border-primary/50",
                                            selectedDocument?.id === doc.id && "ring-2 ring-primary border-primary"
                                        )}
                                        onClick={() => setSelectedDocument(doc)}
                                    >
                                        {/* Preview */}
                                        <div className="aspect-square bg-muted relative">
                                            {doc.document_type.startsWith('image/') ? (
                                                <Image
                                                    src={doc.document_path}
                                                    alt={doc.document_name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                    <FileIcon className="w-12 h-12" />
                                                </div>
                                            )}

                                            {/* Permission Badge */}
                                            <div className="absolute top-2 right-2">
                                                <Badge
                                                    variant="secondary"
                                                    className={cn("text-xs gap-1", getPermissionColor(doc.user_permission))}
                                                >
                                                    {getPermissionIcon(doc.user_permission)}
                                                    {doc.user_permission}
                                                </Badge>
                                            </div>

                                            {/* Selected Indicator */}
                                            {selectedDocument?.id === doc.id && (
                                                <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                                                    <div className="bg-primary text-primary-foreground rounded-full p-1">
                                                        <Check className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="p-2 border-t bg-background">
                                            <p className="text-xs font-medium truncate" title={doc.document_name}>
                                                {doc.document_name}
                                            </p>
                                            <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                                                <span>{formatSize(doc.file_size)}</span>
                                                <Badge variant="outline" className="text-xs">
                                                    {doc.entity_type}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="px-6 py-4 border-t bg-muted/30">
                    <div className="flex items-center justify-between w-full">
                        <div className="text-sm text-muted-foreground">
                            {selectedDocument ? (
                                <div className="flex items-center gap-2">
                                    <span>Selected: <span className="font-medium text-foreground">{selectedDocument.document_name}</span></span>
                                    <Badge variant="secondary" className={cn("text-xs", getPermissionColor(selectedDocument.user_permission))}>
                                        {selectedDocument.user_permission}
                                    </Badge>
                                </div>
                            ) : (
                                <span>No document selected</span>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSelect} disabled={!selectedDocument}>
                                Insert Document
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
