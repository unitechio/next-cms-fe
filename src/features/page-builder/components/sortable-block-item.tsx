'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PageBlock } from '@/features/pages/types';
import { usePageBuilderStore } from '../store/page-builder-store';
import { Button } from '@/components/ui/button';
import { GripVertical, Trash2, Copy } from 'lucide-react';
import { BlockRenderer } from './block-renderer';
import { cn } from '@/lib/utils';

interface SortableBlockItemProps {
    block: PageBlock;
    isPreview: boolean;
}

export function SortableBlockItem({ block, isPreview }: SortableBlockItemProps) {
    const { selectedBlockId, selectBlock, removeBlock, duplicateBlock } = usePageBuilderStore();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: block.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const isSelected = selectedBlockId === block.id;

    if (isPreview) {
        return (
            <div ref={setNodeRef} style={style}>
                <BlockRenderer block={block} isPreview />
            </div>
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                'group relative rounded-lg border-2 transition-all',
                isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-border',
                isDragging && 'opacity-50'
            )}
            onClick={() => selectBlock(block.id)}
        >
            {/* Hover Toolbar */}
            <div className="absolute -top-10 left-0 z-10 hidden items-center gap-1 rounded-md border bg-background p-1 shadow-sm group-hover:flex">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 cursor-grab p-0"
                    {...listeners}
                    {...attributes}
                >
                    <GripVertical className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={(e) => {
                        e.stopPropagation();
                        duplicateBlock(block.id);
                    }}
                >
                    <Copy className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-destructive"
                    onClick={(e) => {
                        e.stopPropagation();
                        removeBlock(block.id);
                    }}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>

            <div className="rounded-lg bg-background p-4">
                <BlockRenderer block={block} isPreview={false} />
            </div>
        </div>
    );
}
