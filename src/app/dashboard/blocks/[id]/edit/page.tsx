'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { BlockForm } from '@/features/blocks/components/block-form';
import { blockService } from '@/features/blocks/services/block.service';
import { Block } from '@/features/pages/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditBlockPage() {
    const params = useParams();
    const blockId = params.id as string;
    const [block, setBlock] = useState<Block | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBlock = async () => {
            try {
                const data = await blockService.getBlock(blockId);
                setBlock(data);
            } catch (error) {
                console.error('Failed to load block:', error);
            } finally {
                setLoading(false);
            }
        };

        loadBlock();
    }, [blockId]);

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-12 w-64" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    if (!block) {
        return <div>Block not found</div>;
    }

    return <BlockForm blockId={blockId} initialData={block} />;
}
