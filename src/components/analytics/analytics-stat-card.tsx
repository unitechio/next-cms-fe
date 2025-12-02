"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface AnalyticsStatCardProps {
    title: string;
    value: string | number;
    change: number; // percentage
    trend?: "up" | "down";
    icon: LucideIcon;
    color: string;
    bg: string;
    delay?: number;
    suffix?: string;
    prefix?: string;
}

export function AnalyticsStatCard({
    title,
    value,
    change,
    trend,
    icon: Icon,
    color,
    bg,
    delay = 0,
    suffix = "",
    prefix = "",
}: AnalyticsStatCardProps) {
    const isPositive = change >= 0;
    const displayTrend = trend || (isPositive ? "up" : "down");

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
        >
            <Card className="hover:border-primary/50 transition-colors group">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-lg ${bg} ${color}`}>
                            <Icon className="w-6 h-6" />
                        </div>
                        <div
                            className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${displayTrend === "up"
                                    ? "bg-green-500/10 text-green-400"
                                    : "bg-red-500/10 text-red-400"
                                }`}
                        >
                            {change > 0 ? "+" : ""}
                            {change.toFixed(1)}%
                            {displayTrend === "up" ? (
                                <ArrowUpRight className="w-3 h-3" />
                            ) : (
                                <ArrowDownRight className="w-3 h-3" />
                            )}
                        </div>
                    </div>
                    <h3 className="text-muted-foreground text-sm font-medium mb-1">
                        {title}
                    </h3>
                    <p className="text-2xl font-bold group-hover:text-primary transition-colors">
                        {prefix}
                        {typeof value === "number" ? value.toLocaleString() : value}
                        {suffix}
                    </p>
                </CardContent>
            </Card>
        </motion.div>
    );
}
