/**
 * Parse API response that may have nested structure
 * Handles multiple formats:
 * 1. { success: true, data: { data: [...], total, page, limit } }
 * 2. { data: [...], meta: { total_pages, ... } }
 * 3. { data: [...] }
 * 4. [...]
 */
export function parseApiResponse<T>(response: any): {
    data: T[];
    totalPages: number;
} {
    // If response is already an array, return it directly
    if (Array.isArray(response)) {
        return { data: response, totalPages: 1 };
    }

    // Handle standard response format: { success: true, data: [...], meta: { ... } }
    if (response?.meta && Array.isArray(response?.data)) {
        let totalPages = 1;
        if (response.meta.pagination?.last_page) {
            totalPages = response.meta.pagination.last_page;
        } else if (response.meta.pagination?.total && response.meta.pagination?.per_page) {
            totalPages = Math.ceil(response.meta.pagination.total / response.meta.pagination.per_page);
        } else if (response.meta.total_pages) {
            totalPages = response.meta.total_pages;
        }
        return { data: response.data, totalPages };
    }

    // Extract the main data object (could be response.data or response itself)
    const mainData = response?.data || response;
    
    // Check if mainData has a nested data property (format 1)
    const itemsData = mainData?.data || mainData;
    
    // Ensure data is array
    const data = Array.isArray(itemsData) ? itemsData : [];
    
    // Calculate total pages
    let totalPages = 1;
    
    // Format 1: { data: { total, limit } }
    if (mainData?.total && mainData?.limit) {
        totalPages = Math.ceil(mainData.total / mainData.limit);
    }
    // Format 2: { meta: { total_pages } }
    else if (mainData?.meta?.total_pages) {
        totalPages = mainData.meta.total_pages;
    }
    // Format 2 alternative: { meta: { total, limit } }
    else if (mainData?.meta?.total && mainData?.meta?.limit) {
        totalPages = Math.ceil(mainData.meta.total / mainData.meta.limit);
    }
    // Format 3: { meta: { pagination: { total, per_page, last_page } } }
    else if (mainData?.meta?.pagination?.last_page) {
        totalPages = mainData.meta.pagination.last_page;
    }
    else if (mainData?.meta?.pagination?.total && mainData?.meta?.pagination?.per_page) {
        totalPages = Math.ceil(mainData.meta.pagination.total / mainData.meta.pagination.per_page);
    }
    
    return { data, totalPages };
}
