"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/services/api";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    router.replace(token ? "/feed" : "/login");
  }, [router]);

  return (
    <main className="page-shell flex items-center justify-center">
      <div className="glass-panel rounded-3xl border border-white/70 px-8 py-12 text-center shadow-card">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">DailyMind</p>
        <h1 className="mt-3 font-[var(--font-display)] text-3xl font-bold">
          Building your knowledge feed...
        </h1>
      </div>
    </main>
  );
}
