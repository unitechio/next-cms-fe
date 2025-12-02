'use client';

import { Document } from '../types';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface DocumentPreviewModalProps {
    document: Document | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDownload?: (document: Document) => void;
}

export function DocumentPreviewModal({
    document,
    open,
    onOpenChange,
    onDownload,
}: DocumentPreviewModalProps) {
    const [zoom, setZoom] = useState(100);
    const [rotation, setRotation] = useState(0);

    if (!document) return null;

    const isImage = document.document_type.startsWith('image/');
    const isPDF = document.document_type === 'application/pdf';
    const isVideo = document.document_type.startsWith('video/');
    const isAudio = document.document_type.startsWith('audio/');

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
    const handleRotate = () => setRotation(prev => (prev + 90) % 360);
    const handleReset = () => {
        setZoom(100);
        setRotation(0);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl h-[90vh] p-0">
                <DialogHeader className="px-6 pt-6 pb-4 border-b">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-lg font-semibold truncate pr-4">
                            {document.document_name}
                        </DialogTitle>
                        <div className="flex items-center gap-2">
                            {isImage && (
                                <>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={handleZoomOut}
                                        disabled={zoom <= 50}
                                    >
                                        <ZoomOut className="w-4 h-4" />
                                    </Button>
                                    <span className="text-sm text-muted-foreground min-w-[4rem] text-center">
                                        {zoom}%
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={handleZoomIn}
                                        disabled={zoom >= 200}
                                    >
                                        <ZoomIn className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={handleRotate}
                                    >
                                        <RotateCw className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleReset}
                                    >
                                        Reset
                                    </Button>
                                </>
                            )}
                            <Button
                                variant="default"
                                size="sm"
                                onClick={() => onDownload?.(document)}
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                            </Button>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-auto p-6 bg-muted/30">
                    <div className="flex items-center justify-center min-h-full">
                        {isImage && (
                            <div
                                className="relative transition-transform duration-200"
                                style={{
                                    transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                                }}
                            >
                                <Image
                                    src={document.document_path}
                                    alt={document.document_name}
                                    width={1200}
                                    height={800}
                                    className="max-w-full h-auto rounded-lg shadow-lg"
                                    style={{ objectFit: 'contain' }}
                                />
                            </div>
                        )}

                        {isPDF && (
                            <iframe
                                src={document.document_path}
                                className="w-full h-[calc(90vh-120px)] rounded-lg shadow-lg bg-white"
                                title={document.document_name}
                            />
                        )}

                        {isVideo && (
                            <video
                                src={document.document_path}
                                controls
                                className="max-w-full max-h-[calc(90vh-120px)] rounded-lg shadow-lg"
                            >
                                Your browser does not support the video tag.
                            </video>
                        )}

                        {isAudio && (
                            <div className="w-full max-w-2xl p-8 bg-card rounded-lg shadow-lg">
                                <audio
                                    src={document.document_path}
                                    controls
                                    className="w-full"
                                >
                                    Your browser does not support the audio tag.
                                </audio>
                                <p className="text-center text-sm text-muted-foreground mt-4">
                                    {document.document_name}
                                </p>
                            </div>
                        )}

                        {!isImage && !isPDF && !isVideo && !isAudio && (
                            <div className="text-center p-8">
                                <p className="text-lg text-muted-foreground mb-4">
                                    Preview not available for this file type
                                </p>
                                <p className="text-sm text-muted-foreground mb-6">
                                    {document.document_type}
                                </p>
                                <Button onClick={() => onDownload?.(document)}>
                                    <Download className="w-4 h-4 mr-2" />
                                    Download to view
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
