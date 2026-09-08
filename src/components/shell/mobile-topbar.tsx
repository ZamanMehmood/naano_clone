"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/shell/logo";
import { NavLinks } from "@/components/shell/nav-links";
import { WorkspaceSwitcher } from "@/components/shell/workspace-switcher";
import { UserMenu } from "@/components/shell/user-menu";
import { SearchTrigger } from "@/components/shell/search-trigger";

export function MobileTopbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex items-center justify-between gap-2 border-b border-border bg-background px-4 py-3 lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Open navigation menu" />}>
          <Menu className="size-5" />
        </SheetTrigger>
        <SheetContent side="left" className="flex w-72 flex-col gap-0 p-4">
          <SheetHeader className="p-0 pb-4">
            <SheetTitle className="sr-only">Navigation menu</SheetTitle>
            <Link href="/marketplace" onClick={() => setOpen(false)}>
              <Logo />
            </Link>
          </SheetHeader>
          <WorkspaceSwitcher />
          <SearchTrigger className="mt-3" />
          <div className="mt-4 flex-1">
            <NavLinks onNavigate={() => setOpen(false)} />
          </div>
          <div className="border-t border-border pt-3">
            <UserMenu />
          </div>
        </SheetContent>
      </Sheet>

      <Link href="/marketplace" className="lg:hidden">
        <Logo />
      </Link>

      <SearchTrigger className="max-w-40 shrink-0 sm:max-w-none" />
    </header>
  );
}
