"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { purchasesApi } from "@/lib/api/purchases";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "date-fns";
import { Suspense } from "react";

export default function VerifyPaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get("reference");

  // TanStack Query with enabled condition
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["verify-payment", reference],
    queryFn: async () => {
      if (!reference) {
        throw new Error("No payment reference found");
      }
      const result = await purchasesApi.verifyPurchase({ reference });

      if (!result.success) {
        throw new Error(result.message || "Payment verification failed");
      }

      return result.data;
    },
    enabled: !!reference,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Determine status based on query state
  const getStatus = () => {
    if (!reference) return "failed";
    if (isLoading) return "loading";
    if (isError) return "failed";
    if (data) return "success";
    return "idle";
  };

  const status = getStatus();
  const errorMessage =
    error instanceof Error
      ? error.message
      : "An error occurred during verification";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Icon and Status */}
            <div className="flex flex-col items-center space-y-4">
              {status === "loading" && (
                <>
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <h1 className="text-2xl font-bold text-center">
                    Verifying your payment...
                  </h1>
                  <p className="text-sm text-muted-foreground text-center">
                    Please don't close this page or refresh your browser
                  </p>
                </>
              )}

              {status === "success" && (
                <>
                  <CheckCircle2 className="h-12 w-12 text-green-600" />
                  <h1 className="text-2xl font-bold text-center text-green-600">
                    Payment verified successfully
                  </h1>
                  <p className="text-sm text-muted-foreground text-center">
                    Your payment has been confirmed
                  </p>
                </>
              )}

              {status === "failed" && (
                <>
                  <AlertCircle className="h-12 w-12 text-red-600" />
                  <h1 className="text-2xl font-bold text-center text-red-600">
                    Payment verification failed
                  </h1>
                  <p className="text-sm text-red-600 text-center">
                    {!reference ? "No payment reference found" : errorMessage}
                  </p>
                </>
              )}
            </div>

            {/* Details */}
            {data && (
              <div className="space-y-2 bg-muted p-4 rounded-lg">
                {data.data?.reference && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Reference:</span>
                    <span className="font-mono font-semibold">
                      {data.data?.reference}
                    </span>
                  </div>
                )}
                {data.data?.paidAt && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Paid At:</span>
                    <span className="font-mono font-semibold">
                      {formatDate(data.data?.paidAt, "yyyy-MM-dd")}
                    </span>
                  </div>
                )}
                {data.data?.amount && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-semibold">
                      GHS {data.data?.amount / 100}
                    </span>
                  </div>
                )}
                {data.data?.customerEmail && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Purchased By:</span>
                    <span className="font-semibold">
                      {" "}
                      {data.data?.customerEmail}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Manual Action for Failed State */}
            {status === "failed" && (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.push("/marketplace")}
                >
                  Return to Listings
                </Button>
              </div>
            )}

            {/* Manual Action for Success State */}
            {status === "success" && (
              <div className="flex items-center gap-3">
                <Button
                  className="flex-1"
                  variant={"outline"}
                  onClick={() => router.push("/marketplace/listing")}
                >
                  Purchase Another
                </Button>
                <Button
                  className="flex-1"
                  onClick={() =>
                    router.push(
                      `/dashboard/purchases/${data.data.transactionId}`,
                    )
                  }
                >
                  View Purchase
                </Button>
              </div>
            )}

            {/* Loading Progress Indicator */}
            {status === "loading" && (
              <div className="w-full bg-muted rounded-full h-1 overflow-hidden">
                <div className="bg-primary h-full w-1/3 animate-pulse"></div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
