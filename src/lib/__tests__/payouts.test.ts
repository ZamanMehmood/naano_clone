import { describe, expect, it } from "vitest";
import type { Campaign } from "@/data/types";
import { derivePayouts, summarizePayouts } from "@/lib/payouts";

function makeCampaign(overrides: Partial<Campaign>): Campaign {
  return {
    id: "campaign-x",
    slug: "x",
    name: "X",
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

describe("derivePayouts", () => {
  it("only creates a payout once a post is at least scheduled", () => {
    const campaign = makeCampaign({
      creators: [
        { creatorId: "c1", status: "invited", feedback: [], trackingUrl: "", utm: { source: "", medium: "", campaign: "", content: "" }, spendEUR: 100 },
        { creatorId: "c2", status: "accepted", feedback: [], trackingUrl: "", utm: { source: "", medium: "", campaign: "", content: "" }, spendEUR: 200 },
        { creatorId: "c3", status: "draft_submitted", feedback: [], trackingUrl: "", utm: { source: "", medium: "", campaign: "", content: "" }, spendEUR: 300 },
        { creatorId: "c4", status: "scheduled", feedback: [], trackingUrl: "", utm: { source: "", medium: "", campaign: "", content: "" }, spendEUR: 400 },
        { creatorId: "c5", status: "live", feedback: [], trackingUrl: "", utm: { source: "", medium: "", campaign: "", content: "" }, spendEUR: 500 },
        { creatorId: "c6", status: "paid", feedback: [], trackingUrl: "", utm: { source: "", medium: "", campaign: "", content: "" }, spendEUR: 600 },
      ],
    });

    const payouts = derivePayouts([campaign]);
    expect(payouts.map((p) => p.creatorId).sort()).toEqual(["c4", "c5", "c6"]);
  });

  it("maps collaboration status to the right payout status", () => {
    const campaign = makeCampaign({
      creators: [
        { creatorId: "c4", status: "scheduled", feedback: [], trackingUrl: "", utm: { source: "", medium: "", campaign: "", content: "" }, spendEUR: 400 },
        { creatorId: "c5", status: "live", feedback: [], trackingUrl: "", utm: { source: "", medium: "", campaign: "", content: "" }, spendEUR: 500 },
        { creatorId: "c6", status: "paid", feedback: [], trackingUrl: "", utm: { source: "", medium: "", campaign: "", content: "" }, spendEUR: 600 },
      ],
    });
    const payouts = derivePayouts([campaign]);
    expect(payouts.find((p) => p.creatorId === "c4")?.status).toBe("scheduled");
    expect(payouts.find((p) => p.creatorId === "c5")?.status).toBe("processing");
    expect(payouts.find((p) => p.creatorId === "c6")?.status).toBe("paid");
  });
});

describe("summarizePayouts", () => {
  it("sums amounts per status", () => {
    const totals = summarizePayouts([
      { id: "1", creatorId: "c1", campaignId: "camp", amountEUR: 100, status: "scheduled", invoiceRef: "i1" },
      { id: "2", creatorId: "c2", campaignId: "camp", amountEUR: 200, status: "paid", invoiceRef: "i2" },
      { id: "3", creatorId: "c3", campaignId: "camp", amountEUR: 50, status: "paid", invoiceRef: "i3" },
    ]);
    expect(totals).toEqual({ scheduled: 100, processing: 0, paid: 250 });
  });
});
