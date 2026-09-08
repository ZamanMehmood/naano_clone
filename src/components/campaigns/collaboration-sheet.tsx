"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { AvatarInitials } from "@/components/common/avatar-initials";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { CampaignCreator, Creator } from "@/data/types";
import { COLLABORATION_STATUSES } from "@/data/types";
import { COLLABORATION_STATUS_LABEL } from "@/lib/campaign-status";
import { formatCurrencyEUR, formatDate } from "@/lib/format";

export function CollaborationSheet({
  open,
  onOpenChange,
  row,
  creator,
  onStatusChange,
  onAddFeedback,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  row: CampaignCreator | null;
  creator: Creator | undefined;
  onStatusChange: (creatorId: string, status: CampaignCreator["status"]) => void;
  onAddFeedback: (creatorId: string, body: string) => void;
}) {
  const [draft, setDraft] = useState("");

  if (!row || !creator) return null;

  function copyLink() {
    navigator.clipboard
      .writeText(row!.trackingUrl)
      .then(() => toast.success("Tracking link copied"))
      .catch(() => toast.error("Couldn't copy link"));
  }

  function submitFeedback() {
    if (!draft.trim()) return;
    onAddFeedback(row!.creatorId, draft.trim());
    setDraft("");
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto p-6 sm:max-w-md">
        <SheetHeader className="p-0 pb-2">
          <div className="flex items-center gap-3">
            <AvatarInitials name={creator.name} size="md" />
            <div className="min-w-0">
              <SheetTitle>{creator.name}</SheetTitle>
              <SheetDescription className="truncate">{creator.headline}</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex flex-col gap-5">
          <div className="grid gap-1.5">
            <Label htmlFor="status-select">Status</Label>
            <Select
              value={row.status}
              onValueChange={(value) => onStatusChange(row.creatorId, value as CampaignCreator["status"])}
            >
              <SelectTrigger id="status-select" className="w-full">
                <SelectValue>
                  {(value: unknown) =>
                    COLLABORATION_STATUS_LABEL[value as CampaignCreator["status"]]
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {COLLABORATION_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {COLLABORATION_STATUS_LABEL[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {row.scheduledDate && (
            <p className="text-sm text-muted-foreground">
              Scheduled for <span className="font-medium text-foreground">{formatDate(row.scheduledDate)}</span>
            </p>
          )}

          <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
            <p className="text-sm font-medium">{formatCurrencyEUR(row.spendEUR)} spend</p>
            <Button variant="outline" size="sm" onClick={copyLink}>
              <Copy className="size-3.5" /> Copy tracking link
            </Button>
          </div>

          {row.draftPreview && (
            <div className="rounded-lg border border-border bg-muted/40 p-3">
              <p className="mb-1 text-xs font-medium text-muted-foreground">Draft preview</p>
              <p className="text-sm">{row.draftPreview}</p>
            </div>
          )}

          <Separator />

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">Feedback</h3>
            {row.feedback.length === 0 ? (
              <p className="text-sm text-muted-foreground">No messages yet.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {row.feedback.map((msg) => (
                  <li key={msg.id} className="flex flex-col gap-0.5 text-sm">
                    <span className="flex items-baseline gap-2">
                      <span className="font-medium">{msg.authorName}</span>
                      <span className="text-xs text-muted-foreground">{formatDate(msg.createdAt)}</span>
                    </span>
                    <span className="text-muted-foreground">{msg.body}</span>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex flex-col gap-2">
              <Textarea
                placeholder="Leave feedback for this creator..."
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={3}
              />
              <Button size="sm" className="self-end" onClick={submitFeedback} disabled={!draft.trim()}>
                <Check className="size-3.5" /> Send
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
