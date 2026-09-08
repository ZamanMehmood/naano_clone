"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { BUILDER_STEPS, type BuilderStep } from "@/store/campaign-draft-store";

const STEP_LABELS: Record<BuilderStep, string> = {
  objective: "Objective",
  creators: "Creators",
  brief: "Brief",
  tracking: "Tracking",
  review: "Review & launch",
};

export function BuilderStepper({
  current,
  furthestIndex,
  onSelect,
}: {
  current: BuilderStep;
  furthestIndex: number;
  onSelect: (step: BuilderStep) => void;
}) {
  const currentIndex = BUILDER_STEPS.indexOf(current);

  return (
    <nav aria-label="Campaign builder steps">
      <ol className="flex flex-wrap items-center gap-2">
        {BUILDER_STEPS.map((step, i) => {
          const done = i < currentIndex;
          const active = step === current;
          const reachable = i <= furthestIndex;
          return (
            <li key={step} className="flex items-center gap-2">
              <button
                type="button"
                disabled={!reachable}
                onClick={() => onSelect(step)}
                aria-current={active ? "step" : undefined}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50",
                  active
                    ? "border-brand bg-brand/10 text-brand"
                    : done
                      ? "border-transparent bg-success/10 text-success hover:bg-success/20"
                      : "border-border text-muted-foreground hover:bg-accent",
                )}
              >
                {done ? (
                  <Check className="size-3.5" />
                ) : (
                  <span
                    className={cn(
                      "flex size-4 items-center justify-center rounded-full text-[10px]",
                      active ? "bg-brand text-primary-foreground" : "bg-muted",
                    )}
                  >
                    {i + 1}
                  </span>
                )}
                {STEP_LABELS[step]}
              </button>
              {i < BUILDER_STEPS.length - 1 && <span className="h-px w-4 bg-border" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
