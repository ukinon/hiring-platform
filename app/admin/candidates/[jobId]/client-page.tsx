"use client";
import { DataTable, createSortableHeader } from "@/components/ui/data-table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useCandidates } from "@/hooks/react-queries/admin";
import { Candidate } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import Image from "next/image";
import Paginator from "@/components/paginator";
import { useSearchParams } from "next/navigation";

const columns: ColumnDef<Candidate>[] = [
  {
    accessorKey: "full_name",
    header: createSortableHeader("NAMA LENGKAP"),
    cell: ({ row }) => {
      return (
        <div className="font-medium">{row.getValue("full_name") || "-"}</div>
      );
    },
  },
  {
    accessorKey: "email",
    header: createSortableHeader("EMAIL ADDRESS"),
    cell: ({ row }) => {
      const email = row.getValue("email") as string | null;
      return <div className="text-muted-foreground">{email || "-"}</div>;
    },
  },
  {
    accessorKey: "phone_number",
    header: createSortableHeader("PHONE NUMBERS"),
    cell: ({ row }) => {
      const phone = row.getValue("phone_number") as number | null;
      return <div className="text-muted-foreground">{phone || "-"}</div>;
    },
  },
  {
    accessorKey: "date_of_birth",
    header: createSortableHeader("DATE OF BIRTH"),
    cell: ({ row }) => {
      const date = row.getValue("date_of_birth") as string | null;
      if (!date) return <div className="text-muted-foreground">-</div>;

      const formattedDate = new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
      return <div className="text-muted-foreground">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "domicile",
    header: createSortableHeader("DOMICILE"),
    cell: ({ row }) => {
      const domicile = row.getValue("domicile") as string | null;
      return <div className="text-muted-foreground">{domicile || "-"}</div>;
    },
  },
  {
    accessorKey: "gender",
    header: createSortableHeader("GENDER"),
    cell: ({ row }) => {
      const gender = row.getValue("gender") as string | null;
      return (
        <div className="text-muted-foreground capitalize">{gender || "-"}</div>
      );
    },
  },
  {
    accessorKey: "linkedin_link",
    header: "LINK LINKEDIN",
    cell: ({ row }) => {
      const link = row.getValue("linkedin_link") as string | null;
      if (!link) return <div className="text-muted-foreground">-</div>;

      return (
        <Button
          variant="link"
          size="sm"
          className="h-auto p-0 text-primary"
          asChild
        >
          <Link
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1"
          >
            {link.length > 30 ? `${link.substring(0, 30)}...` : link}
            <ExternalLink className="h-3 w-3" />
          </Link>
        </Button>
      );
    },
  },
];

export default function CandidatesClientPage({ jobId }: { jobId: string }) {
  const { data: candidatesData, isLoading } = useCandidates(jobId);
  const searchParams = useSearchParams();

  const candidates = candidatesData?.candidates || [];
  const totalPages = candidatesData?.totalPages || 1;
  const total = candidatesData?.total || 0;
  const currentPage = candidatesData?.page || 1;

  if (!candidatesData) {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <ScrollArea className="h-[92vh] p-2 md:p-4">
            <div className="space-y-3">
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
            </div>
          </ScrollArea>

          <div className="hidden lg:flex lg:col-span-2 h-[92vh] items-center justify-center p-2 md:p-4">
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
  }

  return (
    <div className="flex flex-col px-2 md:px-6 py-4 space-y-4">
      <h1 className="text-xl-bold">{candidatesData?.jobs.title}</h1>

      <div className="border rounded-lg p-2 md:p-5 min-h-[78vh] overflow-x-auto">
        {candidates.length === 0 &&
          !isLoading &&
          !searchParams.get("search") && (
            <Empty>
              <EmptyHeader>
                <EmptyMedia>
                  <Image
                    width={260}
                    height={260}
                    src="/assets/candidates-empty.png"
                    alt="Empty State"
                  />
                </EmptyMedia>
              </EmptyHeader>
              <EmptyContent>
                <EmptyTitle className="heading-s-bold">
                  No candidates found
                </EmptyTitle>
                <EmptyDescription className="text-l-regular">
                  Share your job vacancies so that more candidates will apply.{" "}
                </EmptyDescription>
              </EmptyContent>
            </Empty>
          )}

        {(candidates.length > 0 ||
          (candidates.length === 0 && searchParams.get("search"))) &&
          !isLoading && (
            <>
              <DataTable
                columns={columns}
                data={candidates || []}
                enableSelection={true}
                showSearch={true}
                isLoading={isLoading}
              />
              {totalPages > 1 && (
                <div className="mt-4">
                  <Paginator
                    currentPage={currentPage}
                    totalPages={totalPages}
                    total={total}
                    data={candidates}
                  />
                </div>
              )}
            </>
          )}
      </div>
    </div>
  );
}
