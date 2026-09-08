import type { FunnelTotals } from "@/lib/analytics";
import { formatNumber, formatPercent } from "@/lib/format";

const STAGE_OPACITY = [1, 0.72, 0.48];

export function FunnelChart({ totals }: { totals: FunnelTotals }) {
  const stages = [
    { label: "Impressions", value: totals.impressions },
    { label: "Clicks", value: totals.clicks },
    { label: "Leads", value: totals.leads },
  ];

  if (totals.impressions === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
        No funnel activity in this range yet.
      </div>
    );
  }

  const max = stages[0].value || 1;

  return (
    <div className="flex flex-col gap-4 py-2">
      {stages.map((stage, i) => {
        const widthPct = Math.max(4, (stage.value / max) * 100);
        const prev = stages[i - 1];
        const conversion = prev && prev.value > 0 ? (stage.value / prev.value) * 100 : null;
        return (
          <div key={stage.label}>
            <div className="mb-1 flex items-baseline justify-between text-sm">
              <span className="font-medium">{stage.label}</span>
              <span className="flex items-baseline gap-2">
                <span className="font-semibold tabular-nums">{formatNumber(stage.value)}</span>
                {conversion !== null && (
                  <span className="text-xs text-muted-foreground">{formatPercent(conversion)} of prev.</span>
                )}
              </span>
            </div>
            <div className="h-6 w-full overflow-hidden rounded-md bg-muted">
              <div
                className="h-full rounded-md bg-chart-1 transition-[width]"
                style={{ width: `${widthPct}%`, opacity: STAGE_OPACITY[i] }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
