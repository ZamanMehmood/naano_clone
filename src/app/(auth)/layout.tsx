import type { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "@/components/shell/logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-8 px-4 py-12">
      <Link href="/marketplace">
        <Logo />
      </Link>
      {children}
    </div>
  );
}
