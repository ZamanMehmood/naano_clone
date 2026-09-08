"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltip } from "@/components/analytics/chart-tooltip";
import type { CreatorPerformancePoint } from "@/lib/analytics";
import { formatNumber } from "@/lib/format";

export function PerformanceBarChart({ data }: { data: CreatorPerformancePoint[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-70 items-center justify-center text-sm text-muted-foreground">
        No leads attributed to any creator in this range yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} layout="vertical" margin={{ left: 4, right: 24, top: 8, bottom: 0 }}>
        <CartesianGrid horizontal={false} stroke="var(--border)" />
        <XAxis
          type="number"
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="creatorName"
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={110}
        />
        <Tooltip
          cursor={{ fill: "var(--muted)" }}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const point = payload[0].payload as CreatorPerformancePoint;
            return (
              <ChartTooltip
                title={point.creatorName}
                rows={[{ label: "leads", value: formatNumber(point.leads), color: "var(--chart-1)" }]}
              />
            );
          }}
        />
        <Bar dataKey="leads" fill="var(--chart-1)" radius={[0, 4, 4, 0]} maxBarSize={18} />
      </BarChart>
    </ResponsiveContainer>
  );
}
