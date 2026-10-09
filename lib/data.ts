export type NavLink = {
  key: string;
  label: string;
  href: string;
};

/**
 * Single source of truth for site navigation. Both Navbar and Footer map
 * over this array — never duplicate or spread-merge it elsewhere.
 */
export const navLinks: NavLink[] = [
  { key: "home", label: "Home", href: "/" },
  { key: "duel", label: "Duel / Play", href: "/duel" },
  { key: "howItWorks", label: "How It Works", href: "/how-it-works" },
  { key: "bounties", label: "Bounties", href: "/bounties" },
  { key: "about", label: "About", href: "/about" },
];

export const APP_NAME = "Syntax Sheriff";
export const APP_TAGLINE = "Cyber-Western Coding Duels";
export const APP_VERSION_TAG = "CYBER_WESTERN_V3.1";