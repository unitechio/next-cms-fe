// Recent Documents Component
'use client';

import { useEffect, useState } from 'react';
import { Document } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Eye, Download, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface RecentDocumentsProps {
    limit?: number;
    onDocumentClick?: (document: Document) => void;
}

export function RecentDocuments({ limit = 5, onDocumentClick }: RecentDocumentsProps) {
    const [recentDocs, setRecentDocs] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch recent documents from API
        // For now, using mock data
        setTimeout(() => {
            setRecentDocs([
                {
                    id: 1,
                    document_code: 'DOC-001',
                    document_name: 'Project Proposal.pdf',
                    document_path: '/docs/proposal.pdf',
                    document_type: 'application/pdf',
                    entity_type: 'post',
                    entity_id: 1,
                    file_size: 2048000,
                    uploaded_by: 'user-1',
                    uploader_name: 'John Doe',
                    user_permission: 'owner',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
                {
                    id: 2,
                    document_code: 'DOC-002',
                    document_name: 'Design Mockup.png',
                    document_path: '/docs/mockup.png',
                    document_type: 'image/png',
                    entity_type: 'general',
                    entity_id: 0,
                    file_size: 1024000,
                    uploaded_by: 'user-2',
                    uploader_name: 'Jane Smith',
                    user_permission: 'edit',
                    created_at: new Date(Date.now() - 3600000).toISOString(),
                    updated_at: new Date(Date.now() - 3600000).toISOString(),
                },
            ] as Document[]);
            setLoading(false);
        }, 500);
    }, []);

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (type: string) => {
        if (type.startsWith('image/')) return '🖼️';
        if (type === 'application/pdf') return '📄';
        if (type.startsWith('video/')) return '🎥';
        if (type.startsWith('audio/')) return '🎵';
        return '📎';
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Recent Documents
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Recent Documents
                </CardTitle>
            </CardHeader>
            <CardContent>
                {recentDocs.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                        No recent documents
                    </p>
                ) : (
                    <div className="space-y-2">
                        {recentDocs.slice(0, limit).map((doc) => (
                            <div
                                key={doc.id}
                                onClick={() => onDocumentClick?.(doc)}
                                className={cn(
                                    "flex items-center gap-3 p-3 rounded-lg border bg-card transition-colors",
                                    onDocumentClick && "cursor-pointer hover:bg-accent"
                                )}
                            >
                                <span className="text-2xl">{getFileIcon(doc.document_type)}</span>

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{doc.document_name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-muted-foreground">
                                            {formatSize(doc.file_size)}
                                        </span>
                                        <span className="text-xs text-muted-foreground">•</span>
                                        <span className="text-xs text-muted-foreground">
                                            {format(new Date(doc.created_at), 'MMM d, HH:mm')}
                                        </span>
                                    </div>
                                </div>

                                <Badge variant="outline" className="text-xs">
                                    {doc.entity_type}
                                </Badge>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
