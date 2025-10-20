import React from "react";
import { Button } from "./ui/button";
import { useSearchQuery } from "@/hooks/useSearchQuery";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginatorProps {
  currentPage: number;
  totalPages: number;
  total: number;
  data: unknown[];
}

export default function Paginator({
  data,
  totalPages,
  total,
  currentPage,
}: PaginatorProps) {
  const { handlePageChange } = useSearchQuery();
  const path = usePathname();

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    pages.push(1);

    if (totalPages <= maxVisiblePages) {
      for (let i = 2; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage > 3) {
        pages.push("...");
      }
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <p className="text-xs sm:text-sm text-muted-foreground">
          Showing {data.length} of {total} items
        </p>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 sm:h-8 sm:w-8"
          onClick={() =>
            handlePageChange({
              page: currentPage - 1,
              path,
            })
          }
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>

        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="px-1 sm:px-2 text-xs sm:text-sm text-muted-foreground"
            >
              ...
            </span>
          ) : (
            <Button
              key={`page-${page}`}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              className="h-7 w-7 sm:h-8 sm:w-8 text-xs sm:text-sm"
              onClick={() =>
                handlePageChange({
                  page: page as number,
                  path,
                })
              }
            >
              {page}
            </Button>
          )
        )}

        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 sm:h-8 sm:w-8"
          onClick={() =>
            handlePageChange({
              page: currentPage + 1,
              path,
            })
          }
          disabled={currentPage >= totalPages}
        >
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>
    </div>
  );
}
