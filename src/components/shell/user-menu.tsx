"use client";

import Link from "next/link";
import { LifeBuoy, LogOut, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AvatarInitials } from "@/components/common/avatar-initials";

const DEMO_USER = { name: "Jordan Kim", role: "Campaign Manager", email: "jordan@acme.example" };

export function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          />
        }
      >
        <AvatarInitials name={DEMO_USER.name} size="sm" />
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium">{DEMO_USER.name}</span>
          <span className="block truncate text-xs text-muted-foreground">{DEMO_USER.role}</span>
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>
          <span className="block truncate font-medium">{DEMO_USER.name}</span>
          <span className="block truncate text-xs font-normal text-muted-foreground">
            {DEMO_USER.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/settings" />}>
          <Settings className="size-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/marketing" />}>
          <LifeBuoy className="size-4" />
          Marketing site
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/sign-in" />}>
          <LogOut className="size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
