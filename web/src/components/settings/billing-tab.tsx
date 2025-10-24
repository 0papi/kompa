"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, AlertCircle } from "lucide-react"

export function BillingTab() {
  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>You are currently on the Pro plan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-4">
            <div>
              <h3 className="font-semibold text-foreground">Pro Plan</h3>
              <p className="text-sm text-muted-foreground">$29/month</p>
            </div>
            <Badge>Active</Badge>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Plan Features</h4>
            <ul className="space-y-2">
              {[
                "Unlimited projects",
                "Advanced analytics",
                "Priority support",
                "Custom integrations",
                "Team collaboration",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-green-600" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3">
            <Button>Upgrade Plan</Button>
            <Button variant="outline">Manage Subscription</Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>View and download your invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { date: "Oct 23, 2025", amount: "$29.00", status: "Paid" },
              { date: "Sep 23, 2025", amount: "$29.00", status: "Paid" },
              { date: "Aug 23, 2025", amount: "$29.00", status: "Paid" },
            ].map((invoice, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-border pb-4 last:border-0">
                <div>
                  <p className="font-medium text-foreground">{invoice.date}</p>
                  <p className="text-sm text-muted-foreground">{invoice.amount}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{invoice.status}</Badge>
                  <Button variant="ghost" size="sm">
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Manage your payment methods</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-16 rounded bg-gradient-to-r from-blue-600 to-blue-400" />
              <div>
                <p className="font-medium text-foreground">Visa ending in 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/26</p>
              </div>
            </div>
            <Badge>Default</Badge>
          </div>
          <Button variant="outline">Add Payment Method</Button>
        </CardContent>
      </Card>

      {/* Billing Alert */}
      <Card className="border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
        <CardContent className="flex gap-3 pt-6">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-500" />
          <div>
            <p className="font-medium text-amber-900 dark:text-amber-200">Billing Information</p>
            <p className="text-sm text-amber-800 dark:text-amber-300">Your billing cycle renews on November 23, 2025</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
