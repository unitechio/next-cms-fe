'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface SEOScore {
    score: number;
    issues: string[];
    suggestions: string[];
}

interface PostSEOAnalyzerProps {
    title?: string;
    content?: string;
    metaTitle?: string;
    metaDescription?: string;
    slug?: string;
}

export function PostSEOAnalyzer({
    title = '',
    content = '',
    metaTitle = '',
    metaDescription = '',
    slug = '',
}: PostSEOAnalyzerProps) {
    const analyzeSEO = (): SEOScore => {
        const issues: string[] = [];
        const suggestions: string[] = [];
        let score = 100;

        // Title checks
        if (!title || title.length < 30) {
            issues.push('Title is too short (minimum 30 characters recommended)');
            score -= 15;
        } else if (title.length > 60) {
            issues.push('Title is too long (maximum 60 characters recommended)');
            score -= 10;
        }

        // Meta title
        if (!metaTitle) {
            suggestions.push('Add a custom meta title for better SEO');
            score -= 5;
        }

        // Meta description
        if (!metaDescription) {
            issues.push('Meta description is missing');
            score -= 15;
        } else if (metaDescription.length < 120) {
            issues.push('Meta description is too short (minimum 120 characters)');
            score -= 10;
        } else if (metaDescription.length > 160) {
            issues.push('Meta description is too long (maximum 160 characters)');
            score -= 10;
        }

        // Content length
        const wordCount = content.split(/\s+/).filter(Boolean).length;
        if (wordCount < 300) {
            issues.push(`Content is too short (${wordCount} words, minimum 300 recommended)`);
            score -= 20;
        } else if (wordCount < 600) {
            suggestions.push('Consider adding more content for better SEO (600+ words ideal)');
            score -= 5;
        }

        // Slug
        if (!slug) {
            issues.push('URL slug is missing');
            score -= 10;
        } else if (slug.length > 50) {
            suggestions.push('URL slug is quite long, consider shortening it');
            score -= 5;
        }

        // Headings check (basic)
        const hasH1 = /<h1/i.test(content);
        const hasH2 = /<h2/i.test(content);
        if (!hasH1 && !hasH2) {
            suggestions.push('Add headings (H1, H2) to structure your content');
            score -= 10;
        }

        return {
            score: Math.max(0, score),
            issues,
            suggestions,
        };
    };

    const seoData = analyzeSEO();
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreLabel = (score: number) => {
        if (score >= 80) return 'Excellent';
        if (score >= 60) return 'Good';
        if (score >= 40) return 'Needs Improvement';
        return 'Poor';
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>SEO Analysis</CardTitle>
                <CardDescription>
                    Optimize your post for search engines
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Score */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">SEO Score</span>
                        <span className={`text-2xl font-bold ${getScoreColor(seoData.score)}`}>
                            {seoData.score}/100
                        </span>
                    </div>
                    <Progress value={seoData.score} className="h-2" />
                    <p className="text-sm text-muted-foreground">
                        {getScoreLabel(seoData.score)}
                    </p>
                </div>

                {/* Issues */}
                {seoData.issues.length > 0 && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-destructive">
                            <AlertCircle className="w-4 h-4" />
                            Issues ({seoData.issues.length})
                        </div>
                        <ul className="space-y-1">
                            {seoData.issues.map((issue, i) => (
                                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                    <span className="text-destructive mt-0.5">•</span>
                                    <span>{issue}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Suggestions */}
                {seoData.suggestions.length > 0 && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
                            <Info className="w-4 h-4" />
                            Suggestions ({seoData.suggestions.length})
                        </div>
                        <ul className="space-y-1">
                            {seoData.suggestions.map((suggestion, i) => (
                                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">•</span>
                                    <span>{suggestion}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* All good */}
                {seoData.issues.length === 0 && seoData.suggestions.length === 0 && (
                    <div className="flex items-center gap-2 text-green-600 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-sm font-medium">
                            Your post is well optimized for SEO!
                        </span>
                    </div>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                        <p className="text-xs text-muted-foreground">Word Count</p>
                        <p className="text-lg font-semibold">
                            {content.split(/\s+/).filter(Boolean).length}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Reading Time</p>
                        <p className="text-lg font-semibold">
                            {Math.ceil(content.split(/\s+/).filter(Boolean).length / 200)} min
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
