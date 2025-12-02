'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Media } from '../types';
import { format } from 'date-fns';
import Image from 'next/image';
import { Copy, Download, FileText, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface MediaDetailProps {
    media: Media | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDelete: (id: string) => void;
}

export function MediaDetail({ media, open, onOpenChange, onDelete }: MediaDetailProps) {
    if (!media) return null;

    const handleCopyUrl = () => {
        navigator.clipboard.writeText(media.url);
        toast.success('URL copied to clipboard');
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Media Details</DialogTitle>
                </DialogHeader>

                <div className="grid gap-6">
                    {/* Preview */}
                    <div className="aspect-video relative rounded-lg bg-muted overflow-hidden flex items-center justify-center border">
                        {media.mime_type.startsWith('image/') ? (
                            <Image
                                src={media.url}
                                alt={media.original_name}
                                fill
                                className="object-contain"
                            />
                        ) : (
                            <FileText className="w-16 h-16 text-muted-foreground" />
                        )}
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground mb-1">Filename</p>
                            <p className="font-medium truncate" title={media.original_name}>
                                {media.original_name}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground mb-1">Type</p>
                            <p className="font-medium">{media.mime_type}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground mb-1">Size</p>
                            <p className="font-medium">{formatSize(media.size)}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground mb-1">Uploaded</p>
                            <p className="font-medium">
                                {format(new Date(media.created_at), 'MMM d, yyyy HH:mm')}
                            </p>
                        </div>
                    </div>

                    {/* URL */}
                    <div className="space-y-2">
                        <p className="text-sm font-medium">Public URL</p>
                        <div className="flex gap-2">
                            <code className="flex-1 bg-muted p-2 rounded text-xs break-all">
                                {media.url}
                            </code>
                            <Button variant="outline" size="icon" onClick={handleCopyUrl}>
                                <Copy className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="destructive" onClick={() => {
                        onDelete(media.id);
                        onOpenChange(false);
                    }}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                    </Button>
                    <Button variant="outline" asChild>
                        <a href={media.url} download target="_blank" rel="noopener noreferrer">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                        </a>
                    </Button>
                    <Button onClick={() => onOpenChange(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
