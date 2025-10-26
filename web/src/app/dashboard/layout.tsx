"use client";

import { type ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase"; // your firebase config
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { EmailVerificationBanner } from "@/components/email-verification-banner";
import Loader from "@/components/loader";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-muted-foreground">
        <Loader />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader />
      <EmailVerificationBanner />
      <main className="flex-1 overflow-y-auto bg-background/90 custom-scrollbar">
        <div className="container mx-auto p-6 md:p-8 lg:p-10 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
