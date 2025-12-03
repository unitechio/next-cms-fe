import { apiClient } from '@/lib/axios';
import {
    Customer,
    CustomerFilter,
    CreateCustomerRequest,
    UpdateCustomerRequest,
    PaginatedCustomersResponse,
} from '../types';

export const customerService = {
    /**
     * Get customers with filtering and pagination
     */
    getCustomers: async (filter: CustomerFilter) => {
        const params = new URLSearchParams();
        if (filter.search) params.append('search', filter.search);
        if (filter.status) params.append('status', filter.status);
        if (filter.source) params.append('source', filter.source);
        if (filter.assigned_to) params.append('assigned_to', filter.assigned_to);
        params.append('page', filter.page.toString());
        params.append('limit', filter.limit.toString());

        const response = await apiClient.get<PaginatedCustomersResponse>(
            `/customers?${params.toString()}`
        );
        return response.data;
    },

    /**
     * Get a single customer by ID
     */
    getCustomer: async (id: number) => {
        const response = await apiClient.get<Customer>(`/customers/${id}`);
        return response.data;
    },

    /**
     * Create a new customer
     */
    createCustomer: async (data: CreateCustomerRequest) => {
        const response = await apiClient.post<{ data: Customer }>('/customers', data);
        return response.data.data;
    },

    /**
     * Update a customer
     */
    updateCustomer: async (id: number, data: UpdateCustomerRequest) => {
        const response = await apiClient.put<{ data: Customer }>(`/customers/${id}`, data);
        return response.data.data;
    },

    /**
     * Delete a customer
     */
    deleteCustomer: async (id: number) => {
        await apiClient.delete(`/customers/${id}`);
    },

    /**
     * Assign customer to user
     */
    assignToUser: async (customerId: number, userId: string) => {
        const response = await apiClient.post<{ data: Customer }>(
            `/customers/${customerId}/assign`,
            { user_id: userId }
        );
        return response.data.data;
    },

    /**
     * Unassign customer from user
     */
    unassignFromUser: async (customerId: number) => {
        const response = await apiClient.post<{ data: Customer }>(
            `/customers/${customerId}/unassign`
        );
        return response.data.data;
    },

    /**
     * Update customer status
     */
    updateStatus: async (customerId: number, status: string) => {
        const response = await apiClient.patch<{ data: Customer }>(
            `/customers/${customerId}/status`,
            { status }
        );
        return response.data.data;
    },

    /**
     * Search customers
     */
    searchCustomers: async (query: string) => {
        const response = await apiClient.get<Customer[]>(
            `/customers/search?q=${encodeURIComponent(query)}`
        );
        return response.data;
    },
};
