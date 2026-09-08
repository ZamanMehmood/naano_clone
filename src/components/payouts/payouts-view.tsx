"use client";

import { FileText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PayoutStatusPill } from "@/components/campaigns/status-pill";
import type { Payout } from "@/data/types";
import { getCreatorById } from "@/data/creators";
import { getCampaignById } from "@/data/campaigns";
import { formatCurrencyEUR } from "@/lib/format";
import { summarizePayouts } from "@/lib/payouts";

export function PayoutsView({ payouts }: { payouts: Payout[] }) {
  const totals = summarizePayouts(payouts);
  const totalDue = totals.scheduled + totals.processing;

  return (
    <div className="flex flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">Total paid</p>
            <p className="mt-1 text-lg font-semibold">{formatCurrencyEUR(totals.paid)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">Processing</p>
            <p className="mt-1 text-lg font-semibold">{formatCurrencyEUR(totals.processing)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">Scheduled</p>
            <p className="mt-1 text-lg font-semibold">{formatCurrencyEUR(totals.scheduled)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">Total outstanding</p>
            <p className="mt-1 text-lg font-semibold">{formatCurrencyEUR(totalDue)}</p>
          </CardContent>
        </Card>
      </div>

      {payouts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
          No payouts yet — they appear once a creator&apos;s post is scheduled.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Creator</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Invoice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.map((payout) => {
                const creator = getCreatorById(payout.creatorId);
                const campaign = getCampaignById(payout.campaignId);
                if (!creator || !campaign) return null;
                return (
                  <TableRow key={payout.id}>
                    <TableCell className="font-medium">{creator.name}</TableCell>
                    <TableCell className="text-muted-foreground">{campaign.name}</TableCell>
                    <TableCell>{formatCurrencyEUR(payout.amountEUR)}</TableCell>
                    <TableCell>
                      <PayoutStatusPill status={payout.status} />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          toast.info("Invoices aren't wired up in this demo", {
                            description: `Would open ${payout.invoiceRef}.`,
                          })
                        }
                      >
                        <FileText className="size-3.5" /> {payout.invoiceRef}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
