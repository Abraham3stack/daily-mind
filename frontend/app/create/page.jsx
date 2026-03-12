"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CreateHeroSkeleton, FactFormSkeleton } from "@/components/LoadingState";
import Navbar from "@/components/Navbar";
import FactForm from "@/components/FactForm";
import { getToken } from "@/services/api";

export default function CreatePage() {
  const router = useRouter();
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }

    setIsPageLoading(false);
  }, [router]);

  return (
    <main className="page-shell">
      <Navbar />

      <section className="mt-6 grid gap-5 md:mt-8 md:gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[1.6rem] bg-ink p-6 text-white shadow-card sm:rounded-[2rem] sm:p-8">
          {isPageLoading ? (
            <CreateHeroSkeleton />
          ) : (
            <>
              <p className="text-sm uppercase tracking-[0.3em] text-teal-200">Create</p>
              <h1 className="mt-3 font-[var(--font-display)] text-3xl font-bold sm:text-4xl">Post today’s insight</h1>
              <p className="mt-4 max-w-lg text-sm text-slate-300">
                Keep it direct. Start with “Today I learned...” and write one useful fact people can absorb quickly in the feed.
              </p>
            </>
          )}
        </div>

        {isPageLoading ? (
          <FactFormSkeleton />
        ) : (
          <FactForm />
        )}
      </section>
    </main>
  );
}
