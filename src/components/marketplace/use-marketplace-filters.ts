"use client";

import { useMemo } from "react";
import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";
import type { Niche } from "@/data/types";
import {
  DEFAULT_FILTERS,
  FOLLOWER_BOUNDS,
  PRICE_BOUNDS,
  type MarketplaceFilters,
  type SortKey,
} from "@/lib/filters";

const SORT_VALUES: SortKey[] = ["fit", "price-asc", "price-desc", "followers", "impressions", "cpc"];

const searchParamSchema = {
  q: parseAsString.withDefault(""),
  niches: parseAsArrayOf(parseAsString).withDefault([]),
  countries: parseAsArrayOf(parseAsString).withDefault([]),
  languages: parseAsArrayOf(parseAsString).withDefault([]),
  verified: parseAsBoolean.withDefault(false),
  minFit: parseAsInteger.withDefault(0),
  followerMin: parseAsInteger.withDefault(FOLLOWER_BOUNDS[0]),
  followerMax: parseAsInteger.withDefault(FOLLOWER_BOUNDS[1]),
  priceMin: parseAsInteger.withDefault(PRICE_BOUNDS[0]),
  priceMax: parseAsInteger.withDefault(PRICE_BOUNDS[1]),
  sort: parseAsStringEnum<SortKey>(SORT_VALUES).withDefault("fit"),
  page: parseAsInteger.withDefault(1),
};

export function useMarketplaceFilters() {
  const [state, setState] = useQueryStates(searchParamSchema, {
    history: "replace",
    scroll: false,
  });

  const filters: MarketplaceFilters = useMemo(
    () => ({
      query: state.q,
      niches: state.niches as Niche[],
      countries: state.countries,
      languages: state.languages,
      verifiedOnly: state.verified,
      minFitScore: state.minFit,
      followerRange: [state.followerMin, state.followerMax],
      priceRange: [state.priceMin, state.priceMax],
    }),
    [state],
  );

  function setFilters(patch: Partial<MarketplaceFilters>) {
    setState((prev) => ({
      q: patch.query ?? prev.q,
      niches: patch.niches ?? prev.niches,
      countries: patch.countries ?? prev.countries,
      languages: patch.languages ?? prev.languages,
      verified: patch.verifiedOnly ?? prev.verified,
      minFit: patch.minFitScore ?? prev.minFit,
      followerMin: patch.followerRange?.[0] ?? prev.followerMin,
      followerMax: patch.followerRange?.[1] ?? prev.followerMax,
      priceMin: patch.priceRange?.[0] ?? prev.priceMin,
      priceMax: patch.priceRange?.[1] ?? prev.priceMax,
      page: 1,
    }));
  }

  function resetFilters() {
    setState({
      q: "",
      niches: [],
      countries: [],
      languages: [],
      verified: false,
      minFit: 0,
      followerMin: FOLLOWER_BOUNDS[0],
      followerMax: FOLLOWER_BOUNDS[1],
      priceMin: PRICE_BOUNDS[0],
      priceMax: PRICE_BOUNDS[1],
      page: 1,
    });
  }

  return {
    filters,
    setFilters,
    resetFilters,
    sort: state.sort,
    setSort: (sort: SortKey) => setState({ sort, page: 1 }),
    page: state.page,
    setPage: (page: number) => setState({ page }),
    defaultFilters: DEFAULT_FILTERS,
  };
}
