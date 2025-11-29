'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { mediaService } from '@/features/media/services/media.service';
import { toast } from 'sonner';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    onRemove?: () => void;
    disabled?: boolean;
    maxSize?: number; // in MB
}

export function ImageUpload({
    value,
    onChange,
    onRemove,
    disabled,
    maxSize = 5,
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            if (acceptedFiles.length === 0) return;

            const file = acceptedFiles[0];

            // Validate file size
            if (file.size > maxSize * 1024 * 1024) {
                toast.error(`File size must be less than ${maxSize}MB`);
                return;
            }

            setIsUploading(true);
            try {
                const response = await mediaService.uploadMedia(file);
                onChange(response.url);
                toast.success('Image uploaded successfully');
            } catch (error) {
                console.error('Upload failed:', error);
                toast.error('Failed to upload image');
            } finally {
                setIsUploading(false);
            }
        },
        [onChange, maxSize]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
        },
        maxFiles: 1,
        disabled: disabled || isUploading,
    });

    return (
        <div className="space-y-4">
            {value ? (
                <div className="relative aspect-video w-full max-w-md rounded-lg overflow-hidden border">
                    <Image
                        src={value}
                        alt="Uploaded image"
                        fill
                        className="object-cover"
                    />
                    {!disabled && (
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => {
                                if (onRemove) onRemove();
                                onChange('');
                            }}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            ) : (
                <div
                    {...getRootProps()}
                    className={cn(
                        'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
                        isDragActive && 'border-primary bg-primary/5',
                        disabled && 'opacity-50 cursor-not-allowed',
                        !disabled && 'hover:border-primary hover:bg-primary/5'
                    )}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center gap-2">
                        {isUploading ? (
                            <>
                                <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
                                <p className="text-sm text-muted-foreground">Uploading...</p>
                            </>
                        ) : (
                            <>
                                <div className="rounded-full bg-primary/10 p-3">
                                    <Upload className="h-6 w-6 text-primary" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">
                                        {isDragActive ? 'Drop image here' : 'Click to upload or drag and drop'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        PNG, JPG, GIF up to {maxSize}MB
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
