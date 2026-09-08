import type { UtmParams } from "@/data/types";

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function buildUtm(campaignSlug: string, creatorSlug: string): UtmParams {
  return {
    source: "linkedin",
    medium: "sponsored-post",
    campaign: campaignSlug,
    content: creatorSlug,
  };
}

export function buildTrackingUrl(campaignSlug: string, creatorSlug: string): string {
  const utm = buildUtm(campaignSlug, creatorSlug);
  const params = new URLSearchParams({
    utm_source: utm.source,
    utm_medium: utm.medium,
    utm_campaign: utm.campaign,
    utm_content: utm.content,
  });
  return `https://trk.naano.link/${campaignSlug}/${creatorSlug}?${params.toString()}`;
}
