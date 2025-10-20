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

  const { ...queryParams } = await searchParams;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: CANDIDATE_QUERY_KEYS.list(jobId, queryParams),
    queryFn: () => getCandidates(jobId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CandidatesClientPage jobId={jobId} />
    </HydrationBoundary>
  );
}
