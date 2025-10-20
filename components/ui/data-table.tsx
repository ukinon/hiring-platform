"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  Column,
  ColumnOrderState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  Trash2,
  Filter,
  Plus,
  ChevronUp,
  GripVertical,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import SearchInput from "../search-input";
import { useSearchQuery } from "@/hooks/useSearchQuery";
import { Skeleton } from "./skeleton";

// Skeleton loading component
const TableSkeleton = ({
  columns,
  rows = 5,
}: {
  columns: number;
  rows?: number;
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {Array.from({ length: columns }).map((_, index) => (
              <TableHead key={index}>
                <div className="h-4 bg-muted animate-pulse rounded" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <TableCell key={colIndex}>
                  <div className="h-4 bg-muted animate-pulse rounded" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

interface FilterOption {
  label: string;
  value: string;
}

interface FilterSection {
  title: string;
  paramName?: string; // Optional parameter name for URL
  options: FilterOption[] | undefined;
  selectedValue?: string;
  selectedValues?: string[]; // Support for multiple selections
  multiSelect?: boolean; // Enable multiple selection mode
  onValueChange?: (value: string) => void; // Make optional since data table can handle internally
  onValuesChange?: (values: string[]) => void; // Handler for multiple values
  searchPlaceholder?: string;
}

interface CustomButton {
  label: string;
  onClick: () => void;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  icon?: React.ReactNode;
  className?: string;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onBulkDelete?: (selectedIds: string[]) => Promise<void>;
  getRowId?: (row: TData) => string;
  enableSelection?: boolean;
  enableSorting?: boolean;
  className?: string;
  isLoading?: boolean;
  sectionLoading?: Record<string, boolean>;
  showSearch?: boolean;
  showFilters?: boolean;
  showAddButton?: boolean;
  addButtonLabel?: string;
  onAddClick?: () => void;
  customButtons?: CustomButton[];
  filterSections?: FilterSection[];
  showRowsPerPage?: boolean;
}

interface RowWithId {
  id: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onBulkDelete,
  getRowId = (row: TData) => (row as RowWithId).id,
  enableSelection = true,
  enableSorting = true,
  className,
  isLoading = false,
  showSearch = true,
  showFilters = false,
  showAddButton = false,
  addButtonLabel = "Add",
  onAddClick,
  customButtons = [],
  filterSections = [],
  sectionLoading = {},
  showRowsPerPage = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [activeFilterSection, setActiveFilterSection] = React.useState(0);
  const [filterSearch, setFilterSearch] = React.useState("");
  const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>([]);
  const [columnSizing, setColumnSizing] = React.useState({});
  const [draggedColumn, setDraggedColumn] = React.useState<string | null>(null);

  // Handle URL parameters internally
  const pathname = usePathname();
  const {
    handlePageChange,
    handleLimitChange,
    handleSortChange,
    filters,
    limit,
    sort,
    order,
  } = useSearchQuery();

  // Create filter change handler
  const handleFilterChange = (paramName: string, value: string) => {
    const currentFilters = { ...filters };

    if (value) {
      currentFilters[`filter[${paramName}]`] = value;
    } else {
      delete currentFilters[`filter[${paramName}]`];
    }

    handlePageChange({
      page: 1,
      path: pathname,
      filters: currentFilters,
    });
  };

  // Create multi-filter change handler
  const handleMultiFilterChange = (paramName: string, values: string[]) => {
    const currentFilters = { ...filters };

    if (values.length > 0) {
      currentFilters[`filter[${paramName}]`] = values.join(",");
    } else {
      delete currentFilters[`filter[${paramName}]`];
    }

    handlePageChange({
      page: 1,
      path: pathname,
      filters: currentFilters,
    });
  };

  const filtersSection = filterSections.map((section) => {
    const currentFilterValue = section.paramName
      ? (filters[`filter[${section.paramName}]`] as string) || ""
      : "";

    if (section.multiSelect) {
      const selectedValues = currentFilterValue
        ? currentFilterValue.split(",").filter(Boolean)
        : section.selectedValues || [];

      return {
        ...section,
        selectedValues,
        onValuesChange:
          section.onValuesChange ||
          ((values: string[]) => {
            if (section.paramName) {
              handleMultiFilterChange(section.paramName, values);
            }
          }),
      };
    } else {
      // Handle single-select filters
      return {
        ...section,
        selectedValue: currentFilterValue || section.selectedValue || "",
        onValueChange:
          section.onValueChange ||
          ((value: string) => {
            if (section.paramName) {
              handleFilterChange(section.paramName, value);
            }
          }),
      };
    }
  });

  // Create columns with selection if enabled
  const modifiedColumns = React.useMemo(() => {
    const selectColumn: ColumnDef<TData, TValue> = {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          onClick={(e) => e.stopPropagation()}
        />
      ),
      enableSorting: false,
      enableHiding: false,
      enableResizing: false,
      size: 40,
    };

    return enableSelection ? [selectColumn, ...columns] : columns;
  }, [columns, enableSelection]);

  const table = useReactTable({
    data,
    columns: modifiedColumns,
    enableRowSelection: enableSelection,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    onSortingChange: enableSorting
      ? (
          updaterOrValue: ((old: SortingState) => SortingState) | SortingState
        ) => {
          const newSorting =
            typeof updaterOrValue === "function"
              ? updaterOrValue(sorting)
              : updaterOrValue;

          if (newSorting.length > 0) {
            const { id, desc } = newSorting[0];
            handleSortChange(id, desc ? "desc" : "asc", pathname);
          } else {
            handleSortChange("", "asc", pathname);
          }
          setSorting(newSorting);
        }
      : setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnOrderChange: setColumnOrder,
    onColumnSizingChange: setColumnSizing,
    getRowId,
    manualSorting: enableSorting,
    state: {
      sorting: enableSorting
        ? sort
          ? [{ id: sort, desc: order === "desc" }]
          : sorting
        : undefined,
      rowSelection,
      columnOrder,
      columnSizing,
    },
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedIds = selectedRows.map((row) => getRowId(row.original));

  const handleBulkDelete = async () => {
    if (!onBulkDelete || selectedIds.length === 0) return;

    setIsDeleting(true);
    try {
      await onBulkDelete(selectedIds);
      setRowSelection({});
    } catch (error) {
      console.error("Bulk delete failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Drag and drop handlers for column reordering
  const handleDragStart = (e: React.DragEvent, columnId: string) => {
    // Don't allow dragging the select column
    if (columnId === "select") {
      e.preventDefault();
      return;
    }
    setDraggedColumn(columnId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();

    // Don't allow dropping on the select column
    if (targetColumnId === "select") {
      setDraggedColumn(null);
      return;
    }

    if (
      !draggedColumn ||
      draggedColumn === targetColumnId ||
      draggedColumn === "select"
    ) {
      setDraggedColumn(null);
      return;
    }

    const currentOrder = table.getState().columnOrder;
    const allColumnIds = table.getAllLeafColumns().map((col) => col.id);
    const orderToUse = currentOrder.length > 0 ? currentOrder : allColumnIds;

    const draggedIndex = orderToUse.indexOf(draggedColumn);
    const targetIndex = orderToUse.indexOf(targetColumnId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedColumn(null);
      return;
    }

    const newOrder = [...orderToUse];
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedColumn);

    setColumnOrder(newOrder);
    setDraggedColumn(null);
  };

  const handleDragEnd = () => {
    setDraggedColumn(null);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
          {showSearch && (
            <div className="w-full sm:w-80">
              <SearchInput />
            </div>
          )}

          {/* Filters */}
          {showFilters && filtersSection.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  {/* Show active filter count */}
                  {filtersSection.some((section) =>
                    section.multiSelect
                      ? section.selectedValues &&
                        section.selectedValues.length > 0
                      : section.selectedValue
                  ) && (
                    <span className="ml-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                      {filtersSection.reduce((count, section) => {
                        if (section.multiSelect) {
                          return count + (section.selectedValues?.length || 0);
                        } else {
                          return count + (section.selectedValue ? 1 : 0);
                        }
                      }, 0)}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-96 p-0">
                <div className="flex">
                  {/* Left side - Filter Categories */}
                  <div className="w-32 border-r bg-muted/30">
                    <div className="p-3 border-b">
                      <h4 className="font-medium text-sm">Filters</h4>
                    </div>
                    <div className="p-2">
                      {filtersSection.map((section, index) => (
                        <div
                          key={index}
                          className={`px-3 py-2 text-sm rounded cursor-pointer transition-colors flex items-center justify-between ${
                            activeFilterSection === index
                              ? "bg-accent text-accent-foreground"
                              : "hover:bg-accent/50 hover:text-accent-foreground"
                          }`}
                          onClick={() => {
                            setActiveFilterSection(index);
                            setFilterSearch("");
                          }}
                        >
                          <span>{section.title}</span>
                          {((section.multiSelect &&
                            section.selectedValues &&
                            section.selectedValues.length > 0) ||
                            (!section.multiSelect &&
                              section.selectedValue)) && (
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                              {section.multiSelect &&
                                section.selectedValues &&
                                section.selectedValues.length > 1 && (
                                  <span className="text-xs text-primary font-medium">
                                    {section.selectedValues.length}
                                  </span>
                                )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right side - Filter Options */}
                  <div className="flex-1">
                    <div className="p-[0.325rem]  border-b">
                      {filtersSection[activeFilterSection]
                        .searchPlaceholder && (
                        <Input
                          value={filterSearch}
                          onChange={(e) => setFilterSearch(e.target.value)}
                          onKeyDown={(e) => e.stopPropagation()}
                          placeholder={
                            filtersSection[activeFilterSection]
                              .searchPlaceholder
                          }
                          className="h-8"
                        />
                      )}
                    </div>
                    <div className="p-2 pt-0 max-h-64 overflow-y-auto">
                      {filtersSection[activeFilterSection] && (
                        <div className="space-y-1">
                          {/* Clear option */}
                          {((filtersSection[activeFilterSection].multiSelect &&
                            filtersSection[activeFilterSection]
                              .selectedValues &&
                            filtersSection[activeFilterSection].selectedValues!
                              .length > 0) ||
                            (!filtersSection[activeFilterSection].multiSelect &&
                              filtersSection[activeFilterSection]
                                .selectedValue)) && (
                            <div className="px-2 pb-2 border-b">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-muted-foreground"
                                onClick={() => {
                                  const section =
                                    filtersSection[activeFilterSection];
                                  if (
                                    section.multiSelect &&
                                    section.onValuesChange
                                  ) {
                                    section.onValuesChange([]);
                                  } else if (
                                    !section.multiSelect &&
                                    section.onValueChange
                                  ) {
                                    section.onValueChange("");
                                  }
                                }}
                              >
                                Clear filter
                              </Button>
                            </div>
                          )}

                          {sectionLoading[activeFilterSection] &&
                            Array.from({ length: 5 }).map((_, index) => (
                              <Skeleton key={index} className="h-6 w-full" />
                            ))}

                          {filtersSection[activeFilterSection].options &&
                            !sectionLoading[activeFilterSection] &&
                            filtersSection[activeFilterSection].options
                              .filter(
                                // Filter options client-side by label or value using the search input
                                (option) =>
                                  !filterSearch ||
                                  option.label
                                    .toLowerCase()
                                    .includes(filterSearch.toLowerCase()) ||
                                  option.value
                                    .toLowerCase()
                                    .includes(filterSearch.toLowerCase())
                              )
                              .map((option) => {
                                const section =
                                  filtersSection[activeFilterSection];
                                const isChecked = section.multiSelect
                                  ? section.selectedValues?.includes(
                                      option.value
                                    ) || false
                                  : section.selectedValue === option.value;

                                return (
                                  <DropdownMenuCheckboxItem
                                    key={option.value}
                                    checked={isChecked}
                                    onCheckedChange={() => {
                                      if (
                                        section.multiSelect &&
                                        section.onValuesChange
                                      ) {
                                        const currentValues =
                                          section.selectedValues || [];
                                        const newValues =
                                          currentValues.includes(option.value)
                                            ? currentValues.filter(
                                                (v) => v !== option.value
                                              )
                                            : [...currentValues, option.value];
                                        section.onValuesChange(newValues);
                                      } else if (
                                        !section.multiSelect &&
                                        section.onValueChange
                                      ) {
                                        const currentValue =
                                          section.selectedValue;
                                        const newValue =
                                          currentValue === option.value
                                            ? ""
                                            : option.value;
                                        section.onValueChange(newValue);
                                      }
                                    }}
                                    onSelect={(e) => e.preventDefault()}
                                    className="cursor-pointer"
                                  >
                                    {option.label}
                                  </DropdownMenuCheckboxItem>
                                );
                              })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Rows per page */}
          {showRowsPerPage && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Rows per page:
              </span>
              <Select
                value={limit.toString()}
                onValueChange={(value) =>
                  handleLimitChange(parseInt(value), pathname)
                }
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Column Visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column, index) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id + index}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Add Button */}
          {showAddButton && onAddClick && (
            <Button onClick={onAddClick} className="gap-2">
              <Plus className="h-4 w-4" />
              {addButtonLabel}
            </Button>
          )}

          {/* Custom Buttons */}
          {customButtons.map((button, index) => (
            <Button
              key={index}
              onClick={button.onClick}
              variant={button.variant || "outline"}
              className={cn("gap-2", button.className)}
            >
              {button.icon}
              {button.label}
            </Button>
          ))}
        </div>
      </div>

      {enableSelection && selectedIds.length > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-muted/50 p-3 rounded-md gap-2">
          <span className="text-xs sm:text-sm text-muted-foreground">
            {selectedIds.length} row(s) selected
          </span>
          {onBulkDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              disabled={isDeleting}
              className="gap-2 w-full sm:w-auto"
            >
              <Trash2 className="h-4 w-4" />
              {isDeleting ? "Deleting..." : "Delete Selected"}
            </Button>
          )}
        </div>
      )}

      {isLoading ? (
        <TableSkeleton columns={modifiedColumns.length} rows={5} />
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table className="table-fixed">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup, index) => (
                <TableRow key={headerGroup.id + index}>
                  {headerGroup.headers.map((header, headerIndex) => {
                    const isSelectColumn = header.column.id === "select";
                    const canReorder = !header.isPlaceholder && !isSelectColumn;
                    const resizeHandler = header.getResizeHandler();

                    return (
                      <TableHead
                        key={header.id + headerIndex}
                        onDragOver={(e) => {
                          if (canReorder) {
                            handleDragOver(e);
                          }
                        }}
                        onDrop={(e) => {
                          if (canReorder) {
                            handleDrop(e, header.column.id);
                          }
                        }}
                        style={{
                          width: header.getSize(),
                          position: "relative",
                          opacity: draggedColumn === header.column.id ? 0.5 : 1,
                          cursor: "default",
                        }}
                        className={cn(
                          "whitespace-nowrap transition-opacity",
                          draggedColumn === header.column.id &&
                            "bg-accent cursor-grabbing"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {canReorder && (
                            <span
                              data-drag-handle="true"
                              draggable
                              onDragStart={(e) => {
                                handleDragStart(e, header.column.id);
                                e.dataTransfer.setData(
                                  "text/plain",
                                  header.column.id
                                );
                              }}
                              onDragEnd={handleDragEnd}
                              className="cursor-grab text-muted-foreground flex items-center"
                            >
                              <GripVertical className="h-4 w-4 flex-shrink-0" />
                            </span>
                          )}
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </div>
                        {/* Column Resizer */}
                        {header.column.getCanResize() && (
                          <div
                            data-resize-handle="true"
                            draggable={false}
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              resizeHandler(e);
                            }}
                            onTouchStart={(e) => {
                              e.stopPropagation();
                              resizeHandler(e);
                            }}
                            className={cn(
                              "absolute right-0 top-0 h-full w-[6px] -translate-x-1/2 cursor-col-resize rounded-sm bg-transparent hover:bg-primary/50 transition-colors z-50 touch-none select-none",
                              header.column.getIsResizing() && "bg-primary"
                            )}
                          />
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id + row.index}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="truncate whitespace-nowrap"
                        style={{ width: cell.column.getSize() }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={modifiedColumns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

// Helper function to create sortable column header
export const createSortableHeader = <TData,>(label: string) => {
  const SortableHeader = ({ column }: { column: Column<TData, unknown> }) => {
    return (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-8 p-0 font-medium"
      >
        {label}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    );
  };

  SortableHeader.displayName = `SortableHeader_${label}`;
  return SortableHeader;
};

// Helper function to create API-based sortable column header
export const createApiSortableHeader = (label: string, sortKey: string) => {
  const ApiSortableHeader = () => {
    const pathname = usePathname();
    const { sort, order, handleSortChange } = useSearchQuery();
    const isActive = sort === sortKey;
    const nextOrder = isActive && order === "asc" ? "desc" : "asc";

    const handleClick = () => {
      handleSortChange(sortKey, nextOrder, pathname);
    };

    return (
      <Button
        variant="ghost"
        onClick={handleClick}
        className="h-8 p-0 font-medium"
      >
        {label}
        {isActive ? (
          order === "asc" ? (
            <ChevronUp className="ml-2 h-4 w-4 text-primary" />
          ) : (
            <ChevronDown className="ml-2 h-4 w-4 text-primary" />
          )
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4" />
        )}
      </Button>
    );
  };

  ApiSortableHeader.displayName = `ApiSortableHeader_${label}`;
  return ApiSortableHeader;
};

// Export types for external use
export type { FilterOption, FilterSection, CustomButton };
