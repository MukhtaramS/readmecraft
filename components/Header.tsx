"use client";

import { useState, useEffect } from "react";
import { FileText, Moon, Sun } from "lucide-react";

type Props = {
  onLogoClick?: () => void;
  rightContent?: React.ReactNode;
};

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    setDark(isDark);
    try { localStorage.setItem("theme", isDark ? "dark" : "light"); } catch {}
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800 transition-colors"
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}

export default function Header({ onLogoClick, rightContent }: Props) {
  return (
    <header className="border-b border-gray-200 dark:border-zinc-800/60 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-13 flex items-center justify-between">
        <button
          onClick={onLogoClick}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <FileText size={15} className="text-white" />
          </div>
          <span className="text-base font-semibold tracking-tight text-gray-900 dark:text-white">
            ReadMe<span className="text-blue-500 dark:text-blue-400">Craft</span>
          </span>
        </button>
        <div className="flex items-center gap-2">
          {rightContent}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
