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

export default function ApplyEmptyPage() {
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
        <EmptyTitle className="heading-s-bold">Job not available</EmptyTitle>
        <EmptyDescription className="text-l-regular">
          Please make sure the job link is correct.
        </EmptyDescription>
      </EmptyContent>
    </Empty>
  );
}
