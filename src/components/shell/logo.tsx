import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 font-semibold tracking-tight", className)}>
      <svg viewBox="0 0 28 28" className="size-6" aria-hidden="true">
        <rect width="28" height="28" rx="8" className="fill-brand" />
        <path
          d="M8 19V9.6h2.3l6 6.6V9.6h2.3V19h-2.3l-6-6.7V19H8Z"
          className="fill-primary-foreground"
        />
      </svg>
      <span>naano</span>
    </span>
  );
}
