import { authAPI } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useLogin() {
  return useMutation({
    mutationFn: authAPI.login,
  });
}

export function useRegister() {
  const router = useRouter();
  return useMutation({
    mutationFn: authAPI.register,
    onSuccess: () => {
      router.push("/login");
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: authAPI.forgotPassword,
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: authAPI.resetPassword,
  });
}
