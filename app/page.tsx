"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Clock, Check, X, AlertTriangle, FileCode, Star, Lock, ArrowRight, Sparkles } from 'lucide-react';
import type { LucideIcon } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { APP_TAGLINE } from "@/lib/data";
import { cn } from "@/lib/utils";

type StageStatus = "cleared" | "current" | "locked";

interface TrailStage {
  label: string;
  status: StageStatus;
}

interface MissionItem {
  icon: string;
  title: string;
  description: string;
}

interface AnatomyStep {
  step: string;
  title: string;
  description: string;
}

interface BountyTier {
  name: string;
  seconds: number;
  description: string;
  crimeType: string;
}

interface SnippetOption {
  id: string;
  code: string;
  correct: boolean;
  note: string;
}

const MISSION_ICONS: Record<string, LucideIcon> = {
  clock: Clock,
  code: FileCode,
  check: Check,
  bot: Sparkles,
};

const BENTO_SPANS = [
  "md:col-span-3 md:row-span-2",
  "md:col-span-3",
  "md:col-span-3",
  "md:col-span-3",
];

function RobotMascot({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" fill="none">
      <rect x="16" y="22" width="32" height="26" rx="6" className="fill-current" />
      <rect x="22" y="10" width="20" height="16" rx="5" className="fill-current" />
      <circle cx="28" cy="18" r="2.5" className="fill-[var(--background)]" />
      <circle cx="36" cy="18" r="2.5" className="fill-[var(--background)]" />
      <rect x="10" y="28" width="6" height="14" rx="3" className="fill-current opacity-80" />
      <rect x="48" y="28" width="6" height="14" rx="3" className="fill-current opacity-80" />
      <rect x="22" y="48" width="8" height="12" rx="3" className="fill-current" />
      <rect x="34" y="48" width="8" height="12" rx="3" className="fill-current" />
      <rect x="26" y="4" width="12" height="4" rx="2" className="fill-current opacity-60" />
    </svg>
  );
}

