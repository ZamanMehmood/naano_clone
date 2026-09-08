"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AvatarInitials } from "@/components/common/avatar-initials";

const WORKSPACES = [
  { id: "acme", name: "Acme Inc", plan: "Managed" },
  { id: "north-star", name: "North Star Labs", plan: "Self-serve" },
];

export function WorkspaceSwitcher() {
  const [activeId, setActiveId] = useState(WORKSPACES[0].id);
  const active = WORKSPACES.find((w) => w.id === activeId) ?? WORKSPACES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-2 text-left text-sm shadow-sm transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          />
        }
      >
        <AvatarInitials name={active.name} size="sm" />
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium">{active.name}</span>
          <span className="block truncate text-xs text-muted-foreground">{active.plan}</span>
        </span>
        <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {WORKSPACES.map((ws) => (
          <DropdownMenuItem key={ws.id} onSelect={() => setActiveId(ws.id)} className="gap-2">
            <AvatarInitials name={ws.name} size="sm" />
            <span className="min-w-0 flex-1">
              <span className="block truncate">{ws.name}</span>
              <span className="block truncate text-xs text-muted-foreground">{ws.plan}</span>
            </span>
            {ws.id === activeId && <Check className="size-4 text-brand" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
