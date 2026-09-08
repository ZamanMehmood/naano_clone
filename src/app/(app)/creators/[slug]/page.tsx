import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shell/page-header";
import { getCreatorBySlug } from "@/data/creators";

export default async function CreatorProfilePage({ params }: PageProps<"/creators/[slug]">) {
  const { slug } = await params;
  const creator = getCreatorBySlug(slug);
  if (!creator) notFound();

  return (
    <div>
      <PageHeader title={creator.name} description="Full profile coming next." />
    </div>
  );
}
