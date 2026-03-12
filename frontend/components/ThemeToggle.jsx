"use client";

import { useTheme } from "@/components/ThemeProvider";

export default function ThemeToggle({ className = "" }) {
  const { isDark, toggleTheme, mounted } = useTheme();

  return (
    <button
      className={`relative flex h-11 w-[88px] items-center rounded-full border border-white/70 bg-white/80 p-1 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.45)] transition duration-500 dark:border-white/10 dark:bg-slate-900/80 ${className}`}
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle light and dark theme"
    >
      <span
        className={`absolute left-1 top-1 h-9 w-9 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-coral shadow-[0_12px_24px_-14px_rgba(249,115,96,0.9)] transition duration-500 ${
          mounted && isDark ? "translate-x-[44px] rotate-[180deg]" : "translate-x-0 rotate-0"
        }`}
      />
      <span className="relative z-10 flex w-full items-center justify-between px-2 text-sm">
        <span className={`transition duration-300 ${mounted && !isDark ? "text-ink" : "text-slate-400"}`}>☀</span>
        <span className={`transition duration-300 ${mounted && isDark ? "text-white" : "text-slate-400"}`}>☾</span>
      </span>
    </button>
  );
}
