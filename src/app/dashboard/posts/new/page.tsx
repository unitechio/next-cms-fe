"use client";

import { PostForm } from "@/features/posts/components/post-form";

export default function CreatePostPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Create New Post</h1>
      <PostForm />
    </div>
  );
}