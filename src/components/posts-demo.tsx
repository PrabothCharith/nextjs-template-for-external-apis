"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPost, getPosts, updatePost, deletePost, Post } from "@/lib/api";
import { useState } from "react";

export default function PostsDemo() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editingPost, setEditingPost] = useState<Post | null>(null);

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
      // Mock update cache
      queryClient.setQueryData(["posts"], (old: Post[] = []) => [
        newPost,
        ...old,
      ]);
      resetForm();
      alert("Post created successfully! (Mocked)");
    },
  });

  // Example UseMutation: Updating data
  const updatePostMutation = useMutation({
    mutationFn: updatePost,
    onSuccess: (updatedPost) => {
      // Mock update cache
      queryClient.setQueryData(["posts"], (old: Post[] = []) =>
        old.map((p) => (p.id === updatedPost.id ? updatedPost : p))
      );
      resetForm();
      alert("Post updated successfully! (Mocked)");
    },
  });

  // Example UseMutation: Deleting data
  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: (_, deletedId) => {
      // Mock update cache
      queryClient.setQueryData(["posts"], (old: Post[] = []) =>
        old.filter((p) => p.id !== deletedId)
      );
      alert("Post deleted successfully! (Mocked)");
    },
  });

  const resetForm = () => {
    setTitle("");
    setBody("");
    setEditingPost(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPost) {
      updatePostMutation.mutate({ ...editingPost, title, body });
    } else {
      createPostMutation.mutate({ title, body });
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setTitle(post.title);
    setBody(post.body);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this post?")) {
      deletePostMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="p-4">Loading posts...</div>;
  if (isError)
    return <div className="p-4 text-red-500">Error: {error.message}</div>;

  return (
    <div className="space-y-8">
      <div className="p-6 bg-card border rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold mb-4">
          {editingPost ? "Edit Post (PUT Demo)" : "Create Post (POST Demo)"}
        </h2>
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
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={
                createPostMutation.isPending || updatePostMutation.isPending
              }
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-50"
            >
              {editingPost
                ? updatePostMutation.isPending
                  ? "Updating..."
                  : "Update Post"
                : createPostMutation.isPending
                ? "Creating..."
                : "Create Post"}
            </button>
            {editingPost && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border rounded-md hover:bg-muted"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">
          Posts (Query, Update, Delete Demo)
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts?.slice(0, 10).map((post) => (
            <div
              key={post.id}
              className="p-4 border rounded-lg hover:shadow-md transition-shadow flex flex-col"
            >
              <h3 className="font-semibold text-lg mb-2 truncate">
                {post.title}
              </h3>
              <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-grow">
                {post.body}
              </p>
              <div className="flex gap-2 mt-auto pt-2 border-t">
                <button
                  onClick={() => handleEdit(post)}
                  className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded hover:opacity-90"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="px-3 py-1 text-sm bg-destructive text-destructive-foreground rounded hover:opacity-90"
                >
                  Delete
                </button>
              </div>
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
