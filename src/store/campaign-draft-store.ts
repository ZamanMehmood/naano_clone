import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CampaignObjective } from "@/data/types";

export const BUILDER_STEPS = ["objective", "creators", "brief", "tracking", "review"] as const;
export type BuilderStep = (typeof BUILDER_STEPS)[number];

interface CampaignDraftState {
  step: BuilderStep;
  campaignName: string;
  objective: CampaignObjective | null;
  targetAudience: string;
  keyMessages: string[];
  creatorIds: string[];
  brief: string | null;
  launched: boolean;

  setStep: (step: BuilderStep) => void;
  setCampaignName: (name: string) => void;
  setObjective: (objective: CampaignObjective) => void;
  setTargetAudience: (audience: string) => void;
  setKeyMessages: (messages: string[]) => void;
  seedCreatorsIfEmpty: (ids: string[]) => void;
  toggleCreator: (id: string) => void;
  removeCreator: (id: string) => void;
  setBrief: (brief: string) => void;
  markLaunched: () => void;
  reset: () => void;
}

const initialState = {
  step: "objective" as BuilderStep,
  campaignName: "",
  objective: null as CampaignObjective | null,
  targetAudience: "",
  keyMessages: [] as string[],
  creatorIds: [] as string[],
  brief: null as string | null,
  launched: false,
};

export const useCampaignDraftStore = create<CampaignDraftState>()(
  persist(
    (set) => ({
      ...initialState,

      setStep: (step) => set({ step }),
      setCampaignName: (campaignName) => set({ campaignName }),
      setObjective: (objective) => set({ objective }),
      setTargetAudience: (targetAudience) => set({ targetAudience }),
      setKeyMessages: (keyMessages) => set({ keyMessages }),
      seedCreatorsIfEmpty: (ids) =>
        set((s) => (s.creatorIds.length > 0 ? s : { creatorIds: ids })),
      toggleCreator: (id) =>
        set((s) => ({
          creatorIds: s.creatorIds.includes(id)
            ? s.creatorIds.filter((c) => c !== id)
            : [...s.creatorIds, id],
        })),
      removeCreator: (id) => set((s) => ({ creatorIds: s.creatorIds.filter((c) => c !== id) })),
      setBrief: (brief) => set({ brief }),
      markLaunched: () => set({ launched: true }),
      reset: () => set(initialState),
    }),
    { name: "naano-campaign-draft" },
  ),
);
