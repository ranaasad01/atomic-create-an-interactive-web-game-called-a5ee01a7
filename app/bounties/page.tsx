"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Star, FileCode, GitBranch, Sparkles, Lock, Unlock, Check, X, Activity, ArrowUp, ChevronRight, type LucideIcon } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

interface BountyItem {
  id: string;
  tier: string;
  name: string;
  description: string;
  reward: string;
  requirementText: string;
  progress: number;
  earned: boolean;
}

interface LadderRung {
  tier: string;
  label: string;
  requirement: string;
  unlocked: boolean;
}

interface BadgeEntry {
  id: string;
  name: string;
  description: string;
  earned: boolean;
}

interface SummaryStat {
  id: string;
  label: string;
  value: string;
}

const BOUNTY_ICONS: Record<string, LucideIcon> = {
  "python-patrol": Star,
  "js-gunslinger": FileCode,
  "loop-wrangler": GitBranch,
  "async-outlaw": Sparkles,
};

const SUMMARY_ICONS: Record<string, LucideIcon> = {
  purse: Star,
  streak: Activity,
  rank: ArrowUp,
};

function getTierStyle(tier: string): string {
  switch (tier) {
    case "I":
      return "border-[#63e0fb]/40 bg-[#63e0fb]/10 text-[#63e0fb]";
    case "II":
      return "border-[#f1c048]/40 bg-[#f1c048]/10 text-[#f1c048]";
    case "III":
      return "border-[#f4a261]/40 bg-[#f4a261]/10 text-[#f4a261]";
    default:
      return "border-[#ffb4ab]/40 bg-[#ffb4ab]/10 text-[#ffb4ab]";
  }
}

function SegmentedBar({ progress }: { progress: number }) {
  const totalSegments = 10;
  const filled = Math.round((progress / 100) * totalSegments);
  return (
    <div className="flex gap-1" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
      {Array.from({ length: totalSegments }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-2 flex-1 rounded-sm transition-colors duration-300",
            i < filled ? "bg-[#63e0fb]" : "bg-[#3d332d]",
          )}
        />
      ))}
    </div>
  );
}

