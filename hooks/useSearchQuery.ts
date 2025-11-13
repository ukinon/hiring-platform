import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

// Define types for filter, sort and order parameters
type FilterParams = Record<string, string | number | boolean>;
type SortOrder = "asc" | "desc";

export function useSearchQuery() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse current URL parameters
  const currentParams = useMemo(() => {
    const page = searchParams.get("page")
      ? parseInt(searchParams.get("page") || "1", 10)
      : 1;
    const search = searchParams.get("search")
      ? decodeURIComponent(searchParams.get("search") || "")
      : "";
    const sort = searchParams.get("sort") || "";
    const order = (searchParams.get("order") as SortOrder) || "";
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit") || "10", 10)
      : 10;

    // Extract filter parameters (any parameter that's not page, search, sort, order, or limit)
    const filters: FilterParams = {};
    searchParams.forEach((value, key) => {
      if (!["page", "search", "sort", "order", "limit"].includes(key)) {
        filters[key] = decodeURIComponent(value);
      }
    });

    return { page, search, sort, order, limit, filters };
  }, [searchParams]);

  const handlePageChange = ({
    page,
    path,
    search,
    filters,
    sort,
    order,
    limit,
  }: {
    page: number;
    path: string;
    search?: string;
    filters?: FilterParams;
    sort?: string;
    order?: SortOrder;
    limit?: number;
  }) => {
    const params = new URLSearchParams();

    // Add pagination
    if (page > 1) params.set("page", page.toString());

    // Add search parameter - use provided value or preserve current
    const finalSearch = search !== undefined ? search : currentParams.search;
    if (finalSearch && finalSearch.trim() !== "")
      params.set("search", finalSearch);

    // Add filter parameters - use provided filters or preserve current
    const finalFilters =
      filters !== undefined ? filters : currentParams.filters;
    if (finalFilters) {
      Object.entries(finalFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.set(key, value.toString());
        }
      });
    }

    // Add sort parameter - use provided value or preserve current
    const finalSort = sort !== undefined ? sort : currentParams.sort;
    if (finalSort) params.set("sort", finalSort);

    // Add order parameter - use provided value or preserve current
    const finalOrder = order !== undefined ? order : currentParams.order;
    if (finalOrder) params.set("order", finalOrder);

    // Add limit parameter - use provided value or preserve current
    const finalLimit = limit !== undefined ? limit : currentParams.limit;
    if (finalLimit && finalLimit !== 10)
      params.set("limit", finalLimit.toString());

    const queryString = params.toString();
    router.replace(`${path}${queryString ? `?${queryString}` : ""}`, {
      scroll: false,
    });
  };

  const handleLimitChange = (newLimit: number, path: string) => {
    handlePageChange({
      page: 1, // Reset to first page when changing limit
      path,
      search: currentParams.search,
      filters: currentParams.filters,
      sort: currentParams.sort,
      order: currentParams.order,
      limit: newLimit,
    });
  };

  const handleSortChange = (
    newSort: string,
    newOrder: "asc" | "desc",
    path: string
  ) => {
    handlePageChange({
      page: currentParams.page, // Keep current page when sorting
      path,
      search: currentParams.search,
      filters: currentParams.filters,
      sort: newSort || undefined,
      order: newOrder,
      limit: currentParams.limit,
    });
  };

  return {
    handlePageChange,
    handleLimitChange,
    handleSortChange,
    ...currentParams,
  };
}
