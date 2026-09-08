import type { Campaign, Creator, PostPerformance } from "@/data/types";

/**
 * There's no CRM in this demo, so a lead's pipeline value is assumed rather
 * than tracked. €350/lead keeps the resulting pipeline:spend ratio in a
 * believable "strong channel" range (~5-10x) rather than an implausible
 * triple-digit multiple. Used consistently everywhere "pipeline" is shown.
 * Documented in the README.
 */
export const ASSUMED_PIPELINE_PER_LEAD_EUR = 350;

export type DateRangeKey = "30d" | "90d" | "all";

export const DATE_RANGE_OPTIONS: { value: DateRangeKey; label: string }[] = [
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "all", label: "All time" },
];

export interface PerformanceRowWithContext extends PostPerformance {
  campaignId: string;
  campaignName: string;
}

export function flattenPerformance(campaigns: Campaign[]): PerformanceRowWithContext[] {
  return campaigns.flatMap((c) =>
    c.performance.map((p) => ({ ...p, campaignId: c.id, campaignName: c.name })),
  );
}

export function filterByDateRange(
  rows: PerformanceRowWithContext[],
  range: DateRangeKey,
  now: Date = new Date(),
): PerformanceRowWithContext[] {
  if (range === "all") return rows;
  const days = range === "30d" ? 30 : 90;
  const cutoff = new Date(now.getTime() - days * 86400000);
  return rows.filter((r) => new Date(r.postedAt) >= cutoff);
}

function weekStart(iso: string): string {
  const d = new Date(iso);
  const day = d.getUTCDay();
  const diff = (day + 6) % 7; // Monday-start week
  d.setUTCDate(d.getUTCDate() - diff);
  return d.toISOString().slice(0, 10);
}

export interface PipelinePoint {
  weekStart: string;
  pipelineEUR: number;
}

export function pipelineOverTime(rows: PerformanceRowWithContext[]): PipelinePoint[] {
  const byWeek = new Map<string, number>();
  for (const row of rows) {
    const key = weekStart(row.postedAt);
    byWeek.set(key, (byWeek.get(key) ?? 0) + row.leads * ASSUMED_PIPELINE_PER_LEAD_EUR);
  }
  return Array.from(byWeek.entries())
    .map(([weekStart, pipelineEUR]) => ({ weekStart, pipelineEUR }))
    .sort((a, b) => a.weekStart.localeCompare(b.weekStart));
}

export interface CreatorPerformancePoint {
  creatorId: string;
  creatorName: string;
  leads: number;
}

export function creatorIdByPerformanceId(campaigns: Campaign[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const campaign of campaigns) {
    for (const perf of campaign.performance) {
      map.set(perf.id, perf.creatorId);
    }
  }
  return map;
}

export function performanceByCreator(
  rows: PerformanceRowWithContext[],
  campaigns: Campaign[],
  getCreator: (id: string) => Creator | undefined,
  topN = 8,
): CreatorPerformancePoint[] {
  const creatorIdByPerformance = creatorIdByPerformanceId(campaigns);

  const leadsByCreator = new Map<string, number>();
  for (const row of rows) {
    const creatorId = creatorIdByPerformance.get(row.id);
    if (!creatorId) continue;
    leadsByCreator.set(creatorId, (leadsByCreator.get(creatorId) ?? 0) + row.leads);
  }

  return Array.from(leadsByCreator.entries())
    .map(([creatorId, leads]) => ({
      creatorId,
      creatorName: getCreator(creatorId)?.name ?? "Unknown creator",
      leads,
    }))
    .sort((a, b) => b.leads - a.leads)
    .slice(0, topN);
}

export interface FunnelTotals {
  impressions: number;
  clicks: number;
  leads: number;
}

export function funnelTotals(rows: PerformanceRowWithContext[]): FunnelTotals {
  return rows.reduce(
    (acc, r) => ({
      impressions: acc.impressions + r.impressions,
      clicks: acc.clicks + r.clicks,
      leads: acc.leads + r.leads,
    }),
    { impressions: 0, clicks: 0, leads: 0 },
  );
}

export interface AnalyticsSummary {
  totalSpendEUR: number;
  pipelineEUR: number;
  costPerLeadEUR: number;
  roiMultiple: number;
}

export function summarize(
  rows: PerformanceRowWithContext[],
  campaigns: Campaign[],
): AnalyticsSummary {
  const creatorIdByPerformance = creatorIdByPerformanceId(campaigns);
  const activeCreatorIds = new Set(
    rows.map((r) => creatorIdByPerformance.get(r.id)).filter((id): id is string => Boolean(id)),
  );

  let totalSpendEUR = 0;
  for (const campaign of campaigns) {
    for (const cc of campaign.creators) {
      if (activeCreatorIds.has(cc.creatorId)) totalSpendEUR += cc.spendEUR;
    }
  }

  const { leads } = funnelTotals(rows);
  const pipelineEUR = leads * ASSUMED_PIPELINE_PER_LEAD_EUR;

  return {
    totalSpendEUR,
    pipelineEUR,
    costPerLeadEUR: leads > 0 ? totalSpendEUR / leads : 0,
    roiMultiple: totalSpendEUR > 0 ? pipelineEUR / totalSpendEUR : 0,
  };
}
