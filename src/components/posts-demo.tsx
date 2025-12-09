"use client";

import {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  patchPost,
  getComments,
  Post,
} from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Laptop } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";

export default function PostsDemo() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  // Changed from singular ID to a Set of IDs for multiple open comments
  const [expandedPostIds, setExpandedPostIds] = useState<Set<number>>(
    new Set()
  );

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Modal state for delete confirmation
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [postToDelete, setPostToDelete] = useState<number | null>(null);

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
      onOpenChange(); // Close modal on success
      setPostToDelete(null);
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

  const handleDeleteClick = (id: number) => {
    setPostToDelete(id);
    onOpen();
  };

  const confirmDelete = () => {
    if (postToDelete) {
      deletePostMutation.mutate(postToDelete);
    }
  };

  const handlePatch = (post: Post) => {
    // Demo: Append " [Patched]" to title
    patchPostMutation.mutate({
      id: post.id,
      updates: { title: `${post.title} [Patched]` },
    });
  };

  const toggleConstants = (id: number) => {
    setExpandedPostIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="space-y-8">
      {/* Theme Toggle & Header */}
      <div className="flex justify-end mb-4">
        <Dropdown>
          <DropdownTrigger>
            <Button isIconOnly variant="flat" aria-label="Theme actions">
              {mounted ? (
                theme === "dark" ? (
                  <Moon size={20} />
                ) : theme === "system" ? (
                  <Laptop size={20} />
                ) : (
                  <Sun size={20} />
                )
              ) : (
                <Sun size={20} />
              )}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Theme selection"
            onAction={(key) => setTheme(key as string)}
            selectedKeys={mounted ? [theme || "system"] : ["system"]}
            selectionMode="single"
          >
            <DropdownItem key="light" startContent={<Sun size={16} />}>
              Light
            </DropdownItem>
            <DropdownItem key="dark" startContent={<Moon size={16} />}>
              Dark
            </DropdownItem>
            <DropdownItem key="system" startContent={<Laptop size={16} />}>
              System
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

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
                handleDelete={handleDeleteClick}
                handlePatch={handlePatch}
                patchIsPending={
                  patchPostMutation.isPending &&
                  patchPostMutation.variables?.id === post.id
                }
                isExpanded={expandedPostIds.has(post.id)}
                toggleComments={() => toggleConstants(post.id)}
              />
            ))}
          </div>
        )}
        <p className="text-sm text-default-500 mt-4">Showing top 10 posts.</p>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirm Delete
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to delete this post? This action cannot
                  be undone.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={confirmDelete}
                  isLoading={deletePostMutation.isPending}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

function PostCard({
  post,
  handleEdit,
  handleDelete,
  handlePatch,
  patchIsPending,
  isExpanded,
  toggleComments,
}: any) {
  return (
    <Card className="flex flex-col h-fit">
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
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-4">
                <Divider className="my-2" />
                <CommentsSection postId={post.id} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
          onPress={toggleComments}
        >
          {isExpanded ? "Hide Comments" : "Comments"}
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
