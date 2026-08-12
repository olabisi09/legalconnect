"use client";

import Link from "next/link";
import { useForgotPassword } from "@/hooks/features/use-auth";
import { FormProvider, useForm } from "react-hook-form";
import { FormInput } from "@/components/forms/form-input";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppButton } from "@/components/app-button";
import { AuthForm } from "@/components/auth-form";
import { useState } from "react";
import { RiMailCheckLine } from "@remixicon/react";

const forgotPasswordSchema = z.object({
  email: z.email("Enter a valid email address"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const forgotPassword = useForgotPassword();
  const [step, setStep] = useState<"request" | "sent">("request");
  const [sentTo, setSentTo] = useState("");
  const [justResent, setJustResent] = useState(false);
  const [expiryTimeInMinutes, setExpiryTimeInMinutes] = useState(0);

  const form = useForm({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(forgotPasswordSchema),
  });
  const { handleSubmit } = form;

  const convertSecondsToMinutes = (seconds: number) => {
    return Math.floor(seconds / 60);
  };

  const onSubmit = async (values: ForgotPasswordValues) => {
    await forgotPassword.mutateAsync(values, {
      onSuccess: (data) => {
        setSentTo(values.email);
        setExpiryTimeInMinutes(convertSecondsToMinutes(data.expiresIn));
        setStep("sent");
      },
    });
  };

  const handleResend = async () => {
    if (!sentTo) return;
    await forgotPassword.mutateAsync(
      { email: sentTo },
      {
        onSuccess: (data) => {
          setJustResent(true);
          setExpiryTimeInMinutes(convertSecondsToMinutes(data.expiresIn));
          setTimeout(() => setJustResent(false), 4000);
        },
      },
    );
  };

  if (step === "sent") {
    return (
      <AuthForm
        title="Check your email"
        subtitle="We've sent a password reset link to your inbox."
        footer={
          <Link
            href="/login"
            className="font-medium text-lc-ink underline underline-offset-2"
          >
            Back to sign in
          </Link>
        }
      >
        <div className="space-y-6">
          <div className="flex flex-col items-center gap-4 rounded-[3px] border border-lc-ink/12 bg-lc-paper-warm px-6 py-8 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border-[1.5px] border-lc-ledger text-lc-ledger">
              <RiMailCheckLine className="h-5.5 w-5.5" />
            </span>

            <div>
              <p className="text-sm text-lc-slate">Reset link sent to</p>
              <p className="mt-1 font-plexmono text-[13px] text-lc-ink">
                {sentTo}
              </p>
            </div>

            <p className="max-w-70 text-xs leading-relaxed text-lc-slate">
              The link expires in {expiryTimeInMinutes} minutes. If you
              don&apos;t see it, check your spam folder.
            </p>
          </div>

          <div className="text-center text-sm text-lc-slate">
            Didn&apos;t get the email?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={forgotPassword.isPending}
              className="cursor-pointer font-medium text-lc-ink underline underline-offset-2 disabled:opacity-50"
            >
              {forgotPassword.isPending
                ? "Resending..."
                : justResent
                  ? "Sent again"
                  : "Resend link"}
            </button>
          </div>
        </div>
      </AuthForm>
    );
  }

  return (
    <AuthForm
      title="Forgot your password?"
      subtitle="Enter your email to reset your password"
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-lc-ink underline underline-offset-2"
          >
            Sign up
          </Link>
        </>
      }
    >
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-4">
            <FormInput
              id="email"
              name="email"
              type="email"
              className="w-full"
              placeholder="Email address"
              label="Email address"
              autoFocus
            />
          </div>

          <AppButton
            type="submit"
            className="w-full bg-lc-stamp text-lc-paper hover:bg-lc-stamp-dark"
            loading={forgotPassword.isPending}
            loadingText="Sending reset link..."
          >
            Send reset link
          </AppButton>
        </form>
      </FormProvider>
    </AuthForm>
  );
}
