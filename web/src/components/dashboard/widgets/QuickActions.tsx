"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, List } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Frequently used shortcuts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Link
          href="/dashboard/listings/new"
          className="block w-full text-left px-4 py-3 rounded-lg border border-border hover:bg-accent/5 transition-colors group"
        >
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4 text-primary" />
            <div className="font-medium">Create New Listing</div>
          </div>
          <div className="text-sm text-muted-foreground mt-1">Add a new property comparable</div>
        </Link>
        <Link
          href="/marketplace"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-left px-4 py-3 rounded-lg border border-border hover:bg-accent/5 transition-colors group"
        >
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-primary" />
            <div className="font-medium">Browse Marketplace</div>
          </div>
          <div className="text-sm text-muted-foreground mt-1">Explore published listings</div>
        </Link>
        <Link
          href="/dashboard/listings"
          className="block w-full text-left px-4 py-3 rounded-lg border border-border hover:bg-accent/5 transition-colors group"
        >
          <div className="flex items-center gap-2">
            <List className="h-4 w-4 text-primary" />
            <div className="font-medium">View My Listings</div>
          </div>
          <div className="text-sm text-muted-foreground mt-1">Manage all your listings</div>
        </Link>
      </CardContent>
    </Card>
  )
}
