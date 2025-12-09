"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPost, getPosts } from "@/lib/api";
import { useState } from "react";

export default function PostsDemo() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  // Example UseQuery: Fetching data
  const {
    data: posts,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  // Example UseMutation: Creating data
  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: (newPost) => {
      // In a real app, you might invalidate the query to refetch
      // queryClient.invalidateQueries({ queryKey: ['posts'] });

      // For this demo with JSONPlaceholder (which doesn't actually save),
      // we'll explicitly update the cache to show the result
      queryClient.setQueryData(["posts"], (old: any) => [newPost, ...old]);

      setTitle("");
      setBody("");
      alert("Post created successfully! (Mocked)");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPostMutation.mutate({ title, body });
  };

  if (isLoading) return <div className="p-4">Loading posts...</div>;
  if (isError)
    return <div className="p-4 text-red-500">Error: {error.message}</div>;

  return (
    <div className="space-y-8">
      <div className="p-6 bg-card border rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Create Post (Mutation Demo)</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <input
              id="title"
              type="text"
              className="w-full p-2 border rounded-md bg-background"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="body" className="block text-sm font-medium mb-1">
              Body
            </label>
            <textarea
              id="body"
              className="w-full p-2 border rounded-md bg-background"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={createPostMutation.isPending}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-50"
          >
            {createPostMutation.isPending ? "Creating..." : "Create Post"}
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Posts (Query Demo)</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts?.slice(0, 10).map((post) => (
            <div
              key={post.id}
              className="p-4 border rounded-lg hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-lg mb-2 truncate">
                {post.title}
              </h3>
              <p className="text-muted-foreground text-sm line-clamp-3">
                {post.body}
              </p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Showing top 10 posts for brevity.
        </p>
      </div>
    </div>
  );
}
