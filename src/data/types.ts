export type Niche =
  | "AI"
  | "SaaS"
  | "Sales"
  | "GTM"
  | "Marketing"
  | "Fintech"
  | "HR"
  | "Ops";

export const NICHES: Niche[] = [
  "AI",
  "SaaS",
  "Sales",
  "GTM",
  "Marketing",
  "Fintech",
  "HR",
  "Ops",
];

export type Availability = "available" | "limited" | "booked";

export interface AudienceBreakdownItem {
  label: string;
  pct: number;
}

export interface SamplePost {
  id: string;
  excerpt: string;
  postedAt: string;
  impressions: number;
  clicks: number;
  likes: number;
  comments: number;
  engagementRate: number;
}

export interface Creator {
  id: string;
  slug: string;
  name: string;
  headline: string;
  bio: string;
  niches: Niche[];
  followers: number;
  country: string;
  countryCode: string;
  languages: string[];
  avgImpressions: number;
  avgEngagementRate: number;
  avgClicksPerPost: number;
  pricePerPostEUR: number;
  audienceFitScore: number;
  verified: boolean;
  availability: Availability;
  audience: {
    roles: AudienceBreakdownItem[];
    seniority: AudienceBreakdownItem[];
    geography: AudienceBreakdownItem[];
  };
  samplePosts: SamplePost[];
}

export type CampaignStatus = "draft" | "live" | "completed";
export type CampaignObjective = "awareness" | "leads" | "product_launch";

export const CAMPAIGN_OBJECTIVES: {
  value: CampaignObjective;
  label: string;
  description: string;
}[] = [
  {
    value: "awareness",
    label: "Awareness",
    description: "Get in front of a new audience and build category recognition.",
  },
  {
    value: "leads",
    label: "Leads",
    description: "Drive qualified clicks that convert into pipeline.",
  },
  {
    value: "product_launch",
    label: "Product launch",
    description: "Announce something new to an audience that already trusts the creator.",
  },
];

export type CollaborationStatus =
  | "invited"
  | "accepted"
  | "draft_submitted"
  | "scheduled"
  | "live"
  | "paid";

export const COLLABORATION_STATUSES: CollaborationStatus[] = [
  "invited",
  "accepted",
  "draft_submitted",
  "scheduled",
  "live",
  "paid",
];

export type PayoutStatus = "scheduled" | "processing" | "paid";

export interface FeedbackMessage {
  id: string;
  author: "client" | "creator";
  authorName: string;
  body: string;
  createdAt: string;
}

export interface UtmParams {
  source: string;
  medium: string;
  campaign: string;
  content: string;
}

export interface CampaignCreator {
  creatorId: string;
  status: CollaborationStatus;
  scheduledDate?: string;
  draftPreview?: string;
  feedback: FeedbackMessage[];
  trackingUrl: string;
  utm: UtmParams;
  spendEUR: number;
}

export interface PostPerformance {
  id: string;
  creatorId: string;
  postedAt: string;
  impressions: number;
  clicks: number;
  leads: number;
}

export interface Payout {
  id: string;
  creatorId: string;
  campaignId: string;
  amountEUR: number;
  status: PayoutStatus;
  invoiceRef: string;
}

export interface Campaign {
  id: string;
  slug: string;
  name: string;
  status: CampaignStatus;
  objective: CampaignObjective;
  targetAudience: string;
  keyMessages: string[];
  budgetEUR: number;
  createdAt: string;
  launchedAt?: string;
  completedAt?: string;
  brief?: string;
  creators: CampaignCreator[];
  performance: PostPerformance[];
}
