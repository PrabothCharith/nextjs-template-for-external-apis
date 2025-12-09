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
} from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Input,
  Textarea,
  Checkbox,
  Skeleton,
  Chip,
  Divider,
  ScrollShadow,
} from "@heroui/react";

export default function PostsDemo() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);

  // Todo Demo
  const { data: todo, isLoading: isTodoLoading } = useQuery({
    queryKey: ["todo", 1],
    queryFn: () => getTodo(1),
  });

  // Example UseQuery: Fetching data
  const {
    data: posts,
    isLoading: isPostsLoading,
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
    },
  });

  // Example UseMutation: Deleting data
  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(["posts"], (old: Post[] = []) =>
        old.filter((p) => p.id !== deletedId)
      );
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

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-4">
      {/* Todo Section */}
      <Card className="max-w-[400px]">
        <CardHeader className="flex gap-3">
          <h2 className="text-xl font-bold">Todo Demo (Fetch ID: 1)</h2>
        </CardHeader>
        <Divider />
        <CardBody>
          {isTodoLoading ? (
            <div className="space-y-3">
              <Skeleton className="w-3/5 rounded-lg">
                <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
              </Skeleton>
            </div>
          ) : todo ? (
            <div className="flex items-center gap-2">
              <Checkbox isSelected={todo.completed} isReadOnly>
                <span
                  className={
                    todo.completed ? "line-through text-default-500" : ""
                  }
                >
                  {todo.title}
                </span>
              </Checkbox>
            </div>
          ) : (
            <div>Failed to load todo.</div>
          )}
        </CardBody>
      </Card>

      {/* Form Section */}
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">
            {editingPost ? "Edit Post (PUT Demo)" : "Create Post (POST Demo)"}
          </h2>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Title"
              placeholder="Enter post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              isRequired
              variant="bordered"
            />
            <Textarea
              label="Body"
              placeholder="Enter post content"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              isRequired
              variant="bordered"
            />
            <div className="flex gap-2 justify-end">
              {editingPost && (
                <Button
                  type="button"
                  variant="flat"
                  color="danger"
                  onPress={resetForm}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                color="primary"
                isLoading={
                  createPostMutation.isPending || updatePostMutation.isPending
                }
              >
                {editingPost
                  ? updatePostMutation.isPending
                    ? "Updating..."
                    : "Update Post"
                  : createPostMutation.isPending
                  ? "Creating..."
                  : "Create Post"}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Posts Grid Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Posts (All Endpoints Demo)</h2>

        {isPostsLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-4 space-y-5" radius="lg">
                <Skeleton className="rounded-lg">
                  <div className="h-24 rounded-lg bg-default-300"></div>
                </Skeleton>
                <div className="space-y-3">
                  <Skeleton className="w-3/5 rounded-lg">
                    <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
                  </Skeleton>
                  <Skeleton className="w-4/5 rounded-lg">
                    <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
                  </Skeleton>
                  <Skeleton className="w-2/5 rounded-lg">
                    <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
                  </Skeleton>
                </div>
              </Card>
            ))}
          </div>
        ) : isError ? (
          <div className="text-danger">Error: {error.message}</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {posts?.slice(0, 10).map((post) => (
              <PostCard
                key={post.id}
                post={post}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handlePatch={handlePatch}
                patchIsPending={
                  patchPostMutation.isPending &&
                  patchPostMutation.variables?.id === post.id
                }
                expandedPostId={expandedPostId}
                setExpandedPostId={setExpandedPostId}
              />
            ))}
          </div>
        )}
        <p className="text-sm text-default-500 mt-4">Showing top 10 posts.</p>
      </div>
    </div>
  );
}

function PostCard({
  post,
  handleEdit,
  handleDelete,
  handlePatch,
  patchIsPending,
  expandedPostId,
  setExpandedPostId,
}: any) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="justify-between items-start">
        <h3 className="font-semibold text-lg line-clamp-1" title={post.title}>
          {post.title}
        </h3>
        {post.title.includes("[Patched]") && (
          <Chip color="success" size="sm" variant="flat">
            Patched
          </Chip>
        )}
      </CardHeader>
      <CardBody className="py-2">
        <p className="text-default-500 text-sm line-clamp-3">{post.body}</p>
        {expandedPostId === post.id && (
          <div className="mt-4">
            <Divider className="my-2" />
            <CommentsSection postId={post.id} />
          </div>
        )}
      </CardBody>
      <CardFooter className="pt-2 gap-2 flex-wrap">
        <Button
          size="sm"
          variant="flat"
          color="secondary"
          onPress={() => handleEdit(post)}
        >
          Edit
        </Button>
        <Button
          size="sm"
          variant="flat"
          color="primary"
          onPress={() => handlePatch(post)}
          isLoading={patchIsPending}
        >
          Patch
        </Button>
        <Button
          size="sm"
          variant="flat"
          color="danger"
          onPress={() => handleDelete(post.id)}
        >
          Delete
        </Button>
        <Button
          size="sm"
          variant="light"
          className="ml-auto"
          onPress={() =>
            setExpandedPostId(expandedPostId === post.id ? null : post.id)
          }
        >
          {expandedPostId === post.id ? "Hide Comments" : "Comments"}
        </Button>
      </CardFooter>
    </Card>
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

  if (isLoading)
    return (
      <div className="space-y-2">
        <Skeleton className="w-full rounded-lg h-8" />
        <Skeleton className="w-full rounded-lg h-8" />
      </div>
    );

  if (isError)
    return <div className="text-xs text-danger">Failed to load comments</div>;

  return (
    <ScrollShadow className="h-[150px]">
      <div className="space-y-2">
        {comments?.map((comment) => (
          <div
            key={comment.id}
            className="text-xs p-2 bg-default-100 rounded-md"
          >
            <p className="font-semibold">{comment.email}</p>
            <p className="text-default-500">{comment.body}</p>
          </div>
        ))}
      </div>
    </ScrollShadow>
  );
}
