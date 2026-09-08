"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BadgeCheck, Check, MapPin, MessageCircle, Plus, ThumbsUp } from "lucide-react";
import { AvatarInitials } from "@/components/common/avatar-initials";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AudienceBarList } from "@/components/marketplace/audience-bar-list";
import type { Creator } from "@/data/types";
import { costPerClick } from "@/lib/estimators";
import {
  formatCompactNumber,
  formatCurrencyEUR,
  formatDate,
  formatPercent,
} from "@/lib/format";
import { useShortlistStore } from "@/store/shortlist-store";

const AVAILABILITY_LABEL: Record<Creator["availability"], string> = {
  available: "Available",
  limited: "Limited availability",
  booked: "Fully booked",
};

const AVAILABILITY_TONE: Record<Creator["availability"], string> = {
  available: "text-success",
  limited: "text-warning",
  booked: "text-destructive",
};

export function CreatorProfileView({ creator }: { creator: Creator }) {
  const added = useShortlistStore((s) => s.has(creator.id));
  const addToShortlist = useShortlistStore((s) => s.add);
  const router = useRouter();

  function handleAdd() {
    addToShortlist(creator.id);
    toast.success(`${creator.name} added to campaign`, {
      description: "Continue browsing, or head to Campaigns to build a brief.",
      action: {
        label: "View campaigns",
        onClick: () => router.push("/campaigns/new"),
      },
    });
  }

  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <AvatarInitials name={creator.name} size="xl" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">{creator.name}</h1>
              {creator.verified && (
                <Badge className="gap-1 bg-brand/10 text-brand hover:bg-brand/10">
                  <BadgeCheck className="size-3.5" /> Verified
                </Badge>
              )}
            </div>
            <p className="mt-1 text-muted-foreground">{creator.headline}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5" /> {creator.country}
              </span>
              <span>{creator.languages.join(", ")}</span>
              <span className={AVAILABILITY_TONE[creator.availability]}>
                {AVAILABILITY_LABEL[creator.availability]}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {creator.niches.map((niche) => (
                <Badge key={niche} variant="secondary" className="font-normal">
                  {niche}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">{creator.bio}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Audience breakdown</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div>
              <h3 className="mb-2 text-xs font-medium text-muted-foreground">By role</h3>
              <AudienceBarList items={creator.audience.roles} />
            </div>
            <div>
              <h3 className="mb-2 text-xs font-medium text-muted-foreground">By seniority</h3>
              <AudienceBarList items={creator.audience.seniority} />
            </div>
            <div>
              <h3 className="mb-2 text-xs font-medium text-muted-foreground">By geography</h3>
              <AudienceBarList items={creator.audience.geography} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sample posts</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col divide-y divide-border">
            {creator.samplePosts.map((post) => (
              <div key={post.id} className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0">
                <p className="text-sm">{post.excerpt}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span>{formatDate(post.postedAt)}</span>
                  <span>{formatCompactNumber(post.impressions)} impressions</span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="size-3" /> {formatCompactNumber(post.likes)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="size-3" /> {formatCompactNumber(post.comments)}
                  </span>
                  <span>{formatPercent(post.engagementRate)} engagement</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 lg:sticky lg:top-6 lg:self-start">
        <Card>
          <CardContent className="flex flex-col gap-4 pt-6">
            <div>
              <p className="text-2xl font-semibold">{formatCurrencyEUR(creator.pricePerPostEUR)}</p>
              <p className="text-sm text-muted-foreground">per sponsored post</p>
            </div>
            <Button size="lg" className="w-full" onClick={handleAdd} disabled={added}>
              {added ? (
                <>
                  <Check className="size-4" /> Added to campaign
                </>
              ) : (
                <>
                  <Plus className="size-4" /> Add to campaign
                </>
              )}
            </Button>
            <Separator />
            <dl className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Followers</dt>
                <dd className="font-medium">{formatCompactNumber(creator.followers)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Est. reach / post</dt>
                <dd className="font-medium">{formatCompactNumber(creator.avgImpressions)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Est. clicks / post</dt>
                <dd className="font-medium">{formatCompactNumber(creator.avgClicksPerPost)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Est. cost per click</dt>
                <dd className="font-medium">{formatCurrencyEUR(costPerClick(creator))}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Avg. engagement</dt>
                <dd className="font-medium">{formatPercent(creator.avgEngagementRate)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Audience fit</dt>
                <dd className="font-medium">{creator.audienceFitScore} / 100</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        <p className="text-center text-xs text-muted-foreground">
          Changed your mind?{" "}
          <Link href="/marketplace" className="underline underline-offset-4">
            Back to marketplace
          </Link>
        </p>
      </div>
    </div>
  );
}
