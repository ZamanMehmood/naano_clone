import { describe, expect, it } from "vitest";
import { costPerClick, summarizeCreatorSelection } from "@/lib/estimators";

describe("costPerClick", () => {
  it("divides price by clicks", () => {
    expect(costPerClick({ pricePerPostEUR: 500, avgClicksPerPost: 100 })).toBe(5);
  });

  it("returns 0 instead of Infinity/NaN when clicks are 0", () => {
    expect(costPerClick({ pricePerPostEUR: 500, avgClicksPerPost: 0 })).toBe(0);
  });
});

describe("summarizeCreatorSelection", () => {
  it("sums spend and impressions across the selection", () => {
    const totals = summarizeCreatorSelection([
      { pricePerPostEUR: 300, avgImpressions: 10000, avgClicksPerPost: 100 },
      { pricePerPostEUR: 700, avgImpressions: 20000, avgClicksPerPost: 200 },
    ]);
    expect(totals.creatorCount).toBe(2);
    expect(totals.totalSpendEUR).toBe(1000);
    expect(totals.estimatedImpressions).toBe(30000);
    expect(totals.estimatedClicks).toBe(300);
  });

  it("returns all zeros for an empty selection without dividing by zero", () => {
    const totals = summarizeCreatorSelection([]);
    expect(totals).toEqual({
      creatorCount: 0,
      totalSpendEUR: 0,
      estimatedImpressions: 0,
      estimatedClicks: 0,
      estimatedQualifiedClicks: 0,
      costPerQualifiedClickEUR: 0,
    });
  });
});
