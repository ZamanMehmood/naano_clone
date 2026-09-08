import Link from "next/link";

export default function MarketingPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">The B2B LinkedIn creator marketplace</h1>
      <p className="max-w-md text-muted-foreground">Full marketing page coming later in the build.</p>
      <Link href="/marketplace" className="text-brand underline underline-offset-4">
        View the demo workspace
      </Link>
    </div>
  );
}
