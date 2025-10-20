"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useJobDetail } from "@/hooks/react-queries";
import { ArrowLeft } from "lucide-react";
import React from "react";
import ApplyEmptyPage from "./empty-page";
import { useRouter } from "next/navigation";
import ApplicationForm from "@/components/form/application-form";
import { useApplyMutation } from "@/hooks/react-queries/candidate";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import Image from "next/image";

export default function ApplyClientPage({ id }: { id: string }) {
  const { data, isLoading } = useJobDetail(id);
  const { mutate, isPending, isSuccess } = useApplyMutation();

  const router = useRouter();

  if (!data) {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center w-full overflow-hidden py-[2vh] px-2 md:px-4">
          <Card className="w-full max-w-[700px] h-[88vh] relative">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex gap-4 items-center">
                  <Skeleton className="h-10 w-10 rounded-md" />
                  <Skeleton className="h-6 w-32 sm:w-64" />
                </div>
                <Skeleton className="h-5 w-32 sm:w-48" />
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-32" />

              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-32 w-32 rounded-full" />
                <Skeleton className="h-10 w-36 rounded-md" />
              </div>

              {[...Array(7)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-12 w-full rounded-md" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      );
    }

    if (!isLoading) {
      return <ApplyEmptyPage />;
    }

    return null;
  }

  if (isSuccess) {
    setTimeout(() => {
      router.push("/");
    }, 5000);

    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <Image
              src={"/assets/apply-success.png"}
              alt="Success"
              width={214}
              height={214}
              className="size-[214px] aspect-square"
            />
          </EmptyMedia>
        </EmptyHeader>

        <EmptyContent>
          <EmptyTitle className="heading-m-bold">
            🎉 Your application was sent!
          </EmptyTitle>
          <EmptyDescription className="text-l-regular w-full">
            {
              "Congratulations! You've taken the first step — we look forward to learning more about you during the application process."
            }
          </EmptyDescription>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="flex items-center justify-center w-full overflow-hidden py-[2vh] px-2 md:px-4">
      <Card className="w-full max-w-[700px] h-[88vh] relative">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="flex gap-2 sm:gap-4 items-center">
              <Button
                variant={"outline"}
                size={"icon"}
                onClick={() => router.back()}
              >
                <ArrowLeft />
              </Button>

              <h1 className="text-base sm:text-xl-bold">
                Apply {data?.title} at Rakamin
              </h1>
            </div>

            <p className="text-xs sm:text-m-regular">
              ℹ️ This field required to fill
            </p>
          </div>
        </CardHeader>

        <CardContent className="h-full overflow-y-scroll">
          <ApplicationForm
            jobConfig={data.job_config[0]}
            onSubmit={(data) => mutate(data)}
            isPending={isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
