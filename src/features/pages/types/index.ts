export interface Page {
    id: string;
    title: string;
    slug: string;
    template: string;
    status: 'draft' | 'published';
    seo_title?: string;
    seo_description?: string;
    og_image?: string;
    blocks?: PageBlock[];
    created_at: string;
    updated_at: string;
    published_at?: string;
    created_by?: string;
    updated_by?: string;
}

export interface PageBlock {
    id: string;
    block_id: string;
    page_id: string;
    order: number;
    config: Record<string, any>;
    language?: string;
    parent_block_id?: string;
    block?: Block;
    created_at?: string;
    updated_at?: string;
}

export interface Block {
    id: string;
    name: string;
    type: string;
    category: string;
    schema: BlockSchema;
    preview_template?: string;
    created_at: string;
    updated_at: string;
}

export interface BlockSchema {
    fields: BlockField[];
}

export interface BlockField {
    name: string;
    type: 'text' | 'richtext' | 'number' | 'boolean' | 'select' | 'image' | 'video' | 'repeater' | 'nested';
    label: string;
    required?: boolean;
    default?: any;
    validation?: {
        min?: number;
        max?: number;
        pattern?: string;
    };
    options?: Array<{ label: string; value: string }>;
    conditional?: {
        field: string;
        value: any;
    };
    fields?: BlockField[]; // For nested/repeater
}

export interface PageFilters {
    page: number;
    limit: number;
    search?: string;
    status?: 'draft' | 'published';
}

export interface PageVersion {
    id: string;
    page_id: string;
    version_number: number;
    title: string;
    slug: string;
    template?: string;
    seo_title?: string;
    seo_description?: string;
    og_image?: string;
    blocks_snapshot: any[];
    created_at: string;
    created_by?: string;
    change_description?: string;
}
