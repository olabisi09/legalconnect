"use client";

import Link from "next/link";
import { useRegister } from "@/hooks/features/use-auth";
import { FormProvider, useForm } from "react-hook-form";
import { FormInput } from "@/components/forms/form-input";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { AppButton } from "@/components/app-button";
import { toast } from "sonner";
import { AuthForm } from "@/components/auth-form";
import { FormCheckbox } from "@/components/forms/form-checkbox";
import { organizationTypes, subscriptionTiers } from "@/lib/enums";
import { FormSelect } from "@/components/forms/form-select";
import { useAuthStore } from "@/store/auth-store";

const signupSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  organizationName: z.string().min(1, "Organization name is required"),
  organizationType: z.enum(organizationTypes, {
    error: "Organization type is required",
  }),
  subscriptionTier: z.enum(subscriptionTiers).optional(),
  firmSize: z.string().optional(),
  jurisdiction: z.string().optional(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

type SignupValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { setAuthState } = useAuthStore();
  const signup = useRegister();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(signupSchema),
  });
  const { handleSubmit } = form;

  const onSubmit = async (values: SignupValues) => {
    await signup.mutateAsync(values, {
      onSuccess: async (data) => {
        toast.success("Account created successfully.");

        const sessionResponse = await fetch("/api/auth/session", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accessToken: data.auth.accessToken,
            refreshToken: data.auth.refreshToken,
          }),
        });

        if (!sessionResponse.ok) {
          throw new Error("Unable to create authenticated session");
        }

        setAuthState({ user: data.auth.user });
        router.push("/dashboard");
      },
    });
  };

  const tierOptions = subscriptionTiers.map((tier) => ({
    label: tier[0] + tier.slice(1).toLowerCase(),
    value: tier,
  }));

  const orgTypeOptions = organizationTypes.map((type) => ({
    label: type[0] + type.slice(1).toLowerCase().replace(/_/g, " "),
    value: type,
  }));

  return (
    <AuthForm
      title="Create an account"
      subtitle="Sign up to get started"
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-lc-ink underline underline-offset-2"
          >
            Sign in
          </Link>
        </>
      }
    >
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput
                name="firstName"
                label="First Name"
                placeholder="Enter your first name"
              />
              <FormInput
                name="lastName"
                label="Last Name"
                placeholder="Enter your last name"
              />
            </div>
            <FormInput
              name="email"
              label="Email Address"
              placeholder="Enter your email address"
            />
            <FormInput
              name="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
            />
            <FormInput
              name="organizationName"
              label="Organization Name"
              placeholder="Enter your organization name"
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormSelect
                name="organizationType"
                label="Organization Type"
                placeholder="Enter your organization type"
                options={orgTypeOptions}
              />
              <FormSelect
                name="subscriptionTier"
                label="Subscription Tier"
                placeholder="Enter your subscription tier"
                options={tierOptions}
              />
            </div>

            <FormInput
              name="firmSize"
              label="Firm Size"
              placeholder="Enter your firm size"
            />
            <FormInput
              name="jurisdiction"
              label="Jurisdiction"
              placeholder="Enter your jurisdiction"
            />
          </div>

          <FormCheckbox
            label="I accept the terms and conditions"
            name="acceptTerms"
          />

          <AppButton
            type="submit"
            className="w-full bg-lc-stamp text-lc-paper hover:bg-lc-stamp-dark"
            loading={signup.isPending}
            loadingText="Signing up..."
          >
            Sign up
          </AppButton>
        </form>
      </FormProvider>
    </AuthForm>
  );
}
