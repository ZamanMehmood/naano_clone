"use client";

import { NICHES } from "@/data/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FOLLOWER_BOUNDS, PRICE_BOUNDS, type MarketplaceFilters } from "@/lib/filters";
import { formatCompactNumber, formatCurrencyEUR } from "@/lib/format";

const ANY = "__any__";

export function FilterRail({
  filters,
  onChange,
  onReset,
  countries,
  languages,
}: {
  filters: MarketplaceFilters;
  onChange: (patch: Partial<MarketplaceFilters>) => void;
  onReset: () => void;
  countries: string[];
  languages: string[];
}) {
  function toggleNiche(niche: string, checked: boolean) {
    onChange({
      niches: checked
        ? [...filters.niches, niche as MarketplaceFilters["niches"][number]]
        : filters.niches.filter((n) => n !== niche),
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Filters</h2>
        <Button variant="ghost" size="sm" onClick={onReset} className="h-auto px-2 py-1 text-xs">
          Reset
        </Button>
      </div>

      <fieldset className="flex flex-col gap-2.5">
        <legend className="mb-1 text-xs font-medium text-muted-foreground">Niche</legend>
        {NICHES.map((niche) => (
          <div key={niche} className="group/field-label flex items-center gap-2">
            <Checkbox
              id={`niche-${niche}`}
              checked={filters.niches.includes(niche)}
              onCheckedChange={(checked) => toggleNiche(niche, checked === true)}
            />
            <Label htmlFor={`niche-${niche}`} className="text-sm font-normal">
              {niche}
            </Label>
          </div>
        ))}
      </fieldset>

      <div className="flex flex-col gap-2">
        <Label htmlFor="filter-country" className="text-xs font-medium text-muted-foreground">
          Country
        </Label>
        <Select
          value={filters.countries[0] ?? ANY}
          onValueChange={(value) => onChange({ countries: value === ANY ? [] : [value as string] })}
        >
          <SelectTrigger id="filter-country" className="w-full">
            <SelectValue placeholder="Any country">
              {(value: unknown) => (value === ANY ? "Any country" : (value as string))}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANY}>Any country</SelectItem>
            {countries.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="filter-language" className="text-xs font-medium text-muted-foreground">
          Language
        </Label>
        <Select
          value={filters.languages[0] ?? ANY}
          onValueChange={(value) => onChange({ languages: value === ANY ? [] : [value as string] })}
        >
          <SelectTrigger id="filter-language" className="w-full">
            <SelectValue placeholder="Any language">
              {(value: unknown) => (value === ANY ? "Any language" : (value as string))}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANY}>Any language</SelectItem>
            {languages.map((l) => (
              <SelectItem key={l} value={l}>
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium text-muted-foreground">Followers</Label>
          <span className="text-xs text-muted-foreground">
            {formatCompactNumber(filters.followerRange[0])} – {formatCompactNumber(filters.followerRange[1])}
          </span>
        </div>
        <Slider
          min={FOLLOWER_BOUNDS[0]}
          max={FOLLOWER_BOUNDS[1]}
          step={1000}
          value={filters.followerRange}
          onValueChange={(value) => onChange({ followerRange: value as [number, number] })}
        />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium text-muted-foreground">Price per post</Label>
          <span className="text-xs text-muted-foreground">
            {formatCurrencyEUR(filters.priceRange[0])} – {formatCurrencyEUR(filters.priceRange[1])}
          </span>
        </div>
        <Slider
          min={PRICE_BOUNDS[0]}
          max={PRICE_BOUNDS[1]}
          step={50}
          value={filters.priceRange}
          onValueChange={(value) => onChange({ priceRange: value as [number, number] })}
        />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium text-muted-foreground">Minimum fit score</Label>
          <span className="text-xs text-muted-foreground">{filters.minFitScore}</span>
        </div>
        <Slider
          min={0}
          max={99}
          step={5}
          value={[filters.minFitScore]}
          onValueChange={(value) => onChange({ minFitScore: (value as number[])[0] })}
        />
      </div>

      <div className="group/field-label flex items-center gap-2">
        <Checkbox
          id="filter-verified"
          checked={filters.verifiedOnly}
          onCheckedChange={(checked) => onChange({ verifiedOnly: checked === true })}
        />
        <Label htmlFor="filter-verified" className="text-sm font-normal">
          Verified only
        </Label>
      </div>
    </div>
  );
}
