import type { Availability, Creator, Niche, SamplePost } from "./types";
import { NICHES } from "./types";
import {
  COUNTRIES,
  FIRST_NAMES,
  HEADLINE_TEMPLATES,
  LAST_NAMES,
  NICHE_COMPANIES,
  NICHE_POST_HOOKS,
  NICHE_TOPICS,
} from "./name-bank";
import { createRng, hashSeed, pick, pickN, randFloat, randInt, weightedPick } from "./rng";

const CREATOR_COUNT = 60;

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizePcts(items: { label: string; pct: number }[]): { label: string; pct: number }[] {
  const total = items.reduce((s, i) => s + i.pct, 0);
  const scaled = items.map((i) => ({ label: i.label, pct: Math.round((i.pct / total) * 100) }));
  const diff = 100 - scaled.reduce((s, i) => s + i.pct, 0);
  scaled[0].pct += diff;
  return scaled;
}

const ROLE_POOL = ["Marketing", "Sales", "Founder / CEO", "Product", "Engineering", "Operations", "HR", "Finance"];
const SENIORITY_POOL = ["Individual contributor", "Manager", "Director", "VP", "C-level"];

function buildCreator(index: number): Creator {
  const seed = hashSeed(`naano-creator-${index}`);
  const rng = createRng(seed);

  const firstName = pick(rng, FIRST_NAMES);
  const lastName = pick(rng, LAST_NAMES);
  const name = `${firstName} ${lastName}`;

  const primaryNiche = pick(rng, NICHES);
  const hasSecondNiche = rng() < 0.45;
  const secondNiche = hasSecondNiche
    ? pick(rng, NICHES.filter((n) => n !== primaryNiche))
    : null;
  const niches: Niche[] = secondNiche ? [primaryNiche, secondNiche] : [primaryNiche];

  const country = pick(rng, COUNTRIES);
  const languages = rng() < 0.2 && !country.languages.includes("English")
    ? [...country.languages]
    : country.languages;

  const followerTier = weightedPick(rng, [
    ["micro", 30],
    ["mid", 35],
    ["large", 25],
    ["mega", 10],
  ] as [string, number][]);
  const followerRanges: Record<string, [number, number]> = {
    micro: [1000, 10000],
    mid: [10000, 50000],
    large: [50000, 150000],
    mega: [150000, 500000],
  };
  const [fMin, fMax] = followerRanges[followerTier];
  const followers = randInt(rng, fMin, fMax);
  const followerFraction = followers / 500000;

  const reachMultiplier = randFloat(rng, 0.14, 0.55);
  const avgImpressions = Math.max(600, Math.round(followers * reachMultiplier));

  const engagementRate = Math.max(
    1.1,
    Number((randFloat(rng, 2.2, 9.2) - followerFraction * 2.4).toFixed(1)),
  );

  const ctrPct = Math.max(0.25, randFloat(rng, 0.4, 2.4) - followerFraction * 0.6);
  const avgClicksPerPost = Math.max(3, Math.round((avgImpressions * ctrPct) / 100));

  const nicheFactor: Record<Niche, number> = {
    AI: 1.2,
    Fintech: 1.15,
    SaaS: 1.05,
    GTM: 1.0,
    Sales: 0.95,
    Marketing: 0.95,
    HR: 0.88,
    Ops: 0.9,
  };
  const priceBase = 130 + followerFraction * 4300 * nicheFactor[primaryNiche];
  const pricePerPostEUR = Math.round((priceBase * randFloat(rng, 0.85, 1.18)) / 5) * 5;

  const verified = rng() < 0.35 + followerFraction * 0.5;

  const audienceFitScore = Math.min(
    99,
    Math.max(40, Math.round(48 + engagementRate * 3.2 + (verified ? 7 : 0) + randInt(rng, -8, 8))),
  );

  const availability: Availability = weightedPick(rng, [
    ["available", 58],
    ["limited", 32],
    ["booked", 10],
  ] as [Availability, number][]);

  const topic = pick(rng, NICHE_TOPICS[primaryNiche]);
  const company = pick(rng, NICHE_COMPANIES[primaryNiche]);
  const headlineTemplate = pick(rng, HEADLINE_TEMPLATES[primaryNiche]);
  const headline = headlineTemplate.replace("{topic}", topic).replace("{company}", company);

  const bio = `${firstName} spent years at ${company} before going independent, and now writes for ${niches
    .join(" & ")
    .toLowerCase()} leaders about ${topic}. Based in ${country.name}, ${firstName.split(" ")[0]} publishes ${
    rng() < 0.5 ? "twice" : "three times"
  } a week and is best known for turning ${topic} into frameworks operators actually use. Posts sponsored by companies read like ${firstName}'s own thinking, not an ad — that's the reason the audience stays.`;

  const roles = normalizePcts(
    pickN(rng, ROLE_POOL, 4).map((label) => ({ label, pct: randInt(rng, 10, 40) })),
  ).sort((a, b) => b.pct - a.pct);

  const seniority = normalizePcts(
    pickN(rng, SENIORITY_POOL, 4).map((label) => ({ label, pct: randInt(rng, 10, 40) })),
  ).sort((a, b) => b.pct - a.pct);

  const otherCountries = pickN(
    rng,
    COUNTRIES.filter((c) => c.code !== country.code).map((c) => c.name),
    3,
  );
  const geography = normalizePcts(
    [
      { label: country.name, pct: randInt(rng, 30, 55) },
      ...otherCountries.map((label) => ({ label, pct: randInt(rng, 8, 22) })),
    ],
  ).sort((a, b) => b.pct - a.pct);

  const postCount = rng() < 0.4 ? 3 : 2;
  const hooks = pickN(rng, NICHE_POST_HOOKS[primaryNiche], Math.min(postCount, NICHE_POST_HOOKS[primaryNiche].length));
  const samplePosts: SamplePost[] = hooks.map((excerpt, i) => {
    const impressions = Math.max(400, Math.round(avgImpressions * randFloat(rng, 0.65, 1.45)));
    const clicks = Math.max(2, Math.round((impressions * ctrPct) / 100 * randFloat(rng, 0.75, 1.3)));
    const likeRate = randFloat(rng, engagementRate * 0.45, engagementRate * 0.85) / 100;
    const likes = Math.max(5, Math.round(impressions * likeRate));
    const comments = Math.max(1, Math.round(likes * randFloat(rng, 0.06, 0.22)));
    const daysAgo = randInt(rng, 3, 120) + i * 30;
    const postedAt = new Date(Date.now() - daysAgo * 86400000).toISOString().slice(0, 10);
    return {
      id: `${index}-post-${i}`,
      excerpt,
      postedAt,
      impressions,
      clicks,
      likes,
      comments,
      engagementRate: Number((((likes + comments) / impressions) * 100).toFixed(1)),
    };
  });

  const slugBase = slugify(name);

  return {
    id: `creator-${index}`,
    slug: slugBase,
    name,
    headline,
    bio,
    niches,
    followers,
    country: country.name,
    countryCode: country.code,
    languages,
    avgImpressions,
    avgEngagementRate: engagementRate,
    avgClicksPerPost,
    pricePerPostEUR,
    audienceFitScore,
    verified,
    availability,
    audience: { roles, seniority, geography },
    samplePosts,
  };
}

function dedupeSlugs(list: Creator[]): Creator[] {
  const seen = new Map<string, number>();
  return list.map((c) => {
    const count = seen.get(c.slug) ?? 0;
    seen.set(c.slug, count + 1);
    if (count === 0) return c;
    return { ...c, slug: `${c.slug}-${count + 1}` };
  });
}

export const creators: Creator[] = dedupeSlugs(
  Array.from({ length: CREATOR_COUNT }, (_, i) => buildCreator(i)),
);

export function getCreatorBySlug(slug: string): Creator | undefined {
  return creators.find((c) => c.slug === slug);
}

export function getCreatorById(id: string): Creator | undefined {
  return creators.find((c) => c.id === id);
}
