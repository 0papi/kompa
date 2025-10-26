"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { listingsApi } from "@/lib/api/listings"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/hooks/useSession"

export function RecentListings() {
  const { isAuthenticated } = useSession()
  const router = useRouter()

  const { data: listingsData, isLoading } = useQuery({
    queryKey: ["user-listings-stats"],
    queryFn: () => listingsApi.getMyListings(),
    enabled: isAuthenticated,
  })

  const listings = listingsData?.data || []

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Recent Listings</CardTitle>
        <CardDescription>Your latest property comparable listings</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : listings.length > 0 ? (
          <div className="space-y-6">
            {listings.slice(0, 4).map((listing) => (
              <div
                key={listing.id}
                className="flex items-center gap-4 hover:bg-accent/5 p-2 rounded-lg transition-colors cursor-pointer"
                onClick={() => router.push(`/dashboard/listings?listingId=${listing.id}`)}
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Home className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-none truncate">{listing.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{listing.city}, {listing.state}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-semibold">${Number(listing.price).toLocaleString()}</div>
                  <div className={`text-xs mt-1 px-2 py-0.5 rounded-full inline-block ${
                    listing.status === 'PUBLISHED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    listing.status === 'DRAFT' ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' :
                    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}>
                    {listing.status.toLowerCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Home className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-sm text-muted-foreground">No listings yet</p>
            <p className="text-xs text-muted-foreground mt-1">Create your first property listing to get started</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
