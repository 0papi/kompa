"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { paymentMethodsApi, type PaymentMethodType, type PaymentMethod, type CreatePaymentMethodData } from "@/lib/api/payment-methods"
import { userApi } from "@/lib/api/user"
import { toast } from "sonner"
import {
  CreditCard,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Wallet,
  Building,
  Mail,
  Phone,
  Loader2,
  Star,
  StarOff
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const PAYMENT_METHOD_ICONS: Record<PaymentMethodType, React.ElementType> = {
  BANK_ACCOUNT: Building,
  PAYPAL: Mail,
  STRIPE: CreditCard,
  VENMO: Wallet,
  CASHAPP: Wallet,
  ZELLE: Phone,
}

const PAYMENT_METHOD_LABELS: Record<PaymentMethodType, string> = {
  BANK_ACCOUNT: "Bank Account",
  PAYPAL: "PayPal",
  STRIPE: "Stripe",
  VENMO: "Venmo",
  CASHAPP: "Cash App",
  ZELLE: "Zelle",
}

export function PaymentMethodsTab() {
  const queryClient = useQueryClient()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Check if user is a provider
  const { data: userData } = useQuery({
    queryKey: ["user-profile"],
    queryFn: () => userApi.getProfile(),
  })

  const user = userData?.data
  const isProvider = user?.account_type === "PROVIDER" || user?.account_type === "CONSUMER_PROVIDER"

  // Fetch payment methods
  const { data, isLoading } = useQuery({
    queryKey: ["payment-methods"],
    queryFn: () => paymentMethodsApi.getAllPaymentMethods(),
    enabled: isProvider,
  })

  const paymentMethods = data?.data || []

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => paymentMethodsApi.deletePaymentMethod(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] })
      toast.success("Payment method deleted successfully")
      setDeleteId(null)
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete payment method")
    },
  })

  // Set preferred mutation
  const setPreferredMutation = useMutation({
    mutationFn: (id: string) => paymentMethodsApi.updatePaymentMethod(id, { isPreferred: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] })
      toast.success("Preferred payment method updated")
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update preferred method")
    },
  })

  // Remove preferred mutation
  const removePreferredMutation = useMutation({
    mutationFn: (id: string) => paymentMethodsApi.updatePaymentMethod(id, { isPreferred: false }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] })
      toast.success("Preferred status removed")
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to remove preferred status")
    },
  })

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
  }

  const handleSetPreferred = (id: string) => {
    setPreferredMutation.mutate(id)
  }

  const handleRemovePreferred = (id: string) => {
    removePreferredMutation.mutate(id)
  }

  if (!isProvider) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Payment methods are only available for Provider accounts. Upgrade your account to manage payment methods.
        </AlertDescription>
      </Alert>
    )
  }

  if (isLoading) {
    return <PaymentMethodsLoading />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Payment Methods</h3>
          <p className="text-sm text-muted-foreground">
            Manage how you receive payments for your comparables
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Payment Method
            </Button>
          </DialogTrigger>
          <AddPaymentMethodDialog onClose={() => setIsAddDialogOpen(false)} />
        </Dialog>
      </div>

      {/* Payment Methods List */}
      {paymentMethods.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No payment methods yet</h3>
            <p className="text-sm text-muted-foreground mb-4 text-center max-w-sm">
              Add a payment method to start receiving payments for your property comparables
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Payment Method
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {paymentMethods.map((method) => {
            const Icon = PAYMENT_METHOD_ICONS[method.methodType]
            return (
              <Card key={method.id} className={method.isPreferred ? "border-primary" : ""}>
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                      <Icon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{PAYMENT_METHOD_LABELS[method.methodType]}</h4>
                        {method.isPreferred && (
                          <Badge variant="default" className="gap-1">
                            <Star className="h-3 w-3 fill-current" />
                            Preferred
                          </Badge>
                        )}
                        {method.isVerified && (
                          <Badge variant="secondary" className="gap-1">
                            <Check className="h-3 w-3" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {method.accountDetails.email ||
                          method.accountDetails.phone ||
                          (method.accountDetails.accountNumber &&
                            `****${method.accountDetails.accountNumber}`) ||
                          method.accountDetails.accountHolderName ||
                          "No details"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!method.isPreferred && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetPreferred(method.id)}
                        disabled={setPreferredMutation.isPending}
                      >
                        Set as Preferred
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <span className="sr-only">More options</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="12" cy="5" r="1" />
                            <circle cx="12" cy="19" r="1" />
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {method.isPreferred ? (
                          <DropdownMenuItem
                            onClick={() => handleRemovePreferred(method.id)}
                            disabled={removePreferredMutation.isPending}
                          >
                            <StarOff className="mr-2 h-4 w-4" />
                            Remove Preferred
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => handleSetPreferred(method.id)}
                            disabled={setPreferredMutation.isPending}
                          >
                            <Star className="mr-2 h-4 w-4" />
                            Set as Preferred
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => setDeleteId(method.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Payment Method</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this payment method? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteId && handleDelete(deleteId)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Info Card */}
      <Card className="border-blue-500/50 bg-blue-50 dark:bg-blue-950/20">
        <CardContent className="flex gap-3 pt-6">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-500" />
          <div>
            <p className="font-medium text-blue-900 dark:text-blue-200">Payment Information</p>
            <p className="text-sm text-blue-800 dark:text-blue-300">
              Payment methods are used to receive earnings from property comparable purchases. Set a preferred method
              for faster payouts.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AddPaymentMethodDialog({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient()
  const [methodType, setMethodType] = useState<PaymentMethodType>("PAYPAL")
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    accountHolderName: "",
    accountNumber: "",
    routingNumber: "",
  })
  const [isPreferred, setIsPreferred] = useState(false)

  const createMutation = useMutation({
    mutationFn: (data: CreatePaymentMethodData) => paymentMethodsApi.createPaymentMethod(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] })
      toast.success("Payment method added successfully")
      onClose()
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to add payment method")
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const accountDetails: any = {}

    if (methodType === "BANK_ACCOUNT") {
      accountDetails.accountHolderName = formData.accountHolderName
      accountDetails.accountNumber = formData.accountNumber
      accountDetails.routingNumber = formData.routingNumber
    } else if (methodType === "PAYPAL" || methodType === "STRIPE") {
      accountDetails.email = formData.email
    } else if (methodType === "VENMO" || methodType === "CASHAPP" || methodType === "ZELLE") {
      accountDetails.phone = formData.phone
      accountDetails.email = formData.email
    }

    createMutation.mutate({
      methodType,
      accountDetails,
      isPreferred,
    })
  }

  return (
    <DialogContent className="sm:max-w-[500px]">
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>Add Payment Method</DialogTitle>
          <DialogDescription>
            Add a new payment method to receive earnings from your comparables
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Payment Method Type */}
          <div className="space-y-2">
            <Label htmlFor="methodType">Payment Method Type</Label>
            <Select value={methodType} onValueChange={(value) => setMethodType(value as PaymentMethodType)}>
              <SelectTrigger id="methodType" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PAYPAL">PayPal</SelectItem>
                <SelectItem value="BANK_ACCOUNT">Bank Account</SelectItem>
                <SelectItem value="STRIPE">Stripe</SelectItem>
                <SelectItem value="VENMO">Venmo</SelectItem>
                <SelectItem value="CASHAPP">Cash App</SelectItem>
                <SelectItem value="ZELLE">Zelle</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dynamic Fields Based on Type */}
          {(methodType === "PAYPAL" || methodType === "STRIPE") && (
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          )}

          {(methodType === "VENMO" || methodType === "CASHAPP" || methodType === "ZELLE") && (
            <>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1234567890"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-alt">Email (Optional)</Label>
                <Input
                  id="email-alt"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </>
          )}

          {methodType === "BANK_ACCOUNT" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="accountHolderName">Account Holder Name</Label>
                <Input
                  id="accountHolderName"
                  placeholder="John Doe"
                  value={formData.accountHolderName}
                  onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number (Last 4 digits)</Label>
                <Input
                  id="accountNumber"
                  placeholder="1234"
                  maxLength={4}
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground">Only enter the last 4 digits for security</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="routingNumber">Routing Number</Label>
                <Input
                  id="routingNumber"
                  placeholder="123456789"
                  maxLength={9}
                  value={formData.routingNumber}
                  onChange={(e) => setFormData({ ...formData, routingNumber: e.target.value })}
                  required
                />
              </div>
            </>
          )}

          {/* Set as Preferred */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPreferred"
              checked={isPreferred}
              onChange={(e) => setIsPreferred(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="isPreferred" className="text-sm font-normal">
              Set as preferred payment method
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Payment Method"
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}

function PaymentMethodsLoading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-10 w-40" />
      </div>
      {[1, 2].map((i) => (
        <Card key={i}>
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
            <Skeleton className="h-9 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
