"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Moon, Sun, Monitor } from "lucide-react"

export function AppearanceTab() {
  const [theme, setTheme] = useState("system")
  const [compactMode, setCompactMode] = useState(false)
  const [animations, setAnimations] = useState(true)

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>Choose your preferred color scheme</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={theme} onValueChange={setTheme}>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light" className="flex cursor-pointer items-center gap-3">
                  <Sun className="h-4 w-4" />
                  <div>
                    <p className="font-medium">Light</p>
                    <p className="text-sm text-muted-foreground">Clean and bright interface</p>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark" className="flex cursor-pointer items-center gap-3">
                  <Moon className="h-4 w-4" />
                  <div>
                    <p className="font-medium">Dark</p>
                    <p className="text-sm text-muted-foreground">Easy on the eyes at night</p>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <RadioGroupItem value="system" id="system" />
                <Label htmlFor="system" className="flex cursor-pointer items-center gap-3">
                  <Monitor className="h-4 w-4" />
                  <div>
                    <p className="font-medium">System</p>
                    <p className="text-sm text-muted-foreground">Follow your device settings</p>
                  </div>
                </Label>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Display Options */}
      <Card>
        <CardHeader>
          <CardTitle>Display Options</CardTitle>
          <CardDescription>Customize how content is displayed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="compact" className="font-medium">
                Compact Mode
              </Label>
              <p className="text-sm text-muted-foreground">Reduce spacing and padding</p>
            </div>
            <Switch id="compact" checked={compactMode} onCheckedChange={setCompactMode} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="animations" className="font-medium">
                Animations
              </Label>
              <p className="text-sm text-muted-foreground">Enable smooth transitions</p>
            </div>
            <Switch id="animations" checked={animations} onCheckedChange={setAnimations} />
          </div>
        </CardContent>
      </Card>

      {/* Accent Color */}
      <Card>
        <CardHeader>
          <CardTitle>Accent Color</CardTitle>
          <CardDescription>Choose your preferred accent color</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-3">
            {[
              { name: "Blue", color: "bg-blue-500" },
              { name: "Purple", color: "bg-purple-500" },
              { name: "Pink", color: "bg-pink-500" },
              { name: "Red", color: "bg-red-500" },
              { name: "Orange", color: "bg-orange-500" },
              { name: "Green", color: "bg-green-500" },
            ].map((accent) => (
              <button
                key={accent.name}
                className={`h-10 w-10 rounded-lg transition-transform hover:scale-110 ${accent.color}`}
                title={accent.name}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>See how your settings look</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 rounded-lg border border-border bg-muted/50 p-4">
            <div className="h-20 rounded-lg bg-primary" />
            <div className="space-y-2">
              <div className="h-4 w-3/4 rounded bg-foreground/20" />
              <div className="h-4 w-1/2 rounded bg-foreground/10" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button>Save Preferences</Button>
    </div>
  )
}
