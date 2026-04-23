"use client";

import { useEffect, useRef, useState } from "react";

type CursorState = { visible: boolean; label: string; x: number; y: number };

export default function CustomCursor() {
  const rafRef = useRef<number | null>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const elRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CursorState>({
    visible: false,
    label: "VIEW",
    x: 0,
    y: 0,
  });

  useEffect(() => {
    // Use rAF to throttle DOM updates for smooth tracking
    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };

      const target = (e.target as Element).closest("[data-cursor]") as HTMLElement | null;
      const label = target?.dataset.cursor ?? null;

      setState((prev) => ({
        visible: !!label,
        label: label ?? prev.label,
        x: e.clientX,
        y: e.clientY,
      }));
    };

    const onLeave = () => setState((p) => ({ ...p, visible: false }));

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (typeof window === "undefined") return null;

  return (
    <div
      ref={elRef}
      aria-hidden="true"
      className="fixed pointer-events-none z-[9999] top-0 left-0"
      style={{
        transform: `translate(${state.x}px, ${state.y}px) translate(-50%, -50%)`,
        transition: "transform 0.06s linear, opacity 0.2s ease, scale 0.2s cubic-bezier(0.4,0,0.2,1)",
        opacity: state.visible ? 1 : 0,
        scale: state.visible ? "1" : "0.6",
      }}
    >
      <div
        className="w-[68px] h-[68px] rounded-full flex items-center justify-center text-[11px] font-bold tracking-widest uppercase select-none"
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(8px)",
          color: "#09090b",
          boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
          letterSpacing: "0.12em",
        }}
      >
        {state.label}
      </div>
    </div>
  );
}
