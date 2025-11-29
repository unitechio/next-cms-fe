'use client';

import { PostForm } from "@/features/posts/components/post-form";
import { postService } from "@/features/posts/services/post.service";
import { Post } from "@/features/posts/types";
import { useEffect, useState } from "react";

interface EditPostPageProps {
  params: {
    id: string;
  };
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await postService.getPost(params.id);
        setPost(postData);
      } catch (error) {
        console.error("Failed to fetch post:", error);
      }
    };

    fetchPost();
  }, [params.id]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Edit Post</h1>
      {post ? <PostForm initialData={post} /> : <p>Loading...</p>}
    </div>
  );
}