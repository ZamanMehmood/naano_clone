import type {
  Campaign,
  CampaignCreator,
  CollaborationStatus,
  FeedbackMessage,
  PostPerformance,
} from "./types";
import { creators } from "./creators";
import {
  CAMPAIGN_SEEDS,
  CLIENT_FEEDBACK_LINES,
  CREATOR_FEEDBACK_LINES,
} from "./campaign-bank";
import { createRng, hashSeed, pick, pickN, randFloat, randInt, weightedPick } from "./rng";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function daysAgoIso(days: number): string {
  return new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
}

function conversionRateFor(objective: string): [number, number] {
  if (objective === "leads") return [0.06, 0.14];
  if (objective === "product_launch") return [0.04, 0.1];
  return [0.02, 0.06];
}

function buildFeedback(
  rng: () => number,
  count: number,
  createdFrom: number,
): FeedbackMessage[] {
  const messages: FeedbackMessage[] = [];
  for (let i = 0; i < count; i++) {
    const isClient = i % 2 === 0;
    messages.push({
      id: `fb-${createdFrom}-${i}`,
      author: isClient ? "client" : "creator",
      authorName: isClient ? "You" : "Creator",
      body: isClient ? pick(rng, CLIENT_FEEDBACK_LINES) : pick(rng, CREATOR_FEEDBACK_LINES),
      createdAt: daysAgoIso(randInt(rng, 1, createdFrom)),
    });
  }
  return messages;
}

function buildCampaign(index: number): Campaign {
  const seed = CAMPAIGN_SEEDS[index];
  const rng = createRng(hashSeed(`naano-campaign-${index}`));
  const slug = slugify(seed.name);

  const eligible = creators.filter((c) => c.niches.some((n) => seed.niches.includes(n)));
  const pool = eligible.length >= seed.creatorCount ? eligible : creators;
  const picked = pickN(rng, pool, seed.creatorCount);

  const createdAt = daysAgoIso(seed.daysAgoCreated);
  const launchedAt =
    seed.status !== "draft" ? daysAgoIso(Math.max(1, seed.daysAgoCreated - randInt(rng, 2, 5))) : undefined;
  const completedAt = seed.status === "completed" ? daysAgoIso(randInt(rng, 1, 6)) : undefined;

  const [convMin, convMax] = conversionRateFor(seed.objective);

  const campaignCreators: CampaignCreator[] = [];
  const performance: PostPerformance[] = [];

  picked.forEach((creator, i) => {
    let status: CollaborationStatus;
    if (seed.status === "draft") {
      status = weightedPick(rng, [
        ["invited", 55],
        ["accepted", 45],
      ] as [CollaborationStatus, number][]);
    } else if (seed.status === "live") {
      status = weightedPick(rng, [
        ["accepted", 15],
        ["draft_submitted", 25],
        ["scheduled", 25],
        ["live", 35],
      ] as [CollaborationStatus, number][]);
    } else {
      status = "paid";
    }

    const scheduledDate =
      status === "scheduled" || status === "live" || status === "paid"
        ? daysAgoIso(status === "scheduled" ? -randInt(rng, 1, 10) : randInt(rng, 1, seed.daysAgoCreated))
        : undefined;

    const draftPreview =
      status === "draft_submitted" || status === "scheduled" || status === "live" || status === "paid"
        ? `${creator.headline.split(" — ")[0]}. ${creator.bio.slice(0, 110)}...`
        : undefined;

    const feedbackCount =
      status === "invited" ? 0 : status === "accepted" ? randInt(rng, 0, 1) : randInt(rng, 1, 3);

    const utm = {
      source: "linkedin",
      medium: "sponsored-post",
      campaign: slug,
      content: creator.slug,
    };
    const trackingUrl = `https://trk.naano.link/${slug}/${creator.slug}?utm_source=${utm.source}&utm_medium=${utm.medium}&utm_campaign=${utm.campaign}&utm_content=${utm.content}`;

    campaignCreators.push({
      creatorId: creator.id,
      status,
      scheduledDate,
      draftPreview,
      feedback: buildFeedback(rng, feedbackCount, seed.daysAgoCreated),
      trackingUrl,
      utm,
      spendEUR: creator.pricePerPostEUR,
    });

    if (status === "live" || status === "paid") {
      const postCount = status === "paid" && rng() < 0.3 ? 2 : 1;
      for (let p = 0; p < postCount; p++) {
        const impressions = Math.max(
          400,
          Math.round(creator.avgImpressions * randFloat(rng, 0.7, 1.4)),
        );
        const clicks = Math.max(
          2,
          Math.round((impressions / creator.avgImpressions) * creator.avgClicksPerPost),
        );
        const leads = Math.max(0, Math.round(clicks * randFloat(rng, convMin, convMax)));
        performance.push({
          id: `perf-${index}-${i}-${p}`,
          creatorId: creator.id,
          postedAt: daysAgoIso(randInt(rng, 1, Math.max(2, seed.daysAgoCreated - 2))),
          impressions,
          clicks,
          leads,
        });
      }
    }
  });

  const budgetEUR =
    Math.round((campaignCreators.reduce((s, c) => s + c.spendEUR, 0) * randFloat(rng, 1.08, 1.25)) / 50) * 50;

  return {
    id: `campaign-${index}`,
    slug,
    name: seed.name,
    status: seed.status,
    objective: seed.objective,
    targetAudience: seed.targetAudience,
    keyMessages: seed.keyMessages,
    budgetEUR,
    createdAt,
    launchedAt,
    completedAt,
    creators: campaignCreators,
    performance,
  };
}

export const campaigns: Campaign[] = CAMPAIGN_SEEDS.map((_, i) => buildCampaign(i));

export function getCampaignBySlug(slug: string): Campaign | undefined {
  return campaigns.find((c) => c.slug === slug);
}

export function getCampaignById(id: string): Campaign | undefined {
  return campaigns.find((c) => c.id === id);
}
