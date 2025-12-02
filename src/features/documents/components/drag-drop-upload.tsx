'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudUpload, File as FileIcon, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { documentService } from '../services/document.service';
import { EntityType } from '../types';
import { toast } from 'sonner';

interface DragDropUploadProps {
    entityType?: EntityType;
    entityId?: number;
    onUploadComplete?: () => void;
    maxFiles?: number;
    maxSize?: number; // in MB
}

interface UploadingFile {
    file: File;
    progress: number;
    status: 'uploading' | 'success' | 'error';
    error?: string;
}

export function DragDropUpload({
    entityType = 'general',
    entityId = 0,
    onUploadComplete,
    maxFiles = 10,
    maxSize = 50, // 50MB default
}: DragDropUploadProps) {
    const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);

    const uploadFile = async (file: File) => {
        const fileIndex = uploadingFiles.findIndex(f => f.file === file);

        try {
            // Simulate progress (in real app, use XMLHttpRequest or axios with onUploadProgress)
            setUploadingFiles(prev => prev.map((f, i) =>
                i === fileIndex ? { ...f, progress: 30 } : f
            ));

            await documentService.uploadDocument({
                file,
                entity_type: entityType,
                entity_id: entityId,
                document_name: file.name,
            });

            setUploadingFiles(prev => prev.map((f, i) =>
                i === fileIndex ? { ...f, progress: 100, status: 'success' as const } : f
            ));

            toast.success(`${file.name} uploaded successfully`);
        } catch (error) {
            console.error('Upload failed:', error);
            setUploadingFiles(prev => prev.map((f, i) =>
                i === fileIndex ? {
                    ...f,
                    status: 'error' as const,
                    error: 'Upload failed'
                } : f
            ));
            toast.error(`Failed to upload ${file.name}`);
        }
    };

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        // Check file size
        const oversizedFiles = acceptedFiles.filter(f => f.size > maxSize * 1024 * 1024);
        if (oversizedFiles.length > 0) {
            toast.error(`Some files exceed ${maxSize}MB limit`);
            return;
        }

        // Check max files
        if (acceptedFiles.length > maxFiles) {
            toast.error(`Maximum ${maxFiles} files allowed`);
            return;
        }

        // Add files to uploading list
        const newFiles: UploadingFile[] = acceptedFiles.map(file => ({
            file,
            progress: 0,
            status: 'uploading' as const,
        }));

        setUploadingFiles(newFiles);

        // Upload all files
        await Promise.all(acceptedFiles.map(uploadFile));

        // Call completion callback after a delay
        setTimeout(() => {
            onUploadComplete?.();
            setUploadingFiles([]);
        }, 2000);
    }, [entityType, entityId, maxFiles, maxSize, onUploadComplete]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles,
        maxSize: maxSize * 1024 * 1024,
    });

    const removeFile = (index: number) => {
        setUploadingFiles(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-4">
            {/* Drop Zone */}
            <div
                {...getRootProps()}
                className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                    isDragActive
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50"
                )}
            >
                <input {...getInputProps()} />
                <CloudUpload className={cn(
                    "w-12 h-12 mx-auto mb-4",
                    isDragActive ? "text-primary" : "text-muted-foreground"
                )} />
                {isDragActive ? (
                    <p className="text-lg font-medium">Drop files here...</p>
                ) : (
                    <>
                        <p className="text-lg font-medium mb-2">
                            Drag & drop files here, or click to select
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Maximum {maxFiles} files, up to {maxSize}MB each
                        </p>
                    </>
                )}
            </div>

            {/* Uploading Files List */}
            {uploadingFiles.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-sm font-medium">Uploading Files</h4>
                    {uploadingFiles.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-3 p-3 rounded-lg border bg-card"
                        >
                            <FileIcon className="w-5 h-5 text-muted-foreground flex-shrink-0" />

                            <div className="flex-1 min-w-0 space-y-1">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-sm font-medium truncate">{item.file.name}</p>
                                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                                        {(item.file.size / 1024 / 1024).toFixed(2)} MB
                                    </span>
                                </div>

                                {item.status === 'uploading' && (
                                    <Progress value={item.progress} className="h-1" />
                                )}

                                {item.status === 'success' && (
                                    <p className="text-xs text-green-600 dark:text-green-400">
                                        ✓ Upload complete
                                    </p>
                                )}

                                {item.status === 'error' && (
                                    <p className="text-xs text-destructive">
                                        ✗ {item.error}
                                    </p>
                                )}
                            </div>

                            {item.status !== 'uploading' && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 flex-shrink-0"
                                    onClick={() => removeFile(index)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            )}

                            {item.status === 'uploading' && (
                                <Loader2 className="w-5 h-5 animate-spin text-primary flex-shrink-0" />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
