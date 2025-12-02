// Document Tags Component
'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus, Tag } from 'lucide-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

interface DocumentTagsProps {
    documentId: number;
    tags?: string[];
    onTagsChange?: (tags: string[]) => void;
    readOnly?: boolean;
}

const TAG_COLORS = [
    'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
    'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
    'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
    'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
    'bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-500/20',
];

export function DocumentTags({
    documentId,
    tags = [],
    onTagsChange,
    readOnly = false,
}: DocumentTagsProps) {
    const [newTag, setNewTag] = useState('');
    const [open, setOpen] = useState(false);

    const handleAddTag = () => {
        if (!newTag.trim()) return;
        if (tags.includes(newTag.trim())) return;

        const updatedTags = [...tags, newTag.trim()];
        onTagsChange?.(updatedTags);
        setNewTag('');
        setOpen(false);
    };

    const handleRemoveTag = (tag: string) => {
        const updatedTags = tags.filter(t => t !== tag);
        onTagsChange?.(updatedTags);
    };

    const getTagColor = (index: number) => {
        return TAG_COLORS[index % TAG_COLORS.length];
    };

    return (
        <div className="flex flex-wrap gap-2 items-center">
            {tags.map((tag, index) => (
                <Badge
                    key={tag}
                    variant="secondary"
                    className={getTagColor(index)}
                >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                    {!readOnly && (
                        <button
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 hover:text-destructive"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    )}
                </Badge>
            ))}

            {!readOnly && (
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="h-6">
                            <Plus className="w-3 h-3 mr-1" />
                            Add Tag
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64">
                        <div className="space-y-2">
                            <Input
                                placeholder="Enter tag name..."
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleAddTag();
                                }}
                            />
                            <Button size="sm" className="w-full" onClick={handleAddTag}>
                                Add Tag
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            )}
        </div>
    );
}
