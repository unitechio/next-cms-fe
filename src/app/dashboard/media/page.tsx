"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { mediaService } from "@/features/media/services/media.service";
import { Media } from "@/features/media/types";
import {
    CloudUpload,
    File as FileIcon,
    Loader2,
    Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { toast } from "sonner";
import { MediaFilters } from "@/features/media/components/media-filters";
import { MediaDetail } from "@/features/media/components/media-detail";
import { parseApiResponse } from "@/lib/api-utils";

export default function MediaPage() {
    const [media, setMedia] = useState<Media[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [filters, setFilters] = useState({});
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);

    const fetchMedia = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await mediaService.getMedia({
                page,
                limit: 20,
                ...filters,
            });
            const { data, totalPages: pages } = parseApiResponse<Media>(response);
            setMedia(data);
            setTotalPages(pages);
        } catch (error) {
            console.error("Failed to fetch media:", error);
        } finally {
            setIsLoading(false);
        }
    }, [page, filters]);

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchMedia();
        }, 300);
        return () => clearTimeout(debounce);
    }, [fetchMedia]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            await mediaService.uploadMedia(file);
            fetchMedia();
            toast.success("File uploaded successfully");
        } catch (error) {
            console.error("Failed to upload media:", error);
            toast.error("Failed to upload file");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this file?")) return;
        try {
            await mediaService.deleteMedia(id);
            setMedia(media.filter((m) => m.id !== id));
            setSelectedIds(selectedIds.filter(sid => sid !== id));
            toast.success("File deleted successfully");
        } catch (error) {
            console.error("Failed to delete media:", error);
            toast.error("Failed to delete file");
        }
    };

    const handleBulkDelete = async () => {
        if (!confirm(`Are you sure you want to delete ${selectedIds.length} files?`)) return;
        try {
            await Promise.all(selectedIds.map(id => mediaService.deleteMedia(id)));
            setMedia(media.filter((m) => !selectedIds.includes(m.id)));
            setSelectedIds([]);
            toast.success("Files deleted successfully");
        } catch (error) {
            console.error("Failed to delete media:", error);
            toast.error("Failed to delete some files");
        }
    };

    const toggleSelection = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
        );
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB", "TB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Media Library</h1>
                    <p className="text-muted-foreground">Manage your uploaded files and assets.</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    {selectedIds.length > 0 && (
                        <Button variant="destructive" onClick={handleBulkDelete}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete ({selectedIds.length})
                        </Button>
                    )}
                    <Button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                    >
                        {isUploading ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <CloudUpload className="w-4 h-4 mr-2" />
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
            </div>

            <MediaFilters onFilterChange={(newFilters) => {
                setFilters(prev => ({ ...prev, ...newFilters }));
                setPage(1);
            }} />

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : media.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                    No media files found. Upload some files to get started.
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {media.map((item) => (
                        <Card
                            key={item.id}
                            className={`group relative transition-all overflow-hidden cursor-pointer ${selectedIds.includes(item.id) ? 'ring-2 ring-primary' : 'hover:border-primary/50'
                                }`}
                            onClick={() => {
                                setSelectedMedia(item);
                                setDetailOpen(true);
                            }}
                        >
                            <div
                                className="absolute top-2 left-2 z-10"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSelection(item.id);
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(item.id)}
                                    onChange={() => { }} // Handled by div click
                                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                            </div>

                            <CardContent className="p-3">
                                <div className="aspect-square rounded-lg bg-muted mb-3 overflow-hidden relative">
                                    {item.mime_type.startsWith("image/") ? (
                                        <Image
                                            src={item.url}
                                            alt={item.original_name}
                                            fill
                                            className="object-cover transition-transform group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                            <FileIcon className="w-12 h-12" />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <p
                                        className="text-sm font-medium truncate"
                                        title={item.original_name}
                                    >
                                        {item.original_name}
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>{formatSize(item.size)}</span>
                                        <span>{format(new Date(item.created_at), "MMM d")}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Pagination Controls */}
            {!isLoading && media.length > 0 && totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p: number) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Page {page} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p: number) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                    >
                        Next
                    </Button>
                </div>
            )}

            <MediaDetail
                media={selectedMedia}
                open={detailOpen}
                onOpenChange={setDetailOpen}
                onDelete={handleDelete}
            />
        </div>
    );
}
