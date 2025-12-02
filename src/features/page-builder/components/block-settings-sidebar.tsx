'use client';

import { usePageBuilderStore } from '../store/page-builder-store';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DynamicFormGenerator } from './dynamic-form-generator';

export function BlockSettingsSidebar() {
    const { pageBlocks, selectedBlockId, updateBlock } = usePageBuilderStore();

    const selectedBlock = pageBlocks.find((b) => b.id === selectedBlockId);

    if (!selectedBlock) {
        return (
            <div className="flex h-full flex-col border-l bg-background">
                <div className="border-b p-4">
                    <h3 className="font-semibold">Block Settings</h3>
                </div>
                <div className="flex flex-1 items-center justify-center p-4">
                    <p className="text-center text-sm text-muted-foreground">
                        Select a block to edit its settings
                    </p>
                </div>
            </div>
        );
    }

    const handleConfigChange = (config: Record<string, any>) => {
        updateBlock(selectedBlock.id, config);
    };

    return (
        <div className="flex h-full flex-col border-l bg-background">
            <div className="border-b p-4">
                <h3 className="font-semibold">Block Settings</h3>
                <p className="text-sm text-muted-foreground">{selectedBlock.block?.name}</p>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4">
                    {selectedBlock.block?.schema ? (
                        <DynamicFormGenerator
                            schema={selectedBlock.block.schema}
                            config={selectedBlock.config}
                            onChange={handleConfigChange}
                        />
                    ) : (
                        <p className="text-sm text-muted-foreground">No settings available</p>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
