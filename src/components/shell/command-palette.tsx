"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { AvatarInitials } from "@/components/common/avatar-initials";
import { creators } from "@/data/creators";
import { NAV_ITEMS } from "@/components/shell/nav-config";
import { useCommandPaletteStore } from "@/store/command-palette-store";

export function CommandPalette() {
  const open = useCommandPaletteStore((s) => s.open);
  const setOpen = useCommandPaletteStore((s) => s.setOpen);
  const toggle = useCommandPaletteStore((s) => s.toggle);
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [toggle]);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Search"
      description="Search creators and jump to a page"
    >
      <Command>
        <CommandInput placeholder="Search creators, or jump to a page..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigate">
            {NAV_ITEMS.map((item) => (
              <CommandItem key={item.href} value={item.label} onSelect={() => go(item.href)}>
                <item.icon className="size-4" />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Creators">
            {creators.slice(0, 40).map((creator) => (
              <CommandItem
                key={creator.id}
                value={`${creator.name} ${creator.headline}`}
                onSelect={() => go(`/creators/${creator.slug}`)}
              >
                <AvatarInitials name={creator.name} size="sm" className="size-6 text-[10px]" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate">{creator.name}</span>
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
