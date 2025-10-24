"use client";

import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useListingsLayoutStore } from "./states/listings-layout.store";
import { motion } from "framer-motion";

export function LayoutToggle() {
  const { layout, setLayout } = useListingsLayoutStore();

  return (
    <div className="flex items-center gap-1 border rounded-lg p-1 relative">
      <motion.div
        className="absolute h-8 w-8 bg-primary rounded-md"
        initial={false}
        animate={{
          x: layout === "grid" ? 0 : 36,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setLayout("grid")}
        className={`h-8 w-8 relative z-10 transition-colors ${
          layout === "grid"
            ? "text-primary-foreground hover:text-primary-foreground"
            : ""
        }`}
        title="Grid view"
      >
        <motion.div
          animate={{ scale: layout === "grid" ? 1.1 : 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <LayoutGrid className="h-4 w-4" />
        </motion.div>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setLayout("list")}
        className={`h-8 w-8 relative z-10 transition-colors ${
          layout === "list"
            ? "text-primary-foreground hover:text-primary-foreground"
            : ""
        }`}
        title="List view"
      >
        <motion.div
          animate={{ scale: layout === "list" ? 1.1 : 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <List className="h-4 w-4" />
        </motion.div>
      </Button>
    </div>
  );
}
