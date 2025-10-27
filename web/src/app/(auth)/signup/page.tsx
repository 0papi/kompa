/** biome-ignore-all lint/nursery/useSortedClasses: <explanation> */
/** biome-ignore-all lint/correctness/useUniqueElementIds: <explanation> */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Search,
  User,
  CheckCircle2,
  Store,
  ShoppingBag,
  Users,
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAccount } from "@/lib/hooks/mutations/account.mutation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { isValidPhoneNumber } from "libphonenumber-js";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { CompleteOAuthModal } from "@/components/auth/complete-oauth-modal";
import { userApi } from "@/lib/api/user";

const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z
    .string()
    .refine(
      (value) => {
        if (!value || value === "") return true;
        return isValidPhoneNumber(value);
      },
      {
        message: "Please enter a valid phone number",
      }
    )
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/\d/, "Password must contain a number")
    .regex(/[!@#$%^&*]/, "Password must contain a special character"),
  account_type: z
    .enum(["PROVIDER", "CONSUMER", "CONSUMER_PROVIDER"])
    .default("PROVIDER"),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignUp() {
  const router = useRouter();
  const { useCreateUser } = useAccount();
  const createUser = useCreateUser();
  const [showPassword, setShowPassword] = useState(false);
  const [showOAuthModal, setShowOAuthModal] = useState(false);
  const [oauthUserData, setOauthUserData] = useState<{
    email: string;
    firstName: string;
    lastName: string;
  } | null>(null);

  const [signInWithGoogle, googleUser, googleLoading, googleError] = useSignInWithGoogle(auth);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<SignupFormData>({
    // @ts-ignore
    resolver: zodResolver(signupSchema),
  });

  console.log("form errors", errors);

  const isSubmitting = createUser.isPending;

  const password = watch("password", "");

  const passwordRequirements = [
    {
      label: "At least 6 characters",
      met: password.length >= 8,
    },
    {
      label: "Contains a number",
      met: /\d/.test(password),
    },
    {
      label: "Contains a special character",
      met: /[!@#$%^&*]/.test(password),
    },
  ];

  const onSubmit = async (data: SignupFormData) => {
    const name = `${data.firstName} ${data.lastName}`;
    return createUser.mutate(
      {
        account_type: data.account_type,
        email: data.email,
        name,
        phoneNumber: data.phoneNumber || undefined,
        password: data.password,
      },
      {
        onSuccess() {
          toast.success("Account created. Log in to access your account");
          router.push("/login");
        },
        onError(error, variables, onMutateResult, context) {
          console.log("error occurred", error);
          // @ts-ignore
          toast.error(error?.error?.message);
        },
      }
    );
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();

      if (!result) {
        throw new Error("Google sign-in failed");
      }

      // Check if user exists in our database
      try {
        await userApi.getProfile();
        // User exists, redirect to dashboard
        toast.success("Welcome back!");
        router.replace("/dashboard");
      } catch (error: any) {
        const code = error?.error?.code
        console.log('sign up error', error)
        // User doesn't exist (404), show completion modal
        if (code === "USER_NOT_FOUND") {
          // Parse displayName into first and last names
          const displayName = result.user.displayName || "";
          let firstName = "";
          let lastName = "";

          if (displayName) {
            const nameParts = displayName.trim().split(" ");
            firstName = nameParts[0] || "";
            lastName = nameParts.slice(1).join(" ") || "";
          }

          setOauthUserData({
            email: result.user.email || "",
            firstName,
            lastName,
          });
          setShowOAuthModal(true);
        } else {
          throw error;
        }
      }
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      toast.error("Google sign-in failed", {
        description: error?.message || "Please try again",
      });
    }
  };

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
            <h1 className="text-2xl font-bold text-black mb-1">Join Kompa</h1>
            <p className="text-sm text-gray-600">
              Create your account and start exploring comparable data
            </p>
          </div>

          {/* @ts-ignore */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-xs font-semibold text-black mb-1.5"
                >
                  First name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="firstName"
                    type="text"
                    autoComplete="given-name"
                    {...register("firstName")}
                    className={`block w-full pl-10 pr-3 py-2.5 text-sm border rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all ${
                      errors.firstName ? "border-red-500" : "border-gray-200"
                    }`}
                    placeholder="John"
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-xs font-semibold text-black mb-1.5"
                >
                  Last name
                </label>
                <Input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  {...register("lastName")}
                  className={`block w-full px-3 py-2.5 text-sm border rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all ${
                    errors.lastName ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-black mb-1.5"
              >
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  className={`block w-full pl-10 pr-3 py-2.5 text-sm border rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all ${
                    errors.email ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-black mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  {...register("password")}
                  className={`block w-full pl-10 pr-10 py-2.5 text-sm border rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all ${
                    errors.password ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>

              {password && (
                <div className="mt-2 space-y-1.5">
                  {passwordRequirements.map((req) => (
                    <div key={req.label} className="flex items-center gap-2">
                      <CheckCircle2
                        className={`h-3.5 w-3.5 ${
                          req.met ? "text-green-600" : "text-gray-300"
                        } transition-colors`}
                      />
                      <span
                        className={`text-xs ${
                          req.met ? "text-green-600" : "text-gray-500"
                        } transition-colors`}
                      >
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-xs font-semibold text-black mb-1.5"
              >
                Phone Number (Optional)
              </label>
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    {...field}
                    international
                    defaultCountry="GH"
                    placeholder="Enter phone number"
                    numberInputProps={{
                      className:
                        "selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-black ",
                    }}
                  />
                )}
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-black mb-3">
                I want to
              </label>
              <Controller
                name="account_type"
                control={control}
                defaultValue="PROVIDER"
                render={({ field }) => (
                  <div className="grid grid-cols-1 gap-2.5">
                    <button
                      type="button"
                      onClick={() => field.onChange("PROVIDER")}
                      className={cn(
                        "relative p-4 rounded-xl border-1 text-left transition-all duration-200 group",
                        field.value === "PROVIDER"
                          ? "border-blue-600 bg-blue-50 shadow-sm"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                            field.value === "PROVIDER"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                          )}
                        >
                          <Store className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3
                              className={cn(
                                "font-semibold text-sm",
                                field.value === "PROVIDER"
                                  ? "text-blue-900"
                                  : "text-gray-900"
                              )}
                            >
                              Provide Comp Data
                            </h3>
                            {field.value === "PROVIDER" && (
                              <CheckCircle2 className="h-4 w-4 text-blue-600 flex-shrink-0" />
                            )}
                          </div>
                          <p
                            className={cn(
                              "text-xs leading-relaxed",
                              field.value === "PROVIDER"
                                ? "text-blue-700"
                                : "text-gray-600"
                            )}
                          >
                            I have property comparable data to share with the
                            marketplace
                          </p>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => field.onChange("CONSUMER")}
                      className={cn(
                        "relative p-4 rounded-xl border-1 text-left transition-all duration-200 group",
                        field.value === "CONSUMER"
                          ? "border-green-600 bg-green-50 shadow-sm"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                            field.value === "CONSUMER"
                              ? "bg-green-600 text-white"
                              : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                          )}
                        >
                          <ShoppingBag className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3
                              className={cn(
                                "font-semibold text-sm",
                                field.value === "CONSUMER"
                                  ? "text-green-900"
                                  : "text-gray-900"
                              )}
                            >
                              Access Comp Data
                            </h3>
                            {field.value === "CONSUMER" && (
                              <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                            )}
                          </div>
                          <p
                            className={cn(
                              "text-xs leading-relaxed",
                              field.value === "CONSUMER"
                                ? "text-green-700"
                                : "text-gray-600"
                            )}
                          >
                            I need property comparable data for analysis and
                            decision making
                          </p>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => field.onChange("CONSUMER_PROVIDER")}
                      className={cn(
                        "relative p-4 rounded-xl border-1 text-left transition-all duration-200 group",
                        field.value === "CONSUMER_PROVIDER"
                          ? "border-purple-600 bg-purple-50 shadow-sm"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                            field.value === "CONSUMER_PROVIDER"
                              ? "bg-purple-600 text-white"
                              : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                          )}
                        >
                          <Users className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3
                              className={cn(
                                "font-semibold text-sm",
                                field.value === "CONSUMER_PROVIDER"
                                  ? "text-purple-900"
                                  : "text-gray-900"
                              )}
                            >
                              Both
                            </h3>
                            {field.value === "CONSUMER_PROVIDER" && (
                              <CheckCircle2 className="h-4 w-4 text-purple-600 flex-shrink-0" />
                            )}
                          </div>
                          <p
                            className={cn(
                              "text-xs leading-relaxed",
                              field.value === "CONSUMER_PROVIDER"
                                ? "text-purple-700"
                                : "text-gray-600"
                            )}
                          >
                            I want to both provide and access property
                            comparable data
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                )}
              />
              {errors.account_type && (
                <p className="mt-2 text-xs text-red-600">
                  {errors.account_type.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm bg-[#2a2a2a] text-white font-semibold rounded-lg border border-[#4a4a5c] hover:bg-[#323232] transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating account..." : "Create account"}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-gray-500 font-medium">
                  Or sign up with
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm bg-white text-gray-700 font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {googleLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
                  <span>Signing up...</span>
                </>
              ) : (
                <>
                  <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
            >
              Sign in instead
            </Link>
          </p>
        </div>

        <div className="mt-4">
          <p className="text-xs text-gray-500 text-center">
            By creating an account, you agree to our{" "}
            <a href="/terms" className="underline hover:text-gray-700">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline hover:text-gray-700">
              Privacy Policy
            </a>
          </p>
        </div>

        {/* OAuth Completion Modal */}
        {showOAuthModal && oauthUserData && (
          <CompleteOAuthModal
            open={showOAuthModal}
            onClose={() => setShowOAuthModal(false)}
            userEmail={oauthUserData.email}
            firstName={oauthUserData.firstName}
            lastName={oauthUserData.lastName}
          />
        )}
      </div>
    </div>
  );
}
