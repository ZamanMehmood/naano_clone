"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCommandPaletteStore } from "@/store/command-palette-store";

export function SearchTrigger({ className }: { className?: string }) {
  const setOpen = useCommandPaletteStore((s) => s.setOpen);

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className={cn(
        "flex items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm text-muted-foreground shadow-sm transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
    >
      <Search className="size-4" />
      <span className="flex-1 text-left">Search creators</span>
      <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium sm:inline">
        ⌘K
      </kbd>
    </button>
  );
}
