"use client";

import Link from "next/link";
import { useSession } from "@/lib/hooks/useSession";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Home, LayoutDashboard, User, LogOut, LogIn, Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { getInitials } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { favoritesApi } from "@/lib/api/favorites";
import { useBookmarksDrawer } from "@/components/bookmarks/state";
import { BookmarksDrawer } from "@/components/bookmarks/bookmarks-drawer";

export function MarketplaceHeader() {
  const { user, loading, isAuthenticated } = useSession();
  console.log("user session in marketplace", user);
  const router = useRouter();
  const { isOpen: bookmarksDrawerOpen, openDrawer: openBookmarksDrawer, closeDrawer: closeBookmarksDrawer } = useBookmarksDrawer();

  // Fetch user's bookmarks count
  const { data: bookmarksData } = useQuery({
    queryKey: ["user-bookmarks"],
    queryFn: () => favoritesApi.getUserBookmarks(),
    enabled: isAuthenticated && !!user,
  });

  const bookmarksCount = bookmarksData?.data?.length || 0;

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/signup");
    } catch (error) {
      console.error("Sign out failed", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between max-w-7xl">
        <Link
          href="/marketplace"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Home className="h-5 w-5" />
          <span className="text-lg font-semibold">Kompa</span>
        </Link>

        <nav className="flex items-center gap-3">
          {loading ? (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="text-sm">
                      {getInitials(user.displayName, user?.email)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {user.displayName && (
                      <p className="font-medium">{user.displayName}</p>
                    )}
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard"
                    className="flex items-center cursor-pointer"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={openBookmarksDrawer}
                  className="cursor-pointer group"
                >
                  <Bookmark className="mr-2 h-4 w-4 group-hover:text-foreground transition-colors" />
                  <span className="flex-1">Bookmarks</span>
                  {bookmarksCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-2 h-5 min-w-[20px] px-1.5 text-xs font-semibold tabular-nums"
                    >
                      {bookmarksCount > 99 ? "99+" : bookmarksCount}
                    </Badge>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </nav>
      </div>

      <BookmarksDrawer
        open={bookmarksDrawerOpen}
        onOpenChange={closeBookmarksDrawer}
      />
    </header>
  );
}
