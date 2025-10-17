"use client";

import * as React from "react";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";

interface DatePickerProps {
  label?: string;
  placeholder?: string;
  value: Date;
  onChange: (value: Date | undefined) => void;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  label,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex w-full flex-col gap-3">
      <Label htmlFor="date" className="px-1">
        {label}
      </Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <InputGroup>
            <InputGroupInput
              placeholder={placeholder}
              readOnly
              value={
                value
                  ? value.toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })
                  : ""
              }
            />

            <InputGroupAddon>
              <CalendarIcon />
            </InputGroupAddon>

            <InputGroupAddon align="inline-end">
              <ChevronDownIcon />
            </InputGroupAddon>
          </InputGroup>
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
