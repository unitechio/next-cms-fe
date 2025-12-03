'use client';

import { useEffect, useState } from 'react';
import mammoth from 'mammoth';
import { Loader2 } from 'lucide-react';

interface WordViewerProps {
    url: string;
}

export function WordViewer({ url }: WordViewerProps) {
    const [html, setHtml] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadWord = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(url);
                const arrayBuffer = await response.arrayBuffer();
                const result = await mammoth.convertToHtml({ arrayBuffer });
                setHtml(result.value);
            } catch (err) {
                setError('Failed to load Word document');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        loadWord();
    }, [url]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-8 text-destructive">
                {error}
            </div>
        );
    }

    return (
        <div
            className="prose dark:prose-invert max-w-none p-6"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
