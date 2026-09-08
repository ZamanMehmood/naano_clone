import { PageHeader } from "@/components/shell/page-header";
import { AnalyticsView } from "@/components/analytics/analytics-view";
import { campaigns } from "@/data/campaigns";

export default function AnalyticsPage() {
  return (
    <div>
      <PageHeader title="Analytics" description="Attribution across every live and completed campaign." />
      <AnalyticsView campaigns={campaigns} />
    </div>
  );
}
