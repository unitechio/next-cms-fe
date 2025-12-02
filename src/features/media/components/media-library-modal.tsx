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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mediaService } from '@/features/media/services/media.service';
import { Media } from '@/features/media/types';
import { Search, Upload, Loader2, File as FileIcon, Check } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { parseApiResponse } from '@/lib/api-utils';

interface MediaLibraryModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (url: string, type: 'image' | 'file') => void;
}

export function MediaLibraryModal({ open, onOpenChange, onSelect }: MediaLibraryModalProps) {
    const [media, setMedia] = useState<Media[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchMedia = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await mediaService.getMedia({
                page: 1,
                limit: 50, // Fetch more items for the library view
                search,
            });
            // Use parseApiResponse to safely handle different response structures
            const { data } = parseApiResponse<Media>(response);
            setMedia(data);
        } catch (error) {
            console.error('Failed to fetch media:', error);
            toast.error('Failed to load media library');
            setMedia([]); // Ensure media is always an array even on error
        } finally {
            setIsLoading(false);
        }
    }, [search]);

    useEffect(() => {
        if (open) {
            fetchMedia();
        }
    }, [open, fetchMedia]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            await mediaService.uploadMedia(file);
            toast.success('File uploaded successfully');
            fetchMedia(); // Refresh list
        } catch (error) {
            console.error('Failed to upload media:', error);
            toast.error('Failed to upload file');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleSelect = () => {
        if (selectedMedia) {
            const type = selectedMedia.mime_type.startsWith('image/') ? 'image' : 'file';
            onSelect(selectedMedia.url, type);
            onOpenChange(false);
            setSelectedMedia(null);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] h-[600px] flex flex-col p-0 gap-0">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle>Media Library</DialogTitle>
                </DialogHeader>

                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="p-4 border-b flex items-center gap-4 bg-muted/30">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search files..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 bg-background"
                            />
                        </div>
                        <Button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                        >
                            {isUploading ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Upload className="w-4 h-4 mr-2" />
                            )}
                            Upload New
                        </Button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleUpload}
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : media.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                <FileIcon className="w-12 h-12 mb-2 opacity-20" />
                                <p>No media files found</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                {media.map((item) => (
                                    <div
                                        key={item.id}
                                        className={cn(
                                            "group relative aspect-square rounded-lg border cursor-pointer overflow-hidden transition-all hover:border-primary/50",
                                            selectedMedia?.id === item.id && "ring-2 ring-primary border-primary"
                                        )}
                                        onClick={() => setSelectedMedia(item)}
                                    >
                                        {item.mime_type.startsWith('image/') ? (
                                            <Image
                                                src={item.url}
                                                alt={item.original_name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center bg-muted text-muted-foreground p-2 text-center">
                                                <FileIcon className="w-8 h-8 mb-1" />
                                                <span className="text-xs truncate w-full">{item.original_name}</span>
                                            </div>
                                        )}

                                        {selectedMedia?.id === item.id && (
                                            <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                                                <div className="bg-primary text-primary-foreground rounded-full p-1">
                                                    <Check className="w-4 h-4" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="px-6 py-4 border-t bg-muted/30">
                    <div className="flex items-center justify-between w-full">
                        <div className="text-sm text-muted-foreground">
                            {selectedMedia ? (
                                <span>Selected: <span className="font-medium text-foreground">{selectedMedia.original_name}</span></span>
                            ) : (
                                <span>No file selected</span>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSelect} disabled={!selectedMedia}>
                                Insert Media
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
