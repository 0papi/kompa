"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { userApi } from "@/lib/api/user"
import { toast } from "sonner"
import { User, Building2, Users, Sparkles, CheckCircle2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface CompleteOAuthModalProps {
  open: boolean
  onClose: () => void
  userEmail: string
  firstName?: string
  lastName?: string
}

interface FormData {
  firstName: string
  lastName: string
  phoneNumber?: string
  account_type: "CONSUMER" | "PROVIDER" | "CONSUMER_PROVIDER"
}

const ACCOUNT_TYPES = [
  {
    value: "CONSUMER" as const,
    label: "Consumer",
    description: "Browse and purchase property comparables",
    icon: User,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    value: "PROVIDER" as const,
    label: "Provider",
    description: "List and sell property comparables",
    icon: Building2,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    value: "CONSUMER_PROVIDER" as const,
    label: "Both",
    description: "Full access to buy and sell comparables",
    icon: Users,
    gradient: "from-orange-500 to-red-500",
  },
]

export function CompleteOAuthModal({ open, onClose, userEmail, firstName = "", lastName = "" }: CompleteOAuthModalProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { control, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      firstName,
      lastName,
      phoneNumber: "",
      account_type: "CONSUMER",
    },
  })

  const selectedAccountType = watch("account_type")

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      await userApi.completeOAuthRegistration({
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber || undefined,
        account_type: data.account_type,
      })

      toast.success("Registration complete! Welcome to Kompa.", {
        description: "Redirecting to your dashboard...",
      })

      // Small delay for better UX
      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
    } catch (error: any) {
      toast.error("Failed to complete registration", {
        description: error?.message || "Please try again",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden border-0 gap-0">
        <div className="grid md:grid-cols-2 min-h-[600px]">
          {/* Left Column - Form */}
          <div className="p-8 flex flex-col justify-center">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-bold">Almost There!</h2>
              </div>
              <p className="text-muted-foreground">
                Just a couple more details to get you started with Kompa!
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Account Type Selection */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Choose Your Account Type</Label>
                <Controller
                  name="account_type"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="space-y-3"
                    >
                      {ACCOUNT_TYPES.map((type) => {
                        const Icon = type.icon
                        const isSelected = field.value === type.value

                        return (
                          <div key={type.value} className="relative">
                            <RadioGroupItem
                              value={type.value}
                              id={type.value}
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor={type.value}
                              className={cn(
                                "flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all",
                                "hover:border-primary/50 hover:bg-accent/50",
                                isSelected
                                  ? "border-primary bg-primary/5"
                                  : "border-border bg-background"
                              )}
                            >
                              <div
                                className={cn(
                                  "flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center transition-all",
                                  isSelected
                                    ? `bg-gradient-to-br ${type.gradient}`
                                    : "bg-muted"
                                )}
                              >
                                <Icon
                                  className={cn(
                                    "h-5 w-5 transition-colors",
                                    isSelected ? "text-white" : "text-muted-foreground"
                                  )}
                                />
                              </div>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold">{type.label}</p>
                                  {isSelected && (
                                    <CheckCircle2 className="h-4 w-4 text-primary animate-in zoom-in-50" />
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {type.description}
                                </p>
                              </div>
                            </Label>
                          </div>
                        )
                      })}
                    </RadioGroup>
                  )}
                />
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                {/* First Name */}
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-base font-semibold">
                    First Name
                  </Label>
                  <Controller
                    name="firstName"
                    control={control}
                    rules={{ required: "First name is required" }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="firstName"
                        type="text"
                        placeholder="John"
                        className="h-11"
                      />
                    )}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-destructive">{errors.firstName.message}</p>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-base font-semibold">
                    Last Name
                  </Label>
                  <Controller
                    name="lastName"
                    control={control}
                    rules={{ required: "Last name is required" }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        className="h-11"
                      />
                    )}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-destructive">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-base font-semibold">
                  Phone Number <span className="text-muted-foreground font-normal">(Optional)</span>
                </Label>
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="phoneNumber"
                      type="tel"
                      placeholder="+233 24 123 4567"
                      className="h-11"
                    />
                  )}
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  We'll use this for important account notifications
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full h-12 text-base font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Your Account...
                  </>
                ) : (
                  "Complete Registration"
                )}
              </Button>
            </form>

            <p className="mt-6 text-xs text-center text-muted-foreground">
              By continuing, you agree to Kompa's Terms of Service and Privacy Policy
            </p>
          </div>

          {/* Right Column - Visual */}
          <div className="hidden md:flex relative bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 items-center justify-center overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                  backgroundSize: '40px 40px',
                }}
              />
            </div>

            {/* Content */}
            <div className="relative z-10 space-y-8 max-w-sm">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-medium">One Last Step</span>
                </div>

                <h3 className="text-3xl font-bold leading-tight">
                  Join Ghana's Leading Property Comparables Platform
                </h3>

                <p className="text-muted-foreground leading-relaxed">
                  You're moments away from accessing accurate property data and connecting with verified professionals.
                </p>
              </div>

              {/* Feature List */}
              <div className="space-y-4">
                {[
                  {
                    icon: CheckCircle2,
                    text: "Access verified property comparables",
                    gradient: "from-green-500 to-emerald-500",
                  },
                  {
                    icon: CheckCircle2,
                    text: "Connect with trusted providers",
                    gradient: "from-blue-500 to-cyan-500",
                  },
                  {
                    icon: CheckCircle2,
                    text: "Make informed property decisions",
                    gradient: "from-purple-500 to-pink-500",
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 animate-in slide-in-from-right"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={cn(
                      "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center",
                      `bg-gradient-to-br ${feature.gradient}`
                    )}>
                      <feature.icon className="h-4 w-4 text-white" />
                    </div>
                    <p className="text-sm font-medium">{feature.text}</p>
                  </div>
                ))}
              </div>

              {/* Decorative Elements */}
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl -z-10" />
              <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
