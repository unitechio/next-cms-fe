export * from './index';

export interface BlockFilters {
    page: number;
    limit: number;
    search?: string;
    category?: string;
    type?: string;
}
