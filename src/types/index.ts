export interface Meta {
  page: number;
  limit: number;
  total_pages: number;
  total_records: number;
}

export interface ApiResponse<T> {
  data: T;
  meta: Meta;
  message?: string;
  status?: number;
}
