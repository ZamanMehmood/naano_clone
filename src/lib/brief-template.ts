import type { CampaignObjective, Niche } from "@/data/types";
import { CAMPAIGN_OBJECTIVES } from "@/data/types";

export interface BriefInput {
  campaignName: string;
  objective: CampaignObjective;
  targetAudience: string;
  keyMessages: string[];
  niches: Niche[];
}

const OBJECTIVE_TONE: Record<CampaignObjective, string> = {
  awareness:
    "Write to be remembered, not clicked. Lead with a strong opinion or a surprising number — save the product mention for a soft close, if at all.",
  leads:
    "Write to earn a click. Every post needs one clear, specific ask, and the tracking link belongs in the first comment, not buried in paragraph three.",
  product_launch:
    "Write like you're personally excited, not like you're reading a press release. Name what's actually new and who it's for — skip the feature list.",
};

const OBJECTIVE_CTA: Record<CampaignObjective, string> = {
  awareness: "Invite a reply or a share — a comment is worth more than a click here.",
  leads: "One link, one ask: 'book a session' or 'get the guide,' never both.",
  product_launch: "Point to the waitlist or early-access link, and say what happens after they click it.",
};

const NICHE_DOS: Partial<Record<Niche, string>> = {
  AI: "Ground any AI claim in a specific workflow or number — 'saved us 6 hours a week' beats 'powered by AI.'",
  SaaS: "Anchor on a before/after metric your audience already tracks (activation, churn, time-to-value).",
  Sales: "Use real rep language — quota, pipeline, discovery — not marketing-speak.",
  GTM: "Frame it as a decision your audience is already wrestling with, not a category announcement.",
  Marketing: "Show the artifact (the post, the email, the dashboard) — marketers trust what they can see.",
  Fintech: "Be precise about compliance/security claims — vague reassurance reads as evasive in this audience.",
  HR: "Lead with the manager or employee outcome, not the HR-team efficiency gain.",
  Ops: "Name the tool stack or process it replaces — specificity is what makes ops audiences trust a claim.",
};

const GENERIC_DOS = [
  "Write in your own voice — sponsored posts that sound like your organic ones perform better and disclose more honestly.",
  "Use one concrete number or example. Abstractions don't stop the scroll.",
];

const DONTS = [
  "Don't use the word 'excited' more than once, and don't open with a question nobody asked.",
  "Don't hide the #ad / #sponsored disclosure — it goes in the first line, not the hashtags at the bottom.",
  "Don't post the tracking link raw. Use the link naano generates for you so clicks attribute correctly.",
];

function formatList(items: string[]): string {
  return items.map((i) => `- ${i}`).join("\n");
}

/**
 * A deterministic template engine, not an LLM: same input always produces
 * the same brief. No network call, no randomness, no streaming animation to fake.
 */
export function generateBrief(input: BriefInput): string {
  const objectiveMeta = CAMPAIGN_OBJECTIVES.find((o) => o.value === input.objective);
  const relevantDos = input.niches
    .map((n) => NICHE_DOS[n])
    .filter((d): d is string => Boolean(d));
  const dos = [...new Set([...relevantDos, ...GENERIC_DOS])].slice(0, 4);

  const sections = [
    `# Creator brief — ${input.campaignName}`,
    "",
    `**Objective:** ${objectiveMeta?.label ?? input.objective} — ${objectiveMeta?.description ?? ""}`,
    "",
    `**Audience:** ${input.targetAudience || "Not specified yet — add this in step 1."}`,
    "",
    "## Key messages",
    input.keyMessages.length > 0
      ? formatList(input.keyMessages)
      : "- Not specified yet — add at least one in step 1.",
    "",
    "## Tone",
    OBJECTIVE_TONE[input.objective],
    "",
    "## Do",
    formatList(dos),
    "",
    "## Don't",
    formatList(DONTS),
    "",
    "## Call to action",
    OBJECTIVE_CTA[input.objective],
    "",
    "## Deliverable",
    "- 1 original LinkedIn post using the tracking link from step 4, disclosed as sponsored, live within the scheduled window agreed in Campaigns.",
  ];

  return sections.join("\n");
}
