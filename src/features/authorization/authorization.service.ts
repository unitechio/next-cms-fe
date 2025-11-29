import { apiClient } from '@/lib/axios';
import {
  Module,
  Department,
  Service,
  Scope,
  PaginatedResult,
  PaginationParams,
  CreateModuleRequest,
  UpdateModuleRequest,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  CreateServiceRequest,
  UpdateServiceRequest,
  CreateScopeRequest,
  UpdateScopeRequest,
} from './types';

export const authorizationService = {
  // Modules
  getModules: async (params?: PaginationParams) => {
    const { data } = await apiClient.get<PaginatedResult<Module>>(`/modules`, { params });
    return data;
  },

  getActiveModules: async () => {
    const { data } = await apiClient.get<Module[]>(`/modules/active`);
    return data;
  },

  getModule: async (id: number) => {
    const { data } = await apiClient.get<Module>(`/modules/${id}`);
    return data;
  },

  createModule: async (req: CreateModuleRequest) => {
    const { data } = await apiClient.post<Module>(`/modules`, req);
    return data;
  },

  updateModule: async (id: number, req: UpdateModuleRequest) => {
    const { data } = await apiClient.put<Module>(`/modules/${id}`, req);
    return data;
  },

  deleteModule: async (id: number) => {
    await apiClient.delete(`/modules/${id}`);
  },

  // Departments
  getDepartments: async (params?: PaginationParams) => {
    const { data } = await apiClient.get<PaginatedResult<Department>>(`/departments`, { params });
    return data;
  },

  getActiveDepartments: async () => {
    const { data } = await apiClient.get<Department[]>(`/departments/active`);
    return data;
  },

  getDepartmentsByModule: async (moduleId: number) => {
    const { data } = await apiClient.get<Department[]>(`/modules/${moduleId}/departments`);
    return data;
  },

  getDepartment: async (id: number) => {
    const { data } = await apiClient.get<Department>(`/departments/${id}`);
    return data;
  },

  createDepartment: async (req: CreateDepartmentRequest) => {
    const { data } = await apiClient.post<Department>(`/departments`, req);
    return data;
  },

  updateDepartment: async (id: number, req: UpdateDepartmentRequest) => {
    const { data } = await apiClient.put<Department>(`/departments/${id}`, req);
    return data;
  },

  deleteDepartment: async (id: number) => {
    await apiClient.delete(`/departments/${id}`);
  },

  // Services
  getServices: async (params?: PaginationParams) => {
    const { data } = await apiClient.get<PaginatedResult<Service>>(`/services`, { params });
    return data;
  },

  getActiveServices: async () => {
    const { data } = await apiClient.get<Service[]>(`/services/active`);
    return data;
  },

  getServicesByDepartment: async (deptId: number) => {
    const { data } = await apiClient.get<Service[]>(`/departments/${deptId}/services`);
    return data;
  },

  getService: async (id: number) => {
    const { data } = await apiClient.get<Service>(`/services/${id}`);
    return data;
  },

  createService: async (req: CreateServiceRequest) => {
    const { data } = await apiClient.post<Service>(`/services`, req);
    return data;
  },

  updateService: async (id: number, req: UpdateServiceRequest) => {
    const { data } = await apiClient.put<Service>(`/services/${id}`, req);
    return data;
  },

  deleteService: async (id: number) => {
    await apiClient.delete(`/services/${id}`);
  },

  // Scopes
  getScopes: async (params?: PaginationParams) => {
    const { data } = await apiClient.get<PaginatedResult<Scope>>(`/scopes`, { params });
    return data;
  },

  getAllScopes: async () => {
    const { data } = await apiClient.get<Scope[]>(`/scopes/all`);
    return data;
  },

  getScope: async (id: number) => {
    const { data } = await apiClient.get<Scope>(`/scopes/${id}`);
    return data;
  },

  createScope: async (req: CreateScopeRequest) => {
    const { data } = await apiClient.post<Scope>(`/scopes`, req);
    return data;
  },

  updateScope: async (id: number, req: UpdateScopeRequest) => {
    const { data } = await apiClient.put<Scope>(`/scopes/${id}`, req);
    return data;
  },

  deleteScope: async (id: number) => {
    await apiClient.delete(`/scopes/${id}`);
  },
};