export default function HomePage() {
  const t = useTranslations();

  const missionItems = (
    Array.isArray(t.raw("mission.items")) ? t.raw("mission.items") : []
  ) as MissionItem[];

  const anatomySteps = (
    Array.isArray(t.raw("anatomy.steps")) ? t.raw("anatomy.steps") : []
  ) as AnatomyStep[];

  const bountyTiers = (
    Array.isArray(t.raw("bounties.tiers")) ? t.raw("bounties.tiers") : []
  ) as BountyTier[];

  const snippetOptions = (
    Array.isArray(t.raw("sampleDuel.options")) ? t.raw("sampleDuel.options") : []
  ) as SnippetOption[];

  const trailStages = (
    Array.isArray(t.raw("trail.stages")) ? t.raw("trail.stages") : []
  ) as TrailStage[];

  const correctOption = snippetOptions.find((o) => o.correct);

  const snippetLines = [
    "def check_badge(num):",
    "    if num > 0",
    "        return \"Valid badge\"",
    "    return \"Denied\"",
  ];

  return (
    <main className="bg-[var(--background)] text-[var(--foreground)]">
      {/* HERO — split, image-backed HUD panel */}
      <Reveal>
        <section
          id="hero"
          className="relative overflow-hidden border-b border-[hsl(var(--border))] py-28 md:py-36"
        >
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div
              className="absolute inset-0 opacity-70"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 12% 8%, rgba(99,224,251,0.14), transparent 55%), radial-gradient(circle at 88% 18%, rgba(244,162,97,0.10), transparent 50%), radial-gradient(circle at 50% 100%, rgba(9,9,11,0.9), transparent 60%)",
              }}
            />
            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(240,223,215,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(240,223,215,0.4) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />
            <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
            <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-[var(--card)] blur-3xl" />
          </div>
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--accent)] shadow-[0_0_24px_-8px_var(--accent)]">
                <Star className="h-3.5 w-3.5" aria-hidden="true" />
                {t("hero.eyebrow")}
              </span>
              <h1 className="mt-6 text-balance text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                <span className="text-gradient-accent">{t("hero.title")}</span>
              </h1>
              <p className="mt-6 max-w-lg text-pretty text-lg leading-relaxed text-[hsl(var(--muted-foreground))]">
                {t("hero.subtitle")}
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href="/duel"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-7 py-3.5 text-sm font-semibold text-black shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.4)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_32px_-8px_var(--accent)] hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                >
                  <span className="flex items-center gap-2">
                    <span>{t("hero.ctaPrimary")}</span>
                    <span className="inline-flex items-center justify-center rounded-full bg-black/20 p-0.5"><ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></span>
                  </span>
                </Link>
                <Link
                  href="/how-it-works"
                  className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] px-7 py-3.5 text-sm font-semibold transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[var(--accent)]/40 hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                >
                  {t("hero.ctaSecondary")}
                </Link>
              </div>
              <p className="mt-6 text-sm text-[hsl(var(--muted-foreground))]">
                {APP_TAGLINE}
              </p>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_32px_64px_-16px_rgba(0,0,0,0.6),0_0_48px_-16px_rgba(99,224,251,0.15)] transition-transform duration-500 ease-out hover:-translate-y-1">
                <img
                  src="https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/1ec1950184624b6e91ca071361574917.jpg"
                  alt="Sunset over a desert canyon, the setting for Syntax Sheriff duels"
                  className="h-80 w-full object-cover sm:h-96"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                <div className="absolute inset-x-5 bottom-5 rounded-xl border border-white/10 bg-black/60 p-4 backdrop-blur-md shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)]">
                  <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-widest text-white/60">
                    <span className="flex items-center gap-1.5">
                      <FileCode className="h-3.5 w-3.5" aria-hidden="true" />
                      {t("hero.hudFileName")}
                    </span>
                    <span className="flex items-center gap-1.5 text-[var(--accent)]">
                      <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                      {t("hero.hudTimerLabel")}
                    </span>
                  </div>
                  <div className="mt-3 rounded-lg bg-black/50 px-3 py-2 font-mono text-[13px] text-white/90">
                    <span className="text-white/40">2</span>{"  "}
                    <span className="rounded bg-[var(--accent)]/20 px-1 text-[var(--accent)]">
                      if num &gt; 0
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-400">
                    <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                    {t("hero.hudBugLabel")} · {t("hero.hudLineLabel")}
                  </div>
                </div>
                <motion.div
                  initial={{ x: -12, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
                  className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--accent)]/40 bg-black/50 text-[var(--accent)] shadow-[0_0_20px_-4px_var(--accent)] backdrop-blur-md"
                >
                  <Sparkles className="h-5 w-5" aria-hidden="true" />
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* MISSION — bento grid */}
      <Reveal delay={0.08}>
        <section className="relative border-b border-[hsl(var(--border))] py-24 md:py-32">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent" />
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-14 max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                {t("mission.eyebrow")}
              </span>
              <h2 className="mt-5 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                {t("mission.title")}
              </h2>
              <p className="mt-4 text-pretty text-base leading-relaxed text-[hsl(var(--muted-foreground))]">
                {t("mission.subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-6 md:grid-rows-2">
              {missionItems.map((item, i) => {
                const Icon = MISSION_ICONS[item.icon] ?? Sparkles;
                const span = BENTO_SPANS[i % BENTO_SPANS.length];
                return (
                  <motion.div
                    key={item.title}
                    whileHover={{ y: -4, scale: 1.01 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className={cn(
                      "glass-panel glow-border group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[var(--card)]/60 p-7 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-12px_rgba(0,0,0,0.5)] transition-all duration-300 ease-out hover:border-[var(--accent)]/30 hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_20px_40px_-12px_rgba(99,224,251,0.15)]",
                      span,
                    )}
                  >
                    <div>
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/10 text-[var(--accent)] shadow-[0_0_20px_-6px_var(--accent)]">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <h3 className="mt-5 text-lg font-semibold tracking-tight">{item.title}</h3>
                      <p className="mt-2 text-pretty text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ANATOMY — vertical step list */}
      <Reveal delay={0.1}>
        <section className="relative border-b border-[hsl(var(--border))] bg-[var(--card)]/40 py-24 md:py-32">
          <div className="mx-auto max-w-4xl px-6">
            <div className="mb-14 text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                {t("anatomy.eyebrow")}
              </span>
              <h2 className="mt-5 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                {t("anatomy.title")}
              </h2>
            </div>

            <ol className="space-y-4">
              {anatomySteps.map((step, i) => (
                <motion.li
                  key={step.title}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="glass-panel flex items-start gap-5 rounded-2xl border border-white/10 bg-[var(--card)]/70 p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.4)] transition-all duration-300 ease-out hover:border-[var(--accent)]/30"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/10 font-mono text-sm font-bold text-[var(--accent)]">
                    {step.step ?? i + 1}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold tracking-tight">{step.title}</h3>
                    <p className="mt-1.5 text-pretty text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                      {step.description}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>
      </Reveal>

      {/* SAMPLE DUEL — interactive snippet preview */}
      <Reveal delay={0.12}>
        <section className="relative border-b border-[hsl(var(--border))] py-24 md:py-32">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-0 h-96 w-[36rem] -translate-x-1/2 rounded-full bg-[var(--accent)]/5 blur-3xl" />
          </div>
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-14 px-6 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                {t("sampleDuel.eyebrow")}
              </span>
              <h2 className="mt-5 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                {t("sampleDuel.title")}
              </h2>
              <p className="mt-4 text-pretty text-base leading-relaxed text-[hsl(var(--muted-foreground))]">
                {t("sampleDuel.subtitle")}
              </p>

              <div className="mt-8 grid grid-cols-2 gap-3">
                {snippetOptions.map((opt) => (
                  <div
                    key={opt.id}
                    className={cn(
                      "rounded-xl border px-4 py-3 font-mono text-sm transition-all duration-300 ease-out",
                      opt.correct
                        ? "border-[var(--accent)]/50 bg-[var(--accent)]/10 text-[var(--accent)] shadow-[0_0_20px_-8px_var(--accent)]"
                        : "border-white/10 bg-[var(--card)]/50 text-[hsl(var(--muted-foreground))]",
                    )}
                  >
                    {opt.code}
                  </div>
                ))}
              </div>

              {correctOption && (
                <div className="glass-panel mt-6 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/5 p-5 shadow-[0_8px_24px_-12px_rgba(99,224,251,0.3)]">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    {t("sampleDuel.explanationLabel")}
                  </p>
                  <p className="mt-2 text-pretty text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                    {correctOption.note}
                  </p>
                </div>
              )}
            </div>

            <div className="glass-panel glow-border overflow-hidden rounded-2xl border border-white/10 bg-[#0d0a08] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_24px_48px_-16px_rgba(0,0,0,0.6)]">
              <div className="flex items-center justify-between border-b border-white/10 bg-black/40 px-5 py-3">
                <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/50">
                  <FileCode className="h-3.5 w-3.5" aria-hidden="true" />
                  badge_check.py
                </span>
                <span className="flex items-center gap-2 font-mono text-xs text-[var(--accent)]">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  00:14
                </span>
              </div>
              <div className="space-y-1 px-5 py-6 font-mono text-sm">
                {snippetLines.map((line, i) => (
                  <div
                    key={i}
                    className={cn(
                      "rounded px-3 py-1.5",
                      i === 1
                        ? "bg-red-500/10 text-red-300 shadow-[0_0_16px_-8px_rgba(239,68,68,0.5)]"
                        : "text-white/80",
                    )}
                  >
                    <span className="mr-4 select-none text-white/30">{i + 1}</span>
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* TRAIL — robot progress stage */}
      <Reveal delay={0.1}>
        <section className="relative border-b border-[hsl(var(--border))] bg-[var(--card)]/40 py-24 md:py-32">
          <div className="mx-auto max-w-5xl px-6">
            <div className="mb-14 max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                {t("trail.eyebrow")}
              </span>
              <h2 className="mt-5 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                {t("trail.title")}
              </h2>
              <p className="mt-4 text-pretty text-base leading-relaxed text-[hsl(var(--muted-foreground))]">
                {t("trail.subtitle")}
              </p>
            </div>

            <div className="glass-panel relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#241c15] to-[#19120d] p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_24px_48px_-16px_rgba(0,0,0,0.5)] md:p-12">
              <div
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 100%, rgba(244,162,97,0.15), transparent 50%)",
                }}
              />
              <div className="relative flex items-center justify-between">
                <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-gradient-to-r from-transparent via-[hsl(var(--border))] to-transparent" />
                {trailStages.map((stage, i) => {
                  const isCleared = stage.status === "cleared";
                  const isCurrent = stage.status === "current";
                  return (
                    <div key={stage.label} className="relative z-10 flex flex-col items-center gap-3">
                      <div
                        className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300",
                          isCleared &&
                            "border-[var(--accent)] bg-[var(--accent)]/20 text-[var(--accent)] shadow-[0_0_24px_-4px_var(--accent)]",
                          isCurrent &&
                            "border-[var(--accent)] bg-[var(--accent)] text-black shadow-[0_0_32px_-4px_var(--accent)]",
                          stage.status === "locked" &&
                            "border-[hsl(var(--border))] bg-[var(--card)] text-[hsl(var(--muted-foreground))]",
                        )}
                      >
                        {isCurrent ? (
                          <RobotMascot className="h-6 w-6" />
                        ) : stage.status === "locked" ? (
                          <Lock className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <Check className="h-4 w-4" aria-hidden="true" />
                        )}
                      </div>
                      <span
                        className={cn(
                          "max-w-[5.5rem] text-center text-[11px] font-medium leading-tight",
                          isCurrent ? "text-[var(--accent)]" : "text-[hsl(var(--muted-foreground))]",
                        )}
                      >
                        {stage.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* BOUNTIES — tier pricing-style cards */}
      <Reveal delay={0.1}>
        <section className="relative py-24 md:py-32">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent" />
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-14 max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                {t("bounties.eyebrow")}
              </span>
              <h2 className="mt-5 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                {t("bounties.title")}
              </h2>
              <p className="mt-4 text-pretty text-base leading-relaxed text-[hsl(var(--muted-foreground))]">
                {t("bounties.subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {bountyTiers.map((tier, i) => (
                <motion.div
                  key={tier.name}
                  whileHover={{ y: -6, scale: 1.015 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className={cn(
                    "glass-panel glow-border relative flex flex-col rounded-2xl border p-7 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_32px_-12px_rgba(0,0,0,0.5)] transition-all duration-300 ease-out",
                    i === 1
                      ? "border-[var(--accent)]/50 bg-[var(--accent)]/[0.07] shadow-[0_0_48px_-16px_rgba(99,224,251,0.3)]"
                      : "border-white/10 bg-[var(--card)]/60 hover:border-[var(--accent)]/30",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold tracking-tight">{tier.name}</h3>
                    <span className="rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-2.5 py-1 font-mono text-xs text-[var(--accent)]">
                      {tier.seconds}s
                    </span>
                  </div>
                  <p className="mt-3 text-pretty text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                    {tier.description}
                  </p>
                  <div className="mt-6 flex-1 border-t border-dashed border-[hsl(var(--border))]/50 pt-5">
                    <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
                      <AlertTriangle className="h-3.5 w-3.5 text-[var(--accent)]" aria-hidden="true" />
                      {tier.crimeType}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-14 flex justify-center">
              <Link
                href="/bounties"
                className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] px-7 py-3.5 text-sm font-semibold transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[var(--accent)]/40 hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                {t("bounties.ctaLabel")}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </Reveal>
    </main>
  );
}
