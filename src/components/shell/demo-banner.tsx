"use client";

import { useSyncExternalStore } from "react";
import { X } from "lucide-react";

const STORAGE_KEY = "naano-demo-banner-dismissed";
const CHANGE_EVENT = "naano-demo-banner-change";

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  return () => window.removeEventListener(CHANGE_EVENT, callback);
}

function getSnapshot() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function getServerSnapshot() {
  return true;
}

function dismiss() {
  try {
    window.localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* private-mode storage can throw; dismissal still applies for this tab via the event below */
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function DemoBanner() {
  const dismissed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (dismissed) return null;

  return (
    <div className="flex items-center justify-center gap-3 bg-brand px-4 py-2 text-center text-sm font-medium text-primary-foreground">
      <p>
        Demo workspace — data is sample data.{" "}
        <span className="hidden sm:inline">Nothing here is connected to a real account.</span>
      </p>
      <button
        type="button"
        aria-label="Dismiss demo workspace notice"
        onClick={dismiss}
        className="shrink-0 rounded-full p-1 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
