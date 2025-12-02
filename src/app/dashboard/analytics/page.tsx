"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    FileText,
    Eye,
    Clock,
    TrendingDown,
    Link2,
    Globe,
    Smartphone,
    AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalyticsStatCard } from "@/components/analytics/analytics-stat-card";
import { SEOScoreGauge } from "@/components/analytics/seo-score-gauge";
import { TrafficChart } from "@/components/analytics/traffic-chart";
import { TopPostsTable } from "@/components/analytics/top-posts-table";
import { DateRangePicker } from "@/components/analytics/date-range-picker";
import { ExportButton } from "@/components/analytics/export-button";
import { analyticsService } from "@/features/analytics/services/analytics.service";
import {
    AnalyticsOverview,
    SEOMetrics,
    TopPost,
    TrafficData,
    DeviceBreakdown,
    GeographicData,
    ReferralSource,
    AnalyticsFilters,
} from "@/features/analytics/types";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export default function AnalyticsPage() {
    const [filters, setFilters] = useState<AnalyticsFilters>({
        period: "month",
    });
    const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
    const [seoMetrics, setSeoMetrics] = useState<SEOMetrics | null>(null);
    const [topPosts, setTopPosts] = useState<TopPost[]>([]);
    const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
    const [deviceData, setDeviceData] = useState<DeviceBreakdown[]>([]);
    const [geoData, setGeoData] = useState<GeographicData[]>([]);
    const [referralData, setReferralData] = useState<ReferralSource[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadAnalyticsData();
    }, [filters]);

    const loadAnalyticsData = async () => {
        setIsLoading(true);
        try {
            const [
                overviewData,
                seoData,
                postsData,
                traffic,
                devices,
                geo,
                referrals,
            ] = await Promise.all([
                analyticsService.getOverview(filters),
                analyticsService.getSEOMetrics(filters),
                analyticsService.getTopPosts({ ...filters, limit: 5 }),
                analyticsService.getTrafficData(filters),
                analyticsService.getDeviceBreakdown(filters),
                analyticsService.getGeographicData(filters),
                analyticsService.getReferralSources(filters),
            ]);

            setOverview(overviewData);
            setSeoMetrics(seoData);
            setTopPosts(postsData);
            setTrafficData(traffic);
            setDeviceData(devices);
            setGeoData(geo);
            setReferralData(referrals);
        } catch (error) {
            console.error("Failed to load analytics data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        return `${minutes}m ${seconds % 60}s`;
    };

    const COLORS = {
        desktop: "#8b5cf6",
        mobile: "#10b981",
        tablet: "#f59e0b",
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">
                        Analytics Dashboard
                    </h1>
                    <p className="text-muted-foreground">
                        Comprehensive insights into your content performance and SEO metrics
                    </p>
                </div>
                <div className="flex gap-3">
                    <DateRangePicker
                        onChange={(range) =>
                            setFilters({
                                ...filters,
                                start_date: range.from.toISOString(),
                                end_date: range.to.toISOString(),
                            })
                        }
                    />
                    <ExportButton filters={filters} />
                </div>
            </div>

            {/* Overview Stats */}
            {overview && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <AnalyticsStatCard
                        title="Total Posts"
                        value={overview.total_posts}
                        change={overview.change_posts}
                        icon={FileText}
                        color="text-purple-500"
                        bg="bg-purple-500/10"
                        delay={0}
                    />
                    <AnalyticsStatCard
                        title="Total Views"
                        value={overview.total_views.toLocaleString()}
                        change={overview.change_views}
                        icon={Eye}
                        color="text-green-500"
                        bg="bg-green-500/10"
                        delay={0.1}
                    />
                    <AnalyticsStatCard
                        title="Avg. Time on Page"
                        value={formatTime(overview.avg_time_on_page)}
                        change={overview.change_time}
                        icon={Clock}
                        color="text-blue-500"
                        bg="bg-blue-500/10"
                        delay={0.2}
                    />
                    <AnalyticsStatCard
                        title="Bounce Rate"
                        value={`${overview.bounce_rate}%`}
                        change={overview.change_bounce}
                        trend="down"
                        icon={TrendingDown}
                        color="text-orange-500"
                        bg="bg-orange-500/10"
                        delay={0.3}
                    />
                </div>
            )}

            {/* SEO Metrics */}
            {seoMetrics && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <SEOScoreGauge
                        score={seoMetrics.overall_score}
                        metaTagsScore={seoMetrics.meta_tags_score}
                        performanceScore={seoMetrics.performance_score}
                        mobileFriendlyScore={seoMetrics.mobile_friendly_score}
                    />

                    <Card>
                        <CardHeader>
                            <CardTitle>SEO Insights</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Link2 className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">
                                            Backlinks
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold">
                                        {seoMetrics.backlinks_count.toLocaleString()}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Globe className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">
                                            Indexed Pages
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold">
                                        {seoMetrics.indexed_pages}
                                    </p>
                                </div>
                            </div>

                            {/* Top Keywords */}
                            <div>
                                <h4 className="text-sm font-medium mb-3">Top Keywords</h4>
                                <div className="space-y-2">
                                    {seoMetrics.keywords_ranking.slice(0, 3).map((keyword) => (
                                        <div
                                            key={keyword.keyword}
                                            className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                                        >
                                            <div>
                                                <p className="text-sm font-medium">{keyword.keyword}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {keyword.search_volume.toLocaleString()} searches/mo
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline">#{keyword.position}</Badge>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        keyword.change > 0
                                                            ? "bg-green-500/10 text-green-400"
                                                            : "bg-red-500/10 text-red-400"
                                                    }
                                                >
                                                    {keyword.change > 0 ? "+" : ""}
                                                    {keyword.change}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Technical Issues */}
                            {seoMetrics.technical_issues.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" />
                                        Technical Issues
                                    </h4>
                                    <div className="space-y-2">
                                        {seoMetrics.technical_issues.map((issue, index) => (
                                            <div
                                                key={index}
                                                className="p-3 rounded-lg border border-border"
                                            >
                                                <div className="flex items-start justify-between mb-1">
                                                    <p className="text-sm font-medium">{issue.title}</p>
                                                    <Badge
                                                        variant={
                                                            issue.type === "error"
                                                                ? "destructive"
                                                                : "outline"
                                                        }
                                                    >
                                                        {issue.type}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    {issue.description}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Affects {issue.affected_pages} pages
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Traffic Chart */}
            {trafficData.length > 0 && <TrafficChart data={trafficData} />}

            {/* Top Posts */}
            {topPosts.length > 0 && <TopPostsTable posts={topPosts} />}

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Device Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Smartphone className="w-5 h-5" />
                            Device Breakdown
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={deviceData}
                                    dataKey="visitors"
                                    nameKey="device"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label={(entry) => `${entry.percentage}%`}
                                >
                                    {deviceData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[entry.device as keyof typeof COLORS]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="space-y-2 mt-4">
                            {deviceData.map((device) => (
                                <div
                                    key={device.device}
                                    className="flex items-center justify-between text-sm"
                                >
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{
                                                backgroundColor:
                                                    COLORS[device.device as keyof typeof COLORS],
                                            }}
                                        />
                                        <span className="capitalize">{device.device}</span>
                                    </div>
                                    <span className="font-medium">
                                        {device.visitors.toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Geographic Data */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="w-5 h-5" />
                            Top Countries
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {geoData.map((country, index) => (
                                <div key={country.country_code} className="space-y-1">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium">
                                            {index + 1}. {country.country}
                                        </span>
                                        <span className="text-muted-foreground">
                                            {country.visitors.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <div
                                            className="bg-primary h-2 rounded-full transition-all"
                                            style={{ width: `${country.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Referral Sources */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Link2 className="w-5 h-5" />
                            Referral Sources
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {referralData.map((referral, index) => (
                                <div key={referral.source} className="space-y-1">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium">
                                            {index + 1}. {referral.source}
                                        </span>
                                        <span className="text-muted-foreground">
                                            {referral.visitors.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <div
                                            className="bg-green-500 h-2 rounded-full transition-all"
                                            style={{ width: `${referral.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
