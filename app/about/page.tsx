"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Star, Lock, Check, AlertTriangle, Circle, Terminal, Activity, FileCode, Sparkles, ArrowRight, User, Mail, FileText, Clock } from 'lucide-react';
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";

type SectorStatus = "cleared" | "active" | "locked";

interface FeatureCard {
  tag: string;
  title: string;
  desc: string;
}

interface SectorItem {
  id: string;
  name: string;
  status: SectorStatus;
  statusLabel: string;
  desc: string;
}

interface CreditMember {
  role: string;
  name: string;
  blurb: string;
}

interface ContactChannel {
  label: string;
  value: string;
}

const PAGE_BG = "bg-[#19120d]";
const TEXT_PRIMARY = "text-[#f0dfd7]";
const TEXT_MUTED = "text-[#d8c2b5]";
const TEXT_FAINT = "text-[#a08d80]";
const CARD_BG = "bg-[#241e1a]";
const CARD_BG_RAISED = "bg-[#2d231e]";
const BORDER = "border-[#382a22]";
const AMBER = "#f4a261";
const GOLD = "#f9c74f";
const CYAN = "#48cae4";
const CRIMSON = "#e76f51";

const TIMER_BLOCKS = Array.from({ length: 12 }, (_, i) => {
  if (i < 7) return CYAN;
  if (i < 10) return AMBER;
  return CRIMSON;
});

const RUSTY_STATS = [
  { key: "core", value: "88.4 MHz" },
  { key: "thermal", value: "34°C" },
  { key: "energy", value: "1,024 J/Fix" },
  { key: "goal", value: "Dodge City Node" },
];

function statusIcon(status: SectorStatus) {
  if (status === "cleared") return <Check className="h-4 w-4" aria-hidden="true" />;
  if (status === "active") return <Star className="h-4 w-4" aria-hidden="true" />;
  return <Lock className="h-4 w-4" aria-hidden="true" />;
}

function statusColorClass(status: SectorStatus) {
  if (status === "cleared") return "text-[#48cae4] border-[#48cae4]/40 bg-[#48cae4]/10";
  if (status === "active") return "text-[#f9c74f] border-[#f9c74f]/50 bg-[#f9c74f]/10";
  return "text-[#a08d80] border-[#534439] bg-[#19120d]";
}

