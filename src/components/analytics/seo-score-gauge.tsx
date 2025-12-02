"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";

interface SEOScoreGaugeProps {
    score: number; // 0-100
    metaTagsScore: number;
    performanceScore: number;
    mobileFriendlyScore: number;
}

export function SEOScoreGauge({
    score,
    metaTagsScore,
    performanceScore,
    mobileFriendlyScore,
}: SEOScoreGaugeProps) {
    const getScoreColor = (s: number) => {
        if (s >= 80) return "text-green-500";
        if (s >= 50) return "text-yellow-500";
        return "text-red-500";
    };

    const getScoreBg = (s: number) => {
        if (s >= 80) return "bg-green-500/10";
        if (s >= 50) return "bg-yellow-500/10";
        return "bg-red-500/10";
    };

    const getScoreLabel = (s: number) => {
        if (s >= 80) return "Good";
        if (s >= 50) return "Needs Work";
        return "Poor";
    };

    const circumference = 2 * Math.PI * 70;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <Card>
            <CardHeader>
                <CardTitle>SEO Score</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row gap-8 items-center">
                    {/* Circular Gauge */}
                    <div className="relative">
                        <svg className="w-40 h-40 transform -rotate-90">
                            {/* Background circle */}
                            <circle
                                cx="80"
                                cy="80"
                                r="70"
                                stroke="currentColor"
                                strokeWidth="12"
                                fill="none"
                                className="text-muted/20"
                            />
                            {/* Progress circle */}
                            <motion.circle
                                cx="80"
                                cy="80"
                                r="70"
                                stroke="currentColor"
                                strokeWidth="12"
                                fill="none"
                                strokeLinecap="round"
                                className={getScoreColor(score)}
                                initial={{ strokeDashoffset: circumference }}
                                animate={{ strokeDashoffset }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                style={{
                                    strokeDasharray: circumference,
                                }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className={`text-4xl font-bold ${getScoreColor(score)}`}>
                                {score}
                            </span>
                            <span className="text-sm text-muted-foreground">/ 100</span>
                        </div>
                    </div>

                    {/* Score Breakdown */}
                    <div className="flex-1 space-y-4 w-full">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {metaTagsScore >= 80 ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                ) : metaTagsScore >= 50 ? (
                                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                                ) : (
                                    <XCircle className="w-5 h-5 text-red-500" />
                                )}
                                <span className="text-sm font-medium">Meta Tags</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge
                                    variant="outline"
                                    className={getScoreBg(metaTagsScore)}
                                >
                                    {metaTagsScore}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                    {getScoreLabel(metaTagsScore)}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {performanceScore >= 80 ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                ) : performanceScore >= 50 ? (
                                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                                ) : (
                                    <XCircle className="w-5 h-5 text-red-500" />
                                )}
                                <span className="text-sm font-medium">Performance</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge
                                    variant="outline"
                                    className={getScoreBg(performanceScore)}
                                >
                                    {performanceScore}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                    {getScoreLabel(performanceScore)}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {mobileFriendlyScore >= 80 ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                ) : mobileFriendlyScore >= 50 ? (
                                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                                ) : (
                                    <XCircle className="w-5 h-5 text-red-500" />
                                )}
                                <span className="text-sm font-medium">Mobile Friendly</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge
                                    variant="outline"
                                    className={getScoreBg(mobileFriendlyScore)}
                                >
                                    {mobileFriendlyScore}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                    {getScoreLabel(mobileFriendlyScore)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
