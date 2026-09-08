import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCreatorBySlug } from "@/data/creators";
import { CreatorProfileView } from "@/components/marketplace/creator-profile-view";

export async function generateMetadata({
  params,
}: PageProps<"/creators/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const creator = getCreatorBySlug(slug);
  if (!creator) return {};
  return {
    title: creator.name,
    description: creator.headline,
  };
}

export default async function CreatorProfilePage({ params }: PageProps<"/creators/[slug]">) {
  const { slug } = await params;
  const creator = getCreatorBySlug(slug);
  if (!creator) notFound();

  return <CreatorProfileView creator={creator} />;
}
