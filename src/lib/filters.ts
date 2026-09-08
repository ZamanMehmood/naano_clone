import type { Creator, Niche } from "@/data/types";
import { costPerClick } from "@/lib/estimators";

export const FOLLOWER_BOUNDS: [number, number] = [1000, 500000];
export const PRICE_BOUNDS: [number, number] = [0, 6000];

export interface MarketplaceFilters {
  query: string;
  niches: Niche[];
  countries: string[];
  languages: string[];
  verifiedOnly: boolean;
  minFitScore: number;
  followerRange: [number, number];
  priceRange: [number, number];
}

export const DEFAULT_FILTERS: MarketplaceFilters = {
  query: "",
  niches: [],
  countries: [],
  languages: [],
  verifiedOnly: false,
  minFitScore: 0,
  followerRange: FOLLOWER_BOUNDS,
  priceRange: PRICE_BOUNDS,
};

export type SortKey =
  | "fit"
  | "price-asc"
  | "price-desc"
  | "followers"
  | "impressions"
  | "cpc";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "fit", label: "Audience fit" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "followers", label: "Followers" },
  { value: "impressions", label: "Avg. impressions" },
  { value: "cpc", label: "Est. cost per click" },
];

function matchesQuery(creator: Creator, query: string): boolean {
  if (!query.trim()) return true;
  const haystack = `${creator.name} ${creator.headline} ${creator.niches.join(" ")}`.toLowerCase();
  return haystack.includes(query.trim().toLowerCase());
}

export function filterCreators(creators: Creator[], filters: MarketplaceFilters): Creator[] {
  return creators.filter((creator) => {
    if (!matchesQuery(creator, filters.query)) return false;
    if (filters.niches.length > 0 && !creator.niches.some((n) => filters.niches.includes(n))) {
      return false;
    }
    if (filters.countries.length > 0 && !filters.countries.includes(creator.country)) {
      return false;
    }
    if (
      filters.languages.length > 0 &&
      !creator.languages.some((l) => filters.languages.includes(l))
    ) {
      return false;
    }
    if (filters.verifiedOnly && !creator.verified) return false;
    if (creator.audienceFitScore < filters.minFitScore) return false;
    if (creator.followers < filters.followerRange[0] || creator.followers > filters.followerRange[1]) {
      return false;
    }
    if (
      creator.pricePerPostEUR < filters.priceRange[0] ||
      creator.pricePerPostEUR > filters.priceRange[1]
    ) {
      return false;
    }
    return true;
  });
}

export function sortCreators(creators: Creator[], sort: SortKey): Creator[] {
  const sorted = [...creators];
  switch (sort) {
    case "fit":
      return sorted.sort((a, b) => b.audienceFitScore - a.audienceFitScore);
    case "price-asc":
      return sorted.sort((a, b) => a.pricePerPostEUR - b.pricePerPostEUR);
    case "price-desc":
      return sorted.sort((a, b) => b.pricePerPostEUR - a.pricePerPostEUR);
    case "followers":
      return sorted.sort((a, b) => b.followers - a.followers);
    case "impressions":
      return sorted.sort((a, b) => b.avgImpressions - a.avgImpressions);
    case "cpc":
      return sorted.sort((a, b) => costPerClick(a) - costPerClick(b));
    default:
      return sorted;
  }
}

export function isDefaultFilters(filters: MarketplaceFilters): boolean {
  return (
    filters.query.trim() === "" &&
    filters.niches.length === 0 &&
    filters.countries.length === 0 &&
    filters.languages.length === 0 &&
    !filters.verifiedOnly &&
    filters.minFitScore === 0 &&
    filters.followerRange[0] === FOLLOWER_BOUNDS[0] &&
    filters.followerRange[1] === FOLLOWER_BOUNDS[1] &&
    filters.priceRange[0] === PRICE_BOUNDS[0] &&
    filters.priceRange[1] === PRICE_BOUNDS[1]
  );
}
