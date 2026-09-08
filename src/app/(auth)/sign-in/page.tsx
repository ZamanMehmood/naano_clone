import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="text-center">
      <h1 className="text-lg font-semibold">Sign in</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Full screen coming later in the build.{" "}
        <Link href="/marketplace" className="text-brand underline underline-offset-4">
          Continue to demo workspace
        </Link>
      </p>
    </div>
  );
}
