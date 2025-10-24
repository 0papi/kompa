"use client";

import {
  Archive,
  CheckCircle,
  Copy,
  Edit,
  Eye,
  MoreVertical,
  Trash2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Listing } from "@/lib/api/listings";

interface ListingActionsDropdownProps {
  listing: Listing;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onPublish?: (id: string) => void;
  onUnpublish?: (id: string) => void;
  onArchive?: (id: string) => void;
  onUnarchive?: (id: string) => void;
  onDuplicate?: (id: string) => void;
}

export function ListingActionsDropdown({
  listing,
  onView,
  onEdit,
  onDelete,
  onPublish,
  onUnpublish,
  onArchive,
  onUnarchive,
  onDuplicate,
}: ListingActionsDropdownProps) {
  const { id, status } = listing;

  const handleAction = (
    e: React.MouseEvent,
    action: (id: string) => void,
  ) => {
    e.stopPropagation();
    action(id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {/* View */}
        <DropdownMenuItem onClick={(e) => handleAction(e, onView)}>
          <Eye className="h-4 w-4 mr-2" />
          View
        </DropdownMenuItem>

        {/* Edit */}
        <DropdownMenuItem onClick={(e) => handleAction(e, onEdit)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </DropdownMenuItem>

        {/* Duplicate */}
        {onDuplicate && (
          <DropdownMenuItem onClick={(e) => handleAction(e, onDuplicate)}>
            <Copy className="h-4 w-4 mr-2" />
            Duplicate
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {/* Status-specific actions */}
        {status === "DRAFT" && onPublish && (
          <DropdownMenuItem onClick={(e) => handleAction(e, onPublish)}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Publish
          </DropdownMenuItem>
        )}

        {status === "PUBLISHED" && onUnpublish && (
          <DropdownMenuItem onClick={(e) => handleAction(e, onUnpublish)}>
            <XCircle className="h-4 w-4 mr-2" />
            Unpublish
          </DropdownMenuItem>
        )}

        {status === "PUBLISHED" && onArchive && (
          <DropdownMenuItem onClick={(e) => handleAction(e, onArchive)}>
            <Archive className="h-4 w-4 mr-2" />
            Archive
          </DropdownMenuItem>
        )}

        {status === "ARCHIVED" && onUnarchive && (
          <DropdownMenuItem onClick={(e) => handleAction(e, onUnarchive)}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Unarchive
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {/* Delete */}
        <DropdownMenuItem
          onClick={(e) => handleAction(e, onDelete)}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
