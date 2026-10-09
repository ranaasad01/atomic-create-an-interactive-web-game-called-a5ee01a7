"use client";
import { MouseEvent, useState } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Menu, X, Bell, Settings } from 'lucide-react';
import { navLinks, APP_NAME, APP_VERSION_TAG } from "@/lib/data";

export default function Navbar() {
  const pathname = usePathname();
  const t = useTranslations();
  const navT = t.raw("nav") as Record<string, string>;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  const linkIsActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  const handleAnchorClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#") && pathname === "/") {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const visibleLinks = navLinks.filter((link) => link.href !== "/");

  return (
    <header className="sticky top-0 z-50 border-b border-[#534439]/60 bg-[#19120d]/92 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5 rounded-[4px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63e0fb]"
        >
          <motion.span
            initial={{ rotate: -15, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-[#f4a261]/40 bg-[#f4a261]/10 text-[#ffc499]"
          >
            <Star className="h-4 w-4" aria-hidden="true" />
          </motion.span>
          <span className="flex flex-col leading-none">
            <span className="font-sans text-base font-bold uppercase tracking-tight text-[#f0dfd7] transition-colors group-hover:text-[#ffc499]">
              {APP_NAME}
            </span>
            <span className="hidden font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#a08d80] sm:block">
              [{APP_VERSION_TAG}]
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {visibleLinks.map((link) => {
            const active = linkIsActive(link.href);
            return (
              <Link
                key={link.key}
                href={
                  link.href.startsWith("#") && pathname !== "/"
                    ? `/${link.href}`
                    : link.href
                }
                onClick={(e) => handleAnchorClick(e, link.href)}
                className={`font-sans text-sm font-medium uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63e0fb] ${
                  active ? "text-[#ffc499]" : "text-[#d8c2b5] hover:text-[#f0dfd7]"
                }`}
              >
                {navT[link.key] ?? link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSoundOn((v) => !v)}
            aria-label={t("navbar.soundLabel")}
            aria-pressed={soundOn}
            className={`hidden h-9 w-9 items-center justify-center rounded-[4px] border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63e0fb] sm:flex ${
              soundOn ? "border-[#63e0fb]/50 text-[#63e0fb]" : "border-[#534439] text-[#a08d80]"
            }`}
          >
            <Bell className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label={t("navbar.settingsLabel")}
            className="hidden h-9 w-9 items-center justify-center rounded-[4px] border border-[#534439] text-[#d8c2b5] transition-colors hover:border-[#f4a261]/60 hover:text-[#ffc499] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63e0fb] sm:flex"
          >
            <Settings className="h-4 w-4" aria-hidden="true" />
          </button>
          <Link
            href="/duel"
            style={{
              clipPath:
                "polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px)",
            }}
            className="hidden items-center gap-2 border border-[#f4a261] bg-[#f4a261] px-4 py-2 font-sans text-xs font-bold uppercase tracking-wider text-[#2f1400] shadow-[0_3px_0_#8a4a1f] transition-all duration-150 hover:translate-y-[1px] hover:shadow-[0_2px_0_#8a4a1f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63e0fb] md:flex"
          >
            {t("navbar.cta")}
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={t("navbar.menuLabel")}
            aria-expanded={mobileOpen}
            className="flex h-9 w-9 items-center justify-center rounded-[4px] border border-[#534439] text-[#f0dfd7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63e0fb] md:hidden"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-t border-[#534439]/60 bg-[#19120d] md:hidden"
            aria-label="Mobile"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {visibleLinks.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-[4px] px-3 py-2.5 font-sans text-sm font-medium uppercase tracking-wide transition-colors ${
                    linkIsActive(link.href)
                      ? "bg-[#f4a261]/10 text-[#ffc499]"
                      : "text-[#d8c2b5] hover:bg-[#261e19] hover:text-[#f0dfd7]"
                  }`}
                >
                  {navT[link.key] ?? link.label}
                </Link>
              ))}
              <Link
                href="/duel"
                onClick={() => setMobileOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 border border-[#f4a261] bg-[#f4a261] px-4 py-2.5 font-sans text-xs font-bold uppercase tracking-wider text-[#2f1400]"
              >
                {t("navbar.cta")}
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}