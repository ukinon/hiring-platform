"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useJobs } from "@/hooks/react-queries";
import React from "react";
import AdminEmptyPage from "./empty-page";
import CreateJobCTA from "@/components/admin/create-job-cta";
import SearchInput from "@/components/search-input";
import FilterInput from "@/components/filter-input";
import AdminJobCard from "@/components/admin/admin-job-card";
import Paginator from "@/components/paginator";

export default function AdminClientPage() {
  const { data: jobsData, isLoading } = useJobs();

  const jobs = jobsData?.data || [];
  const totalPages = jobsData?.totalPages || 1;
  const total = jobsData?.total || 0;
  const currentPage = jobsData?.page || 1;

  if (isLoading) {
    return (
      <div className="grid grid-cols-6 gap-1">
        <div className="space-y-3 col-span-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 rounded-lg space-y-3 bg-card">
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

        <div className="col-span-2  flex items-start justify-start p-4">
          <Skeleton className="h-32 w-32" />
        </div>
      </div>
    );
  }

  return (
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
            ]}
            className="w-fit"
            paramName="status"
          />
        </div>
        {(!jobs || jobs.length === 0) && !isLoading && <AdminEmptyPage />}
        <ScrollArea className="flex-1 h-[calc(80vh-8rem)]">
          {jobs?.map((job) => (
            <AdminJobCard key={job.id} job={job} />
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

      <div className="order-1 sm:order-2 sm:col-span-2 flex items-start justify-start p-2">
        <CreateJobCTA />
      </div>
    </div>
  );
}
