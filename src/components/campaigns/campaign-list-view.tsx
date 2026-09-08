"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampaignStatusPill } from "@/components/campaigns/status-pill";
import type { Campaign, CampaignStatus } from "@/data/types";
import { CAMPAIGN_OBJECTIVES } from "@/data/types";
import { formatCurrencyEUR, formatDate } from "@/lib/format";

type FilterTab = "all" | CampaignStatus;

const TABS: { value: FilterTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "live", label: "Live" },
  { value: "completed", label: "Completed" },
];

function objectiveLabel(objective: Campaign["objective"]): string {
  return CAMPAIGN_OBJECTIVES.find((o) => o.value === objective)?.label ?? objective;
}

export function CampaignListView({ campaigns }: { campaigns: Campaign[] }) {
  const [tab, setTab] = useState<FilterTab>("all");

  const filtered = useMemo(
    () => (tab === "all" ? campaigns : campaigns.filter((c) => c.status === tab)),
    [campaigns, tab],
  );

  return (
    <div className="flex flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={tab} onValueChange={(v) => setTab(v as FilterTab)}>
          <TabsList>
            {TABS.map((t) => (
              <TabsTrigger key={t.value} value={t.value}>
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Button render={<Link href="/campaigns/new" />} nativeButton={false}>
          <Plus className="size-4" /> New campaign
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
          No {tab} campaigns yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((campaign) => {
            const spend = campaign.creators.reduce((s, c) => s + c.spendEUR, 0);
            return (
              <Link key={campaign.id} href={`/campaigns/${campaign.id}`} className="group">
                <Card className="h-full transition-shadow group-hover:shadow-md">
                  <CardHeader className="flex flex-row items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h2 className="truncate font-semibold group-hover:underline">{campaign.name}</h2>
                      <p className="text-sm text-muted-foreground">{objectiveLabel(campaign.objective)}</p>
                    </div>
                    <CampaignStatusPill status={campaign.status} />
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    <p className="line-clamp-2 text-sm text-muted-foreground">{campaign.targetAudience}</p>
                    <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <Users className="size-4" /> {campaign.creators.length} creators
                      </span>
                      <span className="font-medium">
                        {formatCurrencyEUR(spend)}{" "}
                        <span className="font-normal text-muted-foreground">
                          / {formatCurrencyEUR(campaign.budgetEUR)}
                        </span>
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Created {formatDate(campaign.createdAt)}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