export default function BountiesPage() {
  const t = useTranslations();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const summaryStats = (
    Array.isArray(t.raw("bounties.summaryStats")) ? t.raw("bounties.summaryStats") : []
  ) as SummaryStat[];
  const items = (Array.isArray(t.raw("bounties.items")) ? t.raw("bounties.items") : []) as BountyItem[];
  const ladder = (Array.isArray(t.raw("bounties.ladder")) ? t.raw("bounties.ladder") : []) as LadderRung[];
  const badges = (Array.isArray(t.raw("bounties.badges")) ? t.raw("bounties.badges") : []) as BadgeEntry[];

  const selected = items.find((item) => item.id === selectedId) ?? null;

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setSelectedId(null);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <main className="min-h-screen bg-[#19120d] text-[#f0dfd7]">
      {/* Hero */}
      <Reveal>
        <section className="border-b border-[#534439]/60 bg-[#19120d] px-4 py-16 sm:px-8 md:py-20">
          <div className="mx-auto max-w-6xl">
            <span className="inline-block rounded-sm border border-[#ffb4ab]/40 bg-[#93000a]/20 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-[#ffb4ab]">
              {t("bounties.hero.eyebrow")}
            </span>
            <h1 className="mt-5 max-w-3xl text-balance font-[Space_Grotesk,sans-serif] text-4xl font-bold leading-[1.1] tracking-tight text-[#f0dfd7] sm:text-5xl">
              {t("bounties.hero.title")}
            </h1>
            <p className="mt-5 max-w-2xl text-pretty font-[Plus_Jakarta_Sans,sans-serif] text-base leading-relaxed text-[#d8c2b5]">
              {t("bounties.hero.subtitle")}
            </p>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {summaryStats.map((stat, i) => {
                const Icon = SUMMARY_ICONS[stat.id] ?? Star;
                return (
                  <Reveal key={stat.id} delay={i * 0.06}>
                    <div className="flex items-center gap-3 rounded-lg border border-[#534439] bg-[#221a15] p-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[#f4a261]/30 bg-[#f4a261]/10 text-[#f4a261]">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div>
                        <div className="font-[Space_Grotesk,sans-serif] text-lg font-bold text-[#f0dfd7]">
                          {stat.value}
                        </div>
                        <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#a08d80]">
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      </Reveal>

      {/* Bounty contract grid */}
      <Reveal>
        <section className="border-b border-[#534439]/60 bg-[#19120d] px-4 py-16 sm:px-8 md:py-20">
          <div className="mx-auto max-w-6xl">
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-[#f1c048]">
              {t("bounties.gridTitle")}
            </span>
            <h2 className="mt-3 font-[Space_Grotesk,sans-serif] text-2xl font-semibold tracking-tight text-[#f0dfd7] sm:text-3xl">
              {t("bounties.gridHeading")}
            </h2>

            <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-4">
              {items.map((item, i) => {
                const Icon = BOUNTY_ICONS[item.id] ?? Star;
                const spanClass =
                  i === 0 ? "lg:col-span-2" : i === 3 ? "lg:col-span-4" : "lg:col-span-1";
                return (
                  <Reveal key={item.id} delay={i * 0.08} className={spanClass}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(item.id)}
                      className={cn(
                        "group flex h-full w-full flex-col gap-4 rounded-lg border border-[#534439] bg-[#261e19] p-6 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-[#f4a261]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4a261]",
                        i === 3 && "sm:flex-row sm:items-center sm:justify-between",
                      )}
                    >
                      <div className={cn("flex items-start justify-between gap-3", i === 3 && "sm:flex-1")}>
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-[#534439] bg-[#19120d] text-[#f4a261]">
                            <Icon className="h-5 w-5" aria-hidden="true" />
                          </div>
                          <div>
                            <span
                              className={cn(
                                "inline-block rounded-sm border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em]",
                                getTierStyle(item.tier),
                              )}
                            >
                              {t("bounties.cardTierLabel", { tier: item.tier })}
                            </span>
                            <h3 className="mt-2 font-[Space_Grotesk,sans-serif] text-lg font-semibold text-[#f0dfd7]">
                              {item.name}
                            </h3>
                          </div>
                        </div>
                        {item.earned ? (
                          <Unlock className="h-4 w-4 shrink-0 text-[#f1c048]" aria-hidden="true" />
                        ) : (
                          <Lock className="h-4 w-4 shrink-0 text-[#a08d80]" aria-hidden="true" />
                        )}
                      </div>

                      <p className="font-[Plus_Jakarta_Sans,sans-serif] text-sm leading-relaxed text-[#d8c2b5]">
                        {item.description}
                      </p>

                      <div className={cn("mt-auto flex items-center justify-between gap-3 border-t border-[#3d332d] pt-4", i === 3 && "sm:mt-0 sm:border-t-0 sm:border-l sm:pl-6 sm:pt-0")}>
                        <div>
                          <span className="block font-mono text-[10px] uppercase tracking-[0.08em] text-[#a08d80]">
                            {t("bounties.cardRewardLabel")}
                          </span>
                          <span className="font-[Space_Grotesk,sans-serif] text-xl font-bold text-[#f1c048]">
                            {item.reward}
                          </span>
                        </div>
                        <span className="inline-flex items-center gap-1 font-mono text-xs font-semibold uppercase tracking-[0.06em] text-[#f4a261] group-hover:text-[#63e0fb]">
                          {t("bounties.cardViewDetails")}
                          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                      </div>
                    </button>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      </Reveal>

      {/* Tier progression ladder */}
      <Reveal>
        <section className="border-b border-[#534439]/60 bg-[#221a15] px-4 py-16 sm:px-8 md:py-20">
          <div className="mx-auto max-w-6xl">
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-[#63e0fb]">
              {t("bounties.ladderTitle")}
            </span>
            <h2 className="mt-3 font-[Space_Grotesk,sans-serif] text-2xl font-semibold tracking-tight text-[#f0dfd7] sm:text-3xl">
              {t("bounties.ladderHeading")}
            </h2>
            <p className="mt-2 max-w-xl font-[Plus_Jakarta_Sans,sans-serif] text-sm leading-relaxed text-[#d8c2b5]">
              {t("bounties.ladderSubtitle")}
            </p>

            <div className="relative mt-12 flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
              <div className="absolute left-0 right-0 top-5 hidden h-px bg-[#534439] sm:block" aria-hidden="true" />
              {ladder.map((rung, i) => (
                <Reveal key={rung.tier} delay={i * 0.07} className="relative flex flex-1 flex-col items-center gap-3 text-center">
                  <div
                    className={cn(
                      "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2",
                      rung.unlocked
                        ? "border-[#f1c048] bg-[#f1c048]/15 text-[#f1c048]"
                        : "border-[#534439] bg-[#19120d] text-[#a08d80]",
                    )}
                  >
                    {rung.unlocked ? (
                      <Check className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Lock className="h-4 w-4" aria-hidden="true" />
                    )}
                  </div>
                  <span className="font-mono text-xs font-bold uppercase tracking-[0.08em] text-[#f1c048]">
                    {rung.label}
                  </span>
                  <p className="max-w-[13rem] font-[Plus_Jakarta_Sans,sans-serif] text-xs leading-relaxed text-[#d8c2b5]">
                    {rung.requirement}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* Badge gallery */}
      <Reveal>
        <section className="border-b border-[#534439]/60 bg-[#19120d] px-4 py-16 sm:px-8 md:py-20">
          <div className="mx-auto max-w-6xl">
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-[#f4a261]">
              {t("bounties.badgeTitle")}
            </span>
            <h2 className="mt-3 font-[Space_Grotesk,sans-serif] text-2xl font-semibold tracking-tight text-[#f0dfd7] sm:text-3xl">
              {t("bounties.badgeHeading")}
            </h2>
            <p className="mt-2 max-w-xl font-[Plus_Jakarta_Sans,sans-serif] text-sm leading-relaxed text-[#d8c2b5]">
              {t("bounties.badgeSubtitle")}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {badges.map((badge, i) => (
                <Reveal key={badge.id} delay={i * 0.05}>
                  <div
                    className={cn(
                      "flex h-full flex-col items-center gap-2 rounded-lg border p-4 text-center transition-all duration-300",
                      badge.earned
                        ? "border-[#f1c048]/50 bg-[#f1c048]/5 shadow-[0_0_16px_rgba(241,192,72,0.15)]"
                        : "border-[#3d332d] bg-[#221a15] opacity-70",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full border",
                        badge.earned
                          ? "border-[#f1c048] text-[#f1c048]"
                          : "border-[#534439] text-[#a08d80]",
                      )}
                    >
                      {badge.earned ? (
                        <Unlock className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Lock className="h-4 w-4" aria-hidden="true" />
                      )}
                    </div>
                    <span className="font-[Space_Grotesk,sans-serif] text-xs font-semibold text-[#f0dfd7]">
                      {badge.name}
                    </span>
                    <p className="font-[Plus_Jakarta_Sans,sans-serif] text-[11px] leading-relaxed text-[#a08d80]">
                      {badge.description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* CTA banner */}
      <Reveal>
        <section className="bg-[#221a15] px-4 py-16 sm:px-8 md:py-20">
          <div className="mx-auto max-w-6xl rounded-lg border-2 border-[#f1c048] bg-[#19120d] p-8 shadow-[0_0_24px_rgba(249,199,79,0.15)] sm:p-10">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-[#f1c048]">
                  {t("bounties.ctaEyebrow")}
                </span>
                <h2 className="mt-3 max-w-lg text-balance font-[Space_Grotesk,sans-serif] text-2xl font-semibold tracking-tight text-[#f0dfd7] sm:text-3xl">
                  {t("bounties.ctaHeading")}
                </h2>
                <p className="mt-3 max-w-xl font-[Plus_Jakarta_Sans,sans-serif] text-sm leading-relaxed text-[#d8c2b5]">
                  {t("bounties.ctaBody")}
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <Link
                  href="/duel"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md border-b-[3px] border-[#6f3800] bg-[#f4a261] px-6 py-3 font-[Space_Grotesk,sans-serif] text-sm font-bold uppercase tracking-[0.06em] text-[#2f1400] transition-all duration-150 hover:brightness-105 active:translate-y-[2px] active:border-b-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63e0fb]"
                >
                  {t("bounties.ctaPrimary")}
                </Link>
                <a
                  href="#top"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-[#534439] bg-transparent px-6 py-3 font-[Space_Grotesk,sans-serif] text-sm font-semibold uppercase tracking-[0.06em] text-[#d8c2b5] transition-all duration-300 hover:border-[#63e0fb] hover:text-[#63e0fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63e0fb]"
                >
                  {t("bounties.ctaSecondary")}
                </a>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Reward details modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#140d08]/85 px-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedId(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={selected.name}
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-lg border-2 border-[#f1c048] bg-[#19120d] p-6 shadow-[0_0_24px_rgba(249,199,79,0.25)] sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span
                    className={cn(
                      "inline-block rounded-sm border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em]",
                      getTierStyle(selected.tier),
                    )}
                  >
                    {t("bounties.cardTierLabel", { tier: selected.tier })}
                  </span>
                  <h3 className="mt-3 font-[Space_Grotesk,sans-serif] text-2xl font-bold text-[#f0dfd7]">
                    {selected.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  aria-label={t("bounties.modal.close")}
                  className="rounded-md border border-[#534439] p-2 text-[#d8c2b5] transition-colors duration-200 hover:border-[#63e0fb] hover:text-[#63e0fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63e0fb]"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <p className="mt-4 font-[Plus_Jakarta_Sans,sans-serif] text-sm leading-relaxed text-[#d8c2b5]">
                {selected.description}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-md border border-[#3d332d] bg-[#221a15] p-4">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.08em] text-[#a08d80]">
                    {t("bounties.modal.rewardLabel")}
                  </span>
                  <span className="font-[Space_Grotesk,sans-serif] text-xl font-bold text-[#f1c048]">
                    {selected.reward}
                  </span>
                </div>
                <div className="rounded-md border border-[#3d332d] bg-[#221a15] p-4">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.08em] text-[#a08d80]">
                    {t("bounties.modal.requirementLabel")}
                  </span>
                  <span className="font-[Plus_Jakarta_Sans,sans-serif] text-sm font-semibold text-[#f0dfd7]">
                    {selected.requirementText}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[#a08d80]">
                    {t("bounties.modal.progressLabel")}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.08em]",
                      selected.earned
                        ? "border-[#f1c048]/40 bg-[#f1c048]/10 text-[#f1c048]"
                        : "border-[#63e0fb]/40 bg-[#63e0fb]/10 text-[#63e0fb]",
                    )}
                  >
                    {selected.earned ? t("bounties.modal.statusEarned") : t("bounties.modal.statusActive")}
                  </span>
                </div>
                <SegmentedBar progress={selected.progress} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}