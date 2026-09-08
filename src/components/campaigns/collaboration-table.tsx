"use client";

import { AvatarInitials } from "@/components/common/avatar-initials";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CollaborationStatusPill } from "@/components/campaigns/status-pill";
import type { CampaignCreator, Creator } from "@/data/types";
import { formatCurrencyEUR, formatDate } from "@/lib/format";

export function CollaborationTable({
  rows,
  getCreator,
  onOpenRow,
}: {
  rows: CampaignCreator[];
  getCreator: (creatorId: string) => Creator | undefined;
  onOpenRow: (row: CampaignCreator) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Creator</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Scheduled</TableHead>
            <TableHead>Spend</TableHead>
            <TableHead>Feedback</TableHead>
            <TableHead className="sr-only">Open</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const creator = getCreator(row.creatorId);
            if (!creator) return null;
            return (
              <TableRow key={row.creatorId}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <AvatarInitials name={creator.name} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate font-medium">{creator.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{creator.headline}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <CollaborationStatusPill status={row.status} />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {row.scheduledDate ? formatDate(row.scheduledDate) : "—"}
                </TableCell>
                <TableCell className="text-sm font-medium">{formatCurrencyEUR(row.spendEUR)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {row.feedback.length > 0 ? `${row.feedback.length} message${row.feedback.length > 1 ? "s" : ""}` : "—"}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => onOpenRow(row)}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
