import { PageHeader } from "@/components/shell/page-header";
import { CampaignListView } from "@/components/campaigns/campaign-list-view";
import { campaigns } from "@/data/campaigns";

export default function CampaignsPage() {
  return (
    <div>
      <PageHeader title="Campaigns" description="Manage your campaigns from brief to payout." />
      <CampaignListView campaigns={campaigns} />
    </div>
  );
}
