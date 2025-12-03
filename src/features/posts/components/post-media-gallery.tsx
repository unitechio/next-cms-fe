'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MediaLibraryModal } from '@/features/media/components/media-library-modal';
import { Image as ImageIcon, X, Plus } from 'lucide-react';
import Image from 'next/image';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface MediaItem {
    id: string;
    url: string;
    type: 'image' | 'file';
    name?: string;
}

interface PostMediaGalleryProps {
    media: MediaItem[];
    onChange: (media: MediaItem[]) => void;
}

export function PostMediaGallery({ media, onChange }: PostMediaGalleryProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddMedia = (url: string, type: 'image' | 'file') => {
        const newItem: MediaItem = {
            id: Date.now().toString(),
            url,
            type,
            name: url.split('/').pop(),
        };
        onChange([...media, newItem]);
        setIsModalOpen(false);
    };

    const handleRemove = (id: string) => {
        onChange(media.filter((item) => item.id !== id));
    };

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const items = Array.from(media);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        onChange(items);
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Media Gallery</CardTitle>
                            <CardDescription>
                                Add images and files to your post
                            </CardDescription>
                        </div>
                        <Button onClick={() => setIsModalOpen(true)} size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Media
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {media.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg">
                            <ImageIcon className="w-12 h-12 text-muted-foreground mb-4" />
                            <p className="text-sm text-muted-foreground mb-4">
                                No media added yet
                            </p>
                            <Button variant="outline" onClick={() => setIsModalOpen(true)}>
                                Add Media
                            </Button>
                        </div>
                    ) : (
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="media-gallery" direction="horizontal">
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                                    >
                                        {media.map((item, index) => (
                                            <Draggable key={item.id} draggableId={item.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`relative group aspect-square rounded-lg overflow-hidden border ${snapshot.isDragging ? 'shadow-lg' : ''
                                                            }`}
                                                    >
                                                        {item.type === 'image' ? (
                                                            <Image
                                                                src={item.url}
                                                                alt={item.name || 'Media'}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-muted">
                                                                <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                                            </div>
                                                        )}
                                                        <Button
                                                            variant="destructive"
                                                            size="icon"
                                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            onClick={() => handleRemove(item.id)}
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </Button>
                                                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity truncate">
                                                            {item.name}
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    )}
                </CardContent>
            </Card>

            <MediaLibraryModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                onSelect={handleAddMedia}
            />
        </>
    );
}
