import { PageHeader } from "@/components/shell/page-header";
import { PayoutsView } from "@/components/payouts/payouts-view";
import { campaigns } from "@/data/campaigns";
import { derivePayouts } from "@/lib/payouts";

export default function PayoutsPage() {
  const payouts = derivePayouts(campaigns);
  return (
    <div>
      <PageHeader title="Payouts" description="Creator payouts across every campaign." />
      <PayoutsView payouts={payouts} />
    </div>
  );
}
