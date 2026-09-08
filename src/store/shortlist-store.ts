import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ShortlistState {
  creatorIds: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  clear: () => void;
}

export const useShortlistStore = create<ShortlistState>()(
  persist(
    (set, get) => ({
      creatorIds: [],
      add: (id) =>
        set((s) => (s.creatorIds.includes(id) ? s : { creatorIds: [...s.creatorIds, id] })),
      remove: (id) => set((s) => ({ creatorIds: s.creatorIds.filter((c) => c !== id) })),
      toggle: (id) =>
        set((s) =>
          s.creatorIds.includes(id)
            ? { creatorIds: s.creatorIds.filter((c) => c !== id) }
            : { creatorIds: [...s.creatorIds, id] },
        ),
      has: (id) => get().creatorIds.includes(id),
      clear: () => set({ creatorIds: [] }),
    }),
    { name: "naano-shortlist" },
  ),
);
