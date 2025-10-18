import { CANDIDATE_QUERY_KEYS } from "@/lib/query-keys";
import { applyToJob } from "@/services/candidate";
import { Candidate } from "@/types";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useApplyMutation() {
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: async (candidateData: Partial<Candidate>) => {
      applyToJob(candidateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CANDIDATE_QUERY_KEYS.lists(),
      });
      toast.success("Application submitted successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to apply: ${error}`);
    },
  });
}
