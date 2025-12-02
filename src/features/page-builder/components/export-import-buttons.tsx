'use client';

import { usePageBuilderStore } from '../store/page-builder-store';
import { Button } from '@/components/ui/button';
import { Download, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { useRef } from 'react';

export function ExportImportButtons() {
    const { currentPage, pageBlocks } = usePageBuilderStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = () => {
        if (!currentPage) {
            toast.error('No page to export');
            return;
        }

        const exportData = {
            page: {
                title: currentPage.title,
                slug: currentPage.slug,
                template: currentPage.template,
                seo_title: currentPage.seo_title,
                seo_description: currentPage.seo_description,
                og_image: currentPage.og_image,
            },
            blocks: pageBlocks.map((block) => ({
                block_id: block.block_id,
                order: block.order,
                config: block.config,
                language: block.language,
                block: block.block,
            })),
            exported_at: new Date().toISOString(),
            version: '1.0',
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentPage.slug}-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast.success('Page configuration exported');
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importData = JSON.parse(e.target?.result as string);

                // Validate import data
                if (!importData.page || !importData.blocks) {
                    throw new Error('Invalid import file format');
                }

                // TODO: Apply imported data to current page
                // This would require updating the page and blocks
                console.log('Import data:', importData);
                toast.success('Page configuration imported (preview only)');
            } catch (error) {
                toast.error('Failed to import configuration');
                console.error(error);
            }
        };
        reader.readAsText(file);

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
            >
                <Upload className="mr-2 h-4 w-4" />
                Import
            </Button>
            <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImport}
            />
        </div>
    );
}
