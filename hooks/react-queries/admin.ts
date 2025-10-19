import { CANDIDATE_QUERY_KEYS } from "@/lib/query-keys";
import { getCandidates } from "@/services/admin";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export function useCandidates(jobId: string) {
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  return useQuery({
    queryFn: () => getCandidates(jobId),
    queryKey: CANDIDATE_QUERY_KEYS.list(jobId, queryString),
  });
}
