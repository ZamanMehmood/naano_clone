import { describe, expect, it } from "vitest";
import { creators } from "../creators";
import { campaigns } from "../campaigns";

describe("creators seed data", () => {
  it("has 60 creators with unique slugs and ids", () => {
    expect(creators).toHaveLength(60);
    expect(new Set(creators.map((c) => c.slug)).size).toBe(60);
    expect(new Set(creators.map((c) => c.id)).size).toBe(60);
  });

  it("keeps followers, price and fit score within their documented ranges", () => {
    for (const c of creators) {
      expect(c.followers).toBeGreaterThanOrEqual(1000);
      expect(c.followers).toBeLessThanOrEqual(500000);
      expect(c.pricePerPostEUR).toBeGreaterThan(0);
      expect(c.audienceFitScore).toBeGreaterThanOrEqual(0);
      expect(c.audienceFitScore).toBeLessThanOrEqual(100);
    }
  });

  it("keeps clicks plausible against impressions (never more clicks than impressions)", () => {
    for (const c of creators) {
      expect(c.avgClicksPerPost).toBeLessThanOrEqual(c.avgImpressions);
      for (const post of c.samplePosts) {
        expect(post.clicks).toBeLessThanOrEqual(post.impressions);
        expect(post.likes).toBeLessThanOrEqual(post.impressions);
      }
    }
  });

  it("normalises audience breakdown percentages to 100", () => {
    for (const c of creators) {
      for (const group of [c.audience.roles, c.audience.seniority, c.audience.geography]) {
        const total = group.reduce((sum, item) => sum + item.pct, 0);
        expect(total).toBe(100);
      }
    }
  });
});

describe("campaign seed data", () => {
  it("has 6 campaigns spanning draft, live and completed", () => {
    expect(campaigns).toHaveLength(6);
    const statuses = new Set(campaigns.map((c) => c.status));
    expect(statuses.has("draft")).toBe(true);
    expect(statuses.has("live")).toBe(true);
    expect(statuses.has("completed")).toBe(true);
  });

  it("references only real creators", () => {
    const creatorIds = new Set(creators.map((c) => c.id));
    for (const campaign of campaigns) {
      for (const cc of campaign.creators) {
        expect(creatorIds.has(cc.creatorId)).toBe(true);
      }
    }
  });

  it("keeps leads plausible against clicks, and clicks against impressions", () => {
    for (const campaign of campaigns) {
      for (const row of campaign.performance) {
        expect(row.clicks).toBeLessThanOrEqual(row.impressions);
        expect(row.leads).toBeLessThanOrEqual(row.clicks);
      }
    }
  });

  it("only records performance for creators who are live or paid", () => {
    for (const campaign of campaigns) {
      const eligibleIds = new Set(
        campaign.creators
          .filter((cc) => cc.status === "live" || cc.status === "paid")
          .map((cc) => cc.creatorId),
      );
      for (const row of campaign.performance) {
        expect(eligibleIds.has(row.creatorId)).toBe(true);
      }
    }
  });
});
