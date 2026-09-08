"use client";

import { Check, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CAMPAIGN_OBJECTIVES } from "@/data/types";
import { useCampaignDraftStore } from "@/store/campaign-draft-store";

export function StepObjective() {
  const campaignName = useCampaignDraftStore((s) => s.campaignName);
  const objective = useCampaignDraftStore((s) => s.objective);
  const targetAudience = useCampaignDraftStore((s) => s.targetAudience);
  const keyMessages = useCampaignDraftStore((s) => s.keyMessages);
  const setCampaignName = useCampaignDraftStore((s) => s.setCampaignName);
  const setObjective = useCampaignDraftStore((s) => s.setObjective);
  const setTargetAudience = useCampaignDraftStore((s) => s.setTargetAudience);
  const setKeyMessages = useCampaignDraftStore((s) => s.setKeyMessages);

  function updateMessage(i: number, value: string) {
    const next = [...keyMessages];
    next[i] = value;
    setKeyMessages(next);
  }

  function removeMessage(i: number) {
    setKeyMessages(keyMessages.filter((_, idx) => idx !== i));
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-1.5">
        <Label htmlFor="campaign-name">Campaign name</Label>
        <Input
          id="campaign-name"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
          placeholder="e.g. Q4 Enterprise Awareness Push"
        />
      </div>

      <div className="grid gap-2">
        <Label>Objective</Label>
        <div className="grid gap-3 sm:grid-cols-3">
          {CAMPAIGN_OBJECTIVES.map((opt) => {
            const active = objective === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                aria-pressed={active}
                onClick={() => setObjective(opt.value)}
                className={cn(
                  "flex flex-col gap-1 rounded-xl border p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  active ? "border-brand bg-brand/5" : "border-border hover:bg-accent",
                )}
              >
                <span className="flex items-center justify-between font-medium">
                  {opt.label}
                  {active && <Check className="size-4 text-brand" />}
                </span>
                <span className="text-sm text-muted-foreground">{opt.description}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="target-audience">Target audience</Label>
        <Textarea
          id="target-audience"
          value={targetAudience}
          onChange={(e) => setTargetAudience(e.target.value)}
          placeholder="e.g. VP and C-level buyers at 500+ employee B2B companies evaluating category alternatives"
          rows={3}
        />
      </div>

      <div className="grid gap-2">
        <Label>Key messages</Label>
        {keyMessages.length === 0 && (
          <p className="text-sm text-muted-foreground">Add the 1-3 points every creator's post should land.</p>
        )}
        <div className="flex flex-col gap-2">
          {keyMessages.map((msg, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input value={msg} onChange={(e) => updateMessage(i, e.target.value)} />
              <Button
                variant="ghost"
                size="icon-sm"
                type="button"
                onClick={() => removeMessage(i)}
                aria-label="Remove key message"
              >
                <X className="size-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          type="button"
          className="self-start"
          onClick={() => setKeyMessages([...keyMessages, ""])}
        >
          <Plus className="size-4" /> Add key message
        </Button>
      </div>
    </div>
  );
}
