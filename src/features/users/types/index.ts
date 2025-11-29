export interface Role {
  id: string;
  name: string;
  description?: string;
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
  resource: string;
  action: string;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string; // Legacy field for backward compatibility
  roles?: Role[]; // New field for multiple roles
  permissions?: Permission[]; // Effective permissions
  created_at: string;
  updated_at: string;
  status: 'active' | 'inactive' | 'banned';
  avatar_url?: string;
  phone?: string;
  department?: string;
  position?: string;
  last_login_at?: string;
}

export interface UserFilters {
  page: number;
  limit: number;
  search?: string;
  role?: string;
  status?: string;
}

export interface CreateUserRequest {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  role_ids?: string[];
  status?: 'active' | 'inactive' | 'banned';
  phone?: string;
  department?: string;
  position?: string;
}

export interface UpdateUserRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  role_ids?: string[];
  status?: 'active' | 'inactive' | 'banned';
  phone?: string;
  department?: string;
  position?: string;
}
