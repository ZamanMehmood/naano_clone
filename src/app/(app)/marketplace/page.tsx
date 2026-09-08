import { PageHeader } from "@/components/shell/page-header";

export default function MarketplacePage() {
  return (
    <div>
      <PageHeader title="Marketplace" description="Browse, filter, and shortlist LinkedIn creators." />
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">Coming next: filters, search, sort, and creator cards.</p>
      </div>
    </div>
  );
}
