"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Clock, Sparkles, GitBranch, Star, Terminal, FileCode, AlertTriangle, Check, X, Info, ChevronRight } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

type CodeLanguage = "python" | "javascript";
type Difficulty = "beginner" | "intermediate" | "advanced";
type StageStatus = "cleared" | "current" | "locked";
type OptionId = "A" | "B" | "C" | "D";

interface MCQOption {
  id: OptionId;
  code: string;
  isCorrect: boolean;
  note: string;
}

interface CodeSnippetData {
  id: string;
  language: CodeLanguage;
  fileName: string;
  lines: string[];
  buggyLineNumber: number;
  errorLabel: string;
  consoleError: string;
  difficulty: Difficulty;
  bounty: number;
  options: MCQOption[];
  explanation: string;
  rule: string;
}

const TIMER_DURATION_SECONDS = 24;
const TIMER_SEGMENT_COUNT = 12;
const COMBO_STREAK_THRESHOLD = 3;

const HOTKEY_LABELS: string[] = ["1", "2", "3", "4"];

function getTimerColorClasses(fraction: number): string {
  if (fraction > 0.6) return "bg-cyan-400";
  if (fraction > 0.3) return "bg-amber-400";
  return "bg-red-500";
}

function getTimerGlowClasses(fraction: number): string {
  if (fraction > 0.6) return "shadow-[0_0_8px_0_rgba(34,211,238,0.6)]";
  if (fraction > 0.3) return "shadow-[0_0_8px_0_rgba(251,191,36,0.6)]";
  return "shadow-[0_0_10px_1px_rgba(239,68,68,0.7)] text-red-500 pulse-glow";
}

