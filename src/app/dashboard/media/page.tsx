"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { mediaService } from "@/features/media/services/media.service";
import { Media } from "@/features/media/types";
import {
    CloudUpload,
    File as FileIcon,
    Loader2,
    Trash2,
    Search,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function MediaPage() {
    const [media, setMedia] = useState<Media[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [page] = useState(1);
    const [search, setSearch] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchMedia = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await mediaService.getMedia({
                page,
                limit: 20,
                search,
            });
            setMedia(response.data || []);
        } catch (error) {
            console.error("Failed to fetch media:", error);
        } finally {
            setIsLoading(false);
        }
    }, [page, search]);

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
        } catch (error) {
            console.error("Failed to upload media:", error);
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
        } catch (error) {
            console.error("Failed to delete media:", error);
        }
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
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search files..."
                            className="pl-9"
                        />
                    </div>
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
                            className="group relative hover:border-primary/50 transition-all overflow-hidden"
                        >
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

                                    {/* Overlay Actions */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="rounded-full h-8 w-8"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
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
        </div>
    );
}
