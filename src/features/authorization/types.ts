export interface Module {
  id: number;
  code: string;
  name: string;
  display_name: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  is_active: boolean;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: number;
  module_id: number;
  code: string;
  name: string;
  display_name: string;
  description: string;
  parent_id?: number;
  manager_id?: number;
  is_active: boolean;
  is_system: boolean;
  created_at: string;
  updated_at: string;
  module?: Module;
  parent?: Department;
  children?: Department[];
}

export interface Service {
  id: number;
  department_id: number;
  code: string;
  name: string;
  display_name: string;
  description: string;
  endpoint: string;
  is_active: boolean;
  is_system: boolean;
  created_at: string;
  updated_at: string;
  department?: Department;
}

export enum ScopeLevel {
  ORGANIZATION = 'organization',
  DEPARTMENT = 'department',
  TEAM = 'team',
  PERSONAL = 'personal',
}

export interface Scope {
  id: number;
  code: string;
  name: string;
  display_name: string;
  description: string;
  level: ScopeLevel;
  priority: number;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface CreateModuleRequest {
  code: string;
  name: string;
  display_name?: string;
  description?: string;
  icon?: string;
  color?: string;
  order?: number;
  is_active?: boolean;
}

export interface UpdateModuleRequest {
  name?: string;
  display_name?: string;
  description?: string;
  icon?: string;
  color?: string;
  order?: number;
  is_active?: boolean;
}

export interface CreateDepartmentRequest {
  module_id: number;
  code: string;
  name: string;
  display_name?: string;
  description?: string;
  parent_id?: number;
  manager_id?: number;
  is_active?: boolean;
}

export interface UpdateDepartmentRequest {
  name?: string;
  display_name?: string;
  description?: string;
  parent_id?: number;
  manager_id?: number;
  is_active?: boolean;
}

export interface CreateServiceRequest {
  department_id: number;
  code: string;
  name: string;
  display_name?: string;
  description?: string;
  endpoint?: string;
  is_active?: boolean;
}

export interface UpdateServiceRequest {
  name?: string;
  display_name?: string;
  description?: string;
  endpoint?: string;
  is_active?: boolean;
}

export interface CreateScopeRequest {
  code: string;
  name: string;
  display_name?: string;
  description?: string;
  level: ScopeLevel;
  priority: number;
}

export interface UpdateScopeRequest {
  name?: string;
  display_name?: string;
  description?: string;
  level?: ScopeLevel;
  priority?: number;
}
