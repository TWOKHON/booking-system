"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function CreatableCategorySelect({
  value,
  options,
  placeholder = "Select category",
  onChange,
  onCreate,
}: {
  value: string;
  options: string[];
  placeholder?: string;
  onChange: (value: string) => void;
  onCreate: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const normalizedSearch = search.trim().toLowerCase();
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(normalizedSearch),
  );
  const exactMatch = options.some((option) => option.toLowerCase() === normalizedSearch);
  const canCreate = normalizedSearch.length > 0 && !exactMatch;

  function handleSelect(nextValue: string) {
    onChange(nextValue);
    setSearch("");
    setOpen(false);
  }

  function handleCreate() {
    const createdValue = search.trim();

    if (!createdValue) {
      return;
    }

    onCreate(createdValue);
    onChange(createdValue);
    setSearch("");
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          <span className={cn("truncate", !value && "text-muted-foreground")}>
            {value || placeholder}
          </span>
          <ChevronsUpDownIcon className="size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search or create category..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No categories found.</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem key={option} value={option} onSelect={() => handleSelect(option)}>
                  <CheckIcon
                    className={cn("size-4", value === option ? "opacity-100" : "opacity-0")}
                  />
                  {option}
                </CommandItem>
              ))}
              {canCreate ? (
                <CommandItem value={`create-${search}`} onSelect={handleCreate}>
                  <PlusIcon className="size-4" />
                  Create &quot;{search.trim()}&quot;
                </CommandItem>
              ) : null}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
