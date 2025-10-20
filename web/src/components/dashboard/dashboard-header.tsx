"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  LayoutDashboard,
  BarChart3,
  Users,
  FileText,
  Calendar,
  MessageSquare,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "@/lib/hooks/useSession";
import { ROLE_SPECIFIC_DASHBOARD_ITEMS } from "@/lib/consts";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { SignOutModal } from "./sign-out-modal";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/theme-toggle";

export function DashboardHeader() {
  const [open, setOpen] = useState(false);
  const [signOutModalOpen, setSignOutModalOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { user, role } = useSession();
  const router = useRouter();

  console.log("role ", role);

  const links = ROLE_SPECIFIC_DASHBOARD_ITEMS[role!];

  console.log("dashboard links", links);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut(auth);
      toast.success("Signed out successfully");
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out. Please try again.");
    } finally {
      setIsSigningOut(false);
      setSignOutModalOpen(false);
    }
  };

  const getInitials = (name: string | null, email: string | null) => {
    if (name) {
      const parts = name.trim().split(" ");
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
      }
      return name.slice(0, 2).toUpperCase();
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  const userInitials = getInitials(
    user?.displayName || null,
    user?.email || null,
  );
  const userName = user?.displayName || user?.email?.split("@")[0] || "User";
  const userEmail = user?.email || "";

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/95">
        <div className="container mx-auto px-6 md:px-8 lg:px-10">
          <div className="flex h-16 items-center justify-between">
            {/* Left section - Logo & Command Menu */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(true)}
                className="md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>

              <div className="flex items-center">
                <Link href="/dashboard" className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Search className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="text-xl font-bold text-foreground">
                    Kompa
                  </span>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1 ml-6">
                <Button variant="ghost" size="sm" className="gap-2">
                  <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                  Overview
                </Button>

                {links?.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2"
                      onClick={() => router.push(link.href as any)}
                    >
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      {link.label}
                    </Button>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="hidden md:flex gap-2 w-64 justify-start text-muted-foreground bg-transparent"
                onClick={() => setOpen(true)}
              >
                <Search className="h-4 w-4" />
                <span>Search...</span>
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </Button>

              <ThemeToggle />

              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-accent" />
                <span className="sr-only">Notifications</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={user?.photoURL || undefined}
                        alt={userName}
                      />
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {userName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {userEmail}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSignOutModalOpen(true)}>
                    <LogOut className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <SignOutModal
        open={signOutModalOpen}
        onOpenChange={setSignOutModalOpen}
        onConfirm={handleSignOut}
        isLoading={isSigningOut}
      />

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem>
              <LayoutDashboard className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Overview</span>
            </CommandItem>
            <CommandItem>
              <BarChart3 className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Analytics</span>
            </CommandItem>
            <CommandItem>
              <Users className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Team</span>
            </CommandItem>
            <CommandItem>
              <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Reports</span>
            </CommandItem>
            <CommandItem>
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Calendar</span>
            </CommandItem>
            <CommandItem>
              <MessageSquare className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Messages</span>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Settings">
            <CommandItem>
              <User className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Profile</span>
            </CommandItem>
            <CommandItem>
              <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Settings</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
