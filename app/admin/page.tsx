import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import AdminClientPage from "./client-page";
import { JOBS_QUERY_KEYS } from "@/lib/query-keys";
import { SearchParams } from "@/types";
import { getJobs } from "@/services";
import CreateJobCTA from "@/components/admin/create-job-cta";
import SearchInput from "@/components/search-input";
import FilterInput from "@/components/filter-input";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { ...params } = await searchParams;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: JOBS_QUERY_KEYS.list(params),
    queryFn: () => getJobs(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="grid grid-cols-1 sm:grid-cols-7 sm:gap-1">
        <div className="order-2 sm:order-1 sm:col-span-5 p-3 flex flex-col">
          <div className="flex gap-2 mb-3">
            <SearchInput placeholder="Search by job details" />
            <FilterInput
              options={[
                {
                  label: "Active",
                  value: "active",
                },
                {
                  label: "Inactive",
                  value: "inactive",
                },
                {
                  label: "Draft",
                  value: "draft",
                },
              ]}
              className="w-fit"
              paramName="status"
            />
          </div>
          <AdminClientPage />
        </div>

        <div className="order-1 sm:order-2 sm:col-span-2 flex items-start justify-start p-2">
          <CreateJobCTA />
        </div>
      </div>
    </HydrationBoundary>
  );
}
