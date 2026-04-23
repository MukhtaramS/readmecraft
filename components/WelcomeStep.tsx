"use client";

import { useRef, useState, useCallback } from "react";
import { FileText, User, ArrowRight, Sparkles, Terminal, Hash, AtSign, BarChart2 } from "lucide-react";

type Props = {
  onSelectProject: () => void;
  onSelectProfile: () => void;
};

// ── Floating code tokens (left card background) ──────────────────────────────
const CODE_TOKENS = [
  { text: "## Installation", color: "#60a5fa", x: 6,  y: 10, delay: 0,   dur: 7 },
  { text: "npm install",     color: "#fbbf24", x: 58, y: 7,  delay: 1.2, dur: 9 },
  { text: "[![License]",     color: "#a78bfa", x: 72, y: 52, delay: 0.6, dur: 8 },
  { text: "## Features",     color: "#34d399", x: 8,  y: 58, delay: 2,   dur: 10 },
  { text: "git clone",       color: "#60a5fa", x: 42, y: 82, delay: 0.3, dur: 7.5 },
  { text: "## Usage",        color: "#34d399", x: 78, y: 78, delay: 1.5, dur: 9.5 },
  { text: "const cfg = {",   color: "#f472b6", x: 20, y: 32, delay: 0.9, dur: 8 },
  { text: "badge shields",   color: "#a78bfa", x: 55, y: 32, delay: 1.8, dur: 7 },
];

// ── Mini contribution grid rows (right card background) ───────────────────────
const CONTRIB_COLORS = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];
function makeGrid(rows: number, cols: number) {
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => {
      const v = Math.floor(Math.abs(Math.sin(r * 7 + c * 3)) * 5);
      return CONTRIB_COLORS[v];
    })
  );
}
const GRID = makeGrid(7, 22);

// ── 3-D tilt hook ─────────────────────────────────────────────────────────────
function useTilt() {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({
    transform: "perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)",
    transition: "transform 0.5s cubic-bezier(.03,.98,.52,.99)",
  });

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    setStyle({
      transform: `perspective(1200px) rotateX(${-y * 9}deg) rotateY(${x * 9}deg) translateY(-10px) scale(1.015)`,
      transition: "transform 0.1s linear",
    });
  }, []);

  const onLeave = useCallback(() => {
    setStyle({
      transform: "perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)",
      transition: "transform 0.5s cubic-bezier(.03,.98,.52,.99)",
    });
  }, []);

  return { ref, style, onMove, onLeave };
}

