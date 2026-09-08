import { describe, expect, it } from "vitest";
import type { Creator } from "@/data/types";
import {
  DEFAULT_FILTERS,
  filterCreators,
  isDefaultFilters,
  sortCreators,
} from "@/lib/filters";

function makeCreator(overrides: Partial<Creator>): Creator {
  return {
    id: "id",
    slug: "slug",
    name: "Name",
    headline: "Headline",
    bio: "Bio",
    niches: ["SaaS"],
    followers: 10000,
    country: "Germany",
    countryCode: "DE",
    languages: ["German", "English"],
    avgImpressions: 5000,
    avgEngagementRate: 3,
    avgClicksPerPost: 100,
    pricePerPostEUR: 500,
    audienceFitScore: 70,
    verified: false,
    availability: "available",
    audience: { roles: [], seniority: [], geography: [] },
    samplePosts: [],
    ...overrides,
  };
}

describe("filterCreators", () => {
  const creators = [
    makeCreator({ id: "1", name: "Alice AI", niches: ["AI"], followers: 5000, pricePerPostEUR: 200, verified: true, audienceFitScore: 90, country: "Germany" }),
    makeCreator({ id: "2", name: "Bob Sales", niches: ["Sales"], followers: 200000, pricePerPostEUR: 4000, verified: false, audienceFitScore: 50, country: "France" }),
    makeCreator({ id: "3", name: "Cara SaaS", niches: ["SaaS"], followers: 50000, pricePerPostEUR: 1000, verified: true, audienceFitScore: 65, country: "Germany" }),
  ];

  it("returns everything when filters are default", () => {
    expect(filterCreators(creators, DEFAULT_FILTERS)).toHaveLength(3);
  });

  it("filters by search query across name, headline and niches", () => {
    const result = filterCreators(creators, { ...DEFAULT_FILTERS, query: "sales" });
    expect(result.map((c) => c.id)).toEqual(["2"]);
  });

  it("filters by niche multi-select", () => {
    const result = filterCreators(creators, { ...DEFAULT_FILTERS, niches: ["AI", "SaaS"] });
    expect(result.map((c) => c.id).sort()).toEqual(["1", "3"]);
  });

  it("filters by verified-only", () => {
    const result = filterCreators(creators, { ...DEFAULT_FILTERS, verifiedOnly: true });
    expect(result.map((c) => c.id).sort()).toEqual(["1", "3"]);
  });

  it("filters by minimum fit score", () => {
    const result = filterCreators(creators, { ...DEFAULT_FILTERS, minFitScore: 70 });
    expect(result.map((c) => c.id)).toEqual(["1"]);
  });

  it("filters by follower range", () => {
    const result = filterCreators(creators, { ...DEFAULT_FILTERS, followerRange: [10000, 100000] });
    expect(result.map((c) => c.id)).toEqual(["3"]);
  });

  it("filters by price range", () => {
    const result = filterCreators(creators, { ...DEFAULT_FILTERS, priceRange: [0, 500] });
    expect(result.map((c) => c.id)).toEqual(["1"]);
  });

  it("filters by country", () => {
    const result = filterCreators(creators, { ...DEFAULT_FILTERS, countries: ["France"] });
    expect(result.map((c) => c.id)).toEqual(["2"]);
  });

  it("combines multiple filters with AND semantics", () => {
    const result = filterCreators(creators, {
      ...DEFAULT_FILTERS,
      niches: ["SaaS"],
      verifiedOnly: true,
      countries: ["Germany"],
    });
    expect(result.map((c) => c.id)).toEqual(["3"]);
  });
});

describe("sortCreators", () => {
  const creators = [
    makeCreator({ id: "1", audienceFitScore: 50, pricePerPostEUR: 300, followers: 1000, avgImpressions: 400, avgClicksPerPost: 20 }),
    makeCreator({ id: "2", audienceFitScore: 90, pricePerPostEUR: 100, followers: 3000, avgImpressions: 900, avgClicksPerPost: 10 }),
    makeCreator({ id: "3", audienceFitScore: 70, pricePerPostEUR: 200, followers: 2000, avgImpressions: 600, avgClicksPerPost: 100 }),
  ];

  it("sorts by fit score descending", () => {
    expect(sortCreators(creators, "fit").map((c) => c.id)).toEqual(["2", "3", "1"]);
  });

  it("sorts by price ascending and descending", () => {
    expect(sortCreators(creators, "price-asc").map((c) => c.id)).toEqual(["2", "3", "1"]);
    expect(sortCreators(creators, "price-desc").map((c) => c.id)).toEqual(["1", "3", "2"]);
  });

  it("sorts by followers descending", () => {
    expect(sortCreators(creators, "followers").map((c) => c.id)).toEqual(["2", "3", "1"]);
  });

  it("sorts by cost per click ascending (cheapest first)", () => {
    // cpc = price / clicks -> 1: 15, 2: 10, 3: 2
    expect(sortCreators(creators, "cpc").map((c) => c.id)).toEqual(["3", "2", "1"]);
  });

  it("does not mutate the input array", () => {
    const original = [...creators];
    sortCreators(creators, "fit");
    expect(creators).toEqual(original);
  });
});

describe("isDefaultFilters", () => {
  it("is true for the default filters", () => {
    expect(isDefaultFilters(DEFAULT_FILTERS)).toBe(true);
  });

  it("is false once any filter changes", () => {
    expect(isDefaultFilters({ ...DEFAULT_FILTERS, query: "ai" })).toBe(false);
    expect(isDefaultFilters({ ...DEFAULT_FILTERS, verifiedOnly: true })).toBe(false);
  });
});
