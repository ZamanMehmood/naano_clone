"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartTooltip } from "@/components/analytics/chart-tooltip";
import type { PipelinePoint } from "@/lib/analytics";
import { formatCurrencyEUR, formatDateShort } from "@/lib/format";

export function PipelineChart({ data }: { data: PipelinePoint[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-70 items-center justify-center text-sm text-muted-foreground">
        No attributed pipeline in this range yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ left: 4, right: 12, top: 8, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="weekStart"
          tickFormatter={(v: string) => formatDateShort(v)}
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          axisLine={{ stroke: "var(--border)" }}
          tickLine={false}
          minTickGap={24}
        />
        <YAxis
          tickFormatter={(v: number) => formatCurrencyEUR(v, { compact: true })}
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={56}
        />
        <Tooltip
          cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;
            return (
              <ChartTooltip
                title={formatDateShort(String(label))}
                rows={[
                  {
                    label: "attributed pipeline",
                    value: formatCurrencyEUR(Number(payload[0].value)),
                    color: "var(--chart-1)",
                  },
                ]}
              />
            );
          }}
        />
        <Line
          type="monotone"
          dataKey="pipelineEUR"
          stroke="var(--chart-1)"
          strokeWidth={2}
          dot={{ r: 3, fill: "var(--chart-1)", strokeWidth: 0 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
