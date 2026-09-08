import { describe, expect, it } from "vitest";
import type { Campaign, Creator } from "@/data/types";
import {
  ASSUMED_PIPELINE_PER_LEAD_EUR,
  filterByDateRange,
  flattenPerformance,
  funnelTotals,
  performanceByCreator,
  pipelineOverTime,
  summarize,
} from "@/lib/analytics";

const emptyCollab = {
  status: "live" as const,
  feedback: [],
  trackingUrl: "",
  utm: { source: "", medium: "", campaign: "", content: "" },
};

function makeCampaign(overrides: Partial<Campaign>): Campaign {
  return {
    id: "campaign-x",
    slug: "x",
    name: "Campaign X",
    status: "live",
    objective: "leads",
    targetAudience: "",
    keyMessages: [],
    budgetEUR: 1000,
    createdAt: "2026-01-01",
    creators: [],
    performance: [],
    ...overrides,
  };
}

describe("flattenPerformance", () => {
  it("attaches campaign context to every row", () => {
    const campaigns = [
      makeCampaign({
        id: "c1",
        name: "First",
        performance: [{ id: "p1", creatorId: "cr1", postedAt: "2026-01-01", impressions: 100, clicks: 10, leads: 1 }],
      }),
    ];
    const rows = flattenPerformance(campaigns);
    expect(rows).toHaveLength(1);
    expect(rows[0].campaignId).toBe("c1");
    expect(rows[0].campaignName).toBe("First");
  });
});

describe("filterByDateRange", () => {
  const now = new Date("2026-06-15");
  const rows = flattenPerformance([
    makeCampaign({
      id: "c1",
      performance: [
        { id: "p1", creatorId: "cr1", postedAt: "2026-06-10", impressions: 1, clicks: 1, leads: 1 }, // 5 days ago
        { id: "p2", creatorId: "cr1", postedAt: "2026-05-01", impressions: 1, clicks: 1, leads: 1 }, // 45 days ago
        { id: "p3", creatorId: "cr1", postedAt: "2026-01-01", impressions: 1, clicks: 1, leads: 1 }, // >90 days ago
      ],
    }),
  ]);

  it("filters to the last 30 days", () => {
    expect(filterByDateRange(rows, "30d", now).map((r) => r.id)).toEqual(["p1"]);
  });

  it("filters to the last 90 days", () => {
    expect(filterByDateRange(rows, "90d", now).map((r) => r.id).sort()).toEqual(["p1", "p2"]);
  });

  it("returns everything for 'all'", () => {
    expect(filterByDateRange(rows, "all", now)).toHaveLength(3);
  });
});

describe("funnelTotals", () => {
  it("sums impressions, clicks and leads and keeps the funnel monotonic", () => {
    const rows = flattenPerformance([
      makeCampaign({
        performance: [
          { id: "p1", creatorId: "cr1", postedAt: "2026-01-01", impressions: 1000, clicks: 100, leads: 10 },
          { id: "p2", creatorId: "cr2", postedAt: "2026-01-02", impressions: 500, clicks: 50, leads: 5 },
        ],
      }),
    ]);
    const totals = funnelTotals(rows);
    expect(totals).toEqual({ impressions: 1500, clicks: 150, leads: 15 });
    expect(totals.impressions).toBeGreaterThanOrEqual(totals.clicks);
    expect(totals.clicks).toBeGreaterThanOrEqual(totals.leads);
  });
});

describe("pipelineOverTime", () => {
  it("buckets leads into weeks and values them at the assumed pipeline-per-lead", () => {
    const rows = flattenPerformance([
      makeCampaign({
        performance: [
          { id: "p1", creatorId: "cr1", postedAt: "2026-01-05", impressions: 1, clicks: 1, leads: 2 },
          { id: "p2", creatorId: "cr1", postedAt: "2026-01-06", impressions: 1, clicks: 1, leads: 3 },
        ],
      }),
    ]);
    const points = pipelineOverTime(rows);
    expect(points).toHaveLength(1);
    expect(points[0].pipelineEUR).toBe(5 * ASSUMED_PIPELINE_PER_LEAD_EUR);
  });

  it("sorts chronologically across weeks", () => {
    const rows = flattenPerformance([
      makeCampaign({
        performance: [
          { id: "p1", creatorId: "cr1", postedAt: "2026-03-01", impressions: 1, clicks: 1, leads: 1 },
          { id: "p2", creatorId: "cr1", postedAt: "2026-01-01", impressions: 1, clicks: 1, leads: 1 },
        ],
      }),
    ]);
    const points = pipelineOverTime(rows);
    expect(points[0].weekStart < points[1].weekStart).toBe(true);
  });
});

describe("performanceByCreator", () => {
  const campaigns = [
    makeCampaign({
      id: "c1",
      creators: [
        { creatorId: "cr1", ...emptyCollab, spendEUR: 100 },
        { creatorId: "cr2", ...emptyCollab, spendEUR: 200 },
      ],
      performance: [
        { id: "p1", creatorId: "cr1", postedAt: "2026-01-01", impressions: 1, clicks: 1, leads: 10 },
        { id: "p2", creatorId: "cr2", postedAt: "2026-01-01", impressions: 1, clicks: 1, leads: 3 },
      ],
    }),
  ];
  const rows = flattenPerformance(campaigns);
  const names: Record<string, string> = { cr1: "Alice", cr2: "Bob" };
  const getCreator = (id: string): Creator | undefined =>
    names[id] ? ({ name: names[id] } as unknown as Creator) : undefined;

  it("aggregates leads per creator, sorted descending", () => {
    const result = performanceByCreator(rows, campaigns, getCreator);
    expect(result[0]).toEqual({ creatorId: "cr1", creatorName: "Alice", leads: 10 });
    expect(result[1]).toEqual({ creatorId: "cr2", creatorName: "Bob", leads: 3 });
  });
});

describe("summarize", () => {
  it("computes spend, pipeline, cost per lead and ROI multiple", () => {
    const campaigns = [
      makeCampaign({
        id: "c1",
        creators: [
          { creatorId: "cr1", ...emptyCollab, spendEUR: 500 },
          { creatorId: "cr2", ...emptyCollab, spendEUR: 300 },
        ],
        performance: [
          { id: "p1", creatorId: "cr1", postedAt: "2026-01-01", impressions: 100, clicks: 10, leads: 2 },
        ],
      }),
    ];
    const rows = flattenPerformance(campaigns);
    const summary = summarize(rows, campaigns);

    // only cr1 has a performance row, so only cr1's spend counts
    expect(summary.totalSpendEUR).toBe(500);
    expect(summary.pipelineEUR).toBe(2 * ASSUMED_PIPELINE_PER_LEAD_EUR);
    expect(summary.costPerLeadEUR).toBe(250);
    expect(summary.roiMultiple).toBeCloseTo((2 * ASSUMED_PIPELINE_PER_LEAD_EUR) / 500);
  });

  it("returns zeros instead of dividing by zero when there are no leads or no spend", () => {
    const summary = summarize([], []);
    expect(summary).toEqual({
      totalSpendEUR: 0,
      pipelineEUR: 0,
      costPerLeadEUR: 0,
      roiMultiple: 0,
    });
  });
});
