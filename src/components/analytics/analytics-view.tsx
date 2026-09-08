"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PipelineChart } from "@/components/analytics/pipeline-chart";
import { PerformanceBarChart } from "@/components/analytics/performance-bar-chart";
import { FunnelChart } from "@/components/analytics/funnel-chart";
import { PerPostTable } from "@/components/analytics/per-post-table";
import { StatTile } from "@/components/analytics/stat-tile";
import type { Campaign } from "@/data/types";
import { getCreatorById } from "@/data/creators";
import {
  DATE_RANGE_OPTIONS,
  filterByDateRange,
  flattenPerformance,
  funnelTotals,
  performanceByCreator,
  pipelineOverTime,
  summarize,
  type DateRangeKey,
} from "@/lib/analytics";
import { formatCurrencyEUR } from "@/lib/format";

function ChartCardSkeleton({ title }: { title: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-70 w-full" />
      </CardContent>
    </Card>
  );
}

export function AnalyticsView({ campaigns }: { campaigns: Campaign[] }) {
  const [range, setRange] = useState<DateRangeKey>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, []);

  const allRows = useMemo(() => flattenPerformance(campaigns), [campaigns]);
  const rows = useMemo(() => filterByDateRange(allRows, range), [allRows, range]);

  const summary = useMemo(() => summarize(rows, campaigns), [rows, campaigns]);
  const pipelinePoints = useMemo(() => pipelineOverTime(rows), [rows]);
  const creatorPoints = useMemo(
    () => performanceByCreator(rows, campaigns, getCreatorById),
    [rows, campaigns],
  );
  const funnel = useMemo(() => funnelTotals(rows), [rows]);

  return (
    <div className="flex flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-3">
        <Select value={range} onValueChange={(v) => setRange(v as DateRangeKey)}>
          <SelectTrigger className="w-[170px]" aria-label="Date range">
            <SelectValue>
              {(value: unknown) => DATE_RANGE_OPTIONS.find((o) => o.value === value)?.label}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {DATE_RANGE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }, (_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="mt-2 h-7 w-24" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <StatTile label="Total spend" value={formatCurrencyEUR(summary.totalSpendEUR)} />
            <StatTile
              label="Attributed pipeline"
              value={formatCurrencyEUR(summary.pipelineEUR)}
              sublabel="at €350 / lead (assumed)"
            />
            <StatTile
              label="Cost per lead"
              value={summary.costPerLeadEUR > 0 ? formatCurrencyEUR(summary.costPerLeadEUR) : "—"}
            />
            <StatTile
              label="ROI multiple"
              value={summary.roiMultiple > 0 ? `${summary.roiMultiple.toFixed(1)}×` : "—"}
            />
          </>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartCardSkeleton title="Attributed pipeline over time" />
          <ChartCardSkeleton title="Performance by creator" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Attributed pipeline over time</CardTitle>
            </CardHeader>
            <CardContent>
              <PipelineChart data={pipelinePoints} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Performance by creator</CardTitle>
            </CardHeader>
            <CardContent>
              <PerformanceBarChart data={creatorPoints} />
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Funnel</CardTitle>
        </CardHeader>
        <CardContent>{loading ? <Skeleton className="h-48 w-full" /> : <FunnelChart totals={funnel} />}</CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-sm font-semibold">Per-post performance</h2>
        {loading ? <Skeleton className="h-64 w-full" /> : <PerPostTable rows={rows} />}
      </div>
    </div>
  );
}
