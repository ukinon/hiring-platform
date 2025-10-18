"use client";

import * as React from "react";
import { CalendarDaysIcon, ChevronDown } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "./input";

interface DatePickerProps {
  label?: string;
  placeholder?: string;
  value?: Date;
  onChange: (value: Date | undefined) => void;
  "aria-invalid"?: boolean;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  label,
  "aria-invalid": ariaInvalid,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const formattedValue = React.useMemo(() => {
    if (!value) {
      return "";
    }

    return value.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }, [value]);

  return (
    <div className="flex w-full flex-col gap-2">
      {label ? (
        <Label htmlFor="date" className="px-1">
          {label}
        </Label>
      ) : null}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <CalendarDaysIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 opacity-50 pointer-events-none" />
            <Input
              id="date"
              readOnly
              placeholder={placeholder}
              className="w-full px-8 cursor-pointer"
              value={formattedValue}
              aria-invalid={ariaInvalid}
            />
            <ChevronDown className="absolute right-3 top-1/2 size-4 -translate-y-1/2 opacity-50 pointer-events-none" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-full overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            captionLayout="dropdown"
            onSelect={(date) => {
              onChange(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
