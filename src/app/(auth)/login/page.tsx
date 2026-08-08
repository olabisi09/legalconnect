"use client";

import Link from "next/link";
import { useLogin } from "@/hooks/features/use-auth";
import { FormProvider, useForm } from "react-hook-form";
import { FormInput } from "@/components/forms/form-input";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store/auth-store";
import { APP_REDIRECT_TO_KEY } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { AppButton } from "@/components/app-button";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  mfaCode: z
    .string()
    .length(6, "MFA code must be 6 digits")
    .optional()
    .or(z.literal("")),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();
  const { setAuthState, clearAuthState } = useAuthStore();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });
  const { handleSubmit } = form;

  const onSubmit = async (values: LoginValues) => {
    try {
      const res = await login.mutateAsync(values);

      if (!res.user?.mfaRequired) {
        const sessionResponse = await fetch("/api/auth/session", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
          }),
        });

        if (!sessionResponse.ok) {
          throw new Error("Unable to create authenticated session");
        }

        setAuthState({ user: res.user, accessToken: res.accessToken });
      }

      const redirectTo = localStorage.getItem(APP_REDIRECT_TO_KEY);
      localStorage.removeItem(APP_REDIRECT_TO_KEY);
      router.replace(redirectTo ?? "/dashboard");
    } catch {
      clearAuthState();
    }
  };
  return (
    <div className="flex pb-8 lg:h-screen lg:pb-0">
      <div className="hidden w-1/2 h-full bg-gray-100 lg:block bg-[url('/images/cover.png')] bg-cover bg-center"></div>

      <div className="h-screen flex w-full items-center justify-center lg:w-1/2">
        <div className="w-full max-w-md space-y-8 px-4">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please sign in to your account
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
                <FormInput
                  id="password"
                  name="password"
                  type="password"
                  className="w-full"
                  placeholder="Password"
                  label="Password"
                />
                <div className="text-end">
                  <Link
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div>
                <AppButton
                  type="submit"
                  className="w-full"
                  loading={login.isPending}
                  loadingText="Signing in..."
                >
                  Sign in
                </AppButton>
              </div>
            </form>
          </FormProvider>

          <div className="mt-6">
            <div className="mt-6 text-center text-sm">
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
