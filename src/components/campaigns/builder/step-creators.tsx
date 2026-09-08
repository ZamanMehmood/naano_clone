"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { AvatarInitials } from "@/components/common/avatar-initials";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCreatorById } from "@/data/creators";
import { costPerQualifiedClick, summarizeCreatorSelection } from "@/lib/estimators";
import { formatCompactNumber, formatCurrencyEUR } from "@/lib/format";
import { useCampaignDraftStore } from "@/store/campaign-draft-store";
import { useShortlistStore } from "@/store/shortlist-store";

export function StepCreators() {
  const creatorIds = useCampaignDraftStore((s) => s.creatorIds);
  const seedCreatorsIfEmpty = useCampaignDraftStore((s) => s.seedCreatorsIfEmpty);
  const removeCreator = useCampaignDraftStore((s) => s.removeCreator);
  const shortlistIds = useShortlistStore((s) => s.creatorIds);

  useEffect(() => {
    if (shortlistIds.length > 0) seedCreatorsIfEmpty(shortlistIds);
  }, [shortlistIds, seedCreatorsIfEmpty]);

  const creators = useMemo(
    () => creatorIds.map(getCreatorById).filter((c): c is NonNullable<typeof c> => Boolean(c)),
    [creatorIds],
  );

  const totals = useMemo(() => summarizeCreatorSelection(creators), [creators]);
  const cpqc = useMemo(
    () =>
      totals.estimatedQualifiedClicks > 0
        ? totals.totalSpendEUR / totals.estimatedQualifiedClicks
        : 0,
    [totals],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">Creators</p>
            <p className="mt-1 text-lg font-semibold">{totals.creatorCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">Total spend</p>
            <p className="mt-1 text-lg font-semibold">{formatCurrencyEUR(totals.totalSpendEUR)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">Est. impressions</p>
            <p className="mt-1 text-lg font-semibold">{formatCompactNumber(totals.estimatedImpressions)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">Est. cost / qualified click</p>
            <p className="mt-1 text-lg font-semibold">{cpqc > 0 ? formatCurrencyEUR(cpqc) : "—"}</p>
          </CardContent>
        </Card>
      </div>

      {creators.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-12 text-center">
          <p className="text-sm text-muted-foreground">No creators selected yet.</p>
          <Button
            render={<Link href="/marketplace" />}
            nativeButton={false}
            variant="outline"
            size="sm"
            className="mt-3"
          >
            Browse the marketplace
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {creators.map((creator) => (
            <div
              key={creator.id}
              className="flex items-center gap-3 rounded-lg border border-border p-3"
            >
              <AvatarInitials name={creator.name} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{creator.name}</p>
                <p className="truncate text-xs text-muted-foreground">{creator.headline}</p>
              </div>
              <p className="shrink-0 text-sm font-medium">{formatCurrencyEUR(creator.pricePerPostEUR)}</p>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => removeCreator(creator.id)}
                aria-label={`Remove ${creator.name}`}
              >
                <X className="size-4" />
              </Button>
            </div>
          ))}
          <Button render={<Link href="/marketplace" />} nativeButton={false} variant="outline" size="sm" className="self-start">
            Add more creators
          </Button>
        </div>
      )}
    </div>
  );
}
