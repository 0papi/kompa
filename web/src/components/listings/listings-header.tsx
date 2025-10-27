"use client";

import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";

interface ListingsHeaderProps {
  onCreateNew?: () => void;
}

export function ListingsHeader({ onCreateNew }: ListingsHeaderProps) {
  return (
    <div className="flex items-center md:flex-row flex-col space-y-4 justify-between">
      <div>
        <h1 className="md:text-3xl text-lg font-bold tracking-tight">Comparables</h1>
        <p className="text-muted-foreground md:text-base text-sm mt-1">
          Manage and view all your comparable listings
        </p>
      </div>
      <div className="flex items-center gap-x-2">
        <Button variant="outline" onClick={onCreateNew}>
          <Download className="h-4 w-4 text-muted-foreground" />
          Export
        </Button>

        <Button onClick={onCreateNew}>
          <Plus className="h-4 w-4 text-muted-foreground" />
          Upload Comparable
        </Button>
      </div>
    </div>
  );
}
