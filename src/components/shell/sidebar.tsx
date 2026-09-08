import Link from "next/link";
import { Logo } from "@/components/shell/logo";
import { NavLinks } from "@/components/shell/nav-links";
import { WorkspaceSwitcher } from "@/components/shell/workspace-switcher";
import { UserMenu } from "@/components/shell/user-menu";
import { SearchTrigger } from "@/components/shell/search-trigger";

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-sidebar px-3 py-4 lg:flex">
      <Link href="/marketplace" className="px-1.5 pb-4">
        <Logo />
      </Link>

      <WorkspaceSwitcher />

      <SearchTrigger className="mt-3" />

      <div className="mt-4 flex-1">
        <NavLinks />
      </div>

      <div className="border-t border-border pt-3">
        <UserMenu />
      </div>
    </aside>
  );
}
