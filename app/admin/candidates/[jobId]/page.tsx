import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { CANDIDATE_QUERY_KEYS } from "@/lib/query-keys";
import { SearchParams } from "@/types";
import { getCandidates } from "@/services/admin";
import CandidatesClientPage from "./client-page";

export default async function AdminPage({
  params,
  searchParams,
}: {
  params: Promise<{ jobId: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { jobId } = await params;
  const query = await searchParams;
  const queryString = Object.entries(query)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: CANDIDATE_QUERY_KEYS.list(jobId, queryString),
    queryFn: () => getCandidates(jobId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CandidatesClientPage jobId={jobId} />
    </HydrationBoundary>
  );
}
