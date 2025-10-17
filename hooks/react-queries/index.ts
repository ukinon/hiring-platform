import { JOBS_QUERY_KEYS } from "@/lib/query-keys";
import { getJobs } from "@/services";
import { useQuery } from "@tanstack/react-query";

export function useJobs() {
  return useQuery({
    queryFn: getJobs,
    queryKey: [JOBS_QUERY_KEYS.lists()],
  });
}
