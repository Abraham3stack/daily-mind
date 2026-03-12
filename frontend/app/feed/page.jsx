"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CreatePostModal from "@/components/CreatePostModal";
import Navbar from "@/components/Navbar";
import { AIFactSkeletonCard, DarkProfileSkeleton, LoadingBanner, PostSkeletonCard } from "@/components/LoadingState";
import PostCard from "@/components/PostCard";
import { getAIFacts, getFacts, getStoredUser, getToken } from "@/services/api";

export default function FeedPage() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [aiFacts, setAiFacts] = useState([]);
  const [isGeneratingFacts, setIsGeneratingFacts] = useState(false);
  const [aiError, setAiError] = useState("");

  const loadFacts = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getFacts();
      const normalizedFacts = Array.isArray(data) ? data : data?.facts || [];
      setPosts(normalizedFacts);
    } catch (loadError) {
      setError(loadError.response?.data?.message || "Unable to load the feed.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }

    setCurrentUser(getStoredUser());
    loadFacts();
  }, [router]);

  const handleGenerateFacts = async () => {
    setIsGeneratingFacts(true);
    setAiError("");

    try {
      const data = await getAIFacts();
      setAiFacts(data?.facts || []);
    } catch (generateError) {
      setAiError(generateError.response?.data?.message || "Unable to generate AI facts.");
    } finally {
      setIsGeneratingFacts(false);
    }
  };

  return (
    <main className="page-shell">
      <Navbar onCreatePost={() => setIsCreateModalOpen(true)} />
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={loadFacts}
      />

      <section className="mt-6 grid gap-5 md:mt-8 md:gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <div className="glass-panel rounded-[1.6rem] border border-white/80 p-4 shadow-card sm:rounded-[2rem] sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Feed</p>
                <h1 className="mt-2 font-[var(--font-display)] text-2xl font-bold sm:text-3xl">Today’s discoveries</h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-600">
                  Browse what the community learned today, then react or jump into the discussion.
                </p>
              </div>
              <button
                className="w-full rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto"
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
              >
                Share a fact
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.6rem] border border-teal-200 bg-gradient-to-br from-teal-600 via-teal-700 to-ink p-4 text-white shadow-card sm:rounded-[2rem] sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm uppercase tracking-[0.32em] text-teal-100">AI Boost</p>
                <h2 className="mt-2 font-[var(--font-display)] text-2xl font-bold sm:text-3xl">
                  Generate instant learning prompts
                </h2>
                <p className="mt-3 max-w-xl text-sm text-teal-50/90">
                  Need inspiration? Pull five short AI-generated facts and keep the feed moving, even when there are already community posts.
                </p>
              </div>
              <button
                className="w-full rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-teal-800 transition hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                type="button"
                onClick={handleGenerateFacts}
                disabled={isGeneratingFacts}
              >
                {isGeneratingFacts ? "Fetching facts..." : "Generate AI Facts"}
              </button>
            </div>
          </div>

          {aiError ? (
            <div className="rounded-[2rem] border border-rose-100 bg-rose-50 p-5 text-sm text-rose-600">
              {aiError}
            </div>
          ) : null}

          {isGeneratingFacts ? (
            <div className="space-y-4">
              <LoadingBanner message="Fetching AI-generated facts for the feed." />
              {Array.from({ length: 3 }).map((_, index) => (
                <AIFactSkeletonCard key={index} />
              ))}
            </div>
          ) : null}

          {!isGeneratingFacts && aiFacts.length ? (
            <div className="space-y-4">
              <div className="glass-panel rounded-[2rem] border border-white/80 p-5 shadow-card">
                <p className="text-sm uppercase tracking-[0.3em] text-teal-700">AI Facts</p>
                <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold">Fresh discoveries</h2>
                <p className="mt-2 text-sm text-slate-600">
                  AI-generated fact ideas you can browse even when the community feed already has posts.
                </p>
              </div>

              {aiFacts.map((fact, index) => (
                <article
                  key={`${fact}-${index}`}
                  className="glass-panel rounded-[1.6rem] border border-white/80 p-4 shadow-card sm:rounded-[2rem] sm:p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-700">AI Generated</p>
                      <h3 className="mt-3 text-base font-semibold leading-7 text-slate-900 sm:text-lg sm:leading-8">{fact}</h3>
                    </div>
                    <div className="w-fit rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
                      Suggested
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : null}

          {isLoading ? (
            <>
              <LoadingBanner message="Fetching the latest facts from the community." />

              {Array.from({ length: 3 }).map((_, index) => (
                <PostSkeletonCard key={index} />
              ))}
            </>
          ) : null}

          {error ? (
            <div className="rounded-[2rem] border border-rose-100 bg-rose-50 p-5 text-sm text-rose-600">
              {error}
            </div>
          ) : null}

          {!isLoading && !posts.length ? (
            <div className="glass-panel rounded-[2rem] border border-white/80 p-8 shadow-card">
              <h2 className="font-[var(--font-display)] text-2xl font-semibold">No posts yet</h2>
              <p className="mt-2 text-sm text-slate-600">Be the first to share something new you learned.</p>
            </div>
          ) : null}

          {posts.map((post) => (
            <PostCard key={post.id || post._id} post={post} currentUser={currentUser} onPostUpdated={loadFacts} />
          ))}
        </div>

        <aside className="order-first space-y-4 xl:order-none">
          <div className="glass-panel rounded-[1.6rem] border border-white/80 p-5 shadow-card sm:rounded-[2rem] sm:p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-coral">Your streak</p>
            <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold">Keep learning in public</h2>
            <p className="mt-3 text-sm text-slate-600">
              The strongest feeds stay specific. Post one clear takeaway, keep it useful, and tag it with the best category.
            </p>
          </div>

          <div className="rounded-[1.6rem] border border-teal-300/25 bg-gradient-to-br from-ink via-slate-900 to-teal-900 p-5 text-white shadow-[0_28px_80px_-32px_rgba(15,23,42,0.75)] sm:rounded-[2rem] sm:p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-teal-200">Profile snapshot</p>
            {isLoading && !currentUser ? (
              <DarkProfileSkeleton />
            ) : (
              <>
                <h3 className="mt-3 font-[var(--font-display)] text-2xl font-semibold drop-shadow-[0_10px_18px_rgba(15,23,42,0.35)]">
                  {currentUser?.name || "Curious learner"}
                </h3>
                <p className="mt-2 text-sm text-slate-300">
                  {currentUser?.email || "Sign in to personalize your feed."}
                </p>
              </>
            )}
          </div>
        </aside>
      </section>
    </main>
  );
}
