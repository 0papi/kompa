"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, ShoppingCart, Bookmark, FileText } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { listingsApi } from "@/lib/api/listings"
import { favoritesApi } from "@/lib/api/favorites"
import { Skeleton } from "@/components/ui/skeleton"
import { useSession } from "@/lib/hooks/useSession"

export function StatsCards() {
  const { isAuthenticated } = useSession()

  // Fetch user's listings stats
  const { data: listingsData, isLoading: listingsLoading } = useQuery({
    queryKey: ["user-listings-stats"],
    queryFn: () => listingsApi.getMyListings(),
    enabled: isAuthenticated,
  })

  // Fetch user's bookmarks
  const { data: bookmarksData, isLoading: bookmarksLoading } = useQuery({
    queryKey: ["user-bookmarks"],
    queryFn: () => favoritesApi.getUserBookmarks(),
    enabled: isAuthenticated,
  })

  const listings = listingsData?.data || []
  const publishedListings = listings.filter(l => l.status === "PUBLISHED").length
  const draftListings = listings.filter(l => l.status === "DRAFT").length
  const totalListings = listings.length
  const totalBookmarks = bookmarksData?.data?.length || 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
          <Home className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {listingsLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <>
              <div className="text-2xl font-bold">{totalListings}</div>
              <p className="text-xs text-muted-foreground">
                {publishedListings} published
              </p>
            </>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Draft Listings</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {listingsLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <>
              <div className="text-2xl font-bold">{draftListings}</div>
              <p className="text-xs text-muted-foreground">
                Waiting to be published
              </p>
            </>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">-</div>
          <p className="text-xs text-muted-foreground">Coming soon</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Saved Listings</CardTitle>
          <Bookmark className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {bookmarksLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <>
              <div className="text-2xl font-bold">{totalBookmarks}</div>
              <p className="text-xs text-muted-foreground">
                Bookmarked properties
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
