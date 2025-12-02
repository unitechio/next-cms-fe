'use client';

import { useState, useEffect } from 'react';
import { PageVersion } from '@/features/pages/types';
import { pageService } from '@/features/pages/services/page.service';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { History, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface VersionHistoryDialogProps {
    pageId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onRevert?: () => void;
}

export function VersionHistoryDialog({
    pageId,
    open,
    onOpenChange,
    onRevert,
}: VersionHistoryDialogProps) {
    const [versions, setVersions] = useState<PageVersion[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedVersion, setSelectedVersion] = useState<PageVersion | null>(null);

    useEffect(() => {
        if (open) {
            loadVersions();
        }
    }, [open, pageId]);

    const loadVersions = async () => {
        try {
            setLoading(true);
            const data = await pageService.getPageVersions(pageId);
            setVersions(data.data || []);
        } catch (error) {
            toast.error('Failed to load version history');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRevert = async (versionId: string) => {
        try {
            await pageService.revertPageVersion(pageId, versionId);
            toast.success('Page reverted to selected version');
            onOpenChange(false);
            onRevert?.();
        } catch (error) {
            toast.error('Failed to revert page');
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <History className="h-5 w-5" />
                        Version History
                    </DialogTitle>
                    <DialogDescription>
                        View and restore previous versions of this page
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 md:grid-cols-2">
                    {/* Version List */}
                    <div>
                        <h3 className="mb-3 font-semibold">Versions</h3>
                        <ScrollArea className="h-96">
                            <div className="space-y-2">
                                {loading ? (
                                    <p className="text-sm text-muted-foreground">Loading...</p>
                                ) : versions.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No versions found</p>
                                ) : (
                                    versions.map((version) => (
                                        <div
                                            key={version.id}
                                            className={`cursor-pointer rounded-lg border p-3 transition-colors hover:bg-muted ${selectedVersion?.id === version.id ? 'border-primary bg-muted' : ''
                                                }`}
                                            onClick={() => setSelectedVersion(version)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-medium">
                                                        Version {version.version_number}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {format(new Date(version.created_at), 'MMM d, yyyy HH:mm')}
                                                    </div>
                                                </div>
                                                {version.version_number === versions[0].version_number && (
                                                    <Badge variant="default">Current</Badge>
                                                )}
                                            </div>
                                            {version.change_description && (
                                                <p className="mt-2 text-sm text-muted-foreground">
                                                    {version.change_description}
                                                </p>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Version Details */}
                    <div>
                        <h3 className="mb-3 font-semibold">Details</h3>
                        {selectedVersion ? (
                            <div className="space-y-4">
                                <div className="rounded-lg border p-4">
                                    <div className="space-y-2">
                                        <div>
                                            <span className="text-sm font-medium">Title:</span>
                                            <p className="text-sm text-muted-foreground">
                                                {selectedVersion.title}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium">Slug:</span>
                                            <p className="text-sm text-muted-foreground">
                                                {selectedVersion.slug}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium">Template:</span>
                                            <p className="text-sm text-muted-foreground">
                                                {selectedVersion.template || 'default'}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium">Blocks:</span>
                                            <p className="text-sm text-muted-foreground">
                                                {selectedVersion.blocks_snapshot?.length || 0} blocks
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {selectedVersion.version_number !== versions[0].version_number && (
                                    <Button
                                        className="w-full"
                                        onClick={() => handleRevert(selectedVersion.id)}
                                    >
                                        <RotateCcw className="mr-2 h-4 w-4" />
                                        Revert to This Version
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Select a version to view details
                            </p>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
