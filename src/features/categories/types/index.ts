export type CategoryType = 'blog' | 'header' | 'footer' | 'sidebar';
export type CategoryStatus = 'active' | 'inactive';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent_id?: number | null;
  order: number;
  type: CategoryType;
  status: CategoryStatus;
  created_at: string;
  updated_at: string;
  // Populated fields
  parent?: Category;
  children_count?: number;
}

export interface CategoryTree extends Category {
  children: CategoryTree[];
}

export interface CategoryFilters {
  page: number;
  limit: number;
  search?: string;
  type?: CategoryType;
  status?: CategoryStatus;
  parent_id?: number | null;
}

export interface CreateCategoryRequest {
  name: string;
  slug: string;
  description?: string;
  parent_id?: number | null;
  order?: number;
  type: CategoryType;
  status: CategoryStatus;
}

export interface UpdateCategoryRequest {
  name?: string;
  slug?: string;
  description?: string;
  parent_id?: number | null;
  order?: number;
  type?: CategoryType;
  status?: CategoryStatus;
}

export interface ReorderCategoryRequest {
  parent_id?: number | null;
  order: number;
}
