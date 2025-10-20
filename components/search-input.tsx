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
  const debounceRef = React.useRef<NodeJS.Timeout | null>(null);

  const path = usePathname();

  React.useEffect(() => {
    setSearchQuery(search);
  }, [search]);

  React.useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full">
      <Input
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => {
          const value = e.target.value;
          setSearchQuery(value);
          if (debounceRef.current) {
            clearTimeout(debounceRef.current);
          }

          debounceRef.current = setTimeout(() => {
            handlePageChange({
              page: 1,
              path,
              search: value.trim() !== "" ? value : undefined,
              filters: filters || undefined,
              sort: sort || undefined,
              order: (order as "asc" | "desc") || undefined,
            });
          }, 300);
        }}
        className="pr-8 h-10 bg-background/60 backdrop-blur-lg border border-border/50 hover:border-border/80 transition-colors"
      />

      <MagnifyingGlassIcon className="w-5 h-5 absolute right-2 top-1/2 -translate-y-1/2 text-primary" />
    </div>
  );
}
