import { CANDIDATE_QUERY_KEYS, JOBS_QUERY_KEYS } from "@/lib/query-keys";
import { createJobPosting, getCandidates } from "@/services/admin";
import { CreateJob } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function useCandidates(jobId: string) {
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  // Parse search params
  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page") || "1", 10)
    : 1;
  const limit = searchParams.get("limit")
    ? parseInt(searchParams.get("limit") || "10", 10)
    : 10;
  const search = searchParams.get("search") || undefined;
  const sort = searchParams.get("sort") || undefined;
  const order = (searchParams.get("order") as "asc" | "desc") || undefined;

  return useQuery({
    queryFn: () =>
      getCandidates(jobId, {
        page,
        limit,
        search,
        sort,
        order,
      }),
    queryKey: CANDIDATE_QUERY_KEYS.list(jobId, queryString),
  });
}

export function useCreateJobMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: CreateJob) => createJobPosting(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: JOBS_QUERY_KEYS.lists(),
      });

      toast.success("Job vacancy successfully created");
    },
  });
}