export default function WelcomeStep({ onSelectProject, onSelectProfile }: Props) {
  const project = useTilt();
  const profile = useTilt();

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">

      {/* ── Ambient background orbs ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="orb-blue" />
        <div className="orb-purple" />
        <div className="orb-indigo" />
      </div>

      {/* ── Header area ── */}
      <div className="relative z-10 pt-14 pb-8 text-center px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 text-gray-600 dark:text-zinc-300 text-xs font-medium mb-5 shadow-sm">
          <Sparkles size={12} className="text-blue-500" />
          README Generator &amp; Builder
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
          What are you building?
        </h1>
        <p className="text-gray-500 dark:text-zinc-500 text-sm sm:text-base max-w-sm mx-auto">
          Pick a README type and generate something great in seconds.
        </p>
      </div>

      {/* ── Portal cards ── */}
      <div className="relative z-10 flex-1 flex flex-col sm:flex-row gap-4 px-4 sm:px-8 pb-10 max-w-5xl mx-auto w-full" style={{ minHeight: "62vh" }}>

        {/* ─── LEFT: Project README ─────────────────────────────────────── */}
        <div
          ref={project.ref}
          style={{ ...project.style, flex: 1 }}
          onMouseMove={project.onMove}
          onMouseLeave={project.onLeave}
          onClick={onSelectProject}
          className="portal-card group cursor-pointer relative rounded-3xl overflow-hidden border border-blue-200/60 dark:border-blue-500/20 bg-white dark:bg-[#0c0f1a] shadow-xl"
        >
          {/* Gradient border glow on hover */}
          <div className="portal-glow-blue" />

          {/* Floating code tokens */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
            {CODE_TOKENS.map((t, i) => (
              <span
                key={i}
                className="absolute font-mono text-[11px] font-medium opacity-0 group-hover:opacity-100 whitespace-nowrap"
                style={{
                  color: t.color,
                  left: `${t.x}%`,
                  top: `${t.y}%`,
                  opacity: 0.18,
                  animation: `floatToken ${t.dur}s ${t.delay}s ease-in-out infinite alternate`,
                  filter: "blur(0.3px)",
                }}
              >
                {t.text}
              </span>
            ))}
            {/* Subtle blue radial glow */}
            <div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(59,130,246,0.08) 0%, transparent 70%)",
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col h-full p-8 sm:p-10">
            {/* Icon */}
            <div className="mb-auto">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-transform duration-300 group-hover:rotate-[-4deg] group-hover:scale-110"
                style={{ background: "linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)" }}
              >
                <FileText size={38} className="text-white drop-shadow" />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-blue-400 dark:text-blue-400">
                  Project README
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                For Your<br />Repository
              </h2>
              <p className="text-gray-500 dark:text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xs">
                Generate professional <code className="text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-1 py-0.5 rounded text-xs">README.md</code> files with installation guides, API docs, badges, and more.
              </p>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2 mt-8 mb-8">
              {["Badges", "Installation", "API Docs", "Contributing"].map((f) => (
                <span key={f} className="text-[11px] px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 font-medium">
                  {f}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="flex items-center gap-2 text-base font-semibold text-blue-600 dark:text-blue-400 group-hover:gap-3 transition-all duration-200">
              Start building
              <div className="w-7 h-7 rounded-full bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all duration-200">
                <ArrowRight size={15} />
              </div>
            </div>
          </div>
        </div>

        {/* ─── RIGHT: Profile README ────────────────────────────────────── */}
        <div
          ref={profile.ref}
          style={{ ...profile.style, flex: 1 }}
          onMouseMove={profile.onMove}
          onMouseLeave={profile.onLeave}
          onClick={onSelectProfile}
          className="portal-card group cursor-pointer relative rounded-3xl overflow-hidden border border-purple-200/60 dark:border-purple-500/20 bg-white dark:bg-[#100c1a] shadow-xl"
        >
          {/* Gradient border glow on hover */}
          <div className="portal-glow-purple" />

          {/* Contribution grid background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
            <div
              className="absolute bottom-0 left-0 right-0 flex flex-col gap-[3px] px-5 pb-5 opacity-20"
              style={{ animation: "fadeUp 1s ease-out" }}
            >
              {GRID.map((row, r) => (
                <div key={r} className="flex gap-[3px]">
                  {row.map((color, c) => (
                    <div
                      key={c}
                      className="rounded-[2px]"
                      style={{
                        width: 12,
                        height: 12,
                        background: color,
                        animation: `pulseCell 3s ${((r * 22 + c) * 0.04) % 2}s ease-in-out infinite alternate`,
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
            {/* Floating icons */}
            {[
              { icon: <BarChart2 size={16} />, x: 72, y: 18, delay: 0.5, color: "#a78bfa" },
              { icon: <Hash size={14} />, x: 14, y: 24, delay: 1.2, color: "#c084fc" },
              { icon: <AtSign size={15} />, x: 82, y: 44, delay: 0.2, color: "#f472b6" },
              { icon: <Terminal size={14} />, x: 10, y: 60, delay: 1.8, color: "#a78bfa" },
            ].map((item, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  color: item.color,
                  opacity: 0.3,
                  animation: `floatToken 6s ${item.delay}s ease-in-out infinite alternate`,
                }}
              >
                {item.icon}
              </div>
            ))}
            {/* Purple radial glow */}
            <div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(139,92,246,0.09) 0%, transparent 70%)",
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col h-full p-8 sm:p-10">
            {/* Icon */}
            <div className="mb-auto">
              <div className="relative w-20 h-20 mb-6">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:rotate-[4deg] group-hover:scale-110"
                  style={{ background: "linear-gradient(135deg, #7c3aed 0%, #c084fc 100%)" }}
                >
                  <User size={38} className="text-white drop-shadow" />
                </div>
                {/* Ring animation */}
                <div className="absolute inset-0 rounded-2xl border-2 border-purple-400/40 scale-0 group-hover:scale-125 opacity-0 group-hover:opacity-0 transition-all duration-700 animate-ping-slow" />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-purple-400">
                  Profile README
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                For Your<br />GitHub Profile
              </h2>
              <p className="text-gray-500 dark:text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xs">
                Create a stunning profile README with GitHub stats, skill badges, and social links that make people want to connect.
              </p>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2 mt-8 mb-8">
              {["GitHub Stats", "Skill Icons", "Social Links", "Activity"].map((f) => (
                <span key={f} className="text-[11px] px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-500/20 font-medium">
                  {f}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="flex items-center gap-2 text-base font-semibold text-purple-600 dark:text-purple-400 group-hover:gap-3 transition-all duration-200">
              Start building
              <div className="w-7 h-7 rounded-full bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-all duration-200">
                <ArrowRight size={15} />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="relative z-10 text-center pb-8">
        <p className="text-xs text-gray-400 dark:text-zinc-600">
          Free to use · No account needed · No AI required
        </p>
      </div>

    </div>
  );
}
