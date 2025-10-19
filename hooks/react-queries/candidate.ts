import { CANDIDATE_QUERY_KEYS } from "@/lib/query-keys";
import { applyToJob } from "@/services/candidate";
import { Candidate } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useApplyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (candidateData: Partial<Candidate>) => {
      applyToJob(candidateData);
    },
    onSuccess: (_, candidateData) => {
      queryClient.invalidateQueries({
        queryKey: CANDIDATE_QUERY_KEYS.lists(candidateData.job_id || ""),
      });
      toast.success("Application submitted successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to apply: ${error}`);
    },
  });
}
