import { PageHeader } from "@/components/shell/page-header";

export default async function CampaignDetailPage({ params }: PageProps<"/campaigns/[id]">) {
  const { id } = await params;
  return (
    <div>
      <PageHeader title={`Campaign ${id}`} description="Collaboration board coming next." />
    </div>
  );
}
