export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  created_at: string;
  updated_at: string;
  status: 'active' | 'inactive' | 'banned';
  avatar_url?: string;
}

export interface UserFilters {
  page: number;
  limit: number;
  search?: string;
  role?: string;
  status?: string;
}
