import { apiClient } from '@/lib/axios';
import {
    AnalyticsOverview,
    SEOMetrics,
    TopPost,
    TrafficData,
    DeviceBreakdown,
    GeographicData,
    ReferralSource,
    AnalyticsFilters,
    AnalyticsExportOptions,
} from '../types';

export const analyticsService = {
    /**
     * Get analytics overview statistics
     */
    getOverview: async (filters?: AnalyticsFilters): Promise<AnalyticsOverview> => {
        const params = new URLSearchParams();
        if (filters?.start_date) params.append('start_date', filters.start_date);
        if (filters?.end_date) params.append('end_date', filters.end_date);
        if (filters?.period) params.append('period', filters.period);

        try {
            const response = await apiClient.get<AnalyticsOverview>(
                `/analytics/overview?${params.toString()}`
            );
            return response.data;
        } catch (error) {
            // Return mock data for development
            return {
                total_posts: 432,
                total_views: 1234567,
                total_users: 12345,
                avg_time_on_page: 245,
                bounce_rate: 42,
                change_posts: 5.2,
                change_views: 24.3,
                change_users: 12.1,
                change_time: -3.2,
                change_bounce: -2.1,
            };
        }
    },

    /**
     * Get SEO metrics and scores
     */
    getSEOMetrics: async (filters?: AnalyticsFilters): Promise<SEOMetrics> => {
        const params = new URLSearchParams();
        if (filters?.start_date) params.append('start_date', filters.start_date);
        if (filters?.end_date) params.append('end_date', filters.end_date);

        try {
            const response = await apiClient.get<SEOMetrics>(
                `/analytics/seo?${params.toString()}`
            );
            return response.data;
        } catch (error) {
            // Return mock data for development
            return {
                overall_score: 78,
                meta_tags_score: 85,
                performance_score: 72,
                mobile_friendly_score: 90,
                backlinks_count: 1234,
                indexed_pages: 387,
                avg_page_speed: 2.3,
                keywords_ranking: [
                    { keyword: 'cms blog', position: 3, search_volume: 5400, change: 2 },
                    { keyword: 'next.js cms', position: 7, search_volume: 3200, change: -1 },
                    { keyword: 'headless cms', position: 12, search_volume: 8900, change: 5 },
                ],
                technical_issues: [
                    {
                        type: 'warning',
                        title: 'Missing alt tags',
                        description: 'Some images are missing alt attributes',
                        affected_pages: 12,
                    },
                    {
                        type: 'error',
                        title: 'Broken links',
                        description: 'Found broken internal links',
                        affected_pages: 3,
                    },
                ],
            };
        }
    },

    /**
     * Get top performing posts
     */
    getTopPosts: async (
        filters?: AnalyticsFilters & { limit?: number }
    ): Promise<TopPost[]> => {
        const params = new URLSearchParams();
        if (filters?.start_date) params.append('start_date', filters.start_date);
        if (filters?.end_date) params.append('end_date', filters.end_date);
        if (filters?.limit) params.append('limit', filters.limit.toString());

        try {
            const response = await apiClient.get<TopPost[]>(
                `/analytics/posts/top?${params.toString()}`
            );
            return response.data;
        } catch (error) {
            // Return mock data for development
            return [
                {
                    id: '1',
                    title: 'Getting Started with Next.js 14 and TypeScript',
                    slug: 'getting-started-nextjs-14-typescript',
                    views: 15234,
                    avg_time_on_page: 342,
                    bounce_rate: 35,
                    comments_count: 45,
                    shares_count: 234,
                    traffic_sources: [
                        { source: 'organic', visitors: 8234, percentage: 54 },
                        { source: 'social', visitors: 4123, percentage: 27 },
                        { source: 'direct', visitors: 2877, percentage: 19 },
                    ],
                    published_at: '2024-11-15T10:30:00Z',
                },
                {
                    id: '2',
                    title: 'Building a Modern CMS with Go and React',
                    slug: 'building-modern-cms-go-react',
                    views: 12456,
                    avg_time_on_page: 298,
                    bounce_rate: 38,
                    comments_count: 32,
                    shares_count: 189,
                    traffic_sources: [
                        { source: 'organic', visitors: 6789, percentage: 55 },
                        { source: 'referral', visitors: 3234, percentage: 26 },
                        { source: 'social', visitors: 2433, percentage: 19 },
                    ],
                    published_at: '2024-11-10T14:20:00Z',
                },
                {
                    id: '3',
                    title: 'SEO Best Practices for 2024',
                    slug: 'seo-best-practices-2024',
                    views: 9876,
                    avg_time_on_page: 412,
                    bounce_rate: 28,
                    comments_count: 67,
                    shares_count: 456,
                    traffic_sources: [
                        { source: 'organic', visitors: 7234, percentage: 73 },
                        { source: 'social', visitors: 1876, percentage: 19 },
                        { source: 'direct', visitors: 766, percentage: 8 },
                    ],
                    published_at: '2024-11-05T09:15:00Z',
                },
            ];
        }
    },

    /**
     * Get traffic data over time
     */
    getTrafficData: async (filters?: AnalyticsFilters): Promise<TrafficData[]> => {
        const params = new URLSearchParams();
        if (filters?.start_date) params.append('start_date', filters.start_date);
        if (filters?.end_date) params.append('end_date', filters.end_date);
        if (filters?.period) params.append('period', filters.period);

        try {
            const response = await apiClient.get<TrafficData[]>(
                `/analytics/traffic?${params.toString()}`
            );
            return response.data;
        } catch (error) {
            // Return mock data for development - last 30 days
            const data: TrafficData[] = [];
            const now = new Date();
            for (let i = 29; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                data.push({
                    date: date.toISOString().split('T')[0],
                    views: Math.floor(Math.random() * 5000) + 2000,
                    visitors: Math.floor(Math.random() * 3000) + 1000,
                    page_views: Math.floor(Math.random() * 7000) + 3000,
                    unique_visitors: Math.floor(Math.random() * 2500) + 800,
                    bounce_rate: Math.floor(Math.random() * 20) + 30,
                });
            }
            return data;
        }
    },

    /**
     * Get device breakdown statistics
     */
    getDeviceBreakdown: async (
        filters?: AnalyticsFilters
    ): Promise<DeviceBreakdown[]> => {
        const params = new URLSearchParams();
        if (filters?.start_date) params.append('start_date', filters.start_date);
        if (filters?.end_date) params.append('end_date', filters.end_date);

        try {
            const response = await apiClient.get<DeviceBreakdown[]>(
                `/analytics/devices?${params.toString()}`
            );
            return response.data;
        } catch (error) {
            // Return mock data for development
            return [
                { device: 'desktop', visitors: 6543, percentage: 53 },
                { device: 'mobile', visitors: 4321, percentage: 35 },
                { device: 'tablet', visitors: 1476, percentage: 12 },
            ];
        }
    },

    /**
     * Get geographic data
     */
    getGeographicData: async (
        filters?: AnalyticsFilters
    ): Promise<GeographicData[]> => {
        const params = new URLSearchParams();
        if (filters?.start_date) params.append('start_date', filters.start_date);
        if (filters?.end_date) params.append('end_date', filters.end_date);

        try {
            const response = await apiClient.get<GeographicData[]>(
                `/analytics/geographic?${params.toString()}`
            );
            return response.data;
        } catch (error) {
            // Return mock data for development
            return [
                { country: 'Vietnam', country_code: 'VN', visitors: 5432, percentage: 44 },
                { country: 'United States', country_code: 'US', visitors: 3456, percentage: 28 },
                { country: 'India', country_code: 'IN', visitors: 1876, percentage: 15 },
                { country: 'United Kingdom', country_code: 'GB', visitors: 987, percentage: 8 },
                { country: 'Others', country_code: 'XX', visitors: 589, percentage: 5 },
            ];
        }
    },

    /**
     * Get referral sources
     */
    getReferralSources: async (
        filters?: AnalyticsFilters
    ): Promise<ReferralSource[]> => {
        const params = new URLSearchParams();
        if (filters?.start_date) params.append('start_date', filters.start_date);
        if (filters?.end_date) params.append('end_date', filters.end_date);

        try {
            const response = await apiClient.get<ReferralSource[]>(
                `/analytics/referrals?${params.toString()}`
            );
            return response.data;
        } catch (error) {
            // Return mock data for development
            return [
                { source: 'Google', url: 'google.com', visitors: 7234, percentage: 58 },
                { source: 'Facebook', url: 'facebook.com', visitors: 2345, percentage: 19 },
                { source: 'Twitter', url: 'twitter.com', visitors: 1456, percentage: 12 },
                { source: 'LinkedIn', url: 'linkedin.com', visitors: 876, percentage: 7 },
                { source: 'Others', url: '', visitors: 489, percentage: 4 },
            ];
        }
    },

    /**
     * Export analytics data
     */
    exportAnalytics: async (options: AnalyticsExportOptions): Promise<Blob> => {
        try {
            const response = await apiClient.post('/analytics/export', options, {
                responseType: 'blob',
            });
            return response.data;
        } catch (error) {
            throw new Error('Export functionality not available yet');
        }
    },
};
