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

export default function IndexEmptyPage() {
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
          Please wait for the next batch of openings.
        </EmptyDescription>
      </EmptyContent>
    </Empty>
  );
}
