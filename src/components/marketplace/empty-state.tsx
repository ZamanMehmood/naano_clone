import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
      <SearchX className="size-8 text-muted-foreground" aria-hidden="true" />
      <div>
        <p className="font-medium">No creators match these filters</p>
        <p className="mt-1 text-sm text-muted-foreground">Try widening your ranges or clearing a filter.</p>
      </div>
      <Button variant="outline" size="sm" onClick={onReset}>
        Reset filters
      </Button>
    </div>
  );
}