export default function AboutPage() {
  const t = useTranslations();

  const features = (Array.isArray(t.raw("about.features")) ? t.raw("about.features") : []) as FeatureCard[];
  const sectorsRaw = (Array.isArray(t.raw("about.sectors.items")) ? t.raw("about.sectors.items") : []) as {
    id: string;
    name: string;
    status: string;
    statusLabel: string;
    desc: string;
  }[];
  const sectors: SectorItem[] = sectorsRaw.map((s) => ({
    id: s.id,
    name: s.name,
    status: (s.status as SectorStatus) ?? "locked",
    statusLabel: s.statusLabel,
    desc: s.desc,
  }));
  const credits = (Array.isArray(t.raw("about.credits.items")) ? t.raw("about.credits.items") : []) as CreditMember[];
  const channels = (Array.isArray(t.raw("about.contact.channels")) ? t.raw("about.contact.channels") : []) as ContactChannel[];

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setForm({ name: "", email: "", message: "" });
    setSubmitted(false);
  };

  return (
    <main className={`${PAGE_BG} ${TEXT_PRIMARY} min-h-screen font-sans`}>
      {/* ===== HERO ===== */}
      <Reveal>
        <section className={`relative overflow-hidden border-b ${BORDER}`}>
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle at 15% 10%, rgba(244,162,97,0.08), transparent 55%), radial-gradient(circle at 85% 30%, rgba(72,202,228,0.07), transparent 50%)",
            }}
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-24">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-2 rounded-sm border ${BORDER} ${CARD_BG} px-3 py-1 font-mono text-[11px] font-bold tracking-[0.1em] text-[#f4a261]`}
                  >
                    {t("about.hero.eyebrow")}
                  </span>
                  <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.1em] text-[#d8c2b5]">
                    <Circle className="h-2 w-2 fill-[#48cae4] text-[#48cae4]" aria-hidden="true" />
                    {t("about.hero.status")}
                  </span>
                </div>

                <h1 className="mt-6 text-balance text-[2.1rem] font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-[3.4rem] md:leading-[1.08]">
                  {t("about.hero.titleLine1")}{" "}
                  <span className="text-[#f4a261]">{t("about.hero.titleHighlight")}</span>
                </h1>

                <p className={`mt-6 max-w-2xl text-pretty text-base leading-relaxed sm:text-lg ${TEXT_MUTED}`}>
                  {t("about.hero.description")}
                </p>

                <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {features.map((f, i) => (
                    <motion.div
                      key={f.tag}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.08 }}
                      className={`rounded-md border ${BORDER} ${CARD_BG} p-4`}
                    >
                      <h3 className="text-sm font-semibold tracking-tight">{f.title}</h3>
                      <p className={`mt-1 text-xs leading-relaxed ${TEXT_FAINT}`}>{f.desc}</p>
                      <span className="mt-3 inline-block font-mono text-[10px] tracking-[0.08em] text-[#48cae4]">
                        {f.tag}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className={`rounded-lg border ${BORDER} ${CARD_BG_RAISED} p-5`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold tracking-[0.08em] text-[#48cae4]">
                    {t("about.hero.telemetry.badge")}
                  </span>
                  <span className="font-mono text-[10px] text-[#a08d80]">{t("about.hero.telemetry.version")}</span>
                </div>

                <div className="mt-4 flex items-center justify-between font-mono text-[11px] text-[#d8c2b5]">
                  <span>{t("about.hero.telemetry.timerLabel")}</span>
                  <span className="text-[#48cae4]">{t("about.hero.telemetry.timerValue")}</span>
                </div>
                <div className="mt-2 flex gap-1" role="img" aria-label="Quick-draw timer gauge">
                  {TIMER_BLOCKS.map((color, i) => (
                    <span key={i} className="h-2 flex-1 rounded-sm" style={{ backgroundColor: color }} />
                  ))}
                </div>

                <div className={`mt-5 rounded-md border ${BORDER} bg-[#140d08] p-4 font-mono text-[13px] leading-relaxed`}>
                  <div className="mb-2 flex items-center gap-2 text-[11px] text-[#a08d80]">
                    <FileCode className="h-3.5 w-3.5" aria-hidden="true" />
                    {t("about.hero.telemetry.fileName")}
                  </div>
                  <div className="text-[#d8c2b5]">
                    <span className="text-[#a08d80]">01</span>{" "}
                    <span className="text-[#48cae4]">def</span> verify_deputy_charge(amps)
                    <span className="ml-2 rounded-sm bg-[#e76f51]/20 px-1 text-[#e76f51]">?</span>
                  </div>
                  <div className="text-[#d8c2b5]">
                    <span className="text-[#a08d80]">02</span>{" "}
                    <span className="pl-3">return amps &gt;= 88.0</span>
                  </div>
                </div>

                <div className="mt-4 rounded-md border border-[#e76f51]/40 bg-[#e76f51]/10 p-3">
                  <p className="font-mono text-[10px] font-bold tracking-[0.08em] text-[#e76f51]">
                    {t("about.hero.telemetry.noticeTitle")}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[#d8c2b5]">{t("about.hero.telemetry.noticeBody")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ===== DEPUTY RUSTY LORE ===== */}
      <Reveal>
        <section className={`border-b ${BORDER}`}>
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-24">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="font-mono text-[11px] font-bold tracking-[0.1em] text-[#f9c74f]">
                  {t("about.lore.eyebrow")}
                </span>
                <h2 className="mt-3 text-balance text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                  {t("about.lore.title")}
                </h2>
              </div>
              <p className={`max-w-sm text-sm leading-relaxed sm:text-right ${TEXT_MUTED}`}>
                {t("about.lore.subtitle")}
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className={`rounded-lg border ${BORDER} ${CARD_BG} p-6`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-[#f9c74f]" aria-hidden="true" />
                    <h3 className="text-lg font-semibold tracking-tight">{t("about.rusty.name")}</h3>
                  </div>
                  <span className="rounded-sm border border-[#f9c74f]/40 bg-[#f9c74f]/10 px-2 py-1 font-mono text-[10px] font-bold tracking-[0.08em] text-[#f9c74f]">
                    {t("about.rusty.statusBadge")}
                  </span>
                </div>

                <div className={`mt-5 overflow-hidden rounded-md border ${BORDER}`}>
                  <img
                    src="https://titoaistorageaccount.blob.core.windows.net/titoai-storage/site-images/755ef70e11cf46d38904f6028a3e776a.jpg"
                    alt="Illustration of a mechanical sheriff robot standing in a neon-lit desert canyon"
                    className="h-48 w-full object-cover"
                  />
                </div>

                <p className={`mt-5 text-sm leading-relaxed ${TEXT_MUTED}`}>{t("about.rusty.description")}</p>

                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-[#382a22] pt-5 sm:grid-cols-4">
                  {RUSTY_STATS.map((stat) => (
                    <div key={stat.key}>
                      <p className="font-mono text-[10px] tracking-[0.08em] text-[#a08d80]">
                        {t(`about.rusty.statLabels.${stat.key}`)}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[#f4a261]">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`rounded-lg border ${BORDER} ${CARD_BG} p-6`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold tracking-tight">{t("about.sectors.title")}</h3>
                  <span className="font-mono text-[10px] tracking-[0.08em] text-[#a08d80]">
                    {t("about.sectors.meta")}
                  </span>
                </div>

                <ul className="mt-5 space-y-3">
                  {sectors.map((sector, i) => (
                    <motion.li
                      key={sector.id}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.35, ease: "easeOut", delay: i * 0.05 }}
                      className={`flex items-start gap-3 rounded-md border ${BORDER} ${CARD_BG_RAISED} p-3`}
                    >
                      <span
                        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border ${statusColorClass(
                          sector.status,
                        )}`}
                      >
                        {statusIcon(sector.status)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-semibold tracking-tight">{sector.name}</p>
                          <span
                            className={`rounded-sm border px-2 py-0.5 font-mono text-[9px] font-bold tracking-[0.08em] ${statusColorClass(
                              sector.status,
                            )}`}
                          >
                            {sector.statusLabel}
                          </span>
                        </div>
                        <p className={`mt-1 text-xs leading-relaxed ${TEXT_FAINT}`}>{sector.desc}</p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ===== CREDITS ===== */}
      <Reveal>
        <section className={`border-b ${BORDER} ${CARD_BG}`}>
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-24">
            <span className="font-mono text-[11px] font-bold tracking-[0.1em] text-[#48cae4]">
              {t("about.credits.eyebrow")}
            </span>
            <h2 className="mt-3 text-balance text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              {t("about.credits.title")}
            </h2>
            <p className={`mt-3 max-w-2xl text-sm leading-relaxed sm:text-base ${TEXT_MUTED}`}>
              {t("about.credits.subtitle")}
            </p>

            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {credits.map((c, i) => (
                <Reveal key={c.name} delay={i * 0.06}>
                  <div
                    className={`h-full rounded-lg border ${BORDER} ${
                      i === 0 ? `${CARD_BG_RAISED} lg:col-span-2` : CARD_BG_RAISED
                    } p-5`}
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-[#f4a261]" aria-hidden="true" />
                      <p className="font-mono text-[10px] font-bold tracking-[0.08em] text-[#f4a261]">{c.role}</p>
                    </div>
                    <h3 className="mt-2 text-base font-semibold tracking-tight">{c.name}</h3>
                    <p className={`mt-2 text-sm leading-relaxed ${TEXT_FAINT}`}>{c.blurb}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ===== CONTACT ===== */}
      <Reveal>
        <section>
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-24">
            <span className="font-mono text-[11px] font-bold tracking-[0.1em] text-[#f9c74f]">
              {t("about.contact.eyebrow")}
            </span>
            <h2 className="mt-3 text-balance text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              {t("about.contact.title")}
            </h2>
            <p className={`mt-3 max-w-2xl text-sm leading-relaxed sm:text-base ${TEXT_MUTED}`}>
              {t("about.contact.subtitle")}
            </p>

            <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-5">
              <div className={`lg:col-span-3 rounded-lg border ${BORDER} ${CARD_BG} p-6`}>
                {submitted ? (
                  <div className="flex flex-col items-start gap-4 py-6">
                    <span className="inline-flex items-center gap-2 rounded-sm border border-[#48cae4]/40 bg-[#48cae4]/10 px-3 py-1 font-mono text-[10px] font-bold tracking-[0.08em] text-[#48cae4]">
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      {t("about.contact.successTitle")}
                    </span>
                    <p className={`text-sm leading-relaxed ${TEXT_MUTED}`}>{t("about.contact.successBody")}</p>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="mt-2 inline-flex items-center gap-2 rounded-sm border border-[#382a22] bg-[#2d231e] px-4 py-2 text-sm font-semibold text-[#f0dfd7] transition-all duration-300 ease-out hover:border-[#48cae4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#48cae4]"
                    >
                      {t("about.contact.resetButton")}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="about-name" className="flex items-center gap-2 text-xs font-semibold tracking-[0.04em] text-[#d8c2b5]">
                        <User className="h-3.5 w-3.5 text-[#a08d80]" aria-hidden="true" />
                        {t("about.contact.nameLabel")}
                      </label>
                      <input
                        id="about-name"
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder={t("about.contact.namePlaceholder")}
                        className="mt-2 w-full rounded-md border border-[#382a22] bg-[#140d08] px-3 py-2.5 text-sm text-[#f0dfd7] placeholder:text-[#5c4538] transition-colors duration-300 focus:border-[#48cae4] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="about-email" className="flex items-center gap-2 text-xs font-semibold tracking-[0.04em] text-[#d8c2b5]">
                        <Mail className="h-3.5 w-3.5 text-[#a08d80]" aria-hidden="true" />
                        {t("about.contact.emailLabel")}
                      </label>
                      <input
                        id="about-email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder={t("about.contact.emailPlaceholder")}
                        className="mt-2 w-full rounded-md border border-[#382a22] bg-[#140d08] px-3 py-2.5 text-sm text-[#f0dfd7] placeholder:text-[#5c4538] transition-colors duration-300 focus:border-[#48cae4] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="about-message" className="flex items-center gap-2 text-xs font-semibold tracking-[0.04em] text-[#d8c2b5]">
                        <FileText className="h-3.5 w-3.5 text-[#a08d80]" aria-hidden="true" />
                        {t("about.contact.messageLabel")}
                      </label>
                      <textarea
                        id="about-message"
                        rows={4}
                        value={form.message}
                        onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                        placeholder={t("about.contact.messagePlaceholder")}
                        className="mt-2 w-full resize-none rounded-md border border-[#382a22] bg-[#140d08] px-3 py-2.5 text-sm text-[#f0dfd7] placeholder:text-[#5c4538] transition-colors duration-300 focus:border-[#48cae4] focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-md border-b-[3px] border-[#b85d3b] bg-[#f4a261] px-5 py-3 text-sm font-bold tracking-tight text-[#181412] transition-all duration-150 ease-out hover:brightness-105 active:translate-y-[2px] active:border-b-[1px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f9c74f] sm:w-auto"
                    >
                      {t("about.contact.submitButton")}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </form>
                )}
              </div>

              <div className={`lg:col-span-2 rounded-lg border ${BORDER} ${CARD_BG_RAISED} p-6`}>
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-[#48cae4]" aria-hidden="true" />
                  <p className="font-mono text-[11px] font-bold tracking-[0.08em] text-[#48cae4]">
                    {t("about.contact.channelsTitle")}
                  </p>
                </div>
                <ul className="mt-5 space-y-4">
                  {channels.map((c) => (
                    <li key={c.label} className="flex items-start justify-between gap-3 border-b border-[#382a22] pb-3 last:border-0">
                      <span className={`flex items-center gap-2 text-xs ${TEXT_FAINT}`}>
                        <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                        {c.label}
                      </span>
                      <span className="text-right text-sm font-semibold text-[#f0dfd7]">{c.value}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex items-center gap-2 rounded-md border border-[#534439] bg-[#19120d] p-3">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-[#e76f51]" aria-hidden="true" />
                  <p className="text-xs leading-relaxed text-[#d8c2b5]">{t("about.contact.channels.0.value") ? "" : ""}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>
    </main>
  );
}