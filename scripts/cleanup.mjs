import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');

const filesToDelete = [
  path.join(rootDir, 'src', 'components', 'posts-demo.tsx'),
  path.join(rootDir, 'src', 'lib', 'api.ts'),
];

const dirsToDelete = [
  path.join(rootDir, 'src', 'app', 'posts'),
];

const pageFile = path.join(rootDir, 'src', 'app', 'page.tsx');

const cleanPageContent = `"use client";

import { useTheme } from "next-themes";
import { Button } from "@heroui/react";
import { Moon, Sun, Laptop } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-4xl font-bold">Welcome to Next.js External API Template</h1>
      <p className="text-xl">Start building your application by editing <code className="bg-default-100 px-2 py-1 rounded">src/app/page.tsx</code></p>
      
      <div className="flex gap-2 mt-4">
         <Button isIconOnly variant="flat" onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {mounted ? (theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />) : <Sun size={20} />}
         </Button>
      </div>
    </div>
  );
}
`;

async function cleanup() {
  console.log('🧹 Starting cleanup...');

  // Delete files
  for (const file of filesToDelete) {
    try {
      await fs.unlink(file);
      console.log(`✅ Deleted: ${path.relative(rootDir, file)}`);
    } catch (err) {
      if (err.code !== 'ENOENT') {
        console.error(`❌ Failed to delete ${file}:`, err);
      }
    }
  }

  // Delete directories
  for (const dir of dirsToDelete) {
    try {
      await fs.rm(dir, { recursive: true, force: true });
      console.log(`✅ Deleted directory: ${path.relative(rootDir, dir)}`);
    } catch (err) {
      console.error(`❌ Failed to delete directory ${dir}:`, err);
    }
  }

  // Rewrite page.tsx
  try {
    await fs.writeFile(pageFile, cleanPageContent);
    console.log(`✅ Reset: ${path.relative(rootDir, pageFile)}`);
  } catch (err) {
    console.error(`❌ Failed to reset ${pageFile}:`, err);
  }

  console.log('✨ Cleanup complete! You can now start building.');
}

cleanup();
