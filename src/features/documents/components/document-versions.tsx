'use client';

import { useState, useEffect } from 'react';
import { DocumentVersion } from '../types';
import { documentService } from '../services/document.service';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Download, RotateCcw, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface DocumentVersionsProps {
    documentId: number;
    canEdit: boolean;
}

export function DocumentVersions({ documentId, canEdit }: DocumentVersionsProps) {
    const [versions, setVersions] = useState<DocumentVersion[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchVersions();
    }, [documentId]);

    const fetchVersions = async () => {
        setIsLoading(true);
        try {
            const data = await documentService.getVersions(documentId);
            setVersions(data);
        } catch (error) {
            console.error('Failed to fetch versions:', error);
            toast.error('Failed to load version history');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadVersion = async (version: DocumentVersion) => {
        try {
            // In a real implementation, you would get a presigned URL for the specific version
            toast.info('Downloading version ' + version.version_number);
            // const { url } = await documentService.getVersionUrl(version.id);
            // window.open(url, '_blank');
        } catch (error) {
            console.error('Failed to download version:', error);
            toast.error('Failed to download version');
        }
    };

    const handleRestoreVersion = async (version: DocumentVersion) => {
        if (!confirm(`Are you sure you want to restore version ${version.version_number}? This will create a new version.`)) {
            return;
        }

        try {
            toast.info('Restore functionality coming soon...');
            // In a real implementation:
            // await documentService.restoreVersion(documentId, version.id);
            // fetchVersions();
            // toast.success('Version restored successfully');
        } catch (error) {
            console.error('Failed to restore version:', error);
            toast.error('Failed to restore version');
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
        <div className="space-y-4">
            <h4 className="text-sm font-medium">Version History</h4>

            {isLoading ? (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
            ) : versions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                    No version history available.
                </p>
            ) : (
                <div className="space-y-2">
                    {versions.map((version, index) => (
                        <div
                            key={version.id}
                            className="flex items-start gap-3 p-3 rounded-lg border bg-card"
                        >
                            <div className="flex-shrink-0 mt-1">
                                <FileText className="w-5 h-5 text-muted-foreground" />
                            </div>

                            <div className="flex-1 min-w-0 space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">
                                        Version {version.version_number}
                                    </span>
                                    {index === 0 && (
                                        <Badge variant="secondary" className="text-xs">
                                            Current
                                        </Badge>
                                    )}
                                </div>

                                <div className="text-xs text-muted-foreground space-y-0.5">
                                    <p>
                                        Modified by <span className="font-medium">{version.user.name}</span>
                                    </p>
                                    <p>{format(new Date(version.created_at), 'PPP p')}</p>
                                    <p>Size: {formatSize(version.file_size)}</p>
                                    {version.change_note && (
                                        <p className="italic mt-1">"{version.change_note}"</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8"
                                    onClick={() => handleDownloadVersion(version)}
                                >
                                    <Download className="w-3 h-3 mr-1" />
                                    Download
                                </Button>
                                {canEdit && index !== 0 && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8"
                                        onClick={() => handleRestoreVersion(version)}
                                    >
                                        <RotateCcw className="w-3 h-3 mr-1" />
                                        Restore
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {versions.length > 0 && (
                <p className="text-xs text-muted-foreground text-center pt-2">
                    Total versions: {versions.length}
                </p>
            )}
        </div>
    );
}
