import Link from "next/link";
import { BadgeCheck, MapPin, Plus } from "lucide-react";
import { AvatarInitials } from "@/components/common/avatar-initials";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Creator } from "@/data/types";
import { formatCompactNumber, formatCurrencyEUR } from "@/lib/format";

export function CreatorCard({
  creator,
  onQuickAdd,
  added,
}: {
  creator: Creator;
  onQuickAdd?: (creator: Creator) => void;
  added?: boolean;
}) {
  return (
    <div className="group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start gap-3">
        <AvatarInitials name={creator.name} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <Link
              href={`/creators/${creator.slug}`}
              className="truncate font-semibold text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {creator.name}
            </Link>
            {creator.verified && (
              <BadgeCheck className="size-4 shrink-0 text-brand" aria-label="Verified creator" />
            )}
          </div>
          <p className="line-clamp-2 text-sm text-muted-foreground">{creator.headline}</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" />
            {creator.country}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {creator.niches.map((niche) => (
          <Badge key={niche} variant="secondary" className="font-normal">
            {niche}
          </Badge>
        ))}
      </div>

      <dl className="grid grid-cols-3 gap-2 border-t border-border pt-3 text-sm">
        <div>
          <dt className="text-xs text-muted-foreground">Followers</dt>
          <dd className="font-medium">{formatCompactNumber(creator.followers)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Avg. impr.</dt>
          <dd className="font-medium">{formatCompactNumber(creator.avgImpressions)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Fit score</dt>
          <dd className="font-medium">{creator.audienceFitScore}</dd>
        </div>
      </dl>

      <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
        <p className="text-sm font-semibold">
          {formatCurrencyEUR(creator.pricePerPostEUR)}
          <span className="ml-1 text-xs font-normal text-muted-foreground">/ post</span>
        </p>
        <Button
          size="sm"
          variant={added ? "secondary" : "default"}
          onClick={() => onQuickAdd?.(creator)}
          disabled={added}
        >
          {added ? "Added" : <><Plus className="size-4" /> Add</>}
        </Button>
      </div>
    </div>
  );
}
