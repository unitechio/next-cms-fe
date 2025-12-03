'use client';

import { useState } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { blockService } from '../services/block.service';
import { Block, BlockSchema } from '@/features/pages/types';
import { Save } from 'lucide-react';
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const blockSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    type: z.string().min(1, 'Type is required'),
    category: z.string().min(1, 'Category is required'),
    schema: z.any(),
});

type BlockFormData = z.infer<typeof blockSchema>;

interface BlockFormProps {
    blockId?: string;
    initialData?: Block;
}

const defaultSchema: BlockSchema = {
    fields: [
        {
            name: 'title',
            type: 'text',
            label: 'Title',
            required: true,
        },
    ],
};

export function BlockForm({ blockId, initialData }: BlockFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [schemaJson, setSchemaJson] = useState(
        JSON.stringify(initialData?.schema || defaultSchema, null, 2)
    );
    const [schemaError, setSchemaError] = useState('');

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<BlockFormData>({
        resolver: zodResolver(blockSchema),
        defaultValues: initialData || {
            name: '',
            type: '',
            category: 'Custom',
        },
    });

    const handleSchemaChange = (value: string | undefined) => {
        if (!value) return;
        setSchemaJson(value);

        try {
            const parsed = JSON.parse(value);
            setValue('schema', parsed);
            setSchemaError('');
        } catch (error) {
            setSchemaError('Invalid JSON');
        }
    };

    const onSubmit = async (data: BlockFormData) => {
        if (schemaError) {
            toast.error('Please fix schema errors');
            return;
        }

        try {
            setLoading(true);
            const blockData = {
                ...data,
                schema: JSON.parse(schemaJson),
            };

            if (blockId) {
                await blockService.updateBlock(blockId, blockData);
                toast.success('Block updated successfully');
            } else {
                await blockService.createBlock(blockData);
                toast.success('Block created successfully');
            }
            router.push('/dashboard/blocks');
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to save block');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">{blockId ? 'Edit Block' : 'Create Block'}</h1>
                    <p className="text-muted-foreground">
                        {blockId ? 'Update block configuration' : 'Create a new reusable block'}
                    </p>
                </div>
                <Button type="submit" disabled={loading} className="cursor-pointer">
                    <Save className="mr-2 h-4 w-4" />
                    Save Block
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Block Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="name">Name *</Label>
                                <Input
                                    id="name"
                                    {...register('name')}
                                    placeholder="Hero Banner"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="type">Type *</Label>
                                <Input
                                    id="type"
                                    {...register('type')}
                                    placeholder="hero-banner"
                                />
                                {errors.type && (
                                    <p className="mt-1 text-sm text-destructive">{errors.type.message}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="category">Category *</Label>
                                <Select
                                    defaultValue={initialData?.category || 'Custom'}
                                    onValueChange={(value) => setValue('category', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Hero">Hero</SelectItem>
                                        <SelectItem value="Content">Content</SelectItem>
                                        <SelectItem value="Media">Media</SelectItem>
                                        <SelectItem value="Commerce">Commerce</SelectItem>
                                        <SelectItem value="Custom">Custom</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>JSON Schema</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="h-96 overflow-hidden rounded-md border">
                                    <MonacoEditor
                                        height="100%"
                                        defaultLanguage="json"
                                        value={schemaJson}
                                        onChange={handleSchemaChange}
                                        theme="vs-dark"
                                        options={{
                                            minimap: { enabled: false },
                                            fontSize: 14,
                                            lineNumbers: 'on',
                                            scrollBeyondLastLine: false,
                                            automaticLayout: true,
                                        }}
                                    />
                                </div>
                                {schemaError && (
                                    <p className="text-sm text-destructive">{schemaError}</p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Define the fields for this block using JSON schema format
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}
