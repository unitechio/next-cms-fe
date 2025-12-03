// Customer Types
export interface Customer {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
    company?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
    status: CustomerStatus;
    notes?: string;
    tags?: string[];
    source?: string;
    assigned_to?: string; // UUID
    assigned_user?: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
    };
    created_at: string;
    updated_at: string;
}

export type CustomerStatus = 'active' | 'inactive' | 'suspended' | 'pending';

export interface CustomerFilter {
    search?: string;
    status?: CustomerStatus;
    source?: string;
    assigned_to?: string;
    page: number;
    limit: number;
}

export interface CreateCustomerRequest {
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
    company?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
    notes?: string;
    tags?: string[];
    source?: string;
    assigned_to?: string;
}

export interface UpdateCustomerRequest {
    email?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    company?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
    status?: CustomerStatus;
    notes?: string;
    tags?: string[];
    source?: string;
}

export interface PaginatedCustomersResponse {
    data: Customer[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
