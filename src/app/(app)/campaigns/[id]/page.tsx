import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shell/page-header";
import { CampaignDetailView } from "@/components/campaigns/campaign-detail-view";
import { getCampaignById } from "@/data/campaigns";

export async function generateMetadata({
  params,
}: PageProps<"/campaigns/[id]">): Promise<Metadata> {
  const { id } = await params;
  const campaign = getCampaignById(id);
  if (!campaign) return {};
  return { title: campaign.name };
}

export default async function CampaignDetailPage({ params }: PageProps<"/campaigns/[id]">) {
  const { id } = await params;
  const campaign = getCampaignById(id);
  if (!campaign) notFound();

  return (
    <div>
      <PageHeader title={campaign.name} description="Per-creator collaboration status, drafts, and feedback." />
      <CampaignDetailView campaign={campaign} />
    </div>
  );
}
