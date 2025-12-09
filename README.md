# Next.js Template for External APIs

This is a minimal **frontend-focused** Next.js 15 template designed for building dynamic web applications that fetch data from **external APIs**.

> [!IMPORTANT]
> **No Backend Logic**: This template does **not** include a database, Prisma, or internal API routes (`app/api`). It is strictly for consuming existing external backends.

If you need a full-stack solution with a database, use our [Next.js Full-Stack Template](https://github.com/PrabothCharith/nextjs-template-fullstack).

## Features

- **Next.js 15** (App Router, TypeScript, React 19)
- **TanStack Query (React Query)**: Pre-configured for robust async data fetching.
- **Tailwind CSS 4**: For utility-first styling.
- **UI Components**:
  - **HeroUI**: For modern, accessible components.
  - **Shadcn/ui**: For copy-paste tailored components.
  - **Lucide React**: For icons.
- **Design System**:
  - Dark/Light theme with `next-themes`.
  - Framer Motion for animations.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Installation](#1-installation)
  - [Run Development Server](#2-run-development-server)
- [Included Examples](#included-examples)
- [Cleanup Script](#-removing-examples-cleanup-script)
- [Project Structure](#project-structure)
- [Data Fetching Pattern](#data-fetching-pattern)

---

## Getting Started

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/PrabothCharith/nextjs-template-for-external-APIs.git
cd nextjs-template-for-external-APIs

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### 2. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

---

## Included Examples

We have included a few examples to help you get started with **TanStack Query** and the UI components. You can explore them in the code:

1. **`src/app/posts/`**:
    - A full CRUD example interacting with [JSONPlaceholder](https://jsonplaceholder.typicode.com/).
    - Demonstrates `useQuery` for fetching and `useMutation` for creating, updating, and deleting data.
2. **`src/components/posts-demo.tsx`**:
    - The main component containing the UI and logic for the Posts CRUD demo.
    - Shows how to handle loading states, optimistic updates, and error handling.
3. **`src/lib/api.ts`**:
    - A strongly-typed API client wrapper for fetching data.
    - Good practice for centralizing your API calls.
4. **`src/app/page.tsx`**:
    - The landing page, currently displaying the demo.

### 🧹 Removing Examples (Cleanup Script)

Once you have explored the examples and are ready to build your own app, you can **automatically remove** all the demo code with a single command.

**This will delete:**

- `src/app/posts/`
- `src/components/posts-demo.tsx`
- `src/lib/api.ts`
- And reset `src/app/page.tsx` to a simple "Hello World" state.

**Run:**

```bash
npm run cleanup
```

> [!WARNING]
> This action is irreversible. Make sure you don't need the example code before running this!

---

## Project Structure

```
src/
  app/
    globals.css       # Global styles
    layout.tsx        # Root layout with providers
    page.tsx          # Home page (will be reset by cleanup)
    posts/            # [DELETE ON CLEANUP] Example pages
  components/
    ui/               # Shadcn/ui components
    posts-demo.tsx    # [DELETE ON CLEANUP] Example component
  lib/
    utils.ts          # Utility functions
    api.ts            # [DELETE ON CLEANUP] Example API client
  providers/
    initial.tsx       # App providers (Theme, QueryClient, etc.)
  scripts/
    cleanup.mjs       # The cleanup script
```

## Data Fetching Pattern

We use **TanStack Query** for data fetching. Here is a quick pattern you can use in your new components:

```typescript
// 1. Define your API call in a separate file (e.g., lib/api.ts)
export async function getUsers() {
  const res = await fetch('https://api.example.com/users');
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

// 2. Use the hook in your component
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/lib/api';

export function UserList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}
```
