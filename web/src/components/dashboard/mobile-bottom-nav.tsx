"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn, getInitials } from "@/lib/utils";
import { ROLE_SPECIFIC_DASHBOARD_ITEMS } from "@/lib/consts";
import { useSession } from "@/lib/hooks/useSession";
import {
  LayoutDashboard,
  Plus,
  MoreHorizontal,
  User,
  Settings,
  Bookmark,
  LogOut,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { favoritesApi } from "@/lib/api/favorites";
import { useBookmarksDrawer } from "@/components/bookmarks/state";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { DISMISSAL_KEY } from "../email-verification-banner";

// Helper function to shorten labels for mobile
const getMobileLabel = (label: string): string => {
  const mobileLabels: Record<string, string> = {
    "My Comparables": "Comparables",
    "My Purchases": "Purchases",
    "Search Comparables": "Search",
    "Sales & Analytics": "Analytics",
  };
  return mobileLabels[label] || label;
};

export function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { role, user, isAuthenticated } = useSession();
  const [moreOpen, setMoreOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { openDrawer: openBookmarksDrawer } = useBookmarksDrawer();

  const links = ROLE_SPECIFIC_DASHBOARD_ITEMS[role!] || [];

  // Fetch user's bookmarks count
  const { data: bookmarksData } = useQuery({
    queryKey: ["user-bookmarks"],
    queryFn: () => favoritesApi.getUserBookmarks(),
    enabled: isAuthenticated,
  });

  const bookmarksCount = bookmarksData?.data?.length || 0;

  const userInitials = getInitials(
    user?.displayName || null,
    user?.email || null
  );
  const userName = user?.displayName || user?.email?.split("@")[0] || "User";
  const userEmail = user?.email || "";

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut(auth);
      localStorage.removeItem(DISMISSAL_KEY);
      toast.success("Signed out successfully");
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out. Please try again.");
    } finally {
      setIsSigningOut(false);
      setMoreOpen(false);
    }
  };

  // Get first 3 links for bottom nav (Overview + 2 others)
  const allNavItems = [
    {
      label: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    ...links.slice(0, 2).map(link => ({
      ...link,
      label: getMobileLabel(link.label),
    })),
  ];

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-lg">
        <div className="grid grid-cols-5 h-16 px-2 relative">
          {/* First nav item */}
          {allNavItems[0] && (() => {
            const Icon = allNavItems[0].icon;
            const isActive = pathname === allNavItems[0].href;
            return (
              <button
              // @ts-ignore
                onClick={() => router.push(allNavItems[0].href)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{allNavItems[0].label}</span>
              </button>
            );
          })()}

          {/* Second nav item */}
          {allNavItems[1] && (() => {
            const Icon = allNavItems[1].icon;
            const isActive = pathname === allNavItems[1].href;
            return (
              <button
              // @ts-ignore
                onClick={() => router.push(allNavItems[1].href)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{allNavItems[1].label}</span>
              </button>
            );
          })()}

          {/* Center Plus Button */}
          <div className="flex items-center justify-center">
            <button
              onClick={() => router.push("/dashboard/listings/new")}
              className="relative -top-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-4 shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
              aria-label="Create new listing"
            >
              <Plus className="h-6 w-6" strokeWidth={2.5} />
            </button>
          </div>

          {/* Third nav item */}
          {allNavItems[2] && (() => {
            const Icon = allNavItems[2].icon;
            const isActive = pathname === allNavItems[2].href;
            return (
              <button
              // @ts-ignore
                onClick={() => router.push(allNavItems[2].href)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{allNavItems[2].label}</span>
              </button>
            );
          })()}

          <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
            <SheetTrigger asChild>
              <button
                className="flex flex-col items-center justify-center gap-1 transition-colors text-muted-foreground hover:text-foreground"
              >
                <MoreHorizontal className="h-5 w-5" />
                <span className="text-xs font-medium">More</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-auto rounded-t-xl">
              <SheetHeader className="mb-6">
                <SheetTitle className="sr-only">More Options</SheetTitle>
                <div className="flex items-center gap-3">
                  <Avatar className="h-14 w-14">
                    <AvatarImage
                      src={user?.photoURL || undefined}
                      alt={userName}
                    />
                    <AvatarFallback className="text-lg">{userInitials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-base font-semibold">{userName}</p>
                    <p className="text-sm text-muted-foreground">{userEmail}</p>
                  </div>
                </div>
              </SheetHeader>

              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-12 text-base"
                  onClick={() => {
                    openBookmarksDrawer();
                    setMoreOpen(false);
                  }}
                >
                  <Bookmark className="mr-3 h-5 w-5 text-muted-foreground" />
                  <span className="flex-1 text-left">Saved Items</span>
                  {bookmarksCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-2 h-6 min-w-[24px] px-2 text-xs font-semibold"
                    >
                      {bookmarksCount > 99 ? "99+" : bookmarksCount}
                    </Badge>
                  )}
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start h-12 text-base"
                  onClick={() => {
                    router.push("/dashboard/settings?tab=profile");
                    setMoreOpen(false);
                  }}
                >
                  <User className="mr-3 h-5 w-5 text-muted-foreground" />
                  <span>Profile</span>
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start h-12 text-base"
                  onClick={() => {
                    router.push("/dashboard/settings");
                    setMoreOpen(false);
                  }}
                >
                  <Settings className="mr-3 h-5 w-5 text-muted-foreground" />
                  <span>Settings</span>
                </Button>

                <Separator className="my-2" />

                <Button
                  variant="ghost"
                  className="w-full justify-start h-12 text-base text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  <span>{isSigningOut ? "Signing out..." : "Sign out"}</span>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </>
  );
}
