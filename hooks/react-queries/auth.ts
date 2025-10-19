import { getCurrentUser } from "@/services";
import { login, logout } from "@/services/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useCurrentUser() {
  return useQuery({
    queryFn: () => getCurrentUser(),
    queryKey: ["currentUser"],
  });
}

export function useLoginMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      router.push("/admin");
    },
    onError: (error) => {
      toast.error(`Login failed: ${error}`);
    },
  });
}

export function useLogoutMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Clear the current user data immediately
      queryClient.setQueryData(["currentUser"], null);
      // Invalidate to refetch (will return null/undefined)
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      router.push("/");
    },
    onError: (error) => {
      toast.error(`Logout failed: ${error}`);
    },
  });
}
