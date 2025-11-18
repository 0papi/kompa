"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { purchasesApi } from "@/lib/api/purchases";
import { useConfirmPurchaseModalStore } from "../state";

interface Listing {
  id: string;
  title: string;
  price: number;
  currency: string;
  sellerId: string;
  seller?: {
    name: string;
    email: string;
  };
}

interface PurchaseConfirmationDialogProps {
  
  onSuccess?: () => void;
}

export function PurchaseConfirmationDialog({
  
  
  onSuccess,
}: PurchaseConfirmationDialogProps) {
  const { setListing, open, listing, setOpen} = useConfirmPurchaseModalStore()
  const [showInitialConfirm, setShowInitialConfirm] = useState(true);
  const [showPaymentRedirect, setShowPaymentRedirect] = useState(false);
  const queryClient = useQueryClient();



  const initiatePurchaseMutation = useMutation({
    mutationFn: (data: { listingId: string, amount:number }) =>
      purchasesApi.initiatePurchase(data),
    onSuccess: (data) => {
      // After successful initialization, show payment redirect dialog
      setShowInitialConfirm(false);
      setShowPaymentRedirect(true);

      // Redirect to Paystack after a short delay to let user see the message
      setTimeout(() => {
        if (data.data?.authorizationUrl) {
          window.location.href = data.data.authorizationUrl;
        }
      }, 1500);
    },
    onError: (error: any) => {
      console.log('log error', error)
      toast.error(
        error?.message || "Failed to initiate purchase. Please try again."
      );
    },
  });

  const handleConfirmPurchase = () => {
    initiatePurchaseMutation.mutate({
      listingId: listing?.id as string,
      amount: Number(listing?.comparablePrice)!
    });
  };

  const handleCancel = () => {
    setShowInitialConfirm(true);
    setShowPaymentRedirect(false);
    setOpen(false)
  };

  return (
    <>
      {/* Initial Confirmation Dialog */}
      <AlertDialog open={open && showInitialConfirm}>
        <AlertDialogContent className="sm:max-w-[500px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              Confirm Purchase
            </AlertDialogTitle>
            <AlertDialogDescription>
              Please review the details below and confirm you want to proceed
              with this purchase.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* Purchase Details */}
          <div className="space-y-4 py-4">
            {/* Listing Card */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Comparable</p>
                  <p className="font-semibold text-base line-clamp-2">
                    {listing?.title}
                  </p>
                </div>

                {/* {listing?.userId && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground">Seller</p>
                      <p className="font-medium">{listing.seller.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {listing.seller.email}
                      </p>
                    </div>
                  </>
                )} */}

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Purchase Price
                    </span>
                    <span className="font-semibold">
                      {'GHS'} {listing?.comparablePrice}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Warning Message */}
            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 p-3">
              <p className="text-sm text-amber-900 dark:text-amber-200">
                You will be redirected to a secure payment page to complete this
                transaction. Please ensure you have a stable internet connection.
              </p>
            </div>

            {/* Terms Acknowledgment */}
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 p-3">
              <p className="text-sm text-blue-900 dark:text-blue-200">
                By proceeding, you agree to our terms of service and this
                purchase is final.
              </p>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={handleCancel}
              disabled={initiatePurchaseMutation.isPending}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmPurchase}
              disabled={initiatePurchaseMutation.isPending}
              className="bg-primary hover:bg-primary/90"
            >
              {initiatePurchaseMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>Proceed to Payment</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Payment Redirect Dialog */}
      <Dialog open={showPaymentRedirect && open}>
        <DialogContent className="sm:max-w-[400px]" onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Ready for Payment
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Card>
              <CardContent className="pt-6 space-y-3">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">
                    Amount to Pay
                  </p>
                  <p className="text-3xl font-bold">
                    {'GHS'} {listing?.comparablePrice}
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {listing?.title}
                  </p>
                  <Badge variant="secondary" className="w-fit">
                    Redirecting to payment...
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 p-3">
              <p className="text-sm text-blue-900 dark:text-blue-200">
                You will be redirected to a secure payment page in a moment. If
                the page doesn't load automatically, please check your browser
                settings.
              </p>
            </div>

            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel} disabled>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
