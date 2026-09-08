import type { AudienceBreakdownItem } from "@/data/types";

export function AudienceBarList({ items }: { items: AudienceBreakdownItem[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-3 text-sm">
          <span className="w-28 shrink-0 truncate text-muted-foreground" title={item.label}>
            {item.label}
          </span>
          <span className="h-2 min-w-8 flex-1 overflow-hidden rounded-full bg-muted" aria-hidden="true">
            <span className="block h-full rounded-full bg-brand" style={{ width: `${item.pct}%` }} />
          </span>
          <span className="w-9 shrink-0 text-right font-medium tabular-nums">{item.pct}%</span>
        </li>
      ))}
    </ul>
  );
}
