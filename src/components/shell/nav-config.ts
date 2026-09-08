import type { LucideIcon } from "lucide-react";
import { BarChart3, Megaphone, Settings, Store, Wallet } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Marketplace", href: "/marketplace", icon: Store },
  { label: "Campaigns", href: "/campaigns", icon: Megaphone },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Payouts", href: "/payouts", icon: Wallet },
  { label: "Settings", href: "/settings", icon: Settings },
];
