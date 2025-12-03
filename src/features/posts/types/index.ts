export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: 'draft' | 'published' | 'archived';
  author_id: string;
  author?: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
  featured_image?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
  category_ids?: number[];
  categories?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  // SEO fields
  meta_title?: string;
  meta_description?: string;
  // Analytics fields
  view_count?: number;
  avg_time_on_page?: number; // in seconds
  bounce_rate?: number; // percentage
  seo_score?: number; // 0-100
  traffic_sources?: Record<string, number>;
}

export interface PostFilters {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  author_id?: string;
}
