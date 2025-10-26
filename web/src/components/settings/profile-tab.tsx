"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Loader2, CheckCircle2 } from "lucide-react";
import { useSession } from "@/lib/hooks/useSession";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/lib/api/user";
import { toast } from "sonner";
import { auth } from "@/lib/firebase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getInitials } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import ProfileLoading from "./profile-loading";
import type { AccountType } from "@/lib/types";
import { profileSchema, type ProfileFormValues } from "@/schema/account.schema";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

export function ProfileTab() {
  const { user: firebaseUser, isAuthenticated } = useSession();
  const queryClient = useQueryClient();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      account_type: "CONSUMER_PROVIDER",
    },
  });

  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: () => userApi.getProfile(),
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (profileData?.data) {
      form.setValue("account_type", profileData.data.account_type)
     form.setValue("name", profileData.data.name as string)
     form.setValue("phoneNumber", profileData.data.phoneNumber || "")
    }
  }, [profileData, form]);

  const updateProfileMutation = useMutation({
    mutationFn: userApi.updateProfile,
    onSuccess: async () => {
      // Force refresh Firebase token to get updated custom claims
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          await currentUser.getIdToken(true); // Force refresh token
        } catch (error) {
          console.error("Error refreshing token:", error);
        }
      }

      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      toast.success("Profile updated successfully", {
        description: "Your changes have been saved and synced.",
      });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    },
  });

  function onSubmit(values: ProfileFormValues) {
    updateProfileMutation.mutate(values);
  }

  if (isLoadingProfile) {
    return <ProfileLoading />;
  }

  const userInitials = getInitials(
    profileData?.data.name || null,
    profileData?.data.email || null
  );

  console.log("account information", profileData?.data)

  return (
    <div className="space-y-6">
      {/* Profile Picture */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>
            Upload a new profile picture (coming soon)
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={firebaseUser?.photoURL || undefined} />
            <AvatarFallback className="text-2xl">{userInitials}</AvatarFallback>
          </Avatar>
          <Button variant="outline" className="gap-2 bg-transparent" disabled>
            <Upload className="h-4 w-4" />
            Upload Picture
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                {...form.register("name")}
                placeholder="Enter your full name"
              />
              {form.formState.errors.name && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            {/* Email (disabled) */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profileData?.data.email || ""}
                disabled
                className="bg-muted cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed
              </p>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Controller
                name="phoneNumber"
                control={form.control}
                render={({ field }) => (
                  <PhoneInput
                    {...field}
                    international
                    defaultCountry="US"
                    placeholder="Enter phone number"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                )}
              />
              {form.formState.errors.phoneNumber && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.phoneNumber.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Used for account verification and important notifications
              </p>
            </div>

            {/* Account Type */}
            <div className="space-y-2">
              <Label htmlFor="account_type">Account Type</Label>
              <Select
                onValueChange={(value) =>
                  form.setValue(
                    "account_type",
                    value as ProfileFormValues["account_type"]
                  )
                }
                value={form.watch("account_type") ?? ""}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PROVIDER">Provider</SelectItem>
                  <SelectItem value="CONSUMER">Consumer</SelectItem>
                  <SelectItem value="CONSUMER_PROVIDER">
                    Consumer & Provider
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground"> Choose your account type based on how you'll use Kompa </p>

              {form.formState.errors.account_type && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.account_type.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="w-full sm:w-auto"
            >
              {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <Button variant="destructive">Delete Account</Button>
        </CardContent>
      </Card>
    </div>
  );
}
