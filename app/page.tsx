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
        <section id="hero" className="relative overflow-hidden border-b border-[hsl(var(--border))] py-24 md:py-32">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          </div>
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                <Star className="h-3.5 w-3.5" aria-hidden="true" />
                {t("hero.eyebrow")}
              </span>
              <h1 className="mt-6 text-balance text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                {t("hero.title")}
              </h1>
              <p className="mt-6 max-w-lg text-pretty text-lg leading-relaxed text-[hsl(var(--muted-foreground))]">
                {t("hero.subtitle")}
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href="/duel"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-7 py-3.5 text-sm font-semibold text-black shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.4)] transition-all duration-300 ease-out hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                >
                  {t("hero.ctaPrimary")}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/how-it-works"
                  className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] px-7 py-3.5 text-sm font-semibold transition-all duration-300 ease-out hover:border-[var(--accent)]/40 hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                >
                  {t("hero.ctaSecondary")}
                </Link>
              </div>
              <p className="mt-6 text-sm italic-none text-[hsl(var(--muted-foreground))]">
                {APP_TAGLINE}
              </p>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_24px_48px_-16px_rgba(0,0,0,0.5)]">
                <img
                  src="https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/1ec1950184624b6e91ca071361574917.jpg"
                  alt="Sunset over a desert canyon, the setting for Syntax Sheriff duels"
                  className="h-80 w-full object-cover sm:h-96"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                <div className="absolute inset-x-5 bottom-5 rounded-xl border border-white/10 bg-black/60 p-4 backdrop-blur-md">
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
                  className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--accent)]/40 bg-black/50 text-[var(--accent)] backdrop-blur-md"
                >
                  <RobotMascot className="h-6 w-6" />
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* MISSION — asymmetric bento */}
      <Reveal>
        <section id="mission" className="py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                {t("mission.eyebrow")}
              </span>
              <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                {t("mission.title")}
              </h2>
              <p className="mt-4 text-pretty text-base leading-relaxed text-[hsl(var(--muted-foreground))]">
                {t("mission.subtitle")}
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-6">
              {missionItems.map((item, i) => {
                const Icon = MISSION_ICONS[item.icon] ?? Sparkles;
                const span = BENTO_SPANS[i] ?? "md:col-span-3";
                return (
                  <Reveal key={item.title} delay={i * 0.08} className={span}>
                    <div
                      className={cn(
                        "flex h-full flex-col justify-between rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-7 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[var(--accent)]/30",
                        i === 0 && "min-h-[260px]",
                      )}
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ANATOMY OF A DUEL — alternating steps */}
      <Reveal>
        <section id="anatomy" className="border-y border-[hsl(var(--border))] bg-[hsl(var(--card))] py-24 md:py-32">
          <div className="mx-auto max-w-5xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                {t("anatomy.eyebrow")}
              </span>
              <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                {t("anatomy.title")}
              </h2>
              <p className="mt-4 text-pretty text-base leading-relaxed text-[hsl(var(--muted-foreground))]">
                {t("anatomy.subtitle")}
              </p>
            </div>
            <div className="mt-16 space-y-10">
              {anatomySteps.map((step, i) => (
                <Reveal key={step.title} delay={i * 0.08}>
                  <div
                    className={cn(
                      "flex flex-col items-start gap-6 sm:flex-row sm:items-center",
                      i % 2 === 1 && "sm:flex-row-reverse sm:text-right",
                    )}
                  >
                    <div className="flex h-16 w-16 flex-none items-center justify-center rounded-2xl border border-[var(--accent)]/30 bg-[var(--background)] font-mono text-xl font-bold text-[var(--accent)]">
                      {step.step}
                    </div>
                    <div className="flex-1 rounded-2xl border border-[hsl(var(--border))] bg-[var(--background)] p-6">
                      <h3 className="text-lg font-semibold">{step.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* SAMPLE DUEL — full-width dark showcase panel */}
      <Reveal>
        <section id="sample-duel" className="py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                {t("sampleDuel.eyebrow")}
              </span>
              <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                {t("sampleDuel.title")}
              </h2>
              <p className="mt-4 text-pretty text-base leading-relaxed text-[hsl(var(--muted-foreground))]">
                {t("sampleDuel.subtitle")}
              </p>
            </div>

            <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-[#0b0d10] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_24px_48px_-16px_rgba(0,0,0,0.5)]">
              <div className="grid grid-cols-1 lg:grid-cols-5">
                <div className="border-b border-white/10 p-6 lg:col-span-3 lg:border-b-0 lg:border-r">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-white/50">
                    <span className="flex items-center gap-1.5">
                      <FileCode className="h-3.5 w-3.5" aria-hidden="true" />
                      {t("sampleDuel.fileName")}
                    </span>
                    <span className="rounded-full bg-[var(--accent)]/15 px-3 py-1 text-[var(--accent)]">
                      {t("sampleDuel.previewBadge")}
                    </span>
                  </div>
                  <div className="mt-5 space-y-1.5 rounded-xl bg-black/50 p-5 font-mono text-sm leading-relaxed">
                    {snippetLines.map((line, i) => (
                      <div
                        key={i}
                        className={cn(
                          "flex gap-4 rounded px-2 py-0.5",
                          i === 1 && "bg-[var(--accent)]/15",
                        )}
                      >
                        <span className="w-4 text-right text-white/30">{i + 1}</span>
                        <span className={i === 1 ? "text-[var(--accent)]" : "text-white/80"}>
                          {line}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-sm font-medium text-red-400">
                    <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                    {t("sampleDuel.errorLabel")}
                  </div>
                  <p className="mt-1 font-mono text-xs text-white/40">
                    {t("sampleDuel.consoleError")}
                  </p>
                </div>

                <div className="p-6 lg:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/50">
                    {t("sampleDuel.promptLabel")}
                  </p>
                  <div className="mt-4 space-y-2.5">
                    {snippetOptions.map((option) => (
                      <div
                        key={option.id}
                        className={cn(
                          "flex items-center gap-3 rounded-xl border px-3.5 py-2.5 font-mono text-[13px]",
                          option.correct
                            ? "border-[var(--accent)]/50 bg-[var(--accent)]/10 text-[var(--accent)]"
                            : "border-white/10 text-white/60",
                        )}
                      >
                        <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full border border-current text-[11px] font-bold">
                          {option.id}
                        </span>
                        <span className="truncate">{option.code}</span>
                        {option.correct ? (
                          <Check className="ml-auto h-4 w-4 flex-none" aria-hidden="true" />
                        ) : (
                          <X className="ml-auto h-4 w-4 flex-none opacity-40" aria-hidden="true" />
                        )}
                      </div>
                    ))}
                  </div>

                  {correctOption && (
                    <div className="mt-5 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/5 p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">
                        <Sparkles className="h-4 w-4" aria-hidden="true" />
                        {t("sampleDuel.explanationTitle")}
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-white/70">
                        {correctOption.note}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* BOUNTIES — stacked list rows with star difficulty */}
      <Reveal>
        <section id="bounties" className="border-y border-[hsl(var(--border))] py-24 md:py-32">
          <div className="mx-auto max-w-5xl px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-xl">
                <span className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                  {t("bounties.eyebrow")}
                </span>
                <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                  {t("bounties.title")}
                </h2>
                <p className="mt-4 text-pretty text-base leading-relaxed text-[hsl(var(--muted-foreground))]">
                  {t("bounties.subtitle")}
                </p>
              </div>
              <Link
                href="/bounties"
                className="inline-flex flex-none items-center gap-2 rounded-full border border-[hsl(var(--border))] px-5 py-2.5 text-sm font-semibold transition-all duration-300 ease-out hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
              >
                {t("bounties.ctaLabel")}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-12 divide-y divide-[hsl(var(--border))] rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
              {bountyTiers.map((tier, i) => (
                <Reveal key={tier.name} delay={i * 0.08}>
                  <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        {Array.from({ length: 3 }, (_, s) => (
                          <Star
                            key={s}
                            className={cn(
                              "h-4 w-4",
                              s <= i ? "fill-[var(--accent)] text-[var(--accent)]" : "text-[hsl(var(--muted-foreground))]",
                            )}
                            aria-hidden="true"
                          />
                        ))}
                        <h3 className="ml-1 text-lg font-semibold">{tier.name}</h3>
                      </div>
                      <p className="mt-2 max-w-md text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                        {tier.description}
                      </p>
                      <p className="mt-2 text-xs font-medium uppercase tracking-widest text-[var(--accent)]/80">
                        {tier.crimeType}
                      </p>
                    </div>
                    <div className="flex flex-none items-center gap-2 rounded-full border border-[hsl(var(--border))] px-4 py-2 text-sm font-semibold">
                      <Clock className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
                      {tier.seconds}{t("bounties.secondsSuffix")}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* TRAIL — full-bleed progress visualization */}
      <Reveal>
        <section id="trail" className="relative overflow-hidden py-24 md:py-32">
          <div className="absolute inset-0 -z-10">
            <img
              src="https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/c2f398f17843484f8f4e139f817d7741.jpg"
              alt="A cracked dirt trail stretching across an arid desert"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/80" />
          </div>
          <div className="mx-auto max-w-5xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                {t("trail.eyebrow")}
              </span>
              <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {t("trail.title")}
              </h2>
              <p className="mt-4 text-pretty text-base leading-relaxed text-white/70">
                {t("trail.subtitle")}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-center gap-5 text-xs font-medium text-white/60">
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-[var(--accent)]" aria-hidden="true" /> {t("trail.legendCleared")}
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" aria-hidden="true" /> {t("trail.legendCurrent")}
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-white/40" aria-hidden="true" /> {t("trail.legendLocked")}
              </span>
            </div>

            <div className="mt-14 flex items-center gap-2 overflow-x-auto pb-4 sm:justify-center">
              {trailStages.map((stage, i) => (
                <div key={stage.label} className="flex flex-none items-center">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={cn(
                        "relative flex h-14 w-14 items-center justify-center rounded-full border-2 text-white",
                        stage.status === "cleared" && "border-[var(--accent)] bg-[var(--accent)]/20",
                        stage.status === "current" && "border-[var(--accent)] bg-[var(--accent)]/30 shadow-[0_0_0_6px_rgba(255,255,255,0.05)]",
                        stage.status === "locked" && "border-white/15 bg-white/5",
                      )}
                    >
                      {stage.status === "cleared" && <Check className="h-5 w-5 text-[var(--accent)]" aria-hidden="true" />}
                      {stage.status === "current" && <RobotMascot className="h-7 w-7 text-[var(--accent)]" />}
                      {stage.status === "locked" && <Lock className="h-5 w-5 text-white/40" aria-hidden="true" />}
                    </div>
                    <span className="max-w-[88px] text-center text-[11px] font-medium leading-tight text-white/60">
                      {stage.label}
                    </span>
                  </div>
                  {i < trailStages.length - 1 && (
                    <div
                      className={cn(
                        "mx-1.5 h-0.5 w-10 flex-none rounded-full sm:w-16",
                        stage.status === "cleared" ? "bg-[var(--accent)]/60" : "bg-white/15",
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* FINAL CTA — split with glow */}
      <Reveal>
        <section id="cta" className="relative overflow-hidden py-24 md:py-32">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute right-0 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-[var(--accent)]/15 blur-3xl" />
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                {t("cta.eyebrow")}
              </span>
              <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                {t("cta.title")}
              </h2>
              <p className="mt-4 max-w-md text-pretty text-base leading-relaxed text-[hsl(var(--muted-foreground))]">
                {t("cta.subtitle")}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/duel"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-7 py-3.5 text-sm font-semibold text-black transition-all duration-300 ease-out hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                {t("cta.primary")}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/bounties"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[hsl(var(--border))] px-7 py-3.5 text-sm font-semibold transition-all duration-300 ease-out hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
              >
                {t("cta.secondary")}
              </Link>
            </div>
          </div>
        </section>
      </Reveal>
    </main>
  );
}