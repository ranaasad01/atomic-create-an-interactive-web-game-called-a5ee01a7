"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FileCode, Terminal, Clock, Activity, Sparkles, ArrowRight, ChevronDown, Circle, AlertTriangle, Star } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

interface StatItem {
  value: string;
  label: string;
}

interface StepItem {
  tag: string;
  title: string;
  desc: string;
  footer: string;
}

interface HotkeyItem {
  combo: string;
  label: string;
}

interface SyntaxRow {
  language: string;
  runtime: string;
  syntaxErrorTitle: string;
  syntaxError: string;
  logicTrap: string;
}

interface FaqItem {
  q: string;
  a: string;
}

const STAT_ICONS = [Clock, Terminal, Activity];
const STEP_ICONS = [FileCode, Terminal, Clock, Activity, Sparkles];

const cardWhileHover: Variants = {
  rest: { y: 0 },
  hover: { y: -4 },
};

const tacticalCard =
  "rounded-md border border-[#534439] bg-[#261e19] shadow-[inset_0_1px_0_rgba(244,162,97,0.2),0_3px_0_#120d0a]";

export default function HowItWorksPage() {
  const t = useTranslations();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const stats = (
    Array.isArray(t.raw("howItWorks.stats")) ? t.raw("howItWorks.stats") : []
  ) as StatItem[];

  const steps = (
    Array.isArray(t.raw("mechanics.steps")) ? t.raw("mechanics.steps") : []
  ) as StepItem[];

  const hotkeys = (
    Array.isArray(t.raw("hotkeys.keys")) ? t.raw("hotkeys.keys") : []
  ) as HotkeyItem[];

  const syntaxRows = (
    Array.isArray(t.raw("syntaxRef.rows")) ? t.raw("syntaxRef.rows") : []
  ) as SyntaxRow[];

  const faqs = (
    Array.isArray(t.raw("faq.items")) ? t.raw("faq.items") : []
  ) as FaqItem[];

  return (
    <main className="min-h-screen bg-[#19120d] font-['Plus_Jakarta_Sans'] text-[#f0dfd7]">
      {/* ===== Overview / Deputy Induction ===== */}
      <Reveal>
        <section className="relative overflow-hidden border-b border-[#534439] bg-[#19120d] px-5 py-20 md:px-8 md:py-28">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, #f0dfd7 0px, #f0dfd7 1px, transparent 1px, transparent 3px)",
            }}
          />
          <div className="relative mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.6fr_1fr] lg:items-start">
              <div>
                <div className="mb-6 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center rounded border border-[#534439] bg-[#221a15] px-3 py-1 font-['JetBrains_Mono'] text-[11px] font-bold uppercase tracking-[0.1em] text-[#d8c2b5]">
                    {t("howItWorks.badge1")}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded border border-[#63e0fb]/40 bg-[#63e0fb]/10 px-3 py-1 font-['JetBrains_Mono'] text-[11px] font-bold uppercase tracking-[0.1em] text-[#63e0fb]">
                    <Circle className="h-2 w-2 fill-current" aria-hidden="true" />
                    {t("howItWorks.badge2")}
                  </span>
                </div>
                <h1 className="text-balance font-['Space_Grotesk'] text-4xl font-bold leading-[1.1] tracking-tight text-[#f0dfd7] md:text-[56px] md:leading-[1.14]">
                  {t("howItWorks.heroTitlePrefix")}{" "}
                  <span className="text-[#ffc499]">{t("howItWorks.heroTitleAccent")}</span>
                </h1>
                <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-[#d8c2b5]">
                  {t("howItWorks.heroSubtitle")}
                </p>
                <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {stats.map((stat, i) => {
                    const Icon = STAT_ICONS[i % STAT_ICONS.length] ?? Clock;
                    return (
                      <div
                        key={i}
                        className={cn("flex items-start gap-3 px-4 py-4", tacticalCard)}
                      >
                        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#63e0fb]" aria-hidden="true" />
                        <div>
                          <div className="font-['Space_Grotesk'] text-lg font-semibold text-[#f0dfd7]">
                            {stat.value}
                          </div>
                          <div className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.08em] text-[#a08d80]">
                            {stat.label}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className={cn("p-5", tacticalCard)}>
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-['JetBrains_Mono'] text-[11px] font-bold uppercase tracking-[0.1em] text-[#d8c2b5]">
                    {t("howItWorks.unitTitle")}
                  </span>
                  <span className="font-['JetBrains_Mono'] text-[11px] font-bold text-[#63e0fb]">
                    {t("howItWorks.unitOnline")}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-3 rounded border border-[#534439] bg-[#140d08] px-6 py-8">
                  <div className="flex h-14 w-14 items-center justify-center rounded border border-[#f1c048]/40 bg-[#f1c048]/10">
                    <Star className="h-7 w-7 text-[#f1c048]" aria-hidden="true" />
                  </div>
                  <div className="font-['Space_Grotesk'] text-sm font-semibold uppercase tracking-wide text-[#f0dfd7]">
                    {t("howItWorks.unitName")}
                  </div>
                  <div className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.08em] text-[#d8c2b5]">
                    {t("howItWorks.unitStatus")}
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded border border-[#534439] bg-[#140d08] px-3 py-2">
                    <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.08em] text-[#a08d80]">
                      {t("howItWorks.chassisLabel")}
                    </div>
                    <div className="font-['JetBrains_Mono'] text-xs text-[#f0dfd7]">
                      {t("howItWorks.chassisValue")}
                    </div>
                  </div>
                  <div className="rounded border border-[#534439] bg-[#140d08] px-3 py-2">
                    <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.08em] text-[#a08d80]">
                      {t("howItWorks.ammoLabel")}
                    </div>
                    <div className="font-['JetBrains_Mono'] text-xs text-[#f0dfd7]">
                      {t("howItWorks.ammoValue")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ===== Mechanics breakdown ===== */}
      <section className="border-b border-[#534439] bg-[#140d08] px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-[#534439] pb-5">
              <div>
                <div className="font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-[0.1em] text-[#f1c048]">
                  {t("mechanics.sectionLabel")}
                </div>
                <h2 className="mt-2 font-['Space_Grotesk'] text-2xl font-semibold tracking-tight text-[#f0dfd7] md:text-[32px]">
                  {t("mechanics.sectionTitle")}
                </h2>
              </div>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-5">
            {steps.map((step, i) => {
              const Icon = STEP_ICONS[i % STEP_ICONS.length] ?? FileCode;
              return (
                <Reveal key={i} delay={i * 0.05}>
                  <motion.div
                    initial="rest"
                    whileHover="hover"
                    animate="rest"
                    variants={cardWhileHover}
                    className={cn("flex h-full flex-col gap-4 p-5", tacticalCard)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-['JetBrains_Mono'] text-[11px] font-bold uppercase tracking-[0.1em] text-[#f1c048]">
                        {step.tag}
                      </span>
                      <Icon className="h-5 w-5 text-[#63e0fb]" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-['Space_Grotesk'] text-base font-semibold text-[#f0dfd7]">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#d8c2b5]">{step.desc}</p>
                    </div>
                    <div className="mt-auto pt-3 font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.08em] text-[#a08d80]">
                      {step.footer}
                    </div>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Hotkeys ===== */}
      <section className="border-b border-[#534439] bg-[#19120d] px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <h2 className="font-['Space_Grotesk'] text-2xl font-semibold tracking-tight text-[#f0dfd7] md:text-[32px]">
              {t("hotkeys.sectionTitle")}
            </h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {hotkeys.map((hotkey, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className={cn("flex items-center justify-between gap-3 px-4 py-4", tacticalCard)}>
                  <span className="font-['JetBrains_Mono'] text-xs text-[#d8c2b5]">{hotkey.label}</span>
                  <span className="rounded border border-[#534439] bg-[#140d08] px-2 py-1 font-['JetBrains_Mono'] text-xs text-[#f0dfd7]">
                    {hotkey.combo}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Syntax reference ===== */}
      <section className="border-b border-[#534439] bg-[#140d08] px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <h2 className="font-['Space_Grotesk'] text-2xl font-semibold tracking-tight text-[#f0dfd7] md:text-[32px]">
              {t("syntaxRef.sectionTitle")}
            </h2>
          </Reveal>
          <div className="mt-8 flex flex-col gap-4">
            {syntaxRows.map((row, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className={cn("flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between", tacticalCard)}>
                  <div>
                    <div className="font-['Space_Grotesk'] text-sm font-semibold text-[#f0dfd7]">
                      {row.language} <span className="text-[#a08d80]">/ {row.runtime}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-sm text-[#f1c048]">
                      <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                      {row.syntaxErrorTitle}
                    </div>
                    <p className="mt-1 text-sm text-[#d8c2b5]">{row.syntaxError}</p>
                  </div>
                  <p className="text-sm text-[#a08d80]">{row.logicTrap}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="border-b border-[#534439] bg-[#19120d] px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <h2 className="font-['Space_Grotesk'] text-2xl font-semibold tracking-tight text-[#f0dfd7] md:text-[32px]">
              {t("faq.sectionTitle")}
            </h2>
          </Reveal>
          <div className="mt-8 flex flex-col gap-3">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <Reveal key={i} delay={i * 0.05}>
                  <div className={cn("overflow-hidden", tacticalCard)}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                    >
                      <span className="font-['Space_Grotesk'] text-sm font-semibold text-[#f0dfd7]">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 shrink-0 text-[#a08d80] transition-transform",
                          isOpen && "rotate-180"
                        )}
                        aria-hidden="true"
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 text-sm leading-relaxed text-[#d8c2b5]">{faq.a}</div>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded border border-[#534439] bg-[#261e19] px-6 py-3 font-['JetBrains_Mono'] text-sm font-bold uppercase tracking-[0.08em] text-[#f0dfd7] hover:bg-[#332821]"
            >
              {t("howItWorks.ctaLabel")}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
