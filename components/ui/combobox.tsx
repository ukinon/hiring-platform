"use client";

import * as React from "react";
import { Check, ChevronDown, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type ComboboxItem = {
  value: string;
  label: string;
  keywords?: string[];
};

type LoadMoreFunction = (page: number) => Promise<ComboboxItem[]>;

interface ComboboxProps {
  items: ComboboxItem[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  disabled?: boolean;
  width?: string;
  triggerWidth?: string;
  contentWidth?: string;
  onLoadMore?: LoadMoreFunction;
  hasMore?: boolean;
  isLoading?: boolean;
  allowClear?: boolean;
  renderTriggerValue?: (item: ComboboxItem | undefined) => React.ReactNode;
  renderItem?: (item: ComboboxItem, selected: boolean) => React.ReactNode;
  triggerClassName?: string;
  triggerVariant?: React.ComponentProps<typeof Button>["variant"];
  triggerSize?: React.ComponentProps<typeof Button>["size"];
  contentClassName?: string;
}

export function Combobox({
  items: initialItems,
  value: controlledValue,
  onValueChange,
  placeholder = "Select an item...",
  searchPlaceholder = "Search...",
  emptyMessage = "No item found.",
  className,
  disabled = false,
  width = "200px",
  triggerWidth,
  contentWidth,
  onLoadMore,
  hasMore = false,
  isLoading = false,
  allowClear = true,
  renderTriggerValue,
  renderItem,
  triggerClassName,
  triggerVariant = "outline",
  triggerSize = "default",
  contentClassName,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState("");
  const [items, setItems] = React.useState(initialItems);
  const [page, setPage] = React.useState(1);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const listRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const value = controlledValue ?? internalValue;
  const setValue = (newValue: string) => {
    setInternalValue(newValue);
    onValueChange?.(newValue);
  };

  const selectedItem = React.useMemo(
    () => items.find((item) => item.value === value),
    [items, value]
  );

  const handleScroll = React.useCallback(async () => {
    if (!listRef.current || !onLoadMore || !hasMore || loadingMore) return;

    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      setLoadingMore(true);
      try {
        const newItems = await onLoadMore(page + 1);
        if (newItems.length > 0) {
          setItems((prev) => [...prev, ...newItems]);
          setPage((p) => p + 1);
        }
      } catch (error) {
        console.error("Error loading more items:", error);
      } finally {
        setLoadingMore(false);
      }
    }
  }, [onLoadMore, hasMore, page, loadingMore]);

  React.useEffect(() => {
    const currentRef = listRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
      return () => currentRef.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant={triggerVariant}
          size={triggerSize}
          role="combobox"
          aria-expanded={open}
          disabled={disabled || isLoading}
          className={cn(
            triggerWidth ?? width ? `w-[${triggerWidth ?? width}]` : undefined,
            "w-full justify-between",
            className,
            triggerClassName
          )}
        >
          <span className="line-clamp-1 text-start text-m-regular text-muted-foreground">
            {isLoading ? (
              <>Loading...</>
            ) : selectedItem ? (
              renderTriggerValue ? (
                <>{renderTriggerValue(selectedItem)}</>
              ) : (
                selectedItem.label
              )
            ) : (
              placeholder
            )}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          contentWidth ?? width ? `w-[${contentWidth ?? width}]` : undefined,
          "p-0",
          contentClassName
        )}
        align="start"
      >
        <Command className="max-w-none">
          <CommandInput
            placeholder={searchPlaceholder}
            className="h-9 placeholder:text-s-regular"
            autoFocus
          />
          <CommandList ref={listRef}>
            {isLoading ? (
              <CommandItem
                value="loading"
                disabled
                className="flex items-center justify-center py-6"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading items...
              </CommandItem>
            ) : items.length === 0 ? (
              <CommandEmpty>{emptyMessage}</CommandEmpty>
            ) : (
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.value}
                    keywords={item.keywords ?? [item.label]}
                    value={item.value}
                    onSelect={(currentValue) => {
                      const nextValue =
                        currentValue === value && allowClear
                          ? ""
                          : currentValue;
                      setValue(nextValue);
                      setOpen(false);
                    }}
                  >
                    {renderItem
                      ? renderItem(item, value === item.value)
                      : item.label}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === item.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
                {loadingMore && (
                  <CommandItem
                    value="loading-more"
                    disabled
                    className="flex items-center justify-center py-2"
                  >
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading more...
                  </CommandItem>
                )}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
