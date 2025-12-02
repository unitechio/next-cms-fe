'use client';

import { DndContext, DragEndEvent, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { usePageBuilderStore } from '../store/page-builder-store';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SortableBlockItem } from './sortable-block-item';
import { BlockRenderer } from './block-renderer';
import { PageBlock } from '@/features/pages/types';
import { useState } from 'react';

export function BuilderCanvas() {
    const { pageBlocks, reorderBlocks, addBlock, currentPage, isPreviewMode } = usePageBuilderStore();
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        // Check if dragging from block library
        if (active.id.toString().startsWith('block-library-')) {
            const blockData = active.data.current?.block;
            if (blockData) {
                const newBlock: PageBlock = {
                    id: `temp-${Date.now()}`,
                    block_id: blockData.id,
                    page_id: currentPage?.id || '',
                    order: pageBlocks.length,
                    config: {},
                    language: 'en',
                    block: blockData,
                };
                addBlock(newBlock);
            }
            return;
        }

        // Reordering existing blocks
        if (active.id !== over.id) {
            const oldIndex = pageBlocks.findIndex((b: PageBlock) => b.id === active.id);
            const newIndex = pageBlocks.findIndex((b: PageBlock) => b.id === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                const newBlocks = arrayMove(pageBlocks, oldIndex, newIndex).map((block: PageBlock, index: number) => ({
                    ...block,
                    order: index,
                }));
                reorderBlocks(newBlocks);
            }
        }
    };

    const activeBlock = pageBlocks.find((b: PageBlock) => b.id === activeId);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <ScrollArea className="h-full bg-muted/30">
                <div className="mx-auto max-w-5xl p-8">
                    {pageBlocks.length === 0 ? (
                        <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed">
                            <div className="text-center">
                                <p className="text-lg font-medium text-muted-foreground">
                                    No blocks yet
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Drag blocks from the library to get started
                                </p>
                            </div>
                        </div>
                    ) : (
                        <SortableContext
                            items={pageBlocks.map((b: PageBlock) => b.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-4">
                                {pageBlocks.map((block: PageBlock) => (
                                    <SortableBlockItem
                                        key={block.id}
                                        block={block}
                                        isPreview={isPreviewMode}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    )}
                </div>
            </ScrollArea>

            <DragOverlay>
                {activeBlock && (
                    <div className="rounded-lg border bg-background p-4 shadow-lg">
                        <BlockRenderer block={activeBlock} isPreview />
                    </div>
                )}
            </DragOverlay>
        </DndContext>
    );
}
