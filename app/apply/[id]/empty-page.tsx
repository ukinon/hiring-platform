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
            className="w-48 h-48 sm:w-64 sm:h-64 md:w-[300px] md:h-[300px]"
          />
        </EmptyMedia>
      </EmptyHeader>
      <EmptyContent>
        <EmptyTitle className="heading-s-bold text-base sm:text-lg">
          Job not available
        </EmptyTitle>
        <EmptyDescription className="text-l-regular text-sm sm:text-base">
          Please make sure the job link is correct.
        </EmptyDescription>
      </EmptyContent>
    </Empty>
  );
}
