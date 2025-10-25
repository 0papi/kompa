"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Suspense } from "react"
import { ProfileTab } from "@/components/settings/profile-tab"
import { BillingTab } from "@/components/settings/billing-tab"
import { AppearanceTab } from "@/components/settings/appearance-tab"
import { User, CreditCard, Palette } from "lucide-react"

function SettingsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const activeTab = searchParams.get("tab") || "profile"

  const handleTabChange = (tab: string) => {
    router.push(`./settings?tab=${tab}` as any)
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "appearance", label: "Appearance", icon: Palette },
  ]

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="border-b border-border">
        <div className=" px-4 py-8 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
            <p className="mt-2 text-sm text-muted-foreground">Manage your account settings and preferences</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="border-b border-border">
          <div className="flex gap-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 px-1 py-3 text-sm font-medium transition-colors relative ${
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  {/* Underline indicator */}
                  {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === "profile" && <ProfileTab />}
          {activeTab === "billing" && <BillingTab />}
          {activeTab === "appearance" && <AppearanceTab />}
        </div>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <SettingsContent />
    </Suspense>
  )
}
