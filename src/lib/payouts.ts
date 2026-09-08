import type { Campaign, Payout, PayoutStatus } from "@/data/types";

const STATUS_FOR_COLLABORATION: Partial<Record<string, PayoutStatus>> = {
  scheduled: "scheduled",
  live: "processing",
  paid: "paid",
};

/**
 * A payout only exists once a post is at least scheduled — nothing owed for a
 * creator who's merely invited/accepted/drafting yet.
 */
export function derivePayouts(campaigns: Campaign[]): Payout[] {
  const payouts: Payout[] = [];
  for (const campaign of campaigns) {
    for (const row of campaign.creators) {
      const status = STATUS_FOR_COLLABORATION[row.status];
      if (!status) continue;
      payouts.push({
        id: `payout-${campaign.id}-${row.creatorId}`,
        creatorId: row.creatorId,
        campaignId: campaign.id,
        amountEUR: row.spendEUR,
        status,
        invoiceRef: `INV-${campaign.id.replace("campaign-", "")}-${row.creatorId.replace("creator-", "")}`,
      });
    }
  }
  return payouts;
}

export function summarizePayouts(payouts: Payout[]) {
  const totals = { scheduled: 0, processing: 0, paid: 0 };
  for (const p of payouts) {
    totals[p.status] += p.amountEUR;
  }
  return totals;
}
