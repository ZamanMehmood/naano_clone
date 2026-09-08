"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CampaignStatusPill } from "@/components/campaigns/status-pill";
import { CollaborationTable } from "@/components/campaigns/collaboration-table";
import { CollaborationSheet } from "@/components/campaigns/collaboration-sheet";
import type { Campaign, CampaignCreator, CollaborationStatus } from "@/data/types";
import { CAMPAIGN_OBJECTIVES } from "@/data/types";
import { getCreatorById } from "@/data/creators";
import { COLLABORATION_STATUS_LABEL } from "@/lib/campaign-status";
import { formatCurrencyEUR, formatDate } from "@/lib/format";

function objectiveLabel(objective: Campaign["objective"]): string {
  return CAMPAIGN_OBJECTIVES.find((o) => o.value === objective)?.label ?? objective;
}

export function CampaignDetailView({ campaign }: { campaign: Campaign }) {
  const [rows, setRows] = useState<CampaignCreator[]>(campaign.creators);
  const [openCreatorId, setOpenCreatorId] = useState<string | null>(null);

  const openRow = rows.find((r) => r.creatorId === openCreatorId) ?? null;
  const spend = rows.reduce((s, r) => s + r.spendEUR, 0);

  function handleStatusChange(creatorId: string, status: CollaborationStatus) {
    setRows((prev) => prev.map((r) => (r.creatorId === creatorId ? { ...r, status } : r)));
    const creator = getCreatorById(creatorId);
    toast.success(`${creator?.name ?? "Creator"} moved to "${COLLABORATION_STATUS_LABEL[status]}"`);
  }

  function handleAddFeedback(creatorId: string, body: string) {
    setRows((prev) =>
      prev.map((r) =>
        r.creatorId === creatorId
          ? {
              ...r,
              feedback: [
                ...r.feedback,
                {
                  id: `fb-local-${Date.now()}`,
                  author: "client",
                  authorName: "You",
                  body,
                  createdAt: new Date().toISOString().slice(0, 10),
                },
              ],
            }
          : r,
      ),
    );
    toast.success("Feedback sent");
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">Status</p>
            <div className="mt-1.5">
              <CampaignStatusPill status={campaign.status} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">Budget</p>
            <p className="mt-1 text-lg font-semibold">{formatCurrencyEUR(campaign.budgetEUR)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">Committed spend</p>
            <p className="mt-1 text-lg font-semibold">{formatCurrencyEUR(spend)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">Creators</p>
            <p className="mt-1 text-lg font-semibold">{rows.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Brief</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Objective</p>
            <p className="mt-1 text-sm">{objectiveLabel(campaign.objective)}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Created</p>
            <p className="mt-1 text-sm">{formatDate(campaign.createdAt)}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs font-medium text-muted-foreground">Target audience</p>
            <p className="mt-1 text-sm">{campaign.targetAudience}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs font-medium text-muted-foreground">Key messages</p>
            <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-muted-foreground">
              {campaign.keyMessages.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-sm font-semibold">Collaboration</h2>
        <CollaborationTable
          rows={rows}
          getCreator={getCreatorById}
          onOpenRow={(row) => setOpenCreatorId(row.creatorId)}
        />
      </div>

      <CollaborationSheet
        open={openCreatorId !== null}
        onOpenChange={(open) => !open && setOpenCreatorId(null)}
        row={openRow}
        creator={openRow ? getCreatorById(openRow.creatorId) : undefined}
        onStatusChange={handleStatusChange}
        onAddFeedback={handleAddFeedback}
      />
    </div>
  );
}
