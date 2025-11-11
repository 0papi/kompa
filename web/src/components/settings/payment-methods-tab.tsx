"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  paymentMethodsApi,
 
  type CreatePaymentMethodData,
 
  type PaymentMethod,
  type PaymentMethodType,
  
} from "@/lib/api/payment-methods";

import { userApi } from "@/lib/api/user";
import { toast } from "sonner";
import {
  CreditCard,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Wallet,
  Building,
  Phone,
  Loader2,
  Star,
  StarOff,
  Smartphone,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { useSession } from "@/lib/hooks/useSession";
import { createPayoutMethodSchema, type BankAccountDetails, type MobileMoneyDetails, type PayoutMethodType } from "@/schema/payment-method.schema";

const PAYMENT_METHOD_ICONS: Record<PayoutMethodType, React.ElementType> = {
  BANK_TRANSFER: Building,
  MOBILE_MONEY: Smartphone,
};

const PAYMENT_METHOD_LABELS: Record<PayoutMethodType, string> = {
  BANK_TRANSFER: "Bank Transfer",
  MOBILE_MONEY: "Mobile Money",
};

const MOBILE_MONEY_PROVIDERS = ["MTN", "VODAFONE", "AIRTEL", "OTHER"] as const;

export function PaymentMethodsTab() {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Check if user is a provider
  const { data: userData } = useQuery({
    queryKey: ["user-profile"],
    queryFn: () => userApi.getProfile(),
  });

  const user = userData?.data;
  const isProvider =
    user?.account_type === "PROVIDER" ||
    user?.account_type === "CONSUMER_PROVIDER";

  // Fetch payment methods
  const { data, isLoading } = useQuery({
    queryKey: ["payment-methods"],
    queryFn: () => paymentMethodsApi.getAllPaymentMethods(),
    enabled: isProvider,
  });

  const paymentMethods = data?.data || [];

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => paymentMethodsApi.deletePaymentMethod(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
      toast.success("Payment method deleted successfully");
      setDeleteId(null);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete payment method");
    },
  });

  // Set preferred mutation
  const setPreferredMutation = useMutation({
    mutationFn: (id: string) =>
      paymentMethodsApi.updatePaymentMethod(id, { isPreferred: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
      toast.success("Preferred payment method updated");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update preferred method");
    },
  });

  // Remove preferred mutation
  const removePreferredMutation = useMutation({
    mutationFn: (id: string) =>
      paymentMethodsApi.updatePaymentMethod(id, { isPreferred: false }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
      toast.success("Preferred status removed");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to remove preferred status");
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleSetPreferred = (id: string) => {
    setPreferredMutation.mutate(id);
  };

  const handleRemovePreferred = (id: string) => {
    removePreferredMutation.mutate(id);
  };

  if (!isProvider) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Payment methods are only available for Provider accounts. Upgrade your
          account to manage payment methods.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return <PaymentMethodsLoading />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Payout Methods</h3>
          <p className="text-sm text-muted-foreground">
            Manage how you receive payments for your comparables
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Payout Method
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
            <h3 className="text-lg font-medium mb-2">No payout methods yet</h3>
            <p className="text-sm text-muted-foreground mb-4 text-center max-w-sm">
              Add a payout method to start receiving earnings from your property
              comparables
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Payout Method
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {paymentMethods.map((method) => {
            const Icon = PAYMENT_METHOD_ICONS[method.methodType];
            const displayDetails = getDisplayDetails(method);

            return (
              <Card
                key={method.id}
                className={method.isPreferred ? "border-primary" : ""}
              >
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                      <Icon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">
                          {PAYMENT_METHOD_LABELS[method.methodType]}
                        </h4>
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
                        {displayDetails}
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
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Payout Method</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this payout method? This action
              cannot be undone.
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
            <p className="font-medium text-blue-900 dark:text-blue-200">
              Payout Information
            </p>
            <p className="text-sm text-blue-800 dark:text-blue-300">
              Payout methods are used to receive earnings from property
              comparable purchases. Set a preferred method for faster payouts.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface AddPaymentMethodDialogProps {
  onClose: () => void;
}

function AddPaymentMethodDialog({ onClose }: AddPaymentMethodDialogProps) {
  const { user: firebaseUser } = useSession();
  const queryClient = useQueryClient();
  const [selectedMethod, setSelectedMethod] = useState<PayoutMethodType>(
    "BANK_TRANSFER"
  );

  const form = useForm({
    resolver: zodResolver(createPayoutMethodSchema),
    defaultValues: {
      methodType: "BANK_TRANSFER",
      accountDetails: {
        methodType: "BANK_TRANSFER",
        details: {
          accountHolderName: "",
          accountNumber: "",
          bankCode: "",
          bankName: "",
        },
      },
      isPreferred: false,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: CreatePaymentMethodData) =>
      paymentMethodsApi.createPaymentMethod(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
      toast.success("Payout method added successfully");
      form.reset();
      onClose();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to add payout method");
    },
  });

  const onSubmit = (data: CreatePaymentMethodData) => {
    createMutation.mutate(data);
  };

  const handleMethodTypeChange = (value: PaymentMethodType) => {
    setSelectedMethod(value);
    form.setValue("methodType", value);

    if (value === "BANK_TRANSFER") {
      form.setValue("accountDetails", {
        methodType: "BANK_TRANSFER",
        details: {
          accountHolderName: "",
          accountNumber: "",
          bankCode: "",
          bankName: "",
        },
      });
    } else if (value === "MOBILE_MONEY") {
      form.setValue("accountDetails", {
        methodType: "MOBILE_MONEY",
        details: {
          phoneNumber: "",
          provider: "MTN",
          accountHolderName: "",
        },
      });
    }
  };

  useEffect(() => {
    if (firebaseUser?.email) {
      // Pre-fill account holder name if available from user profile
      const defaultAccountHolder = firebaseUser.displayName || "";
      if (selectedMethod === "BANK_TRANSFER") {
        form.setValue("accountDetails", {
          methodType: "BANK_TRANSFER",
          details: {
            accountHolderName: defaultAccountHolder,
            accountNumber: "",
            bankCode: "",
            bankName: "",
          },
        });
      }
    }
  }, [firebaseUser, form, selectedMethod]);

  return (
    <DialogContent className="sm:max-w-[500px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add Payout Method</DialogTitle>
            <DialogDescription>
              Add a new payout method to receive earnings from your comparables
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Payment Method Type */}
            <FormField
              control={form.control}
              name="methodType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Method Type</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={handleMethodTypeChange}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="BANK_TRANSFER">
                        Bank Transfer
                      </SelectItem>
                      <SelectItem value="MOBILE_MONEY">
                        Mobile Money
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bank Transfer Fields */}
            {selectedMethod === "BANK_TRANSFER" && (
              <>
                <FormField
                  control={form.control}
                  name="accountDetails"
                  render={({ field }) => {
                    const details = (
                      field.value as {
                        methodType: "BANK_TRANSFER";
                        details: BankAccountDetails;
                      }
                    )?.details;

                    return (
                      <FormItem>
                        <FormLabel>Account Holder Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            value={details?.accountHolderName || ""}
                            onChange={(e) => {
                              field.onChange({
                                methodType: "BANK_TRANSFER",
                                details: {
                                  ...details,
                                  accountHolderName: e.target.value,
                                },
                              });
                            }}
                          />
                        </FormControl>
                        <FormMessage>
                          {form.formState.errors.accountDetails?.message}
                        </FormMessage>
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="accountDetails"
                  render={({ field }) => {
                    const details = (
                      field.value as {
                        methodType: "BANK_TRANSFER";
                        details: BankAccountDetails;
                      }
                    )?.details;

                    return (
                      <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="1234567890"
                            value={details?.accountNumber || ""}
                            onChange={(e) => {
                              field.onChange({
                                methodType: "BANK_TRANSFER",
                                details: {
                                  ...details,
                                  accountNumber: e.target.value,
                                },
                              });
                            }}
                          />
                        </FormControl>
                        <FormMessage>
                          {form.formState.errors.accountDetails?.message}
                        </FormMessage>
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="accountDetails"
                  render={({ field }) => {
                    const details = (
                      field.value as {
                        methodType: "BANK_TRANSFER";
                        details: BankAccountDetails;
                      }
                    )?.details;

                    return (
                      <FormItem>
                        <FormLabel>Bank Code</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="GTBank (058)"
                            value={details?.bankCode || ""}
                            onChange={(e) => {
                              field.onChange({
                                methodType: "BANK_TRANSFER",
                                details: {
                                  ...details,
                                  bankCode: e.target.value,
                                },
                              });
                            }}
                          />
                        </FormControl>
                        <FormMessage>
                          {form.formState.errors.accountDetails?.message}
                        </FormMessage>
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="accountDetails"
                  render={({ field }) => {
                    const details = (
                      field.value as {
                        methodType: "BANK_TRANSFER";
                        details: BankAccountDetails;
                      }
                    )?.details;

                    return (
                      <FormItem>
                        <FormLabel>Bank Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Guaranty Trust Bank"
                            value={details?.bankName || ""}
                            onChange={(e) => {
                              field.onChange({
                                methodType: "BANK_TRANSFER",
                                details: {
                                  ...details,
                                  bankName: e.target.value,
                                },
                              });
                            }}
                          />
                        </FormControl>
                        <FormMessage>
                          {form.formState.errors.accountDetails?.message}
                        </FormMessage>
                      </FormItem>
                    );
                  }}
                />
              </>
            )}

            {/* Mobile Money Fields */}
            {selectedMethod === "MOBILE_MONEY" && (
              <>
                <FormField
                  control={form.control}
                  name="accountDetails"
                  render={({ field }) => {
                    const details = (
                      field.value as {
                        methodType: "MOBILE_MONEY";
                        details: MobileMoneyDetails;
                      }
                    )?.details;

                    return (
                      <FormItem>
                        <FormLabel>Account Holder Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            value={details?.accountHolderName || ""}
                            onChange={(e) => {
                              field.onChange({
                                methodType: "MOBILE_MONEY",
                                details: {
                                  ...details,
                                  accountHolderName: e.target.value,
                                },
                              });
                            }}
                          />
                        </FormControl>
                        <FormMessage>
                          {form.formState.errors.accountDetails?.message}
                        </FormMessage>
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="accountDetails"
                  render={({ field }) => {
                    const details = (
                      field.value as {
                        methodType: "MOBILE_MONEY";
                        details: MobileMoneyDetails;
                      }
                    )?.details;

                    return (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+233501234567"
                            value={details?.phoneNumber || ""}
                            onChange={(e) => {
                              field.onChange({
                                methodType: "MOBILE_MONEY",
                                details: {
                                  ...details,
                                  phoneNumber: e.target.value,
                                },
                              });
                            }}
                          />
                        </FormControl>
                        <small className="text-muted-foreground">
                          Include country code (e.g., +233 for Ghana)
                        </small>
                        <FormMessage>
                          {form.formState.errors.accountDetails?.message}
                        </FormMessage>
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="accountDetails"
                  render={({ field }) => {
                    const details = (
                      field.value as {
                        methodType: "MOBILE_MONEY";
                        details: MobileMoneyDetails;
                      }
                    )?.details;

                    return (
                      <FormItem>
                        <FormLabel>Mobile Money Provider</FormLabel>
                        <Select
                          value={details?.provider || "MTN"}
                          onValueChange={(value) => {
                            field.onChange({
                              methodType: "MOBILE_MONEY",
                              details: {
                                ...details,
                                provider: value as
                                  | "MTN"
                                  | "VODAFONE"
                                  | "AIRTEL"
                                  | "OTHER",
                              },
                            });
                          }}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {MOBILE_MONEY_PROVIDERS.map((provider) => (
                              <SelectItem key={provider} value={provider}>
                                {provider}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage>
                          {form.formState.errors.accountDetails?.message}
                        </FormMessage>
                      </FormItem>
                    );
                  }}
                />
              </>
            )}

            {/* Set as Preferred */}
            <FormField
              control={form.control}
              name="isPreferred"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal cursor-pointer">
                    Set as preferred payout method
                  </FormLabel>
                </FormItem>
              )}
            />
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
                "Add Payout Method"
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
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
  );
}

/**
 * Helper function to display payment method details
 */
function getDisplayDetails(method: PaymentMethod): string {
  const details = method.accountDetails;

  if (method.methodType === "BANK_TRANSFER") {
    return `${details.details.bankName} - ••••${details.details.accountNumber?.slice(-4) || ""}`;
  }

  if (method.methodType === "MOBILE_MONEY") {
    return `${details.details.provider} - ${details.details.phoneNumber}`;
  }

  return "Payment method";
}
