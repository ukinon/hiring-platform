import { JOBS_QUERY_KEYS } from "@/lib/query-keys";
import { getJobs, getJob } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export function useJobs() {
  const searchParams = useSearchParams();

  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page") || "1", 10)
    : 1;
  const limit = searchParams.get("limit")
    ? parseInt(searchParams.get("limit") || "10", 10)
    : 10;
  const search = searchParams.get("search")
    ? decodeURIComponent(searchParams.get("search") || "")
    : undefined;
  const status = searchParams.get("status") || undefined;
  const sort = searchParams.get("sort") || undefined;
  const order = (searchParams.get("order") as "asc" | "desc") || undefined;

  const params = {
    page,
    limit,
    search,
    status,
    sort,
    order,
  };

  return useQuery({
    queryFn: () => {
      return getJobs(params);
    },
    queryKey: JOBS_QUERY_KEYS.list(params),
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useJobDetail(jobId: string) {
  return useQuery({
    queryFn: () => getJob(jobId),
    queryKey: JOBS_QUERY_KEYS.detail(jobId),
    enabled: !!jobId,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
