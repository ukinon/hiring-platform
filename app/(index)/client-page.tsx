"use client";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useJobs } from "@/hooks/react-queries";
import { Job } from "@/types";
import React from "react";
import { BriefcaseIcon } from "@heroicons/react/24/outline";
import JobCard from "@/components/job/job-card";
import IndexEmptyPage from "./empty-page";
import JobDetail from "@/components/job/job-detail";

export default function IndexClientPage() {
  const [selectedJob, setSelectedJob] = React.useState<Job | null>(null);
  const { data: jobs } = useJobs();

  if (!jobs || jobs.length === 0) {
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
