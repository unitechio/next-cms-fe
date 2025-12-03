'use client';

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { postService } from "@/features/posts/services/post.service";
import { Post } from "@/features/posts/types";
import { Edit, MoreVertical, Plus, Trash2, FileText, Eye } from "lucide-react";
import { PostFilters } from "@/features/posts/components/post-filters";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { parseApiResponse } from "@/lib/api-utils";

export default function PostsPage() {
    const router = useRouter();
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({});

    const fetchPosts = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await postService.getPosts({
                page,
                limit: pageSize,
                ...filters,
            });
            const { data, totalPages: pages } = parseApiResponse<Post>(response);
            setPosts(data);
            setTotalPages(pages);
        } catch (error) {
            console.error("Failed to fetch posts:", error);
            toast.error("Failed to fetch posts");
            setPosts([]);
        } finally {
            setIsLoading(false);
        }
    }, [page, pageSize, filters]);

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchPosts();
        }, 300);
        return () => clearTimeout(debounce);
    }, [fetchPosts]);

    const handleDelete = async (postId: string) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            try {
                await postService.deletePost(postId);
                toast.success("Post deleted successfully");
                fetchPosts();
            } catch (error) {
                toast.error("Failed to delete post");
            }
        }
    };

    const handlePreview = (post: Post) => {
        window.open(`/blog/${post.slug}`, '_blank');
    };

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setPage(1);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Content</h1>
                    <p className="text-muted-foreground">Manage blog posts and articles.</p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/posts/new">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Post
                    </Link>
                </Button>
            </div>

            <PostFilters onFilterChange={(newFilters) => {
                setFilters(prev => ({ ...prev, ...newFilters }));
                setPage(1); // Reset to first page on filter change
            }} />

            <DataTable
                data={posts}
                isLoading={isLoading}
                pagination={{
                    currentPage: page,
                    totalPages: totalPages,
                    onPageChange: setPage,
                    pageSize: pageSize,
                    onPageSizeChange: handlePageSizeChange,
                    showPageSize: true,
                    showFirstLast: true,
                }}
                columns={[
                    {
                        header: "Title",
                        cell: (post) => (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-muted flex-shrink-0 overflow-hidden relative">
                                    {post.featured_image ? (
                                        <Image
                                            src={post.featured_image}
                                            alt={post.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <div className="font-medium truncate max-w-[200px] sm:max-w-[300px]">
                                        {post.title}
                                    </div>
                                    <div className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-[300px]">
                                        {post.slug}
                                    </div>
                                </div>
                            </div>
                        ),
                    },
                    {
                        header: "Author",
                        cell: (post) => (
                            <div className="text-sm text-muted-foreground">
                                {post.author ? `${post.author.first_name} ${post.author.last_name}` : "Unknown"}
                            </div>
                        ),
                    },
                    {
                        header: "Status",
                        accessorKey: "status",
                        cell: (post) => (
                            <Badge
                                variant={
                                    post.status === "published"
                                        ? "default"
                                        : post.status === "draft"
                                            ? "secondary"
                                            : "outline"
                                }
                                className="capitalize"
                            >
                                {post.status}
                            </Badge>
                        ),
                    },
                    {
                        header: "Published",
                        accessorKey: "published_at",
                        cell: (post) => (
                            <span className="text-muted-foreground text-sm">
                                {post.published_at
                                    ? format(new Date(post.published_at), "MMM d, yyyy")
                                    : "-"}
                            </span>
                        ),
                    },
                    {
                        header: "Actions",
                        cell: (post) => (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => handlePreview(post)}>
                                        <Eye className="w-4 h-4 mr-2" />
                                        Preview
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => router.push(`/dashboard/posts/${post.id}/edit`)}
                                    >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-destructive"
                                        onClick={() => handleDelete(post.id)}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ),
                    },
                ]}
            />
        </div>
    );
}
