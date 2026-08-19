"use client";

import { AppButton } from "@/components/app-button";
import { FormInput } from "@/components/forms/form-input";
import { DashboardCard } from "@/components/dashboard-card";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useLawyerProfile,
  useUpdateUserProfile,
  useUpsertLawyerProfile,
  useUserProfile,
} from "@/hooks/features/use-profile";
import { useAuthStore } from "@/store/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrgProfile } from "./_components/org-profile";

const userProfileSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
});

const lawyerProfileSchema = z.object({
  barNumber: z.string().trim().min(1, "Bar number is required"),
  practiceAreas: z.string().trim().min(1, "Provide at least one practice area"),
  biography: z.string().trim().min(1, "Biography is required"),
});

type UserProfileValues = z.infer<typeof userProfileSchema>;
type LawyerProfileValues = z.infer<typeof lawyerProfileSchema>;

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const [activeTab, setActiveTab] = useState<"profile" | "organization">(
    "profile",
  );

  const profileQuery = useUserProfile(user?.id);
  const updateUserProfile = useUpdateUserProfile(user?.id);

  const isLawyer = user?.role === "LAWYER";
  const lawyerProfileQuery = useLawyerProfile(isLawyer ? user?.id : undefined);
  const upsertLawyerProfile = useUpsertLawyerProfile(
    isLawyer ? user?.id : undefined,
  );

  const userProfileForm = useForm<UserProfileValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
    },
    resolver: zodResolver(userProfileSchema),
  });

  const lawyerProfileForm = useForm<LawyerProfileValues>({
    defaultValues: {
      barNumber: "",
      practiceAreas: "",
      biography: "",
    },
    resolver: zodResolver(lawyerProfileSchema),
  });

  useEffect(() => {
    if (!profileQuery.data) return;

    userProfileForm.reset({
      firstName: profileQuery.data.firstName,
      lastName: profileQuery.data.lastName,
    });
  }, [profileQuery.data, userProfileForm]);

  useEffect(() => {
    if (!isLawyer) return;

    if (lawyerProfileQuery.data) {
      lawyerProfileForm.reset({
        barNumber: lawyerProfileQuery.data.barNumber ?? "",
        practiceAreas: (lawyerProfileQuery.data.practiceAreas ?? []).join(", "),
        biography: lawyerProfileQuery.data.biography ?? "",
      });
      return;
    }

    if (lawyerProfileQuery.isSuccess && !lawyerProfileQuery.data) {
      lawyerProfileForm.reset({
        barNumber: "",
        practiceAreas: "",
        biography: "",
      });
    }
  }, [
    isLawyer,
    lawyerProfileForm,
    lawyerProfileQuery.data,
    lawyerProfileQuery.isSuccess,
  ]);

  const handleUserProfileSubmit = async (values: UserProfileValues) => {
    const updated = await updateUserProfile.mutateAsync(values);

    if (user) {
      setUser({
        ...user,
        email: updated.email ?? user.email,
        firstName: updated.firstName,
        lastName: updated.lastName,
        role: updated.role ?? user.role,
      });
    }

    toast.success("Profile updated successfully");
  };

  const handleLawyerProfileSubmit = async (values: LawyerProfileValues) => {
    await upsertLawyerProfile.mutateAsync({
      barNumber: values.barNumber,
      biography: values.biography,
      practiceAreas: values.practiceAreas
        .split(",")
        .map((area) => area.trim())
        .filter(Boolean),
    });

    toast.success("Professional profile saved");
  };

  return (
    <div className="grid grid-cols-1 gap-px p-px xl:grid-cols-2">
      <DashboardCard>
        <CardHeader className="border-b">
          <CardTitle className="text-sm">Profile Settings</CardTitle>
          <CardDescription>
            {activeTab === "profile"
              ? "Update your first and last name. Email changes are managed by admin."
              : "Firm details tied to your account. Contact your admin to make changes."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as typeof activeTab)}
          >
            <TabsList variant="line">
              <TabsTrigger value="profile">User Profile</TabsTrigger>
              <TabsTrigger value="organization">Organization</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="pt-4">
              {profileQuery.isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : (
                <FormProvider {...userProfileForm}>
                  <form
                    className="space-y-4"
                    onSubmit={userProfileForm.handleSubmit(
                      handleUserProfileSubmit,
                    )}
                  >
                    <div className="space-y-1">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        readOnly
                        value={profileQuery.data?.email ?? user?.email ?? ""}
                        className="opacity-80"
                      />
                    </div>

                    <FormInput name="firstName" label="First Name" />
                    <FormInput name="lastName" label="Last Name" />

                    <CardFooter className="border-t px-0">
                      <AppButton
                        type="submit"
                        loading={updateUserProfile.isPending}
                        loadingText="Saving..."
                      >
                        Save changes
                      </AppButton>
                    </CardFooter>
                  </form>
                </FormProvider>
              )}
            </TabsContent>

            <TabsContent value="organization" className="pt-4">
              <OrgProfile orgId={user?.orgId ?? ""} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </DashboardCard>

      {isLawyer ? (
        <DashboardCard>
          <CardHeader className="border-b">
            <CardTitle className="text-sm">Professional Profile</CardTitle>
            <CardDescription>
              Internal firm profile for lawyers. This is not a public directory
              listing.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {lawyerProfileQuery.isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : (
              <FormProvider {...lawyerProfileForm}>
                <form
                  className="space-y-4"
                  onSubmit={lawyerProfileForm.handleSubmit(
                    handleLawyerProfileSubmit,
                  )}
                >
                  <FormInput name="barNumber" label="Bar Number" />
                  <FormInput
                    name="practiceAreas"
                    label="Practice Areas"
                    placeholder="Family law, Corporate law"
                  />

                  <div className="space-y-1">
                    <Label htmlFor="biography">Biography</Label>
                    <textarea
                      id="biography"
                      rows={5}
                      className="w-full min-w-0 rounded-md border border-input bg-input/20 px-2 py-1.5 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 md:text-xs/relaxed dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
                      {...lawyerProfileForm.register("biography")}
                    />
                    {lawyerProfileForm.formState.errors.biography?.message ? (
                      <p className="text-xs font-medium text-destructive">
                        {lawyerProfileForm.formState.errors.biography.message}
                      </p>
                    ) : null}
                  </div>

                  <CardFooter className="border-t px-0">
                    <AppButton
                      type="submit"
                      loading={upsertLawyerProfile.isPending}
                      loadingText="Saving..."
                    >
                      Save professional profile
                    </AppButton>
                  </CardFooter>
                </form>
              </FormProvider>
            )}
          </CardContent>
        </DashboardCard>
      ) : null}
    </div>
  );
}
