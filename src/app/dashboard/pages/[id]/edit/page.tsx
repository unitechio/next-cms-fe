'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { PageForm } from '@/features/pages/components/page-form';
import { pageService } from '@/features/pages/services/page.service';
import { Page } from '@/features/pages/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditPagePage() {
    const params = useParams();
    const pageId = params.id as string;
    const [page, setPage] = useState<Page | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPage = async () => {
            try {
                const data = await pageService.getPage(pageId);
                setPage(data);
            } catch (error) {
                console.error('Failed to load page:', error);
            } finally {
                setLoading(false);
            }
        };

        loadPage();
    }, [pageId]);

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-12 w-64" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    if (!page) {
        return <div>Page not found</div>;
    }

    return <PageForm pageId={pageId} initialData={page} />;
}
