'use client';

import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface LazyImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    quality?: number;
}

export function LazyImage({
    src,
    alt,
    width = 800,
    height = 600,
    className = '',
    quality = 85,
}: LazyImageProps) {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const [isLoading, setIsLoading] = useState(true);

    return (
        <div ref={ref} className={`relative ${className}`}>
            {inView ? (
                <>
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-muted">
                            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                        </div>
                    )}
                    <Image
                        src={src}
                        alt={alt}
                        width={width}
                        height={height}
                        quality={quality}
                        loading="lazy"
                        onLoadingComplete={() => setIsLoading(false)}
                        className={className}
                    />
                </>
            ) : (
                <div
                    className="bg-muted animate-pulse"
                    style={{ width, height }}
                />
            )}
        </div>
    );
}
