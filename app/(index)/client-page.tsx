"use client";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useJobs } from "@/hooks/react-queries";
import { Job } from "@/types";
import React from "react";
import { BriefcaseIcon } from "@heroicons/react/24/outline";
import JobCard from "@/components/job/job-card";
import JobDetail from "@/components/job/job-detail";
import SearchInput from "@/components/search-input";
import Paginator from "@/components/paginator";
import { useSearchParams } from "next/navigation";
import IndexEmptyPage from "./empty-page";

export default function IndexClientPage() {
  const [selectedJob, setSelectedJob] = React.useState<Job | null>(null);
  const { data: jobsData, isLoading } = useJobs();
  const searchParams = useSearchParams();

  const jobs = jobsData?.data || [];
  const totalPages = jobsData?.totalPages || 1;
  const total = jobsData?.total || 0;
  const currentPage = jobsData?.page || 1;

  if (!isLoading && jobs.length === 0 && !searchParams.get("search")) {
    return <IndexEmptyPage />;
  }
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="h-[92vh] p-4 flex flex-col">
        <div className="mb-4">
          <SearchInput placeholder="Search jobs..." />
        </div>
        <ScrollArea className="flex-1">
          {isLoading && (
            <>
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="p-4 border rounded-lg space-y-3 bg-card"
                >
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                </div>
              ))}
            </>
          )}

          {!isLoading && jobs.length === 0 && searchParams.get("search") && (
            <Empty>
              <EmptyHeader>
                <EmptyMedia>
                  <BriefcaseIcon className="w-16 h-16 text-muted-foreground" />
                </EmptyMedia>
                <EmptyTitle>No jobs found</EmptyTitle>
                <EmptyDescription>
                  Try adjusting your search terms or filters to find what
                  you&apos;re looking for.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}

          {jobs.length > 0 &&
            jobs?.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                selected={selectedJob === job}
                onSelect={setSelectedJob}
              />
            ))}
        </ScrollArea>
        {totalPages > 1 && (
          <div className="mt-4">
            <Paginator
              currentPage={currentPage}
              totalPages={totalPages}
              total={total}
              data={jobs}
            />
          </div>
        )}
      </div>

      <div className="col-span-2 h-[92vh] flex items-center p-4">
        {!selectedJob && (
          <Empty>
            <EmptyHeader>
              <EmptyMedia>
                <BriefcaseIcon className="w-16 h-16 text-muted-foreground" />
              </EmptyMedia>
              <EmptyTitle>Select a job to see details</EmptyTitle>
              <EmptyDescription>
                Click on a job from the list to view more information about it.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
        {selectedJob && <JobDetail selectedJob={selectedJob} />}
      </div>
    </div>
  );
}
