"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { preferencesApi, type UpdatePreferencesData } from "@/lib/api/preferences"
import { CURRENCIES, POPULAR_CURRENCIES, getCurrenciesByRegion } from "@/lib/currencies"
import { toast } from "sonner"
import { Check, Loader2, Globe, DollarSign, Bell, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

export function PreferencesTab() {
  const queryClient = useQueryClient()
  const [hasChanges, setHasChanges] = useState(false)
  const [openCurrency, setOpenCurrency] = useState(false)

  // Fetch preferences
  const { data, isLoading } = useQuery({
    queryKey: ["user-preferences"],
    queryFn: () => preferencesApi.getPreferences(),
  })

  const preferences = data?.data

  // Local state for form
  const [formData, setFormData] = useState({
    preferredCurrency: preferences?.preferredCurrency || "USD",
    preferredLanguage: preferences?.preferredLanguage || "en",
    notificationPreferences: preferences?.notificationPreferences || {
      email: true,
      push: true,
      sms: false,
      marketing: false,
    },
  })

  // Update local state when preferences load
  useEffect(() => {
    if (preferences) {
      setFormData({
        preferredCurrency: preferences.preferredCurrency,
        preferredLanguage: preferences.preferredLanguage || "en",
        notificationPreferences: preferences.notificationPreferences,
      })
    }
  }, [preferences])

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: UpdatePreferencesData) => preferencesApi.updatePreferences(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-preferences"] })
      toast.success("Preferences updated successfully")
      setHasChanges(false)
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update preferences")
    },
  })

  const handleSave = () => {
    updateMutation.mutate(formData)
  }

  const handleCurrencyChange = (value: string) => {
    setFormData((prev) => ({ ...prev, preferredCurrency: value }))
    setHasChanges(true)
  }

  const handleLanguageChange = (value: string) => {
    setFormData((prev) => ({ ...prev, preferredLanguage: value }))
    setHasChanges(true)
  }

  const handleNotificationToggle = (key: keyof typeof formData.notificationPreferences) => {
    setFormData((prev) => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [key]: !prev.notificationPreferences[key],
      },
    }))
    setHasChanges(true)
  }

  if (isLoading) {
    return <PreferencesLoading />
  }

  return (
    <div className="space-y-6">
      {/* Currency & Language */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-muted-foreground" />
            Regional Settings
          </CardTitle>
          <CardDescription>Set your preferred currency and language</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Currency */}
          <div className="space-y-2">
            <Label htmlFor="currency" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Preferred Currency
            </Label>
            <Popover open={openCurrency} onOpenChange={setOpenCurrency}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCurrency}
                  className="w-full justify-between"
                >
                  {formData.preferredCurrency ? (
                    <>
                      {CURRENCIES.find((c) => c.code === formData.preferredCurrency)?.code} -{" "}
                      {CURRENCIES.find((c) => c.code === formData.preferredCurrency)?.name} (
                      {CURRENCIES.find((c) => c.code === formData.preferredCurrency)?.symbol})
                    </>
                  ) : (
                    "Select currency..."
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search currency..." />
                  <CommandList>
                    <CommandEmpty>No currency found.</CommandEmpty>

                    {/* Popular Currencies */}
                    <CommandGroup heading="Popular">
                      {POPULAR_CURRENCIES.map((code) => {
                        const currency = CURRENCIES.find((c) => c.code === code)
                        if (!currency) return null
                        return (
                          <CommandItem
                            key={currency.code}
                            value={`${currency.code} ${currency.name}`}
                            onSelect={() => {
                              handleCurrencyChange(currency.code)
                              setOpenCurrency(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.preferredCurrency === currency.code ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <span className="font-medium">{currency.code}</span>
                            <span className="mx-2 text-muted-foreground">-</span>
                            <span>{currency.name}</span>
                            <span className="ml-auto text-muted-foreground">{currency.symbol}</span>
                          </CommandItem>
                        )
                      })}
                    </CommandGroup>

                    {/* African Currencies */}
                    <CommandGroup heading="Africa">
                      {getCurrenciesByRegion()["Africa"]?.map((currency) => {
                        // Skip if already in popular
                        if (POPULAR_CURRENCIES.includes(currency.code)) return null
                        return (
                          <CommandItem
                            key={currency.code}
                            value={`${currency.code} ${currency.name}`}
                            onSelect={() => {
                              handleCurrencyChange(currency.code)
                              setOpenCurrency(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.preferredCurrency === currency.code ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <span className="font-medium">{currency.code}</span>
                            <span className="mx-2 text-muted-foreground">-</span>
                            <span>{currency.name}</span>
                            <span className="ml-auto text-muted-foreground">{currency.symbol}</span>
                          </CommandItem>
                        )
                      })}
                    </CommandGroup>

                    {/* Other Regions */}
                    {Object.entries(getCurrenciesByRegion())
                      .filter(([region]) => region !== "Africa")
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([region, currencies]) => (
                        <CommandGroup key={region} heading={region}>
                          {currencies.map((currency) => {
                            // Skip if already in popular
                            if (POPULAR_CURRENCIES.includes(currency.code)) return null
                            return (
                              <CommandItem
                                key={currency.code}
                                value={`${currency.code} ${currency.name}`}
                                onSelect={() => {
                                  handleCurrencyChange(currency.code)
                                  setOpenCurrency(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.preferredCurrency === currency.code ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <span className="font-medium">{currency.code}</span>
                                <span className="mx-2 text-muted-foreground">-</span>
                                <span>{currency.name}</span>
                                <span className="ml-auto text-muted-foreground">{currency.symbol}</span>
                              </CommandItem>
                            )
                          })}
                        </CommandGroup>
                      ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <p className="text-sm text-muted-foreground">
              Prices and earnings will be displayed in this currency
            </p>
          </div>

          {/* Language */}
          <div className="space-y-2">
            <Label htmlFor="language">Preferred Language</Label>
            <Select value={formData.preferredLanguage} onValueChange={handleLanguageChange}>
              <SelectTrigger id="language" className="w-full">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español (Spanish)</SelectItem>
                <SelectItem value="fr">Français (French)</SelectItem>
                <SelectItem value="de">Deutsch (German)</SelectItem>
                <SelectItem value="pt">Português (Portuguese)</SelectItem>
                <SelectItem value="zh">中文 (Chinese)</SelectItem>
                <SelectItem value="ja">日本語 (Japanese)</SelectItem>
                <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              The interface will be displayed in this language
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-muted-foreground" />
            Notification Preferences
          </CardTitle>
          <CardDescription>Manage how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {/* Email Notifications */}
            <div className="flex items-center justify-between space-x-2">
              <div className="flex-1 space-y-0.5">
                <Label htmlFor="email-notifications" className="text-base font-medium">
                  Email Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications about your account activity
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={formData.notificationPreferences.email}
                onCheckedChange={() => handleNotificationToggle("email")}
              />
            </div>

            {/* Push Notifications */}
            <div className="flex items-center justify-between space-x-2">
              <div className="flex-1 space-y-0.5">
                <Label htmlFor="push-notifications" className="text-base font-medium">
                  Push Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive push notifications in your browser
                </p>
              </div>
              <Switch
                id="push-notifications"
                checked={formData.notificationPreferences.push}
                onCheckedChange={() => handleNotificationToggle("push")}
              />
            </div>

            {/* SMS Notifications */}
            <div className="flex items-center justify-between space-x-2">
              <div className="flex-1 space-y-0.5">
                <Label htmlFor="sms-notifications" className="text-base font-medium">
                  SMS Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive text messages for important updates
                </p>
              </div>
              <Switch
                id="sms-notifications"
                checked={formData.notificationPreferences.sms}
                onCheckedChange={() => handleNotificationToggle("sms")}
              />
            </div>

            {/* Marketing Communications */}
            <div className="flex items-center justify-between space-x-2">
              <div className="flex-1 space-y-0.5">
                <Label htmlFor="marketing-notifications" className="text-base font-medium">
                  Marketing Communications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive news, tips, and promotional content
                </p>
              </div>
              <Switch
                id="marketing-notifications"
                checked={formData.notificationPreferences.marketing}
                onCheckedChange={() => handleNotificationToggle("marketing")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Changes */}
      {hasChanges && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="flex items-center justify-between pt-6">
            <div>
              <p className="font-medium text-foreground">You have unsaved changes</p>
              <p className="text-sm text-muted-foreground">Save your preferences to apply the changes</p>
            </div>
            <Button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="min-w-[100px]"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function PreferencesLoading() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-12 w-64" />
              <Skeleton className="h-6 w-12" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
