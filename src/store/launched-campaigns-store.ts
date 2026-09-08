import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Campaign } from "@/data/types";

interface LaunchedCampaignsState {
  campaigns: Campaign[];
  add: (campaign: Campaign) => void;
  getById: (id: string) => Campaign | undefined;
}

export const useLaunchedCampaignsStore = create<LaunchedCampaignsState>()(
  persist(
    (set, get) => ({
      campaigns: [],
      add: (campaign) => set((s) => ({ campaigns: [campaign, ...s.campaigns] })),
      getById: (id) => get().campaigns.find((c) => c.id === id),
    }),
    { name: "naano-launched-campaigns" },
  ),
);
