'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { PDFViewer } from './pdf-viewer';
import { ImageViewer } from './image-viewer';
import { ExcelViewer } from './excel-viewer';
import { WordViewer } from './word-viewer';

interface FileViewerProps {
    file: {
        url: string;
        type: string;
        name: string;
    };
    open: boolean;
    onClose: () => void;
}

export function FileViewer({ file, open, onClose }: FileViewerProps) {
    const [showImageViewer, setShowImageViewer] = useState(false);

    const getFileType = () => {
        const type = file.type.toLowerCase();
        const name = file.name.toLowerCase();

        if (type.includes('pdf') || name.endsWith('.pdf')) return 'pdf';
        if (type.includes('image') || /\.(jpg|jpeg|png|gif|webp|svg)$/.test(name)) return 'image';
        if (type.includes('sheet') || type.includes('excel') || /\.(xlsx|xls)$/.test(name)) return 'excel';
        if (type.includes('word') || type.includes('document') || /\.(docx|doc)$/.test(name)) return 'word';
        return 'unknown';
    };

    const fileType = getFileType();

    const renderViewer = () => {
        switch (fileType) {
            case 'pdf':
                return <PDFViewer url={file.url} />;
            case 'image':
                if (showImageViewer) {
                    return <ImageViewer images={[file.url]} onClose={() => setShowImageViewer(false)} />;
                }
                return (
                    <div className="flex items-center justify-center p-8">
                        <img
                            src={file.url}
                            alt={file.name}
                            className="max-w-full max-h-[70vh] object-contain cursor-pointer"
                            onClick={() => setShowImageViewer(true)}
                        />
                    </div>
                );
            case 'excel':
                return <ExcelViewer url={file.url} />;
            case 'word':
                return <WordViewer url={file.url} />;
            default:
                return (
                    <div className="text-center p-8">
                        <p className="text-muted-foreground mb-4">
                            Preview not available for this file type.
                        </p>
                        <Button asChild>
                            <a href={file.url} download={file.name}>
                                <Download className="w-4 h-4 mr-2" />
                                Download {file.name}
                            </a>
                        </Button>
                    </div>
                );
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl h-[85vh] p-0">
                <DialogHeader className="px-6 pt-6 pb-4 border-b">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-lg font-semibold truncate pr-4">
                            {file.name}
                        </DialogTitle>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" asChild>
                                <a href={file.url} download={file.name}>
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                </a>
                            </Button>
                            <Button variant="ghost" size="sm" onClick={onClose}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </DialogHeader>
                <div className="flex-1 overflow-auto">
                    {renderViewer()}
                </div>
            </DialogContent>
        </Dialog>
    );
}
