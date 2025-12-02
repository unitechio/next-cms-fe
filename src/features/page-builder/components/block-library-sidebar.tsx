'use client';

import { useState } from 'react';
import { Block } from '@/features/pages/types';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Search, GripVertical } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';

interface BlockLibrarySidebarProps {
    blocks: Block[];
}

function DraggableBlock({ block }: { block: Block }) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `block-library-${block.id}`,
        data: { block },
    });

    return (
        <Card
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`cursor-grab p-3 transition-all hover:border-primary ${isDragging ? 'opacity-50' : ''
                }`}
        >
            <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                    <div className="font-medium text-sm">{block.name}</div>
                    <div className="text-xs text-muted-foreground">{block.category}</div>
                </div>
            </div>
        </Card>
    );
}

export function BlockLibrarySidebar({ blocks }: BlockLibrarySidebarProps) {
    const [search, setSearch] = useState('');

    const filteredBlocks = blocks.filter(
        (block) =>
            block.name.toLowerCase().includes(search.toLowerCase()) ||
            block.category.toLowerCase().includes(search.toLowerCase())
    );

    // Group blocks by category
    const groupedBlocks = filteredBlocks.reduce((acc, block) => {
        if (!acc[block.category]) {
            acc[block.category] = [];
        }
        acc[block.category].push(block);
        return acc;
    }, {} as Record<string, Block[]>);

    return (
        <div className="flex h-full flex-col border-r bg-background">
            <div className="border-b p-4">
                <h3 className="mb-3 font-semibold">Block Library</h3>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search blocks..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="space-y-4 p-4">
                    {Object.entries(groupedBlocks).map(([category, categoryBlocks]) => (
                        <div key={category}>
                            <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                                {category}
                            </h4>
                            <div className="space-y-2">
                                {categoryBlocks.map((block) => (
                                    <DraggableBlock key={block.id} block={block} />
                                ))}
                            </div>
                        </div>
                    ))}
                    {filteredBlocks.length === 0 && (
                        <p className="text-center text-sm text-muted-foreground">
                            No blocks found
                        </p>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
