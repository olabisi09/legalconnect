"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { RiErrorWarningLine } from "@remixicon/react";

import { AuthForm } from "@/components/auth-form";
import { FormInput } from "@/components/forms/form-input";
import { AppButton } from "@/components/app-button";
import { useAuthStore } from "@/store/auth-store";
import { useAcceptInvitation } from "@/hooks/features/use-team";

const acceptSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type AcceptValues = z.infer<typeof acceptSchema>;

export default function AcceptInvitationPage() {
  return (
    <Suspense fallback={null}>
      <AcceptInvitationForm />
    </Suspense>
  );
}

function AcceptInvitationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuthState } = useAuthStore();
  const acceptInvitation = useAcceptInvitation();
  const [formError, setFormError] = useState<string | null>(null);

  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const form = useForm<AcceptValues>({
    defaultValues: { firstName: "", lastName: "", password: "" },
    resolver: zodResolver(acceptSchema),
  });
  const { handleSubmit } = form;

  const onSubmit = async (values: AcceptValues) => {
    setFormError(null);
    try {
      const res = await acceptInvitation.mutateAsync({
        ...values,
        token,
        email,
      });

      // Same shape as login — establish the session the same way the login page does.
      const sessionResponse = await fetch("/api/auth/session", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
        }),
      });

      if (!sessionResponse.ok) {
        throw new Error("Unable to create authenticated session");
      }

      setAuthState({ user: res.user });
      router.replace("/dashboard");
    } catch {
      setFormError(
        "That invite link may have expired. Ask your admin to resend it.",
      );
    }
  };

  if (!token || !email) {
    return (
      <AuthForm
        title="Invite link incomplete"
        subtitle="This link is missing information and can't be used to sign up."
        footer={
          <Link
            href="/login"
            className="font-medium text-lc-ink underline underline-offset-2"
          >
            Back to sign in
          </Link>
        }
      >
        <div className="flex flex-col items-center gap-3 rounded-[3px] border border-lc-stamp/30 bg-lc-stamp/5 px-6 py-8 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-lc-stamp text-lc-stamp">
            <RiErrorWarningLine className="h-5 w-5" />
          </span>
          <p className="text-sm text-lc-slate">
            Ask whoever invited you to send a new link from the team page.
          </p>
        </div>
      </AuthForm>
    );
  }

  return (
    <AuthForm
      title="You've been invited"
      subtitle={`Set a password to join as ${email}.`}
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
            <div className="rounded-[3px] border border-lc-ink/12 bg-lc-paper-warm px-3.5 py-2.5">
              <p className="font-plexmono text-[10.5px] uppercase tracking-wide text-lc-slate">
                Email
              </p>
              <p className="mt-0.5 text-sm text-lc-ink">{email}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormInput
                id="firstName"
                name="firstName"
                type="text"
                className="w-full"
                placeholder="First name"
                label="First name"
                autoFocus
              />
              <FormInput
                id="lastName"
                name="lastName"
                type="text"
                className="w-full"
                placeholder="Last name"
                label="Last name"
              />
            </div>

            <FormInput
              id="password"
              name="password"
              type="password"
              className="w-full"
              placeholder="Create a password"
              label="Password"
            />
          </div>

          {formError ? (
            <p className="text-sm text-lc-stamp">{formError}</p>
          ) : null}

          <AppButton
            type="submit"
            className="w-full bg-lc-stamp text-lc-paper hover:bg-lc-stamp-dark"
            loading={acceptInvitation.isPending}
            loadingText="Setting up your account..."
          >
            Accept invite and sign in
          </AppButton>
        </form>
      </FormProvider>
    </AuthForm>
  );
}
