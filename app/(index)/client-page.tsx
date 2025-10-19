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
import IndexEmptyPage from "./empty-page";
import JobDetail from "@/components/job/job-detail";

export default function IndexClientPage() {
  const [selectedJob, setSelectedJob] = React.useState<Job | null>(null);
  const { data: jobs, isLoading } = useJobs();

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        <ScrollArea className="h-[92vh] p-4">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 border rounded-lg space-y-3 bg-card">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="col-span-2 h-[92vh] flex items-center justify-center p-4">
          <div className="w-full max-w-2xl space-y-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            <div className="pt-4 space-y-2">
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if ((!jobs || jobs.length === 0) && !isLoading) {
    return <IndexEmptyPage />;
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      <ScrollArea className="h-[92vh] p-4">
        {jobs?.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            selected={selectedJob === job}
            onSelect={setSelectedJob}
          />
        ))}
      </ScrollArea>

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
