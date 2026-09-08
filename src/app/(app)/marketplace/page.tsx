import { Suspense } from "react";
import { PageHeader } from "@/components/shell/page-header";
import { MarketplaceView } from "@/components/marketplace/marketplace-view";
import { CreatorGridSkeleton } from "@/components/marketplace/creator-grid-skeleton";

export default function MarketplacePage() {
  return (
    <div>
      <PageHeader title="Marketplace" description="Browse, filter, and shortlist LinkedIn creators." />
      <Suspense fallback={<div className="px-4 py-6 sm:px-6 lg:px-8"><CreatorGridSkeleton /></div>}>
        <MarketplaceView />
      </Suspense>
    </div>
  );
}
