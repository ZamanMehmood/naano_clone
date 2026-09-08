import type { ReactNode } from "react";
import { DemoBanner } from "@/components/shell/demo-banner";
import { Sidebar } from "@/components/shell/sidebar";
import { MobileTopbar } from "@/components/shell/mobile-topbar";
import { CommandPalette } from "@/components/shell/command-palette";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <DemoBanner />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <MobileTopbar />
          <main className="flex-1">{children}</main>
        </div>
      </div>
      <CommandPalette />
    </div>
  );
}
