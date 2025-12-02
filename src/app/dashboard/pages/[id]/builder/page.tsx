'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { pageService } from '@/features/pages/services/page.service';
import { blockService } from '@/features/blocks/services/block.service';
import { usePageBuilderStore } from '@/features/page-builder/store/page-builder-store';
import { BuilderTopBar } from '@/features/page-builder/components/builder-top-bar';
import { BlockLibrarySidebar } from '@/features/page-builder/components/block-library-sidebar';
import { BuilderCanvas } from '@/features/page-builder/components/builder-canvas';
import { BlockSettingsSidebar } from '@/features/page-builder/components/block-settings-sidebar';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from 'react-resizable-panels';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function PageBuilderPage() {
    const params = useParams();
    const router = useRouter();
    const pageId = params.id as string;
    const [loading, setLoading] = useState(true);
    const [availableBlocks, setAvailableBlocks] = useState<any[]>([]);

    const { setCurrentPage, setPageBlocks, reset } = usePageBuilderStore();

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                // Load page data
                const pageData = await pageService.getPage(pageId);
                setCurrentPage(pageData);
                setPageBlocks(pageData.blocks || []);

                // Load available blocks
                const blocksData = await blockService.getBlocks({ page: 1, limit: 100 });
                setAvailableBlocks(blocksData.data || []);
            } catch (error) {
                toast.error('Failed to load page builder');
                console.error(error);
                router.push('/dashboard/pages');
            } finally {
                setLoading(false);
            }
        };

        loadData();

        return () => {
            reset();
        };
    }, [pageId]);

    if (loading) {
        return (
            <div className="flex h-screen flex-col">
                <Skeleton className="h-16 w-full" />
                <div className="flex flex-1">
                    <Skeleton className="h-full w-64" />
                    <Skeleton className="h-full flex-1" />
                    <Skeleton className="h-full w-80" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen flex-col">
            <BuilderTopBar />

            <ResizablePanelGroup direction="horizontal" className="flex-1">
                <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                    <BlockLibrarySidebar blocks={availableBlocks} />
                </ResizablePanel>

                <ResizableHandle className="w-1 bg-border" />

                <ResizablePanel defaultSize={55} minSize={30}>
                    <BuilderCanvas />
                </ResizablePanel>

                <ResizableHandle className="w-1 bg-border" />

                <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
                    <BlockSettingsSidebar />
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
