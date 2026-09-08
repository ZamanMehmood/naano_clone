interface TooltipRow {
  label: string;
  value: string;
  color: string;
}

export function ChartTooltip({ title, rows }: { title?: string; rows: TooltipRow[] }) {
  if (rows.length === 0) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-sm shadow-md">
      {title && <p className="mb-1 text-xs text-muted-foreground">{title}</p>}
      <div className="flex flex-col gap-1">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-2">
            <span
              className="h-0.5 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: row.color }}
              aria-hidden="true"
            />
            <span className="font-semibold tabular-nums">{row.value}</span>
            <span className="text-muted-foreground">{row.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
