'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ImageUpload } from '@/components/ui/image-upload';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { pageService } from '../services/page.service';
import { Page } from '../types';
import { Layout, Save } from 'lucide-react';

const pageSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1, 'Slug is required'),
    template: z.string().default('default'),
    status: z.enum(['draft', 'published']).default('draft'),
    seo_title: z.string().optional(),
    seo_description: z.string().optional(),
    og_image: z.string().optional(),
});

type PageFormData = z.infer<typeof pageSchema>;

interface PageFormProps {
    pageId?: string;
    initialData?: Page;
}

export function PageForm({ pageId, initialData }: PageFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [ogImage, setOgImage] = useState<string>(initialData?.og_image || '');

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<PageFormData>({
        resolver: zodResolver(pageSchema),
        defaultValues: initialData || {
            title: '',
            slug: '',
            template: 'default',
            status: 'draft',
        },
    });

    const title = watch('title');

    // Auto-generate slug from title
    useEffect(() => {
        if (!pageId && title) {
            const slug = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            setValue('slug', slug);
        }
    }, [title, pageId, setValue]);

    const onSubmit = async (data: PageFormData) => {
        try {
            setLoading(true);
            const pageData = {
                ...data,
                og_image: ogImage || undefined,
            };

            if (pageId) {
                await pageService.updatePage(pageId, pageData);
                toast.success('Page updated successfully');
            } else {
                const newPage = await pageService.createPage(pageData);
                toast.success('Page created successfully');
                router.push(`/dashboard/pages/${newPage.id}/builder`);
                return;
            }
            router.push('/dashboard/pages');
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to save page');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async () => {
        if (!pageId) {
            toast.error('Please save the page first');
            return;
        }

        try {
            setLoading(true);
            await pageService.publishPage(pageId);
            toast.success('Page published successfully');
            router.push('/dashboard/pages');
        } catch (error) {
            toast.error('Failed to publish page');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">{pageId ? 'Edit Page' : 'Create Page'}</h1>
                    <p className="text-muted-foreground">
                        {pageId ? 'Update page details' : 'Create a new page'}
                    </p>
                </div>
                <div className="flex gap-2">
                    {pageId && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push(`/dashboard/pages/${pageId}/builder`)}
                        >
                            <Layout className="mr-2 h-4 w-4" />
                            Open Builder
                        </Button>
                    )}
                    <Button type="submit" disabled={loading}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Draft
                    </Button>
                    {pageId && (
                        <Button type="button" onClick={handlePublish} disabled={loading}>
                            Publish
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    {...register('title')}
                                    placeholder="Enter page title"
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-destructive">{errors.title.message}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="slug">Slug *</Label>
                                <Input
                                    id="slug"
                                    {...register('slug')}
                                    placeholder="page-slug"
                                />
                                {errors.slug && (
                                    <p className="mt-1 text-sm text-destructive">{errors.slug.message}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="template">Template</Label>
                                <Select
                                    defaultValue={initialData?.template || 'default'}
                                    onValueChange={(value) => setValue('template', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="default">Default</SelectItem>
                                        <SelectItem value="landing">Landing Page</SelectItem>
                                        <SelectItem value="blog">Blog</SelectItem>
                                        <SelectItem value="product">Product</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>SEO Metadata</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="seo_title">SEO Title</Label>
                                <Input
                                    id="seo_title"
                                    {...register('seo_title')}
                                    placeholder="SEO optimized title"
                                />
                            </div>

                            <div>
                                <Label htmlFor="seo_description">SEO Description</Label>
                                <Textarea
                                    id="seo_description"
                                    {...register('seo_description')}
                                    placeholder="SEO meta description"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <Label>OG Image</Label>
                                <ImageUpload
                                    value={ogImage}
                                    onChange={setOgImage}
                                    onRemove={() => setOgImage('')}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}
