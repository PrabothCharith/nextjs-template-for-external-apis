import PostsDemo from "@/components/posts-demo";

export default function PostsPage() {
  return (
    <div className="max-w-5xl mx-auto p-4 py-10">
      <h1 className="text-3xl font-bold mb-8">External API Integration Demo</h1>
      <p className="mb-8 text-muted-foreground">
        This page demonstrates how to fetch and mutate data from an external API
        (JSONPlaceholder) using React Query.
      </p>
      <PostsDemo />
    </div>
  );
}
