"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Star } from 'lucide-react';
import { navLinks, APP_NAME } from "@/lib/data";
import { Reveal } from "@/components/Reveal";

type TelemetryItem = { label: string; value: string };

export default function Footer() {
  const pathname = usePathname();
  const t = useTranslations();
  const navT = t.raw("nav") as Record<string, string>;
  const telemetry = (
    Array.isArray(t.raw("footer.telemetry")) ? t.raw("footer.telemetry") : []
  ) as TelemetryItem[];
  const legalLinks = (
    Array.isArray(t.raw("footer.legalLinks")) ? t.raw("footer.legalLinks") : []
  ) as string[];
  const visibleLinks = navLinks.filter((link) => link.href !== "/");

  const linkIsActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  const handleAnchorClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#") && pathname === "/") {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="border-t border-[#534439]/60 bg-[#140d08] text-[#f0dfd7]">
      <Reveal>
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-[4px] border border-[#f4a261]/40 bg-[#f4a261]/10 text-[#ffc499]">
                  <Star className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <span className="font-sans text-sm font-bold uppercase tracking-tight">
                  {APP_NAME}
                </span>
              </div>
              <p className="mt-4 max-w-xs font-sans text-sm leading-relaxed text-[#d8c2b5]">
                {t("footer.tagline")}
              </p>
            </div>

            <div>
              <h3 className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-[#a08d80]">
                {t("footer.telemetryHeading")}
              </h3>
              <ul className="mt-4 space-y-2">
                {telemetry.map((item, i) => (
                  <li
                    key={i}
                    className="font-mono text-xs leading-relaxed text-[#d8c2b5]"
                  >
                    <span className="text-[#a08d80]">{item.label}: </span>
                    <span className="text-[#63e0fb]">{item.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-[#a08d80]">
                {t("footer.navigationHeading")}
              </h3>
              <ul className="mt-4 space-y-2">
                {visibleLinks.map((link) => (
                  <li key={link.key}>
                    <Link
                      href={
                        link.href.startsWith("#") && pathname !== "/"
                          ? `/${link.href}`
                          : link.href
                      }
                      onClick={(e) => handleAnchorClick(e, link.href)}
                      className={`font-sans text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63e0fb] ${
                        linkIsActive(link.href)
                          ? "text-[#ffc499]"
                          : "text-[#d8c2b5] hover:text-[#f0dfd7]"
                      }`}
                    >
                      {navT[link.key] ?? link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-[#a08d80]">
                {t("footer.advisoryHeading")}
              </h3>
              <p className="mt-4 font-sans text-sm leading-relaxed text-[#d8c2b5]">
                {t("footer.advisoryText")}
              </p>
              <p className="mt-3 font-mono text-xs font-bold uppercase tracking-wide text-[#63e0fb]">
                {t("footer.systemTelemetryLabel")}
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-[#534439]/40 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-xs text-[#a08d80]">
              {t("footer.copyright")}
            </p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {legalLinks.map((label, i) => (
                <li
                  key={i}
                  className="font-mono text-xs uppercase tracking-wide text-[#a08d80]"
                >
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </footer>
  );
}