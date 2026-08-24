"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useResetPassword } from "@/hooks/features/use-auth";
import { FormProvider, useForm } from "react-hook-form";
import { FormInput } from "@/components/forms/form-input";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppButton } from "@/components/app-button";
import { AuthForm } from "@/components/auth-form";
import { Suspense, useState } from "react";
import { RiCheckboxCircleLine, RiErrorWarningLine } from "@remixicon/react";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const resetPassword = useResetPassword();
  const [step, setStep] = useState<"request" | "done">("request");

  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(resetPasswordSchema),
  });
  const { handleSubmit } = form;

  const onSubmit = async (values: ResetPasswordValues) => {
    if (!token) return;

    await resetPassword.mutateAsync(
      { token, password: values.password },
      {
        onSuccess: () => {
          setStep("done");
        },
      },
    );
  };

  // Missing/invalid token — nothing to submit against
  if (!token) {
    return (
      <AuthForm
        title="Invalid reset link"
        subtitle="This password reset link is missing or invalid."
        footer={
          <Link
            href="/forgot-password"
            className="font-medium text-lc-ink underline underline-offset-2"
          >
            Request a new link
          </Link>
        }
      >
        <div className="flex flex-col items-center gap-4 rounded-[3px] border border-lc-ink/12 bg-lc-paper-warm px-6 py-8 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border-[1.5px] border-red-500 text-red-500">
            <RiErrorWarningLine className="h-5.5 w-5.5" />
          </span>
          <p className="max-w-70 text-xs leading-relaxed text-lc-slate">
            Try requesting a fresh reset link — the previous one may have
            expired or already been used.
          </p>
        </div>
      </AuthForm>
    );
  }

  if (step === "done") {
    return (
      <AuthForm
        title="Password reset"
        subtitle="Your password has been changed successfully."
        footer={
          <Link
            href="/login"
            className="font-medium text-lc-ink underline underline-offset-2"
          >
            Back to sign in
          </Link>
        }
      >
        <div className="flex flex-col items-center gap-4 rounded-[3px] border border-lc-ink/12 bg-lc-paper-warm px-6 py-8 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border-[1.5px] border-lc-ledger text-lc-ledger">
            <RiCheckboxCircleLine className="h-5.5 w-5.5" />
          </span>
          <p className="max-w-70 text-xs leading-relaxed text-lc-slate">
            You can now sign in with your new password.
          </p>
        </div>

        <AppButton
          type="button"
          className="mt-6 w-full bg-lc-stamp text-lc-paper hover:bg-lc-stamp-dark"
          onClick={() => router.push("/login")}
        >
          Go to sign in
        </AppButton>
      </AuthForm>
    );
  }

  return (
    <AuthForm
      title="Reset your password"
      subtitle="Enter a new password for your account"
      footer={
        <>
          Remembered your password?{" "}
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
            <FormInput
              id="password"
              name="password"
              type="password"
              className="w-full"
              placeholder="New password"
              label="New password"
              autoFocus
            />
            <FormInput
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="w-full"
              placeholder="Confirm new password"
              label="Confirm new password"
            />
          </div>

          <AppButton
            type="submit"
            className="w-full bg-lc-stamp text-lc-paper hover:bg-lc-stamp-dark"
            loading={resetPassword.isPending}
            loadingText="Resetting password..."
          >
            Reset password
          </AppButton>
        </form>
      </FormProvider>
    </AuthForm>
  );
}
