"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import VerifyPaymentContent from "@/components/purchases/VerifyPaymentDetails";

export default function VerifyPayment() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      }
    >
      <VerifyPaymentContent />
    </Suspense>
  );
}
