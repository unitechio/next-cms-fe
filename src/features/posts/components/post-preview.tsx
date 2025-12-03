'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { Post } from '../types';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface PostPreviewProps {
  post: Partial<Post>;
}

export function PostPreview({ post }: PostPreviewProps) {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Preview</CardTitle>
            <CardDescription>See how your post will look</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'desktop' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('desktop')}
            >
              Desktop
            </Button>
            <Button
              variant={viewMode === 'mobile' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('mobile')}
            >
              Mobile
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          className={`mx-auto transition-all ${
            viewMode === 'mobile' ? 'max-w-sm' : 'max-w-4xl'
          }`}
        >
          <article className="prose dark:prose-invert max-w-none">
            {/* Featured Image */}
            {post.featured_image && (
              <div className="mb-8 rounded-lg overflow-hidden">
                <img
                  src={post.featured_image}
                  alt={post.title || 'Featured image'}
                  className="w-full h-auto"
                />
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl font-bold mb-4">
              {post.title || 'Untitled Post'}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              {post.author && (
                <div className="flex items-center gap-2">
                  <span>By {post.author.first_name} {post.author.last_name}</span>
                </div>
              )}
              {post.published_at && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(post.published_at), 'MMMM d, yyyy')}</span>
                </div>
              )}
              {post.view_count !== undefined && (
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{post.view_count} views</span>
                </div>
              )}
            </div>

            {/* Tags & Categories */}
            {(post.tags || post.categories) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags?.map((tag, i) => (
                  <Badge key={i} variant="secondary">
                    {tag}
                  </Badge>
                ))}
                {post.categories?.map((cat, i) => (
                  <Badge key={i} variant="outline">
                    {cat}
                  </Badge>
                ))}
              </div>
            )}

            <Separator className="my-6" />

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-lg text-muted-foreground italic mb-6">
                {post.excerpt}
              </p>
            )}

            {/* Content */}
            <div
              className="prose-content"
              dangerouslySetInnerHTML={{ __html: post.content || '<p>No content yet...</p>' }}
            />
          </article>
        </div>
      </CardContent>
    </Card>
  );
}
