'use client';

import { PageBlock } from '@/features/pages/types';

interface BlockRendererProps {
    block: PageBlock;
    isPreview: boolean;
}

export function BlockRenderer({ block, isPreview }: BlockRendererProps) {
    const config = block.config || {};
    const blockType = block.block?.type || 'unknown';

    // Render different block types
    switch (blockType) {
        case 'hero-banner':
            return (
                <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 p-12 text-center">
                    {config.background_image && (
                        <img
                            src={config.background_image}
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover opacity-30"
                        />
                    )}
                    <div className="relative z-10">
                        <h1 className="mb-4 text-4xl font-bold">
                            {config.title || 'Hero Title'}
                        </h1>
                        {config.subtitle && (
                            <p className="mb-6 text-xl text-muted-foreground">{config.subtitle}</p>
                        )}
                        {config.cta_text && (
                            <button className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground">
                                {config.cta_text}
                            </button>
                        )}
                    </div>
                </div>
            );

        case 'text-block':
            return (
                <div className="prose max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: config.content || '<p>Text content</p>' }} />
                </div>
            );

        case 'image-gallery':
            return (
                <div className="grid grid-cols-3 gap-4">
                    {(config.images || [{ image: '', caption: 'Image 1' }]).map((img: any, idx: number) => (
                        <div key={idx} className="space-y-2">
                            <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                                {img.image && (
                                    <img src={img.image} alt={img.caption} className="h-full w-full object-cover" />
                                )}
                            </div>
                            {img.caption && (
                                <p className="text-sm text-muted-foreground">{img.caption}</p>
                            )}
                        </div>
                    ))}
                </div>
            );

        case 'product-list':
            return (
                <div className="space-y-6">
                    {config.title && (
                        <h2 className="text-2xl font-bold">{config.title}</h2>
                    )}
                    <div className={`grid gap-4 ${config.layout === 'list' ? 'grid-cols-1' : 'grid-cols-3'}`}>
                        {(config.products || [{ name: 'Product', price: 0 }]).map((product: any, idx: number) => (
                            <div key={idx} className="rounded-lg border p-4">
                                {product.image && (
                                    <img src={product.image} alt={product.name} className="mb-4 h-48 w-full rounded object-cover" />
                                )}
                                <h3 className="font-semibold">{product.name}</h3>
                                <p className="text-lg font-bold text-primary">${product.price}</p>
                            </div>
                        ))}
                    </div>
                </div>
            );

        default:
            return (
                <div className="rounded-lg border-2 border-dashed p-8 text-center">
                    <p className="font-medium">{block.block?.name || 'Unknown Block'}</p>
                    <p className="text-sm text-muted-foreground">Type: {blockType}</p>
                </div>
            );
    }
}
