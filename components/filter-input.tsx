"use client";

import React, { useEffect, useState } from "react";
import { Combobox, ComboboxItem } from "./ui/combobox";
import { useSearchQuery } from "@/hooks/useSearchQuery";
import { usePathname, useSearchParams } from "next/navigation";

interface FilterInputProps {
  options: ComboboxItem[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  paramName?: string;
  className?: string;
  width?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  includeAllOption?: boolean;
}

export default function FilterInput({
  options,
  placeholder = "Select filter...",
  searchPlaceholder = "Search options...",
  emptyMessage = "No options found.",
  paramName = "filter",
  className,
  width = "200px",
  value,
  onValueChange,
  defaultValue,
  includeAllOption = true,
}: FilterInputProps) {
  const { handlePageChange, filters } = useSearchQuery();
  const searchParams = useSearchParams();
  const [selectedValue, setSelectedValue] = useState<string>(value || "");
  const path = usePathname();

  // Update internal state when controlled value changes
  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  // Apply defaultValue if provided, no current filter param, and uncontrolled
  useEffect(() => {
    if (
      !value &&
      defaultValue &&
      !filters[paramName] &&
      selectedValue !== defaultValue
    ) {
      // Set and push default
      handleValueChange(defaultValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue, filters, paramName]);

  const handleValueChange = (newValue: string) => {
    setSelectedValue(newValue);

    if (onValueChange) {
      onValueChange(newValue);
    }

    // Get current search param and other params if they exist
    const searchParam = searchParams.get("search");
    const sortParam = searchParams.get("sort");
    const orderParam = searchParams.get("order");

    // Merge existing filters with the new/updated filter value
    const existingFilters: Record<string, string> = {};
    // current filters from hook already decoded
    Object.entries(filters).forEach(([key, val]) => {
      // Skip if this is the one we're updating; we'll set it below (supports clearing)
      if (key === paramName) return;
      if (val !== undefined && val !== null && val !== "") {
        existingFilters[key] = String(val);
      }
    });

    // Apply or clear current paramName
    if (newValue) {
      existingFilters[paramName] = newValue;
    } else {
      // If cleared, ensure it's not present
      delete existingFilters[paramName];
    }

    // Use the handlePageChange to update the URL with all parameters
    handlePageChange({
      page: 1,
      path,
      search: searchParam || undefined,
      filters: existingFilters,
      sort: sortParam || undefined,
      order: (orderParam as "asc" | "desc") || undefined,
    });
  };

  return (
    <Combobox
      items={[
        ...(includeAllOption
          ? [
              {
                label: "All",
                value: "",
              } as ComboboxItem,
            ]
          : []),
        ...options,
      ]}
      value={selectedValue || (filters[paramName] as string)}
      onValueChange={handleValueChange}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      emptyMessage={emptyMessage}
      className={className}
      width={width}
    />
  );
}
