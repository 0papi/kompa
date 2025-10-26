"use client"

import { useTheme } from "next-themes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Moon, Sun, Monitor, Palette } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from "react"

export function AppearanceTab() {
  const { theme, setTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <AppearanceLoading />
  }

  const currentTheme = theme === "system" ? systemTheme : theme

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-muted-foreground" />
            Theme
          </CardTitle>
          <CardDescription>Choose your preferred color scheme</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={theme} onValueChange={setTheme}>
            <div className="space-y-4">
              {/* Light Theme */}
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="light" id="light" className="mt-1" />
                <Label htmlFor="light" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-3 pb-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-background">
                      <Sun className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Light</p>
                      <p className="text-sm text-muted-foreground">Clean and bright interface</p>
                    </div>
                  </div>
                </Label>
              </div>

              {/* Dark Theme */}
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="dark" id="dark" className="mt-1" />
                <Label htmlFor="dark" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-3 pb-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-background">
                      <Moon className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Dark</p>
                      <p className="text-sm text-muted-foreground">Easy on the eyes at night</p>
                    </div>
                  </div>
                </Label>
              </div>

              {/* System Theme */}
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="system" id="system" className="mt-1" />
                <Label htmlFor="system" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-3 pb-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-background">
                      <Monitor className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">System</p>
                      <p className="text-sm text-muted-foreground">
                        Automatically match your device settings
                      </p>
                    </div>
                  </div>
                </Label>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Preview Card */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>
            {theme === "system"
              ? `Currently using ${currentTheme} mode (system preference)`
              : `Currently using ${theme} mode`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 rounded-lg border border-border bg-muted/50 p-6">
            {/* Preview Header */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="h-5 w-32 rounded-md bg-foreground/80" />
                <div className="h-3 w-48 rounded-md bg-foreground/40" />
              </div>
              <div className="h-9 w-9 rounded-full bg-primary" />
            </div>

            {/* Preview Content */}
            <div className="space-y-3 rounded-lg border border-border bg-background p-4">
              <div className="h-4 w-3/4 rounded bg-foreground/20" />
              <div className="h-4 w-5/6 rounded bg-foreground/15" />
              <div className="h-4 w-1/2 rounded bg-foreground/10" />
            </div>

            {/* Preview Actions */}
            <div className="flex gap-2">
              <div className="h-9 w-20 rounded-md bg-primary" />
              <div className="h-9 w-20 rounded-md border border-border bg-background" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-blue-500/50 bg-blue-50 dark:bg-blue-950/20">
        <CardContent className="flex gap-3 pt-6">
          <Palette className="h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-500" />
          <div>
            <p className="font-medium text-blue-900 dark:text-blue-200">Theme Settings</p>
            <p className="text-sm text-blue-800 dark:text-blue-300">
              Your theme preference is saved automatically and will be applied across all pages. System theme
              automatically switches between light and dark based on your device settings.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AppearanceLoading() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton className="h-5 w-5 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-5 w-24 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-48 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-40 w-full rounded-lg" />
        </CardContent>
      </Card>
    </div>
  )
}
