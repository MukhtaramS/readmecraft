"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { X, Clock, Check, ArrowLeft, ArrowRight, Loader2, ChevronDown } from "lucide-react";

export type ModalSection = { label: string; description: string };

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  name: string;
  tagline: string;
  readme: string;
  previewScheme?: "light" | "dark";
  bestFor: string[];
  sections: ModalSection[];
  estimatedTime: string;
  confirmLabel?: string;
  loadingMessage?: string;
  accentColor?: string;
};

export default function TemplatePreviewModal({
  isOpen, onClose, onConfirm,
  name, tagline, readme,
  previewScheme = "light",
  bestFor, sections, estimatedTime,
  confirmLabel = "Start with this template",
  loadingMessage,
  accentColor = "#3b82f6",
}: Props) {
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sectionsOpen, setSectionsOpen] = useState(true);
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmBtnRef = useRef<HTMLButtonElement>(null);
  const titleId = `modal-title-${name.replace(/\s+/g, "-").toLowerCase()}`;

  // Animate in/out
  useEffect(() => {
    if (isOpen) {
      const id = requestAnimationFrame(() => {
        setVisible(true);
        // Move focus into modal after paint
        requestAnimationFrame(() => confirmBtnRef.current?.focus());
      });
      return () => cancelAnimationFrame(id);
    } else {
      setVisible(false);
      setIsLoading(false);
    }
  }, [isOpen]);

  // Escape key + focus trap
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key !== "Tab") return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])'
        )
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
    },
    [onClose]
  );
  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, handleKey]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleConfirm = async () => {
    setIsLoading(true);
    await onConfirm();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{
        backdropFilter: visible ? "blur(14px)" : "blur(0px)",
        WebkitBackdropFilter: visible ? "blur(14px)" : "blur(0px)",
        backgroundColor: visible ? "rgba(0,0,0,0.65)" : "rgba(0,0,0,0)",
        transition: "backdrop-filter 0.35s ease, background-color 0.35s ease",
      }}
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full flex overflow-hidden rounded-2xl shadow-2xl"
        style={{
          maxWidth: 980,
          height: "min(88vh, 680px)",
          transform: visible ? "scale(1) translateY(0)" : "scale(0.95) translateY(20px)",
          opacity: visible ? 1 : 0,
          transition: "transform 0.38s cubic-bezier(.03,.98,.52,.99), opacity 0.3s ease",
          background: previewScheme === "dark" ? "#0d1117" : "#ffffff",
        }}
        onClick={(e) => e.stopPropagation()}
      >

        {/* ── LEFT: Scrollable README preview ────────────────────────────── */}
        <div
          className="flex-1 overflow-y-auto border-r"
          style={{ borderColor: previewScheme === "dark" ? "#21262d" : "#e2e8f0" }}
        >
          {/* Preview header bar */}
          <div
            className="sticky top-0 z-10 flex items-center gap-2 px-5 py-3 text-xs font-medium border-b"
            style={{
              background: previewScheme === "dark" ? "#161b22" : "#f6f8fa",
              borderColor: previewScheme === "dark" ? "#21262d" : "#e2e8f0",
              color: previewScheme === "dark" ? "#8b949e" : "#57606a",
            }}
          >
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <span className="ml-2">README.md — preview</span>
          </div>

          <div className={`readme-preview-${previewScheme} p-8`} style={{ userSelect: "none", pointerEvents: "none" }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{readme}</ReactMarkdown>
          </div>
        </div>

        {/* ── RIGHT: Details panel ────────────────────────────────────────── */}
        <div
          className="flex flex-col overflow-hidden"
          style={{
            width: 300,
            flexShrink: 0,
            background: previewScheme === "dark" ? "#0d1117" : "#ffffff",
          }}
        >
          {/* Panel header */}
          <div
            className="p-5 border-b flex-shrink-0"
            style={{ borderColor: previewScheme === "dark" ? "#21262d" : "#e2e8f0" }}
          >
            <div className="flex items-center justify-between mb-3">
              {/* Accent strip */}
              <div className="h-1 w-8 rounded-full" style={{ background: accentColor }} />
              <button
                onClick={onClose}
                aria-label="Close preview"
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-500"
                style={{ color: previewScheme === "dark" ? "#8b949e" : "#57606a" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = previewScheme === "dark" ? "#21262d" : "#f3f4f6")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <X size={15} />
              </button>
            </div>
            <h2
              id={titleId}
              className="text-base font-bold mb-1"
              style={{ color: previewScheme === "dark" ? "#f0f6fc" : "#0f172a" }}
            >
              {name}
            </h2>
            <p
              className="text-xs leading-relaxed"
              style={{ color: previewScheme === "dark" ? "#8b949e" : "#57606a" }}
            >
              {tagline}
            </p>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">

            {/* Best for */}
            <div>
              <p
                className="text-[10px] font-semibold uppercase tracking-widest mb-2"
                style={{ color: previewScheme === "dark" ? "#8b949e" : "#6b7280" }}
              >
                Best for
              </p>
              <div className="flex flex-wrap gap-1.5">
                {bestFor.map((use) => (
                  <span
                    key={use}
                    className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                    style={{
                      background: `${accentColor}18`,
                      color: accentColor,
                    }}
                  >
                    {use}
                  </span>
                ))}
              </div>
            </div>

            {/* Sections included */}
            <div>
              <button
                onClick={() => setSectionsOpen((o) => !o)}
                className="flex items-center justify-between w-full mb-2 transition-colors"
                style={{ color: previewScheme === "dark" ? "#8b949e" : "#6b7280" }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-widest">
                  Sections included
                </p>
                <ChevronDown
                  size={13}
                  style={{
                    transform: sectionsOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </button>

              {sectionsOpen && (
                <div className="space-y-2">
                  {sections.map((s) => (
                    <div key={s.label} className="flex items-start gap-2.5">
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                        style={{ background: `${accentColor}20` }}
                      >
                        <Check size={9} style={{ color: accentColor }} />
                      </div>
                      <div>
                        <div
                          className="text-xs font-medium"
                          style={{ color: previewScheme === "dark" ? "#e6edf3" : "#1e293b" }}
                        >
                          {s.label}
                        </div>
                        <div
                          className="text-[10px] mt-0.5"
                          style={{ color: previewScheme === "dark" ? "#8b949e" : "#94a3b8" }}
                        >
                          {s.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Time estimate */}
            <div
              className="flex items-center gap-2 text-[11px] px-3 py-2 rounded-lg"
              style={{
                background: previewScheme === "dark" ? "#161b22" : "#f8fafc",
                color: previewScheme === "dark" ? "#8b949e" : "#64748b",
              }}
            >
              <Clock size={12} style={{ color: accentColor }} />
              Est. completion:
              <span
                className="font-semibold ml-auto"
                style={{ color: previewScheme === "dark" ? "#e6edf3" : "#0f172a" }}
              >
                {estimatedTime}
              </span>
            </div>
          </div>

          {/* CTAs */}
          <div
            className="p-5 space-y-2 flex-shrink-0 border-t"
            style={{ borderColor: previewScheme === "dark" ? "#21262d" : "#e2e8f0" }}
          >
            <button
              ref={confirmBtnRef}
              onClick={handleConfirm}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                background: isLoading ? `${accentColor}90` : accentColor,
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  {loadingMessage ?? `Setting up ${name}…`}
                </>
              ) : (
                <>
                  {confirmLabel}
                  <ArrowRight size={14} />
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-sm transition-colors"
              style={{ color: previewScheme === "dark" ? "#8b949e" : "#64748b" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = previewScheme === "dark" ? "#21262d" : "#f3f4f6")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <ArrowLeft size={13} />
              Back to gallery
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
