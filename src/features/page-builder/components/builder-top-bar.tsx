'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { usePageBuilderStore } from '../store/page-builder-store';
import { pageService } from '@/features/pages/services/page.service';
import { toast } from 'sonner';
import { ArrowLeft, Undo, Redo, Eye, Save, Upload, History } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { LanguageSwitcher } from './language-switcher';
import { ThemeManager } from './theme-manager';
import { ExportImportButtons } from './export-import-buttons';
import { VersionHistoryDialog } from '@/features/pages/components/version-history-dialog';

export function BuilderTopBar() {
    const router = useRouter();
    const [versionDialogOpen, setVersionDialogOpen] = useState(false);
    const {
        currentPage,
        pageBlocks,
        isPreviewMode,
        setPreviewMode,
        undo,
        redo,
        canUndo,
        canRedo,
        isDirty,
        setDirty,
    } = usePageBuilderStore();

    const handleSave = async () => {
        if (!currentPage) return;

        try {
            // Save blocks order
            await pageService.reorderBlocks(
                currentPage.id,
                pageBlocks.map((block, index) => ({ id: block.id, order: index }))
            );

            // Update each block config
            for (const block of pageBlocks) {
                if (block.id.startsWith('temp-')) {
                    // New block - add to page
                    await pageService.addBlockToPage(currentPage.id, {
                        block_id: block.block_id,
                        order: block.order,
                        config: block.config,
                        language: block.language || 'en',
                    });
                } else {
                    // Existing block - update
                    await pageService.updatePageBlock(currentPage.id, block.id, {
                        config: block.config,
                        order: block.order,
                    });
                }
            }

            setDirty(false);
            toast.success('Changes saved successfully');
        } catch (error) {
            toast.error('Failed to save changes');
            console.error(error);
        }
    };

    const handlePublish = async () => {
        if (!currentPage) return;

        try {
            await handleSave();
            await pageService.publishPage(currentPage.id);
            toast.success('Page published successfully');
            router.push('/dashboard/pages');
        } catch (error) {
            toast.error('Failed to publish page');
            console.error(error);
        }
    };

    return (
        <div className="flex h-16 items-center justify-between border-b bg-background px-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push('/dashboard/pages')}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <div>
                    <h2 className="font-semibold">{currentPage?.title || 'Untitled Page'}</h2>
                    <p className="text-xs text-muted-foreground">
                        {isDirty ? 'Unsaved changes' : 'All changes saved'}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <Separator orientation="vertical" className="h-6" />
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => undo()}
                    disabled={!canUndo()}
                >
                    <Undo className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => redo()}
                    disabled={!canRedo()}
                >
                    <Redo className="h-4 w-4" />
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPreviewMode(!isPreviewMode)}
                >
                    <Eye className="mr-2 h-4 w-4" />
                    {isPreviewMode ? 'Edit' : 'Preview'}
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setVersionDialogOpen(true)}
                >
                    <History className="mr-2 h-4 w-4" />
                    History
                </Button>
                <ThemeManager />
                <ExportImportButtons />
                <Separator orientation="vertical" className="h-6" />
                <Button variant="outline" size="sm" onClick={handleSave} disabled={!isDirty}>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                </Button>
                <Button size="sm" onClick={handlePublish}>
                    <Upload className="mr-2 h-4 w-4" />
                    Publish
                </Button>
            </div>

            {currentPage && (
                <VersionHistoryDialog
                    pageId={currentPage.id}
                    open={versionDialogOpen}
                    onOpenChange={setVersionDialogOpen}
                    onRevert={() => {
                        // Reload page data after revert
                        window.location.reload();
                    }}
                />
            )}
        </div>
    );
}
