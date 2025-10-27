"use client";

import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { X, Mail, RefreshCw, CheckCircle2 } from "lucide-react";
import { sendEmailVerification } from "firebase/auth";
import { useSession } from "@/lib/hooks/useSession";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export const DISMISSAL_KEY = "email-verification-banner-dismissed";
const LAST_SENT_KEY = "email-verification-last-sent";
const RESEND_COOLDOWN = 60000; // 60 seconds

export function EmailVerificationBanner() {
  const { user } = useSession();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [hasEverSent, setHasEverSent] = useState(false);

  useEffect(() => {
    
    const dismissed = localStorage.getItem(DISMISSAL_KEY);
    if (dismissed === "true") {
      setIsDismissed(true);
    }

    
    const lastSent = localStorage.getItem(LAST_SENT_KEY);
    if (lastSent) {
      setHasEverSent(true);
      const timeSinceLastSent = Date.now() - parseInt(lastSent);
      if (timeSinceLastSent < RESEND_COOLDOWN) {
        setCooldown(Math.ceil((RESEND_COOLDOWN - timeSinceLastSent) / 1000));
      }
    }
  }, []);

  // Cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // Reset dismissal if email becomes verified
  useEffect(() => {
    if (user?.emailVerified) {
      localStorage.removeItem(DISMISSAL_KEY);
      setIsDismissed(false);
    }
  }, [user?.emailVerified]);

  const handleDismiss = () => {
    localStorage.setItem(DISMISSAL_KEY, "true");
    setIsDismissed(true);
  };

  const handleSendVerification = async () => {
    if (!user || cooldown > 0) return;

    try {
      setIsSending(true);
      await sendEmailVerification(user);

      localStorage.setItem(LAST_SENT_KEY, Date.now().toString());
      setHasEverSent(true);
      setCooldown(60);

      toast.success("Verification email sent!", {
        description: "Please check your inbox and spam folder.",
        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      });
    } catch (error: any) {
      console.error("Error sending verification email:", error);

      // Handle specific error cases
      if (error.code === "auth/too-many-requests") {
        toast.error("Too many requests", {
          description: "Please wait a few minutes before trying again.",
        });
      } else {
        toast.error("Failed to send verification email", {
          description: "Please try again later.",
        });
      }
    } finally {
      setIsSending(false);
    }
  };

  // Don't show if email is verified or user dismissed it
  if (!user || user.emailVerified || isDismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="border-b bg-amber-50 dark:bg-amber-950/20">
          <div className="container mx-auto px-4 md:px-8 lg:px-10">
            <Alert className="relative border-none bg-transparent shadow-none rounded-none py-3 md:py-3">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                {/* Icon and text section */}
                <div className="flex items-start gap-3 flex-1">
                  <div className="flex-shrink-0">
                    <div className="h-9 w-9 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <Mail className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                    </div>
                  </div>

                  <AlertDescription className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                      Verify your email address
                    </p>
                    <p className="text-sm text-amber-700 dark:text-amber-400 mt-0.5">
                      {hasEverSent ? (
                        <>
                          <span className="hidden md:inline">
                            Verification email sent to{" "}
                            <span className="font-semibold">{user.email}</span>.
                            Please check your inbox.
                          </span>
                          <span className="md:hidden">
                            Check your inbox at{" "}
                            <span className="font-semibold break-all">{user.email}</span>
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="hidden md:inline">
                            Click below to send a verification email to{" "}
                            <span className="font-semibold">{user.email}</span>{" "}
                            and unlock all features.
                          </span>
                          <span className="md:hidden">
                            Send verification to{" "}
                            <span className="font-semibold break-all">{user.email}</span>
                          </span>
                        </>
                      )}
                    </p>
                  </AlertDescription>

                  {/* Dismiss button - absolute on mobile */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDismiss}
                    className="h-8 w-8 text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 md:hidden flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Dismiss</span>
                  </Button>
                </div>

                {/* Action buttons section */}
                <div className="flex items-center gap-2 md:ml-auto pl-12 md:pl-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSendVerification}
                    disabled={isSending || cooldown > 0}
                    className="bg-white dark:bg-gray-950 border-amber-300 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-medium text-xs md:text-sm"
                  >
                    {isSending ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 mr-1.5 md:mr-2 animate-spin" />
                        <span className="hidden sm:inline">Sending...</span>
                        <span className="sm:hidden">Sending</span>
                      </>
                    ) : cooldown > 0 ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 mr-1.5 md:mr-2" />
                        Resend ({cooldown}s)
                      </>
                    ) : hasEverSent ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 mr-1.5 md:mr-2" />
                        <span className="hidden sm:inline">Resend email</span>
                        <span className="sm:hidden">Resend</span>
                      </>
                    ) : (
                      <>
                        <Mail className="h-3.5 w-3.5 mr-1.5 md:mr-2" />
                        <span className="hidden sm:inline">Send verification</span>
                        <span className="sm:hidden">Verify</span>
                      </>
                    )}
                  </Button>

                  {/* Dismiss button - visible on desktop */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDismiss}
                    className="hidden md:flex h-8 w-8 text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Dismiss</span>
                  </Button>
                </div>
              </div>
            </Alert>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
