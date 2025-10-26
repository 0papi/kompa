"use client"

import { useSession } from "@/lib/hooks/useSession"
import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

// Lazy load dashboard widgets for better performance
const StatsCards = dynamic(
  () => import("@/components/dashboard/widgets").then(mod => ({ default: mod.StatsCards })),
  {
    loading: () => (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-lg border bg-card">
            <div className="p-6 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    )
  }
)

const RecentListings = dynamic(
  () => import("@/components/dashboard/widgets").then(mod => ({ default: mod.RecentListings })),
  {
    loading: () => (
      <div className="col-span-4 rounded-lg border bg-card">
        <div className="p-6">
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-48 mb-4" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="space-y-2 flex-1">do
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
)

const QuickActions = dynamic(
  () => import("@/components/dashboard/widgets").then(mod => ({ default: mod.QuickActions })),
  {
    loading: () => (
      <div className="col-span-3 rounded-lg border bg-card">
        <div className="p-6">
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-40 mb-4" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }
)

export default function DashboardPage() {
  const { user } = useSession()
  const displayName = user?.displayName || user?.email?.split("@")[0] || "there"

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {displayName}</h1>
        <p className="text-muted-foreground mt-2">Here's an overview of your property comparable listings.</p>
      </div>

      {/* Stats Grid */}
      <StatsCards />

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <RecentListings />
        <QuickActions />
      </div>
    </div>
  )
}
