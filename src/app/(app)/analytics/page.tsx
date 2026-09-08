import { PageHeader } from "@/components/shell/page-header";

export default function AnalyticsPage() {
  return (
    <div>
      <PageHeader title="Analytics" description="Attribution across every live and completed campaign." />
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">Coming next: pipeline over time, funnel, and per-post table.</p>
      </div>
    </div>
  );
}
