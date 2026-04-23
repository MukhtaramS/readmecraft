"use client";

import { useRef, useState, useCallback } from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  strength?: number; // max pixel offset, default 8
};

export default function MagneticButton({
  children,
  className,
  style,
  strength = 8,
  disabled,
  ...rest
}: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      const el = ref.current;
      if (!el) return;
      const { left, top, width, height } = el.getBoundingClientRect();
      const x = ((e.clientX - left) / width - 0.5) * strength * 2;
      const y = ((e.clientY - top) / height - 0.5) * strength * 2;
      setPos({ x, y });
      setActive(true);
    },
    [disabled, strength]
  );

  const onLeave = useCallback(() => {
    setPos({ x: 0, y: 0 });
    setActive(false);
  }, []);

  return (
    <button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      disabled={disabled}
      className={className}
      style={{
        ...style,
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: active
          ? "transform 0.1s linear"
          : "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
        willChange: "transform",
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
