"use client";

import { useState } from "react";
import {
  RiFolderLine,
  RiExpandUpDownLine,
  RiCheckLine,
  RiCloseLine,
} from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCases, useCaseDetails } from "@/hooks/features/use-cases";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import type { Case } from "@/types/case";

export function CasePicker({
  value,
  onChange,
  placeholder = "Select a case",
  disabled,
  clearable,
}: {
  value: string;
  onChange: (caseId: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Shows a small clear (×) button once a case is picked — for filter contexts, not create forms. */
  clearable?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const { data, isLoading } = useCases({
    search: debouncedSearch,
    page: 0,
    size: 20,
  });
  const cases: Case[] = data?.data ?? [];

  // Keeps the trigger's label correct even when the selected case isn't in the current
  // (possibly filtered) list — right after picking it, or when opening in edit mode.
  const { data: selected } = useCaseDetails(value);

  return (
    <div className="flex items-center gap-1.5">
      <Popover
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setSearch("");
        }}
      >
        <PopoverTrigger
          disabled={disabled}
          className="w-full min-w-0 justify-between font-normal"
          render={<Button variant="outline" />}
        >
          <span className="flex min-w-0 items-center gap-2">
            <RiFolderLine className="h-4 w-4 shrink-0 text-muted-foreground" />
            {value && selected ? (
              <span className="truncate text-left">
                <span className="font-plexmono text-[11px] text-muted-foreground">
                  {selected.caseNumber}
                </span>{" "}
                {selected.title}
              </span>
            ) : (
              <span className="truncate text-muted-foreground">
                {placeholder}
              </span>
            )}
          </span>
          <RiExpandUpDownLine className="h-4 w-4 shrink-0 text-muted-foreground" />
        </PopoverTrigger>

        <PopoverContent align="start" className="w-90 p-0">
          <div className="border-b border-border p-2">
            <Input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search cases by number or title…"
              className="h-8"
            />
          </div>
          <div className="max-h-64 overflow-y-auto p-1">
            {isLoading ? (
              <p className="px-2.5 py-4 text-center text-[12.5px] text-muted-foreground">
                Searching…
              </p>
            ) : cases.length === 0 ? (
              <p className="px-2.5 py-4 text-center text-[12.5px] text-muted-foreground">
                No matching cases.
              </p>
            ) : (
              cases.map((c) => {
                const isSelected = c.id === value;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      onChange(c.id);
                      setOpen(false);
                      setSearch("");
                    }}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-[3px] px-2.5 py-2 text-left",
                      isSelected ? "bg-primary/10" : "hover:bg-accent/50",
                    )}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] font-medium text-foreground">
                        {c.title}
                      </span>
                      <span className="block font-plexmono text-[10.5px] text-muted-foreground">
                        {c.caseNumber} · {c.status}
                      </span>
                    </span>
                    {isSelected ? (
                      <RiCheckLine className="h-4 w-4 shrink-0 text-primary" />
                    ) : null}
                  </button>
                );
              })
            )}
          </div>
        </PopoverContent>
      </Popover>

      {clearable && value ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0"
          onClick={() => onChange("")}
          aria-label="Clear case filter"
        >
          <RiCloseLine className="h-4 w-4" />
        </Button>
      ) : null}
    </div>
  );
}
