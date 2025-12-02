export interface AnalyticsOverview {
    total_posts: number;
    total_views: number;
    total_users: number;
    avg_time_on_page: number; // in seconds
    bounce_rate: number; // percentage
    change_posts: number; // percentage change
    change_views: number;
    change_users: number;
    change_time: number;
    change_bounce: number;
}

export interface SEOMetrics {
    overall_score: number; // 0-100
    meta_tags_score: number;
    performance_score: number;
    mobile_friendly_score: number;
    backlinks_count: number;
    indexed_pages: number;
    avg_page_speed: number; // in seconds
    keywords_ranking: KeywordRanking[];
    technical_issues: TechnicalIssue[];
}

export interface KeywordRanking {
    keyword: string;
    position: number;
    search_volume: number;
    change: number; // position change
}

export interface TechnicalIssue {
    type: 'error' | 'warning' | 'info';
    title: string;
    description: string;
    affected_pages: number;
}

export interface TopPost {
    id: string;
    title: string;
    slug: string;
    views: number;
    avg_time_on_page: number; // in seconds
    bounce_rate: number; // percentage
    comments_count: number;
    shares_count: number;
    traffic_sources: TrafficSource[];
    published_at: string;
    featured_image?: string;
}

export interface TrafficSource {
    source: 'organic' | 'direct' | 'social' | 'referral' | 'email' | 'other';
    visitors: number;
    percentage: number;
}

export interface TrafficData {
    date: string;
    views: number;
    visitors: number;
    page_views: number;
    unique_visitors: number;
    bounce_rate: number;
}

export interface DeviceBreakdown {
    device: 'desktop' | 'mobile' | 'tablet';
    visitors: number;
    percentage: number;
}

export interface GeographicData {
    country: string;
    country_code: string;
    visitors: number;
    percentage: number;
}

export interface ReferralSource {
    source: string;
    url: string;
    visitors: number;
    percentage: number;
}

export interface AnalyticsFilters {
    start_date?: string; // ISO date string
    end_date?: string;
    compare_start_date?: string; // for comparison period
    compare_end_date?: string;
    period?: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
}

export interface AnalyticsExportOptions {
    format: 'csv' | 'pdf' | 'excel';
    sections: ('overview' | 'seo' | 'posts' | 'traffic')[];
    filters: AnalyticsFilters;
}
