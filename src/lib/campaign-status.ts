import type { CampaignStatus, CollaborationStatus, PayoutStatus } from "@/data/types";
import { COLLABORATION_STATUSES } from "@/data/types";

export const COLLABORATION_STATUS_LABEL: Record<CollaborationStatus, string> = {
  invited: "Invited",
  accepted: "Accepted",
  draft_submitted: "Draft submitted",
  scheduled: "Scheduled",
  live: "Live",
  paid: "Paid",
};

export const COLLABORATION_STATUS_TONE: Record<CollaborationStatus, string> = {
  invited: "bg-muted text-muted-foreground",
  accepted: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  draft_submitted: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  scheduled: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  live: "bg-success/10 text-success",
  paid: "bg-brand/10 text-brand",
};

export const CAMPAIGN_STATUS_LABEL: Record<CampaignStatus, string> = {
  draft: "Draft",
  live: "Live",
  completed: "Completed",
};

export const CAMPAIGN_STATUS_TONE: Record<CampaignStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  live: "bg-success/10 text-success",
  completed: "bg-brand/10 text-brand",
};

export const PAYOUT_STATUS_LABEL: Record<PayoutStatus, string> = {
  scheduled: "Scheduled",
  processing: "Processing",
  paid: "Paid",
};

export const PAYOUT_STATUS_TONE: Record<PayoutStatus, string> = {
  scheduled: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  processing: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  paid: "bg-success/10 text-success",
};

export function statusIndex(status: CollaborationStatus): number {
  return COLLABORATION_STATUSES.indexOf(status);
}

export function nextCollaborationStatus(status: CollaborationStatus): CollaborationStatus | null {
  const idx = statusIndex(status);
  if (idx === -1 || idx === COLLABORATION_STATUSES.length - 1) return null;
  return COLLABORATION_STATUSES[idx + 1];
}
