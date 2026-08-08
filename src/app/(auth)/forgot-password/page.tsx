"use client";

import Link from "next/link";
import Image from "next/image";
import { useForgotPassword } from "@/hooks/features/use-auth";
import { FormProvider, useForm } from "react-hook-form";
import { FormInput } from "@/components/forms/form-input";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store/auth-store";
import { APP_REDIRECT_TO_KEY } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { AppButton } from "@/components/app-button";

const forgotPasswordSchema = z.object({
  email: z.email("Enter a valid email address"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const router = useRouter();
  const forgotPassword = useForgotPassword();
  const { setAuthState, clearAuthState } = useAuthStore();

  const form = useForm({
    defaultValues: {
      email: "",
      // password: "",
    },
    resolver: zodResolver(forgotPasswordSchema),
  });
  const { handleSubmit } = form;

  const onSubmit = async (values: ForgotPasswordValues) => {
    await forgotPassword.mutateAsync(values, {
      onSuccess: () => {
        router.push("/login");
      },
      onError: () => {
        clearAuthState();
      },
    });
  };
  return (
    <div className="flex pb-8 lg:h-screen lg:pb-0">
      <div className="hidden w-1/2 bg-gray-100 lg:block">
        <Image
          src={`/images/cover.png`}
          alt="Login visual"
          fill
          className="h-full w-full object-cover"
        />
      </div>

      <div className="h-screen flex w-full items-center justify-center lg:w-1/2">
        <div className="w-full max-w-md space-y-6 px-4">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Forgot your password?
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your email address to receive a password reset link
            </p>
          </div>

          <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
              <div className="space-y-4">
                <FormInput
                  id="email"
                  name="email"
                  type="email"
                  className="w-full"
                  placeholder="Email address"
                  label="Email address"
                />
                <div className="text-end"></div>
              </div>

              <div>
                <AppButton
                  type="submit"
                  className="w-full"
                  loading={forgotPassword.isPending}
                  loadingText="Sending reset link..."
                >
                  Send reset link
                </AppButton>
              </div>
            </form>
          </FormProvider>

          <div>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="underline">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
