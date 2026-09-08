import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PerformanceRowWithContext } from "@/lib/analytics";
import { getCreatorById } from "@/data/creators";
import { formatDate, formatNumber } from "@/lib/format";

export function PerPostTable({ rows }: { rows: PerformanceRowWithContext[] }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
        No posts in this range yet.
      </div>
    );
  }

  const sorted = [...rows].sort((a, b) => b.postedAt.localeCompare(a.postedAt));

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Creator</TableHead>
            <TableHead>Campaign</TableHead>
            <TableHead className="text-right">Impressions</TableHead>
            <TableHead className="text-right">Clicks</TableHead>
            <TableHead className="text-right">Leads</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((row) => {
            const creator = getCreatorById(row.creatorId);
            return (
              <TableRow key={row.id}>
                <TableCell className="text-muted-foreground">{formatDate(row.postedAt)}</TableCell>
                <TableCell className="font-medium">{creator?.name ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground">{row.campaignName}</TableCell>
                <TableCell className="text-right tabular-nums">{formatNumber(row.impressions)}</TableCell>
                <TableCell className="text-right tabular-nums">{formatNumber(row.clicks)}</TableCell>
                <TableCell className="text-right tabular-nums">{formatNumber(row.leads)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
