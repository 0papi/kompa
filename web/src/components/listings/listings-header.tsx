"use client";

import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";

interface ListingsHeaderProps {
  onCreateNew?: () => void;
}

export function ListingsHeader({ onCreateNew }: ListingsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Listings</h1>
        <p className="text-muted-foreground mt-1">
          Manage and view all your property listings
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onCreateNew}>
          <Download className="h-4 w-4 text-muted-foreground" />
          Export
        </Button>

        <Button onClick={onCreateNew}>
          <Plus className="h-4 w-4 text-muted-foreground" />
          Create Listing
        </Button>
      </div>
    </div>
  );
}
