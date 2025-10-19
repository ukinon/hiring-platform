"use client";
import React from "react";
import { Input } from "./ui/input";
import { useSearchQuery } from "@/hooks/useSearchQuery";
import { usePathname } from "next/navigation";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function SearchInput({
  placeholder = "Search...",
}: {
  placeholder?: string;
}) {
  const { handlePageChange, filters, sort, order, search } = useSearchQuery();
  const [searchQuery, setSearchQuery] = React.useState(search);

  const path = usePathname();

  return (
    <div className="relative w-full">
      <Input
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          const timer = setTimeout(() => {
            handlePageChange({
              page: 1,
              path,
              search: e.target.value,
              filters: filters || undefined,
              sort: sort || undefined,
              order: (order as "asc" | "desc") || undefined,
            });
          }, 300);
          return () => clearTimeout(timer);
        }}
        className="pr-8 h-10 bg-background/60 backdrop-blur-lg border border-border/50 hover:border-border/80 transition-colors"
      />

      <MagnifyingGlassIcon className="w-5 h-5 absolute right-2 top-1/2 -translate-y-1/2 text-primary" />
    </div>
  );
}
