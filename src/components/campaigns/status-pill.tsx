import { cn } from "@/lib/utils";
import type { CampaignStatus, CollaborationStatus, PayoutStatus } from "@/data/types";
import {
  CAMPAIGN_STATUS_LABEL,
  CAMPAIGN_STATUS_TONE,
  COLLABORATION_STATUS_LABEL,
  COLLABORATION_STATUS_TONE,
  PAYOUT_STATUS_LABEL,
  PAYOUT_STATUS_TONE,
} from "@/lib/campaign-status";

export function CollaborationStatusPill({ status }: { status: CollaborationStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        COLLABORATION_STATUS_TONE[status],
      )}
    >
      {COLLABORATION_STATUS_LABEL[status]}
    </span>
  );
}

export function CampaignStatusPill({ status }: { status: CampaignStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        CAMPAIGN_STATUS_TONE[status],
      )}
    >
      {CAMPAIGN_STATUS_LABEL[status]}
    </span>
  );
}

export function PayoutStatusPill({ status }: { status: PayoutStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        PAYOUT_STATUS_TONE[status],
      )}
    >
      {PAYOUT_STATUS_LABEL[status]}
    </span>
  );
}
