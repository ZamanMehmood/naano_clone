import type { Creator } from "@/data/types";

export function costPerClick(creator: Pick<Creator, "pricePerPostEUR" | "avgClicksPerPost">): number {
  if (creator.avgClicksPerPost <= 0) return 0;
  return creator.pricePerPostEUR / creator.avgClicksPerPost;
}

export function estimatedReach(creator: Pick<Creator, "avgImpressions">, postCount = 1): number {
  return creator.avgImpressions * postCount;
}

export function estimatedClicks(creator: Pick<Creator, "avgClicksPerPost">, postCount = 1): number {
  return creator.avgClicksPerPost * postCount;
}

/** Qualified-click conversion assumption used across the builder and analytics estimates. */
const QUALIFIED_CLICK_RATE = 0.35;

export function estimatedQualifiedClicks(
  creator: Pick<Creator, "avgClicksPerPost">,
  postCount = 1,
): number {
  return Math.round(estimatedClicks(creator, postCount) * QUALIFIED_CLICK_RATE);
}

export function costPerQualifiedClick(
  creator: Pick<Creator, "pricePerPostEUR" | "avgClicksPerPost">,
): number {
  const qualified = estimatedQualifiedClicks(creator);
  if (qualified <= 0) return 0;
  return creator.pricePerPostEUR / qualified;
}

export interface CampaignTotals {
  creatorCount: number;
  totalSpendEUR: number;
  estimatedImpressions: number;
  estimatedClicks: number;
  estimatedQualifiedClicks: number;
  costPerQualifiedClickEUR: number;
}

export function summarizeCreatorSelection(
  creators: Pick<Creator, "pricePerPostEUR" | "avgImpressions" | "avgClicksPerPost">[],
): CampaignTotals {
  const totalSpendEUR = creators.reduce((sum, c) => sum + c.pricePerPostEUR, 0);
  const estimatedImpressions = creators.reduce((sum, c) => sum + c.avgImpressions, 0);
  const estimatedClicksTotal = creators.reduce((sum, c) => sum + c.avgClicksPerPost, 0);
  const estimatedQualified = Math.round(estimatedClicksTotal * QUALIFIED_CLICK_RATE);

  return {
    creatorCount: creators.length,
    totalSpendEUR,
    estimatedImpressions,
    estimatedClicks: estimatedClicksTotal,
    estimatedQualifiedClicks: estimatedQualified,
    costPerQualifiedClickEUR: estimatedQualified > 0 ? totalSpendEUR / estimatedQualified : 0,
  };
}
