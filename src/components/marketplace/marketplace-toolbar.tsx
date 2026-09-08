"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SORT_OPTIONS, type SortKey } from "@/lib/filters";

export function MarketplaceToolbar({
  query,
  onQueryChange,
  sort,
  onSortChange,
  resultCount,
}: {
  query: string;
  onQueryChange: (query: string) => void;
  sort: SortKey;
  onSortChange: (sort: SortKey) => void;
  resultCount: number;
}) {
  const [inputValue, setInputValue] = useState(query);
  const [syncedQuery, setSyncedQuery] = useState(query);

  // External query changes (e.g. "Reset filters") should override local typing.
  // Adjusting state during render (React's recommended pattern for this) rather
  // than in an effect avoids an extra cascading render.
  if (query !== syncedQuery) {
    setSyncedQuery(query);
    setInputValue(query);
  }

  useEffect(() => {
    const handle = setTimeout(() => {
      if (inputValue !== query) onQueryChange(inputValue);
    }, 300);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative min-w-0 flex-1 sm:max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name, headline, or niche..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="pl-9"
          aria-label="Search creators"
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm whitespace-nowrap text-muted-foreground" aria-live="polite">
          {resultCount} {resultCount === 1 ? "creator" : "creators"}
        </p>
        <Select value={sort} onValueChange={(value) => onSortChange(value as SortKey)}>
          <SelectTrigger className="w-[160px] sm:w-[190px]" aria-label="Sort creators">
            <SelectValue>
              {(value: unknown) => SORT_OPTIONS.find((o) => o.value === value)?.label}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
