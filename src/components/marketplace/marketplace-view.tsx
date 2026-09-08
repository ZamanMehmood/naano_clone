"use client";

import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { creators as allCreators } from "@/data/creators";
import { filterCreators, sortCreators } from "@/lib/filters";
import { useMarketplaceFilters } from "@/components/marketplace/use-marketplace-filters";
import { FilterRail } from "@/components/marketplace/filter-rail";
import { MarketplaceToolbar } from "@/components/marketplace/marketplace-toolbar";
import { CreatorCard } from "@/components/marketplace/creator-card";
import { CreatorGridSkeleton } from "@/components/marketplace/creator-grid-skeleton";
import { EmptyState } from "@/components/marketplace/empty-state";
import { Pagination } from "@/components/marketplace/pagination";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useShortlistStore } from "@/store/shortlist-store";

const PAGE_SIZE = 12;

const COUNTRIES = Array.from(new Set(allCreators.map((c) => c.country))).sort();
const LANGUAGES = Array.from(new Set(allCreators.flatMap((c) => c.languages))).sort();

export function MarketplaceView() {
  const { filters, setFilters, resetFilters, sort, setSort, page, setPage } =
    useMarketplaceFilters();
  const [loading, setLoading] = useState(true);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const shortlist = useShortlistStore((s) => s.creatorIds);
  const addToShortlist = useShortlistStore((s) => s.add);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => sortCreators(filterCreators(allCreators, filters), sort), [filters, sort]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function handleQuickAdd(creatorId: string, name: string) {
    addToShortlist(creatorId);
    toast.success(`${name} added to campaign`, {
      description: "Continue building your shortlist, or start a campaign from Campaigns.",
    });
  }

  const filterRailProps = {
    filters,
    onChange: setFilters,
    onReset: resetFilters,
    countries: COUNTRIES,
    languages: LANGUAGES,
  };

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex gap-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <FilterRail {...filterRailProps} />
        </aside>

        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex items-center gap-2">
            <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
              <SheetTrigger
                render={<Button variant="outline" size="sm" className="lg:hidden" />}
              >
                <SlidersHorizontal className="size-4" />
                Filters
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto p-4">
                <SheetHeader className="sr-only">
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <FilterRail {...filterRailProps} />
              </SheetContent>
            </Sheet>
            <div className="min-w-0 flex-1">
              <MarketplaceToolbar
                query={filters.query}
                onQueryChange={(query) => setFilters({ query })}
                sort={sort}
                onSortChange={setSort}
                resultCount={filtered.length}
              />
            </div>
          </div>

          {loading ? (
            <CreatorGridSkeleton />
          ) : filtered.length === 0 ? (
            <EmptyState onReset={resetFilters} />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {pageItems.map((creator) => (
                  <CreatorCard
                    key={creator.id}
                    creator={creator}
                    added={shortlist.includes(creator.id)}
                    onQuickAdd={(c) => handleQuickAdd(c.id, c.name)}
                  />
                ))}
              </div>
              <Pagination page={safePage} pageCount={pageCount} onPageChange={setPage} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
