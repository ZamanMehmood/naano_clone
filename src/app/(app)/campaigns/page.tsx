import { PageHeader } from "@/components/shell/page-header";

export default function CampaignsPage() {
  return (
    <div>
      <PageHeader title="Campaigns" description="Manage your campaigns from brief to payout." />
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">Coming next: campaign list and the builder.</p>
      </div>
    </div>
  );
}
