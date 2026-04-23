"use client";

import { useRef, useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowRight, Check, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import MagneticButton from "./MagneticButton";
import { TEMPLATES, type TemplateId, type TemplateConfig } from "@/lib/samples";
import TemplatePreviewModal from "./TemplatePreviewModal";

type Props = {
  onSelect: (templateId: TemplateId) => void;
  onBack?: () => void;
};

// ── Per-template visual personality ──────────────────────────────────────────
type Theme = {
  cardBg: string;
  previewBg: string;
  previewScheme: "light" | "dark";
  accentColor: string;
  tagBg: string;
  tagText: string;
  infoBg: string;
  infoText: string;
  infoSub: string;
  infoBorder: string;
  badgeBg: string;
  badgeText: string;
  shadow: string;
  hoverShadow: string;
};

const THEMES: Record<string, Theme> = {
  "clean-library": {
    cardBg: "#ffffff",
    previewBg: "#f8fafc",
    previewScheme: "light",
    accentColor: "#2563eb",
    tagBg: "#eff6ff",
    tagText: "#1d4ed8",
    infoBg: "rgba(248,250,252,0.92)",
    infoText: "#0f172a",
    infoSub: "#64748b",
    infoBorder: "rgba(203,213,225,0.6)",
    badgeBg: "#eff6ff",
    badgeText: "#1d4ed8",
    shadow: "0 4px 24px rgba(37,99,235,0.08)",
    hoverShadow: "0 16px 48px rgba(37,99,235,0.18)",
  },
  "api-docs": {
    cardBg: "#0d1117",
    previewBg: "#0d1117",
    previewScheme: "dark",
    accentColor: "#58a6ff",
    tagBg: "rgba(88,166,255,0.12)",
    tagText: "#79c0ff",
    infoBg: "rgba(13,17,23,0.90)",
    infoText: "#e6edf3",
    infoSub: "#8b949e",
    infoBorder: "rgba(48,54,61,0.8)",
    badgeBg: "rgba(88,166,255,0.12)",
    badgeText: "#79c0ff",
    shadow: "0 4px 24px rgba(0,0,0,0.4)",
    hoverShadow: "0 16px 48px rgba(88,166,255,0.15)",
  },
  "fullstack-app": {
    cardBg: "#ffffff",
    previewBg: "#fdf4ff",
    previewScheme: "light",
    accentColor: "#7c3aed",
    tagBg: "#f5f3ff",
    tagText: "#6d28d9",
    infoBg: "rgba(255,255,255,0.92)",
    infoText: "#1e1b4b",
    infoSub: "#6b7280",
    infoBorder: "rgba(196,181,253,0.5)",
    badgeBg: "#f5f3ff",
    badgeText: "#6d28d9",
    shadow: "0 4px 24px rgba(124,58,237,0.10)",
    hoverShadow: "0 16px 48px rgba(124,58,237,0.22)",
  },
  "showcase": {
    cardBg: "#09090f",
    previewBg: "#09090f",
    previewScheme: "dark",
    accentColor: "#f59e0b",
    tagBg: "rgba(245,158,11,0.12)",
    tagText: "#fbbf24",
    infoBg: "rgba(9,9,15,0.92)",
    infoText: "#fafafa",
    infoSub: "#71717a",
    infoBorder: "rgba(63,63,70,0.6)",
    badgeBg: "rgba(245,158,11,0.12)",
    badgeText: "#fbbf24",
    shadow: "0 4px 24px rgba(0,0,0,0.5)",
    hoverShadow: "0 16px 48px rgba(245,158,11,0.15)",
  },
  "open-source": {
    cardBg: "#ffffff",
    previewBg: "#f0fdf4",
    previewScheme: "light",
    accentColor: "#16a34a",
    tagBg: "#dcfce7",
    tagText: "#15803d",
    infoBg: "rgba(240,253,244,0.92)",
    infoText: "#052e16",
    infoSub: "#4b7a5d",
    infoBorder: "rgba(134,239,172,0.5)",
    badgeBg: "#dcfce7",
    badgeText: "#15803d",
    shadow: "0 4px 24px rgba(22,163,74,0.08)",
    hoverShadow: "0 16px 48px rgba(22,163,74,0.20)",
  },
  "startup": {
    cardBg: "#0a0014",
    previewBg: "#0a0014",
    previewScheme: "dark",
    accentColor: "#d946ef",
    tagBg: "rgba(217,70,239,0.12)",
    tagText: "#e879f9",
    infoBg: "rgba(10,0,20,0.92)",
    infoText: "#fafafa",
    infoSub: "#71717a",
    infoBorder: "rgba(88,28,135,0.5)",
    badgeBg: "rgba(217,70,239,0.12)",
    badgeText: "#e879f9",
    shadow: "0 4px 24px rgba(0,0,0,0.5)",
    hoverShadow: "0 16px 48px rgba(217,70,239,0.18)",
  },
};

const GALLERY = TEMPLATES.slice(0, 5); // first 5 templates

// Templates that get a "New" badge
const NEW_TEMPLATE_IDS = new Set(["showcase", "startup"]);

export default function StyleStep({ onSelect, onBack }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [picked, setPicked]           = useState<TemplateId | null>(null);
  const [modalTemplate, setModalTemplate] = useState<TemplateConfig | null>(null);
  const [hovered, setHovered]         = useState<string | null>(null);
  const [showLeftArrow, setShowLeftArrow]   = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [currentCard, setCurrentCard] = useState(1);
  const [cardsReady, setCardsReady]   = useState(false);

  const CARD_W = 400;
  const GAP    = 20;

  // Trigger stagger entrance after mount
  useEffect(() => {
    const id = requestAnimationFrame(() => setCardsReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (CARD_W + GAP), behavior: "smooth" });
  };

  const focusCard = (idx: number) => {
    const clamped = Math.max(0, Math.min(GALLERY.length - 1, idx));
    cardRefs.current[clamped]?.focus();
    scrollRef.current?.scrollTo({ left: clamped * (CARD_W + GAP), behavior: "smooth" });
  };

  const handleGalleryKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); focusCard(currentCard); }      // currentCard is 1-based, so currentCard = next
    if (e.key === "ArrowLeft")  { e.preventDefault(); focusCard(currentCard - 2); }  // currentCard-1 = current, -2 = prev
  };

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeftArrow(el.scrollLeft > 20);
    setShowRightArrow(el.scrollLeft < el.scrollWidth - el.clientWidth - 20);
    const idx = Math.round(el.scrollLeft / (CARD_W + GAP)) + 1;
    setCurrentCard(Math.max(1, Math.min(GALLERY.length, idx)));
  };

  const selectedTemplate = picked ? TEMPLATES.find((t) => t.id === picked) ?? null : null;

  return (
    <>
    <div className="flex flex-col" style={{ height: "calc(100vh - 64px)" }}>

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-6 py-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-white transition-colors px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800/60"
            >
              <ChevronLeft size={16} />
              Back
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-blue-500" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Choose a template
              </span>
            </div>
            <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">
              Scroll to browse · Click to select · Describe your project in chat
            </p>
          </div>
        </div>

        {/* Progress + CTA */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 dark:text-zinc-600 tabular-nums select-none">
            {currentCard} <span className="opacity-40">/</span> {GALLERY.length}
          </span>
          <MagneticButton
            onClick={() => selectedTemplate && setModalTemplate(selectedTemplate)}
            disabled={!picked}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200"
            style={
              picked
                ? { background: THEMES[picked]?.accentColor ?? "#2563eb", color: "#fff" }
                : { background: "transparent", color: "#9ca3af", border: "1px solid #e5e7eb", cursor: "not-allowed" }
            }
          >
            {picked ? (
              <><Check size={15} /> Preview &ldquo;{selectedTemplate?.name}&rdquo;</>
            ) : (
              <>Select a template <ArrowRight size={15} /></>
            )}
          </MagneticButton>
        </div>
      </div>

      {/* ── Gallery ── */}
      <div className="relative flex-1 overflow-hidden group/gallery">

        {/* Left arrow */}
        <button
          onClick={() => scrollBy(-1)}
          aria-label="Previous template"
          className={`absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white dark:bg-zinc-800 shadow-lg border border-gray-200 dark:border-zinc-700 flex items-center justify-center text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${
            showLeftArrow ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none"
          }`}
        >
          <ChevronLeft size={18} />
        </button>

        {/* Right arrow */}
        <button
          onClick={() => scrollBy(1)}
          aria-label="Next template"
          className={`absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white dark:bg-zinc-800 shadow-lg border border-gray-200 dark:border-zinc-700 flex items-center justify-center text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${
            showRightArrow ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2 pointer-events-none"
          }`}
        >
          <ChevronRight size={18} />
        </button>

        {/* Scroll track */}
        <div
          ref={scrollRef}
          onScroll={onScroll}
          onKeyDown={handleGalleryKeyDown}
          role="listbox"
          aria-label="Project README templates"
          aria-orientation="horizontal"
          className="h-full flex gap-5 overflow-x-auto pb-4 gallery-scroll"
          style={{ paddingLeft: 24, paddingRight: 24 }}
        >
          {GALLERY.map((template, idx) => {
            const theme = THEMES[template.id] ?? THEMES["clean-library"];
            const isSelected = picked === template.id;
            const isHovered  = hovered === template.id;
            const isNew      = NEW_TEMPLATE_IDS.has(template.id);
            const bestForStr = template.bestFor?.slice(0, 2).join(", ") ?? template.category;

            return (
              <div
                key={template.id}
                ref={(el) => { cardRefs.current[idx] = el; }}
                role="option"
                tabIndex={0}
                aria-selected={isSelected}
                aria-label={`Template: ${template.name}, best for ${bestForStr}. ${idx + 1} of ${GALLERY.length}.`}
                className={`gallery-card relative flex-shrink-0 rounded-[20px] overflow-hidden ${cardsReady ? "gallery-card-enter" : "opacity-0"}`}
                style={{
                  width: CARD_W,
                  height: "calc(85vh - 80px)",
                  background: theme.cardBg,
                  boxShadow: isHovered || isSelected ? theme.hoverShadow : theme.shadow,
                  transform: isHovered ? "scale(1.02) translateY(-8px)" : "scale(1) translateY(0)",
                  transition: "transform 0.3s cubic-bezier(.03,.98,.52,.99), box-shadow 0.3s ease",
                  border: isSelected ? `2px solid ${theme.accentColor}` : "2px solid transparent",
                  cursor: "pointer",
                  animationDelay: `${idx * 65}ms`,
                  ["--focus-ring" as string]: theme.accentColor,
                }}
                onMouseEnter={() => setHovered(template.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => { setPicked(template.id); setModalTemplate(template); }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setPicked(template.id);
                    setModalTemplate(template);
                  }
                  if (e.key === "ArrowRight") { e.preventDefault(); focusCard(idx + 1); }
                  if (e.key === "ArrowLeft")  { e.preventDefault(); focusCard(idx - 1); }
                }}
              >
                {/* ── NEW badge ── */}
                {isNew && (
                  <div className="absolute top-4 left-4 z-20">
                    <span
                      className="badge-new text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                      style={{ background: theme.accentColor, color: "#fff" }}
                    >
                      New
                    </span>
                  </div>
                )}

                {/* ── Selected checkmark ── */}
                {isSelected && (
                  <div
                    className="absolute top-4 right-4 z-20 w-7 h-7 rounded-full flex items-center justify-center shadow-lg"
                    style={{ background: theme.accentColor }}
                  >
                    <Check size={14} className="text-white" />
                  </div>
                )}

                {/* ── Preview area (top 70%) ── */}
                <div
                  className="relative overflow-hidden"
                  style={{
                    height: "68%",
                    background: theme.previewBg,
                    transform: isHovered ? "scale(1.03)" : "scale(1)",
                    transformOrigin: "top center",
                    transition: "transform 0.4s cubic-bezier(.03,.98,.52,.99)",
                  }}
                >
                  <div
                    className={`readme-preview-${theme.previewScheme} absolute inset-0 overflow-hidden p-6`}
                    style={{ pointerEvents: "none", userSelect: "none" }}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {template.readme}
                    </ReactMarkdown>
                  </div>
                  {/* Bottom fade */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
                    style={{
                      background: `linear-gradient(to top, ${theme.previewBg}, transparent)`,
                    }}
                  />
                  {/* Color accent strip */}
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5"
                    style={{ background: theme.accentColor, opacity: 0.7 }}
                  />
                </div>

                {/* ── Info panel (bottom 32%) ── */}
                <div
                  className="absolute bottom-0 left-0 right-0"
                  style={{
                    height: "34%",
                    background: theme.infoBg,
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    borderTop: `1px solid ${theme.infoBorder}`,
                    padding: "20px 24px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    {/* Category tag */}
                    <div className="flex items-center gap-2 mb-2.5">
                      <span
                        className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
                        style={{ background: theme.tagBg, color: theme.tagText }}
                      >
                        {template.category}
                      </span>
                    </div>

                    <h3
                      className="text-lg font-bold mb-1 leading-tight"
                      style={{ color: theme.infoText }}
                    >
                      {template.name}
                    </h3>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: theme.infoSub }}
                    >
                      {template.tagline} &mdash; e.g. {template.example}
                    </p>
                  </div>

                  {/* CTA — slides up on hover */}
                  <div
                    className="flex items-center justify-between"
                    style={{
                      transform: isHovered ? "translateY(0)" : "translateY(6px)",
                      opacity: isHovered ? 1 : 0.6,
                      transition: "transform 0.25s ease, opacity 0.25s ease",
                    }}
                  >
                    <div className="flex gap-1.5 flex-wrap">
                      {[template.style].map((s) => (
                        <span
                          key={s}
                          className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={{ background: theme.badgeBg, color: theme.badgeText }}
                        >
                          {s.charAt(0).toUpperCase() + s.slice(1)} style
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPicked(template.id);
                        setModalTemplate(template);
                      }}
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                      style={{ background: theme.accentColor, color: "#fff" }}
                    >
                      Preview
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Right spacer so last card can scroll to center-ish */}
          <div className="flex-shrink-0 w-6" />
        </div>

        {/* Left edge fade */}
        <div
          className="absolute left-0 top-0 bottom-4 w-8 pointer-events-none z-10 transition-opacity duration-300"
          style={{
            background: "linear-gradient(to right, var(--fade-edge, #f8fafc), transparent)",
            opacity: showLeftArrow ? 1 : 0,
          }}
        />
        {/* Right edge fade */}
        <div
          className="absolute right-0 top-0 bottom-4 w-16 pointer-events-none z-10"
          style={{
            background: "linear-gradient(to left, var(--fade-edge, #f8fafc), transparent)",
            opacity: showRightArrow ? 1 : 0,
          }}
        />
      </div>

      {/* ── Scroll indicator dots ── */}
      <div className="flex items-center justify-center gap-1.5 py-3 flex-shrink-0" aria-hidden="true">
        {GALLERY.map((t) => (
          <div
            key={t.id}
            className="rounded-full transition-all duration-300"
            style={{
              width: picked === t.id ? 20 : 6,
              height: 6,
              background: picked === t.id
                ? (THEMES[t.id]?.accentColor ?? "#2563eb")
                : "#d1d5db",
            }}
          />
        ))}
      </div>

      {/* Screen reader live region — announces scroll position */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {`Template ${currentCard} of ${GALLERY.length}${picked ? `, ${selectedTemplate?.name} selected` : ""}`}
      </div>

    </div>

    {/* ── Preview detail modal ── */}
    {modalTemplate && (
      <TemplatePreviewModal
        isOpen={true}
        onClose={() => setModalTemplate(null)}
        onConfirm={() => onSelect(modalTemplate!.id)}
        name={modalTemplate.name}
        tagline={`${modalTemplate.tagline} — e.g. ${modalTemplate.example}`}
        readme={modalTemplate.readme}
        previewScheme={THEMES[modalTemplate.id]?.previewScheme ?? "light"}
        bestFor={modalTemplate.bestFor}
        sections={modalTemplate.sections}
        estimatedTime={modalTemplate.estimatedTime}
        confirmLabel="Build with this template"
        accentColor={THEMES[modalTemplate.id]?.accentColor ?? "#2563eb"}
      />
    )}
    </>
  );
}
