import {
  Dumbbell,
  House,
  MessageCircleQuestion,
  Mic,
  UserRound,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

/** Main app sections. Used by both the desktop sidebar and the mobile bottom bar. */
export const NAV_ITEMS: NavItem[] = [
  { href: "/learn", label: "Learn", icon: House },
  { href: "/practice", label: "Practice", icon: Dumbbell },
  { href: "/speak", label: "Speak", icon: Mic },
  { href: "/tutor", label: "Tutor", icon: MessageCircleQuestion },
  { href: "/profile", label: "Profile", icon: UserRound },
];
