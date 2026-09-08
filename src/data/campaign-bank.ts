import type { CampaignObjective, Niche } from "./types";

export interface CampaignSeed {
  name: string;
  status: "draft" | "live" | "completed";
  objective: CampaignObjective;
  targetAudience: string;
  keyMessages: string[];
  niches: Niche[];
  creatorCount: number;
  daysAgoCreated: number;
}

export const CAMPAIGN_SEEDS: CampaignSeed[] = [
  {
    name: "Q3 Enterprise Awareness Push",
    status: "completed",
    objective: "awareness",
    targetAudience: "VP and C-level buyers at 500+ employee B2B companies evaluating category alternatives",
    keyMessages: [
      "We're the category leader trusted by enterprise teams, not just startups",
      "Switching costs less than staying with a legacy vendor",
      "Security and compliance are table stakes, not an afterthought",
    ],
    niches: ["SaaS", "GTM", "Ops"],
    creatorCount: 7,
    daysAgoCreated: 96,
  },
  {
    name: "Series B Launch — Copilot for RevOps",
    status: "completed",
    objective: "product_launch",
    targetAudience: "RevOps and Sales leaders at Series A-C SaaS companies",
    keyMessages: [
      "Copilot for RevOps ships today, backed by our Series B",
      "Built by operators who lived the pipeline reporting problem",
      "Free for the first 90 days for early adopters",
    ],
    niches: ["Sales", "SaaS", "AI"],
    creatorCount: 6,
    daysAgoCreated: 70,
  },
  {
    name: "Pipeline Sprint: Fintech ICP",
    status: "live",
    objective: "leads",
    targetAudience: "Heads of Finance and Compliance at fintech and banking-as-a-service companies",
    keyMessages: [
      "Cut regulatory reporting time from weeks to days",
      "Built for teams that can't afford a compliance miss",
      "Book a working session, not a generic demo",
    ],
    niches: ["Fintech", "Ops"],
    creatorCount: 5,
    daysAgoCreated: 34,
  },
  {
    name: "HR Platform Category Launch",
    status: "live",
    objective: "awareness",
    targetAudience: "Heads of People and HRBPs at 100-2000 employee companies",
    keyMessages: [
      "Performance management that managers actually use",
      "One platform instead of four disconnected HR tools",
      "Built with input from 200+ People teams",
    ],
    niches: ["HR", "Ops"],
    creatorCount: 6,
    daysAgoCreated: 21,
  },
  {
    name: "AI Feature Launch: Inbox Copilot",
    status: "draft",
    objective: "product_launch",
    targetAudience: "Marketing and demand gen leaders exploring AI-assisted workflows",
    keyMessages: [
      "Inbox Copilot drafts on-brand replies in your voice, not a generic one",
      "Ships inside the product you already pay for",
      "Early access opens to waitlist first",
    ],
    niches: ["AI", "Marketing"],
    creatorCount: 5,
    daysAgoCreated: 6,
  },
  {
    name: "Renewal Season: Ops Suite Expansion",
    status: "draft",
    objective: "leads",
    targetAudience: "Ops leaders at existing customers with expansion potential, plus lookalike prospects",
    keyMessages: [
      "Teams using the full suite renew at 94%, not 71%",
      "See the workflow, not just the feature list",
      "Talk to a peer who made the switch, not just a rep",
    ],
    niches: ["Ops", "GTM"],
    creatorCount: 4,
    daysAgoCreated: 2,
  },
];

export const CLIENT_FEEDBACK_LINES = [
  "This is strong — can we pull the hook up into the first line?",
  "Love the specificity here. Ship it as-is.",
  "Can we swap the stat in paragraph two for the Q2 number instead?",
  "This reads a little salesy for your voice — mind softening the CTA?",
  "Perfect, this is exactly the angle we discussed on the call.",
];

export const CREATOR_FEEDBACK_LINES = [
  "Updated the opening line — let me know if that lands better.",
  "Swapped the stat, also tightened the CTA a bit. New draft above.",
  "Good call, done. Posting this Thursday morning as planned.",
  "Appreciate the note — I softened it and kept the rest as-is.",
  "Draft updated. This one's been resonating well with my audience lately.",
];
