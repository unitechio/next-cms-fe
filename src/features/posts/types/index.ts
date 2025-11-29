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
  categories?: string[];
}

export interface PostFilters {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  author_id?: string;
}
