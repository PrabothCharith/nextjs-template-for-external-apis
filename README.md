# Next.js Template for External APIs

This is a minimal Next.js 15 template for building dynamic web applications that fetch data from a separate backend (external API). It is frontend-focused, with no database or direct API endpoint logic included—just fetch your data from your own backend or API.

## Features

- **Next.js 15** (App Router, TypeScript, React 19)
- **TanStack Query (React Query)** for all async data fetching
- **React Query DevTools** for debugging
- **Tailwind CSS 4** for utility-first styling
- **HeroUI** and **Shadcn/ui** for UI components (see their docs for design details)
- **Dark/Light theme** with `next-themes`
- **Framer Motion** for animation
- **Lucide React** for icons


> [!NOTE]
> If you want more details about the Design. Please refer our base project [Next.js Template Static](https://github.com/PrabothCharith/nextjs-template-static)


> [!WARNING]
> This template does not include any backend or API logic. If you need a full-stack solution, use our [Next.js Full-Stack Template](https://github.com/PrabothCharith/nextjs-template-fullstack)


## Project Structure

```
src/
  app/
    globals.css       # Global styles and Tailwind imports
    layout.tsx        # Root layout with providers
    page.tsx          # Home page
  components/
    ui/
      drawer.tsx      # Shadcn/ui drawer component
  lib/
    utils.ts          # Utility functions (cn helper)
  providers/
    initial.tsx       # App providers (Theme, HeroUI, TanStack Query)
.env                  # Environment variables (for API URLs, etc.)
```


## Getting Started

### Prerequisites

- **Node.js 18+** (LTS recommended)
- **npm**, **yarn**, or **pnpm** package manager

### Installation & Setup

1. Clone or Download the Template
```bash
# Clone the repository
git clone https://github.com/PrabothCharith/nextjs-template-for-external-APIs.git
```
yarn dev
npm run dev
Your application should now be running with:

1. **Install dependencies:**
  ```bash
  npm install
  # or

  # or
  pnpm install
  ```
2. **Start dev server:**
  ```bash
  npm run dev
  # or
### Data Fetching with TanStack Query
  # or
  pnpm dev
  ```
3. **Open your app:**
  Visit [http://localhost:3000](http://localhost:3000)

#### Basic Query Hook
```typescript
// hooks/useData.ts
import { useQuery } from '@tanstack/react-query';

interface ExampleData {
  id: string;
  name: string;
  email: string;
}

export function useExampleData() {
  return useQuery<ExampleData[]>({
    queryKey: ['exampleData'],
    queryFn: async () => {
      const response = await fetch('https://api.example.com/data');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      return response.json();
    },
  });
}
```