export default function DuelPage() {
  const t = useTranslations();

  const rawSnippets = t.raw("duel.snippets");
  const snippets = useMemo(
    () => (Array.isArray(rawSnippets) ? (rawSnippets as CodeSnippetData[]) : []),
    [rawSnippets],
  );

  const rawStages = t.raw("duel.stages");
  const stages = useMemo(
    () => (Array.isArray(rawStages) ? (rawStages as string[]) : []),
    [rawStages],
  );

  const difficultyLabels: Record<Difficulty, string> = {
    beginner: t("duel.difficultyBeginner"),
    intermediate: t("duel.difficultyIntermediate"),
    advanced: t("duel.difficultyAdvanced"),
  };

  const languageLabels: Record<CodeLanguage, string> = {
    python: t("duel.languagePython"),
    javascript: t("duel.languageJavaScript"),
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION_SECONDS);
  const [selectedId, setSelectedId] = useState<OptionId | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isTimeout, setIsTimeout] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [casesCleared, setCasesCleared] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);

  const safeIndex = snippets.length > 0 ? currentIndex % snippets.length : 0;
  const currentSnippet = snippets[safeIndex];
  const safeStageIndex = stages.length > 0 ? Math.min(stageIndex, stages.length - 1) : 0;

  const handleSelect = useCallback(
    (id: OptionId) => {
      if (answered || !currentSnippet) return;
      const option = currentSnippet.options.find((o) => o.id === id);
      if (!option) return;
      setSelectedId(id);
      setAnswered(true);
      setIsTimeout(false);
      if (option.isCorrect) {
        setScore((s) => s + currentSnippet.bounty);
        setStreak((s) => {
          const next = s + 1;
          setBestStreak((b) => Math.max(b, next));
          return next;
        });
        setCasesCleared((c) => c + 1);
        setStageIndex((s) => Math.min(s + 1, stages.length > 0 ? stages.length - 1 : 0));
      } else {
        setStreak(0);
      }
    },
    [answered, currentSnippet, stages.length],
  );

  useEffect(() => {
    if (answered) return;
    if (timeLeft <= 0) {
      setAnswered(true);
      setIsTimeout(true);
      setStreak(0);
      return;
    }
    const id = setTimeout(() => setTimeLeft((n) => n - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, answered]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (answered || !currentSnippet) return;
      const key = e.key.toLowerCase();
      const keyMap: Record<string, number> = { "1": 0, "2": 1, "3": 2, "4": 3, a: 0, b: 1, c: 2, d: 3 };
      const idx = keyMap[key];
      if (idx === undefined) return;
      const option = currentSnippet.options[idx];
      if (option) handleSelect(option.id);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [answered, currentSnippet, handleSelect]);

  const handleNext = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % Math.max(snippets.length, 1));
    setTimeLeft(TIMER_DURATION_SECONDS);
    setSelectedId(null);
    setAnswered(false);
    setIsTimeout(false);
  }, [snippets.length]);

  const handleReset = useCallback(() => {
    setCurrentIndex(0);
    setTimeLeft(TIMER_DURATION_SECONDS);
    setSelectedId(null);
    setAnswered(false);
    setIsTimeout(false);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setCasesCleared(0);
    setStageIndex(0);
  }, []);

  if (!currentSnippet) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">{t("duel.fallbackTitle")}</h1>
        <p className="mt-3 text-[hsl(var(--muted-foreground))]">{t("duel.fallbackBody")}</p>
      </main>
    );
  }

  const correctOption = currentSnippet.options.find((o) => o.isCorrect);
  const fraction = timeLeft / TIMER_DURATION_SECONDS;
  const filledSegments = Math.max(0, Math.round(fraction * TIMER_SEGMENT_COUNT));
  const timerColorClasses = getTimerColorClasses(fraction);
  const timerGlowClasses = getTimerGlowClasses(fraction);
  const isTimerLow = fraction <= 0.3;
  const robotPositionPct = stages.length > 1 ? (safeStageIndex / (stages.length - 1)) * 100 : 0;

  return (
    <main className="relative min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {/* Arena header */}
        <Reveal>
          <section aria-labelledby="duel-heading" className="border-b border-[hsl(var(--border))] pb-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
              {t("duel.eyebrow")}
            </span>
            <h1 id="duel-heading" className="mt-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              {t("duel.title")}
            </h1>
            <p className="mt-2 max-w-xl text-pretty text-sm text-[hsl(var(--muted-foreground))] sm:text-base">
              {t("duel.subtitle")}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)]">
                <Clock className="h-4 w-4 text-[hsl(var(--muted-foreground))]" aria-hidden="true" />
                <span className="text-xs text-[hsl(var(--muted-foreground))]">{t("duel.levelLabel")}</span>
                <span className="text-sm font-semibold">{stages[safeStageIndex] ?? ""}</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-[var(--accent)]/30 bg-[hsl(var(--card))] px-4 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12),0_0_12px_-2px_rgba(99,224,251,0.35)] transition-shadow duration-300">
                <Star className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
                <span className="text-xs text-[hsl(var(--muted-foreground))]">{t("duel.bountyLabel")}</span>
                <span className="text-sm font-semibold text-[var(--accent)]">{currentSnippet.bounty}</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-amber-400/30 bg-[hsl(var(--card))] px-4 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12),0_0_12px_-2px_rgba(251,191,36,0.3)] transition-shadow duration-300">
                <Sparkles className="h-4 w-4 text-amber-400" aria-hidden="true" />
                <span className="text-xs text-[hsl(var(--muted-foreground))]">{t("duel.streakLabel")}</span>
                <span className="text-sm font-semibold">{streak}</span>
              </div>
              {streak >= COMBO_STREAK_THRESHOLD && (
                <div className="pulse-glow flex items-center gap-2 rounded-xl border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-4 py-2.5 text-[var(--accent)] shadow-[0_0_14px_-2px_rgba(99,224,251,0.6)]">
                  <GitBranch className="h-4 w-4" aria-hidden="true" />
                  <span className="text-xs font-semibold uppercase tracking-wide">{t("duel.comboBadge")}</span>
                </div>
              )}
              <button
                type="button"
                onClick={handleReset}
                className="ml-auto rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-2.5 text-xs font-semibold text-[hsl(var(--muted-foreground))] transition-all duration-300 hover:-translate-y-0.5 hover:text-[hsl(var(--foreground))] hover:shadow-[0_8px_16px_-6px_rgba(0,0,0,0.3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
              >
                {t("duel.resetButton")}
              </button>
            </div>
          </section>
        </Reveal>

        {/* Duel console */}
        <Reveal delay={0.05} className="mt-10">
          <section aria-labelledby="console-heading" className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <h2 id="console-heading" className="sr-only">
                {t("duel.consoleHeaderLabel")}
              </h2>
              <div className="relative overflow-hidden rounded-2xl border border-[var(--accent)]/20 bg-[hsl(var(--card))]/95 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12),0_0_0_1px_rgba(99,224,251,0.04),0_0_40px_-16px_rgba(99,224,251,0.25)] backdrop-blur-sm">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/60 to-transparent"
                />
                <div className="flex flex-wrap items-center gap-2 border-b border-[hsl(var(--border))] bg-black/10 px-4 py-3">
                  <Terminal className="h-4 w-4 text-[hsl(var(--muted-foreground))]" aria-hidden="true" />
                  <FileCode className="h-4 w-4 text-[hsl(var(--muted-foreground))]" aria-hidden="true" />
                  <span className="font-mono text-xs text-[hsl(var(--muted-foreground))]">{currentSnippet.fileName}</span>
                  <span className="rounded-full border border-[hsl(var(--border))] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[hsl(var(--muted-foreground))]">
                    {languageLabels[currentSnippet.language]}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                      currentSnippet.difficulty === "beginner" && "bg-emerald-500/10 text-emerald-500",
                      currentSnippet.difficulty === "intermediate" && "bg-amber-500/10 text-amber-500",
                      currentSnippet.difficulty === "advanced" && "bg-rose-500/10 text-rose-500",
                    )}
                  >
                    {difficultyLabels[currentSnippet.difficulty]}
                  </span>
                  <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-500 shadow-[0_0_8px_-2px_rgba(239,68,68,0.5)]">
                    <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                    {currentSnippet.errorLabel}
                  </span>
                </div>

                <pre className="overflow-x-auto px-4 py-4 font-mono text-sm leading-relaxed">
                  {currentSnippet.lines.map((line, idx) => {
                    const lineNumber = idx + 1;
                    const isBuggy = lineNumber === currentSnippet.buggyLineNumber;
                    return (
                      <div
                        key={`${currentSnippet.id}-line-${idx}`}
                        className={cn(
                          "flex gap-4 rounded px-2 py-0.5",
                          isBuggy && "border-l-4 border-red-500 bg-red-500/10 shadow-[inset_0_0_12px_-6px_rgba(239,68,68,0.6)]",
                        )}
                      >
                        <span className="w-5 shrink-0 select-none text-right text-[hsl(var(--muted-foreground))]">
                          {lineNumber}
                        </span>
                        <span className={cn("whitespace-pre", isBuggy ? "text-red-500" : "text-[hsl(var(--foreground))]")}>
                          {line}
                        </span>
                        {isBuggy && <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" aria-hidden="true" />}
                      </div>
                    );
                  })}
                </pre>

                <div className="border-t border-[hsl(var(--border))] bg-black/10 px-4 py-3 font-mono text-xs text-red-500">
                  {currentSnippet.consoleError}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between text-xs text-[hsl(var(--muted-foreground))]">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className={cn("h-3.5 w-3.5", isTimerLow && "text-red-500")} aria-hidden="true" />
                    {t("duel.timerLabel")}
                  </span>
                  <span className={cn("font-mono", isTimerLow ? "text-red-500" : "text-[hsl(var(--foreground))]")}>{timeLeft}s</span>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: TIMER_SEGMENT_COUNT }, (_, i) => (
                    <div
                      key={`segment-${i}`}
                      className={cn(
                        "h-2 flex-1 rounded-full transition-all duration-300",
                        i < filledSegments ? cn(timerColorClasses, timerGlowClasses) : "bg-black/10",
                      )}
                    />
                  ))}
                </div>
              </div>

              <h3 className="mb-3 text-sm font-semibold text-[hsl(var(--muted-foreground))]">{t("duel.chooseFixLabel")}</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {currentSnippet.options.map((option, idx) => {
                  const isSelected = selectedId === option.id;
                  const showCorrect = answered && option.isCorrect;
                  const showWrongSelected = answered && isSelected && !option.isCorrect;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      disabled={answered}
                      onClick={() => handleSelect(option.id)}
                      aria-label={t("duel.optionAria", { hotkey: HOTKEY_LABELS[idx] ?? String(idx + 1) })}
                      className={cn(
                        "group relative rounded-xl border p-3 text-left font-mono text-xs transition-all duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]",
                        !answered &&
                          "border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:-translate-y-1 hover:border-[var(--accent)]/50 hover:shadow-[0_12px_28px_-10px_rgba(0,0,0,0.35),0_0_16px_-4px_rgba(99,224,251,0.3)]",
                        showCorrect && "border-emerald-500 bg-emerald-500/10 shadow-[0_0_20px_-4px_rgba(16,185,129,0.6)]",
                        showWrongSelected && "border-red-500 bg-red-500/10 shadow-[0_0_20px_-4px_rgba(239,68,68,0.6)]",
                        answered && !showCorrect && !showWrongSelected && "border-[hsl(var(--border))] opacity-40",
                      )}
                    >
                      <span className="mb-1.5 flex items-center gap-1.5">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-[hsl(var(--border))] bg-black/5 text-[10px] font-bold text-[hsl(var(--muted-foreground))]">
                          {HOTKEY_LABELS[idx] ?? idx + 1}
                        </span>
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-[hsl(var(--border))] text-[10px] font-bold text-[hsl(var(--muted-foreground))]">
                          {option.id}
                        </span>
                        {showCorrect && <Check className="ml-auto h-4 w-4 text-emerald-500" aria-hidden="true" />}
                        {showWrongSelected && <X className="ml-auto h-4 w-4 text-red-500" aria-hidden="true" />}
                      </span>
                      <span className="block whitespace-pre-wrap break-words text-[hsl(var(--foreground))]">{option.code}</span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-xs text-[hsl(var(--muted-foreground))]">{t("duel.hotkeyHint")}</p>
            </div>
          </section>
        </Reveal>

        {/* Robot progress map */}
        <Reveal delay={0.1} className="mt-14">
          <section aria-labelledby="progress-heading" className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)] sm:p-8">
            <h2 id="progress-heading" className="text-lg font-semibold tracking-tight">
              {t("duel.progressMapTitle")}
            </h2>
            <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">{t("duel.progressMapSubtitle")}</p>

            <div className="relative mt-10 pb-10">
              <div className="h-1 w-full overflow-hidden rounded-full bg-black/10">
                <motion.div
                  className="h-full rounded-full bg-[var(--accent)]/50"
                  initial={false}
                  animate={{ width: `${robotPositionPct}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 18 }}
                />
              </div>
              <motion.div
                className="absolute -top-4"
                initial={false}
                animate={{ left: `${robotPositionPct}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
                style={{ transform: "translateX(-50%)" }}
              >
                <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent)] shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3),0_0_18px_-2px_rgba(99,224,251,0.7)]">
                  <div className="absolute inset-0 -z-10 rounded-xl bg-[var(--accent)]/40 blur-md" />
                  <div className="absolute top-1.5 flex gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--background))]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--background))]" />
                  </div>
                  <span className="absolute -top-2 h-2 w-0.5 bg-[var(--accent)]" />
                </div>
              </motion.div>

              <div className="flex justify-between">
                {stages.map((stage, idx) => {
                  const status: StageStatus = idx < safeStageIndex ? "cleared" : idx === safeStageIndex ? "current" : "locked";
                  return (
                    <div key={`${idx}-${stage}`} className="flex flex-col items-center gap-2" style={{ width: `${100 / Math.max(stages.length, 1)}%` }}>
                      <span
                        aria-label={
                          status === "cleared"
                            ? t("duel.stageClearedAria")
                            : status === "current"
                              ? t("duel.stageCurrentLabel")
                              : t("duel.stageLockedAria")
                        }
                        className={cn(
                          "h-3 w-3 rounded-full border-2 transition-shadow duration-300",
                          status === "cleared" && "border-[var(--accent)] bg-[var(--accent)] shadow-[0_0_8px_-1px_rgba(99,224,251,0.7)]",
                          status === "current" && "border-[var(--accent)] bg-transparent shadow-[0_0_10px_-1px_rgba(99,224,251,0.6)]",
                          status === "locked" && "border-black/20 bg-transparent",
                        )}
                      />
                      <span
                        className={cn(
                          "text-center text-[11px] leading-tight",
                          status === "locked" ? "text-[hsl(var(--muted-foreground))]/60" : "text-[hsl(var(--muted-foreground))]",
                        )}
                      >
                        {stage}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </Reveal>

        {/* Session stats bento */}
        <Reveal delay={0.15} className="mt-14">
          <section aria-labelledby="stats-heading">
            <h2 id="stats-heading" className="text-lg font-semibold tracking-tight">
              {t("duel.sessionStatsTitle")}
            </h2>
            <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">{t("duel.sessionStatsSubtitle")}</p>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent)]/5 p-6 shadow-[0_0_24px_-8px_rgba(99,224,251,0.35)] sm:col-span-2">
                <Star className="h-5 w-5 text-[var(--accent)]" aria-hidden="true" />
                <div className="mt-3 text-4xl font-bold text-[var(--accent)]">{score}</div>
                <div className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">{t("duel.scoreLabel")}</div>
              </div>
              <div className="rounded-2xl border border-amber-400/20 bg-[hsl(var(--card))] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12),0_0_18px_-8px_rgba(251,191,36,0.3)]">
                <Sparkles className="h-5 w-5 text-amber-400" aria-hidden="true" />
                <div className="mt-3 text-3xl font-bold">{bestStreak}</div>
                <div className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">{t("duel.bestStreakLabel")}</div>
              </div>
              <div className="rounded-2xl border border-emerald-500/20 bg-[hsl(var(--card))] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)] sm:col-span-3">
                <Check className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                <div className="mt-3 text-3xl font-bold">{casesCleared}</div>
                <div className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">{t("duel.casesClearedLabel")}</div>
              </div>
            </div>
          </section>
        </Reveal>
      </div>

      <AnimatePresence>
        {answered && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="explanation-title"
          >
            <motion.div
              className="w-full max-w-xl rounded-2xl border border-[var(--accent)]/20 bg-[hsl(var(--card))] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_20px_60px_-12px_rgba(0,0,0,0.5),0_0_40px_-12px_rgba(99,224,251,0.25)] sm:p-8"
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className={cn(
                  "mb-4 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold",
                  isTimeout && "bg-red-500/10 text-red-500 shadow-[0_0_16px_-6px_rgba(239,68,68,0.5)]",
                  !isTimeout && selectedId && currentSnippet.options.find((o) => o.id === selectedId)?.isCorrect && "bg-emerald-500/10 text-emerald-500 shadow-[0_0_16px_-6px_rgba(16,185,129,0.5)]",
                  !isTimeout && selectedId && !currentSnippet.options.find((o) => o.id === selectedId)?.isCorrect && "bg-red-500/10 text-red-500 shadow-[0_0_16px_-6px_rgba(239,68,68,0.5)]",
                )}
              >
                {isTimeout ? (
                  <>
                    <X className="h-4 w-4" aria-hidden="true" />
                    {t("duel.timeoutFeedbackTitle")}
                  </>
                ) : selectedId && currentSnippet.options.find((o) => o.id === selectedId)?.isCorrect ? (
                  <>
                    <Check className="h-4 w-4" aria-hidden="true" />
                    {t("duel.correctFeedbackTitle")} &middot; {t("duel.bountyEarnedLabel", { amount: currentSnippet.bounty })}
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4" aria-hidden="true" />
                    {t("duel.wrongFeedbackTitle")}
                  </>
                )}
              </div>

              <h3 id="explanation-title" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
                <Info className="h-5 w-5 text-[var(--accent)]" aria-hidden="true" />
                {t("duel.explanationTitle")}
              </h3>

              <div className="mt-4 space-y-1.5 rounded-xl border border-[hsl(var(--border))]/60 bg-black/20 p-4 font-mono text-xs">
                <div className="flex gap-2 text-red-500">
                  <span>-</span>
                  <span>{currentSnippet.lines[currentSnippet.buggyLineNumber - 1] ?? ""}</span>
                </div>
                <div className="flex gap-2 text-emerald-500">
                  <span>+</span>
                  <span>{correctOption?.code ?? ""}</span>
                </div>
              </div>
              <div className="mt-2 flex gap-4 text-[11px] uppercase tracking-wide text-[hsl(var(--muted-foreground))]">
                <span>{t("duel.diffBuggyLabel")}</span>
                <span>{t("duel.diffFixedLabel")}</span>
              </div>

              <span className="mt-4 inline-flex rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3 py-1 text-[11px] font-semibold text-[var(--accent)] shadow-[0_0_10px_-4px_rgba(99,224,251,0.5)]">
                {t("duel.ruleLabel")}: {currentSnippet.rule}
              </span>

              <p className="mt-3 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">{currentSnippet.explanation}</p>

              <button
                type="button"
                onClick={handleNext}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[hsl(var(--background))] shadow-[0_0_20px_-6px_rgba(99,224,251,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-[0_0_28px_-4px_rgba(99,224,251,0.7)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
              >
                {t("duel.nextCaseButton")}
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
