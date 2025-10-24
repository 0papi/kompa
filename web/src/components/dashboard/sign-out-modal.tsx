"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface SignOutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function SignOutModal({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: SignOutModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[380px]">
        <DialogHeader className="items-start space-y-2 ">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
            <LogOut className="h-6 w-6 text-muted-foreground" />
          </div>
          <DialogTitle className="">Sign Out</DialogTitle>
          <DialogDescription>
            Are you sure you want to sign out? You'll need to sign in again to
            access your dashboard.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? "Signing out..." : "Sign Out"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
