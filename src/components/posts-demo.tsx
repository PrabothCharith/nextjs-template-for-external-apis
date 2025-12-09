"use client";

import {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  patchPost,
  getComments,
  getTodo,
  Post,
  Comment,
} from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function PostsDemo() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);

  // Todo Demo
  const { data: todo } = useQuery({
    queryKey: ["todo", 1],
    queryFn: () => getTodo(1),
  });

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
      queryClient.setQueryData(["posts"], (old: Post[] = []) =>
        old.filter((p) => p.id !== deletedId)
      );
      alert("Post deleted successfully! (Mocked)");
    },
  });

  // Example UseMutation: Patching data (Mock "Mark as Read" or similar partial update)
  const patchPostMutation = useMutation({
    mutationFn: (variables: { id: number; updates: Partial<Post> }) =>
      patchPost(variables.id, variables.updates),
    onSuccess: (patchedPost) => {
      queryClient.setQueryData(["posts"], (old: Post[] = []) =>
        old.map((p) => (p.id === patchedPost.id ? { ...p, ...patchedPost } : p))
      );
      //   alert('Post patched successfully! (Mocked)');
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

  const handlePatch = (post: Post) => {
    // Demo: Append " [Patched]" to title
    patchPostMutation.mutate({
      id: post.id,
      updates: { title: `${post.title} [Patched]` },
    });
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

      <div className="p-4 border rounded-lg bg-muted/20">
        <h2 className="text-xl font-bold mb-2">Todo Demo (Fetch ID: 1)</h2>
        {todo ? (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={todo.completed}
              readOnly
              className="h-4 w-4"
            />
            <span
              className={
                todo.completed ? "line-through text-muted-foreground" : ""
              }
            >
              {todo.title}
            </span>
          </div>
        ) : (
          <div>Loading todo...</div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Posts (All Endpoints Demo)</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts?.slice(0, 10).map((post) => (
            <div
              key={post.id}
              className="p-4 border rounded-lg hover:shadow-md transition-shadow flex flex-col"
            >
              <h3
                className="font-semibold text-lg mb-2 truncate"
                title={post.title}
              >
                {post.title}
              </h3>
              <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-grow">
                {post.body}
              </p>

              <div className="flex flex-wrap gap-2 mt-auto pt-2 border-t">
                <button
                  onClick={() => handleEdit(post)}
                  className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded hover:opacity-90"
                >
                  Edit (PUT)
                </button>
                <button
                  onClick={() => handlePatch(post)}
                  className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:opacity-90 dark:bg-blue-900 dark:text-blue-100"
                  disabled={patchPostMutation.isPending}
                >
                  {patchPostMutation.isPending ? "..." : "Patch"}
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="px-2 py-1 text-xs bg-destructive text-destructive-foreground rounded hover:opacity-90"
                >
                  Delete
                </button>
                <button
                  onClick={() =>
                    setExpandedPostId(
                      expandedPostId === post.id ? null : post.id
                    )
                  }
                  className="px-2 py-1 text-xs border rounded hover:bg-muted ml-auto"
                >
                  {expandedPostId === post.id ? "Hide Comments" : "Comments"}
                </button>
              </div>

              {expandedPostId === post.id && (
                <CommentsSection postId={post.id} />
              )}
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Showing top 10 posts.
        </p>
      </div>
    </div>
  );
}

function CommentsSection({ postId }: { postId: number }) {
  const {
    data: comments,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getComments(postId),
  });

  if (isLoading) return <div className="mt-2 text-xs">Loading comments...</div>;
  if (isError)
    return (
      <div className="mt-2 text-xs text-red-500">Failed to load comments</div>
    );

  return (
    <div className="mt-3 p-3 bg-muted/50 rounded text-xs space-y-2 max-h-48 overflow-y-auto">
      <h4 className="font-semibold mb-1">Comments:</h4>
      {comments?.map((comment) => (
        <div key={comment.id} className="border-b last:border-0 pb-1">
          <p className="font-medium truncate">{comment.email}</p>
          <p className="text-muted-foreground">{comment.body}</p>
        </div>
      ))}
    </div>
  );
}
