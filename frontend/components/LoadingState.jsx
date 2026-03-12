"use client";

export function LoadingBanner({ message }) {
  return (
    <div className="glass-panel rounded-[2rem] border border-white/80 p-5 shadow-card">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Loading</p>
          <p className="mt-2 text-sm text-slate-600">{message}</p>
        </div>
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-teal-700" />
      </div>
    </div>
  );
}

export function PostSkeletonCard({ compact = false }) {
  return (
    <div className="glass-panel animate-pulse rounded-[2rem] border border-white/80 p-5 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="h-4 w-24 rounded-full bg-teal-100" />
          <div className="mt-4 h-5 w-full rounded-full bg-slate-200" />
          <div className={`mt-3 h-5 rounded-full bg-slate-200 ${compact ? "w-3/4" : "w-4/5"}`} />
        </div>
        <div className="h-8 w-24 rounded-full bg-slate-200" />
      </div>

      <div className="mt-5 flex gap-3">
        <div className="h-4 w-16 rounded-full bg-slate-200" />
        <div className="h-4 w-24 rounded-full bg-slate-200" />
        {!compact ? <div className="h-4 w-20 rounded-full bg-slate-200" /> : null}
      </div>

      {!compact ? (
        <div className="mt-5 flex gap-3">
          <div className="h-10 w-20 rounded-full bg-amber-100" />
          <div className="h-10 w-24 rounded-full bg-slate-200" />
        </div>
      ) : null}
    </div>
  );
}

export function DarkProfileSkeleton() {
  return (
    <div className="mt-4 animate-pulse space-y-3">
      <div className="h-7 w-40 rounded-full bg-white/20" />
      <div className="h-4 w-48 rounded-full bg-white/15" />
    </div>
  );
}

export function ProfileInfoSkeleton() {
  return (
    <div className="mt-3 animate-pulse space-y-3">
      <div className="h-9 w-40 rounded-full bg-slate-200" />
      <div className="h-4 w-52 rounded-full bg-slate-200" />
    </div>
  );
}

export function StatSkeleton() {
  return <div className="mt-2 h-10 w-16 animate-pulse rounded-full bg-white" />;
}

export function CreateHeroSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-4 w-20 rounded-full bg-white/20" />
      <div className="h-12 w-3/4 rounded-full bg-white/15" />
      <div className="h-4 w-full rounded-full bg-white/10" />
      <div className="h-4 w-4/5 rounded-full bg-white/10" />
    </div>
  );
}

export function FactFormSkeleton() {
  return (
    <section className="glass-panel animate-pulse rounded-[2rem] border border-white/80 p-6 shadow-card sm:p-8">
      <div className="h-4 w-24 rounded-full bg-slate-200" />
      <div className="mt-3 h-10 w-40 rounded-full bg-slate-200" />
      <div className="mt-3 h-4 w-3/4 rounded-full bg-slate-200" />
      <div className="mt-8 h-48 rounded-[1.5rem] bg-slate-200" />
      <div className="mt-5 h-12 rounded-2xl bg-slate-200" />
      <div className="mt-5 h-12 rounded-2xl bg-slate-200" />
    </section>
  );
}

export function AIFactSkeletonCard() {
  return (
    <article className="glass-panel animate-pulse rounded-[2rem] border border-white/80 p-5 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="h-4 w-28 rounded-full bg-teal-100" />
          <div className="mt-4 h-5 w-full rounded-full bg-slate-200" />
          <div className="mt-3 h-5 w-4/5 rounded-full bg-slate-200" />
        </div>
        <div className="h-8 w-24 rounded-full bg-teal-100" />
      </div>
    </article>
  );
}
