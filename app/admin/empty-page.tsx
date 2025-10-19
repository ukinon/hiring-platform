import CreateJobButton from "@/components/admin/create-job-button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import Image from "next/image";
import React from "react";

export default function AdminEmptyPage() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <Image
            width={300}
            height={300}
            src="/assets/empty-icon.png"
            alt="Empty State"
          />
        </EmptyMedia>
      </EmptyHeader>
      <EmptyContent>
        <EmptyTitle className="heading-s-bold">
          No job openings available
        </EmptyTitle>
        <EmptyDescription className="text-l-regular">
          Create a job opening now and start the candidate process.
        </EmptyDescription>
        <CreateJobButton />
      </EmptyContent>
    </Empty>
  );
}
