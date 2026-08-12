"use client";

import { useState } from "react";
import { AuthForm } from "@/components/auth-form";
import { useEnableMFA, useVerifyMFA } from "@/hooks/features/use-auth";
import { FormProvider, useForm } from "react-hook-form";
import { FormInput } from "@/components/forms/form-input";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { AppButton } from "@/components/app-button";
import { RiShieldLine } from "@remixicon/react";

const verifySchema = z.object({
  code: z.string().length(6, "Enter the 6-digit code from your app"),
});

type VerifyValues = z.infer<typeof verifySchema>;

// Shape assumed from useEnableMFA — adjust field names to match your actual API response.
type MfaEnrollment = {
  qrCodeUrl?: string;
  secret: string;
};

type Step = "prompt" | "verify";

export default function MFAPage() {
  const router = useRouter();
  const enableMfa = useEnableMFA();
  const verifyMfa = useVerifyMFA();

  const [step, setStep] = useState<Step>("verify");
  const [enrollment, setEnrollment] = useState<MfaEnrollment | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { code: "" },
    resolver: zodResolver(verifySchema),
  });
  const { handleSubmit } = form;

  const goToDashboard = () => router.replace("/dashboard");

  const handleEnable = async () => {
    try {
      const res = await enableMfa.mutateAsync();
      setEnrollment({ qrCodeUrl: res.qrCodeUrl, secret: res.secret });
      setStep("verify");
    } catch {
      // enableMfa.isError below surfaces this — nothing further needed here.
    }
  };

  const onVerify = async (values: VerifyValues) => {
    setVerifyError(null);
    try {
      await verifyMfa.mutateAsync({ code: values.code });
      goToDashboard();
    } catch {
      setVerifyError("That code didn't match. Check your app and try again.");
    }
  };

  if (step === "verify" && enrollment) {
    return (
      <AuthForm
        title="Scan and confirm"
        subtitle="Add this account to your authenticator app, then enter the code it generates."
        footer={
          <button
            type="button"
            onClick={goToDashboard}
            className="text-lc-slate underline underline-offset-2 hover:text-lc-ink"
          >
            Skip for now
          </button>
        }
      >
        <div className="space-y-6">
          <div className="rounded-[3px] border border-lc-ink/12 bg-lc-paper-warm p-6">
            <div className="mb-4 font-plexmono text-[10.5px] uppercase tracking-[0.1em] text-lc-slate">
              Scan to enroll
            </div>

            {enrollment.qrCodeUrl ? (
              <div className="flex justify-center">
                <div className="rounded-[3px] border border-lc-ink/12 bg-white p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={enrollment.qrCodeUrl}
                    alt="Scan with your authenticator app"
                    width={168}
                    height={168}
                  />
                </div>
              </div>
            ) : null}

            <div className="mt-5">
              <div className="mb-1.5 font-plexmono text-[10.5px] uppercase tracking-[0.1em] text-lc-slate">
                Can&apos;t scan? Enter this key manually
              </div>
              <div className="break-all rounded-[3px] border border-lc-ink/12 bg-lc-paper px-3.5 py-2.5 font-plexmono text-[13px] tracking-widest text-lc-ink">
                {enrollment.secret}
              </div>
            </div>
          </div>

          <FormProvider {...form}>
            <form onSubmit={handleSubmit(onVerify)} className="space-y-4">
              <FormInput
                id="code"
                name="code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="000000"
                label="6-digit code"
                className="w-full text-center font-plexmono text-lg tracking-[0.5em]"
              />

              {verifyError ? (
                <p className="text-sm text-lc-stamp">{verifyError}</p>
              ) : null}

              <AppButton
                type="submit"
                className="w-full bg-lc-stamp text-lc-paper hover:bg-lc-stamp-dark"
                loading={verifyMfa.isPending}
                loadingText="Verifying..."
              >
                Verify and enable
              </AppButton>
            </form>
          </FormProvider>
        </div>
      </AuthForm>
    );
  }

  return (
    <AuthForm
      title="Add an extra layer of protection"
      subtitle="Two-factor authentication protects your account even if your password is compromised."
      footer={
        <button
          type="button"
          onClick={goToDashboard}
          className="text-lc-slate underline underline-offset-2 hover:text-lc-ink"
        >
          Skip for now
        </button>
      }
    >
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-4 rounded-[3px] border border-lc-ink/12 bg-lc-paper-warm px-6 py-8 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border-[1.5px] border-lc-ledger text-lc-ledger">
            <RiShieldLine className="h-[22px] w-[22px]" />
          </span>
          <p className="max-w-[300px] text-sm leading-relaxed text-lc-slate">
            You&apos;ll scan a QR code with an authenticator app (like Google
            Authenticator or 1Password), then confirm with a 6-digit code —
            takes about a minute.
          </p>
        </div>

        {enableMfa.isError ? (
          <p className="text-center text-sm text-lc-stamp">
            Something went wrong setting up two-factor authentication. Please
            try again.
          </p>
        ) : null}

        <AppButton
          type="button"
          className="w-full bg-lc-stamp text-lc-paper hover:bg-lc-stamp-dark"
          loading={enableMfa.isPending}
          loadingText="Setting up..."
          onClick={handleEnable}
        >
          Enable two-factor authentication
        </AppButton>
      </div>
    </AuthForm>
  );
}
