/** biome-ignore-all lint/nursery/useSortedClasses: <explanation> */
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    const { email } = data;

    try {
      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/login`,
        handleCodeInApp: false,
      });

      setSentEmail(email);
      setIsEmailSent(true);
      toast.success("Password reset email sent!", {
        description: "Check your inbox for the reset link",
      });
    } catch (error: any) {
      console.error("Password reset error:", error);

      // Handle specific Firebase errors
      if (error.code === "auth/user-not-found") {
        toast.error("No account found with this email", {
          description: "Please check your email or sign up",
        });
      } else if (error.code === "auth/invalid-email") {
        toast.error("Invalid email address", {
          description: "Please enter a valid email",
        });
      } else if (error.code === "auth/too-many-requests") {
        toast.error("Too many attempts", {
          description: "Please try again later",
        });
      } else {
        toast.error("Failed to send reset email", {
          description: error?.message || "Please try again",
        });
      }
    }
  };

  const handleResendEmail = async () => {
    try {
      await sendPasswordResetEmail(auth, sentEmail, {
        url: `${window.location.origin}/login`,
        handleCodeInApp: false,
      });
      toast.success("Reset email sent again!", {
        description: "Check your inbox",
      });
    } catch (error: any) {
      console.error("Resend error:", error);
      toast.error("Failed to resend email", {
        description: "Please try again later",
      });
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <div className="mb-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-black mb-2">Check your email</h1>
              <p className="text-sm text-gray-600">
                We've sent a password reset link to
              </p>
              <p className="text-sm font-semibold text-black mt-1">{sentEmail}</p>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-900">
                  Click the link in the email to reset your password. The link will expire in 1 hour.
                </p>
              </div>

              <button
                onClick={handleResendEmail}
                className="w-full px-6 py-3.5 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                Resend email
              </button>

              <Link
                href="/login"
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#2a2a2a] text-white font-semibold rounded-xl border border-[#4a4a5c] hover:bg-[#323232] transition-all"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to sign in
              </Link>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs text-gray-500 text-center">
              Didn't receive the email? Check your spam folder or try resending.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-2xl p-8">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-[#2a2a2a] rounded-lg flex items-center justify-center">
                <Search className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-black">Kompa</span>
            </Link>
            <h1 className="text-2xl font-bold text-black mb-1">Reset your password</h1>
            <p className="text-sm text-gray-600">
              Enter your email and we'll send you a link to reset your password
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-black mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  className={cn(
                    "block w-full pl-12 pr-4 py-3.5",
                    errors.email && "text-red-500",
                    !errors.email && "text-black"
                  )}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3.5 bg-[#2a2a2a] text-white font-semibold rounded-xl border border-[#4a4a5c] hover:bg-[#323232] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Send reset link"}
            </button>

            <Link
              href="/login"
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to sign in
            </Link>
          </form>
        </div>

        <div className="mt-6">
          <p className="text-xs text-gray-500 text-center">
            Don't have an account?{" "}
            <Link href="/signup" className="underline hover:text-gray-700">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
