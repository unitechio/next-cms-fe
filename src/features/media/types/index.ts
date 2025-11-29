export interface Media {
  id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  url: string;
  path: string;
  created_at: string;
  updated_at: string;
  uploaded_by: string;
}

export interface MediaFilters {
  page: number;
  limit: number;
  search?: string;
  type?: string;
}
