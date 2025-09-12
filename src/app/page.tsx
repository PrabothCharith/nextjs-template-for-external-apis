"use client";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button, Select, SelectItem } from "@heroui/react";
import { ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [count, setCount] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  return (
    <div className={`${isDrawerOpen && 'scale-95'} transition-transform duration-300 ease-in-out`}>

      <Select
        className="fixed top-4 right-4 w-40"
        value={theme}
        onChange={(event) => setTheme((event.target as HTMLSelectElement).value as 'system' | 'dark' | 'light')}
        defaultSelectedKeys={theme ? [theme] : []}
      >
        <SelectItem key='system'>System</SelectItem>
        <SelectItem key='dark'>Dark</SelectItem>
        <SelectItem key='light'>Light</SelectItem>
      </Select>

      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
      <Button onPress={() => setCount(count + 1)}>Click Count <ArrowRight /> {count}</Button>
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerTrigger>
          <Button variant="solid" color="primary" onPress={() => setIsDrawerOpen(true)}>Open Drawer</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Are you absolutely sure?</DrawerTitle>
            <DrawerDescription>This action cannot be undone.</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose>
              <Button onPress={() => setIsDrawerOpen(false)}>Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
