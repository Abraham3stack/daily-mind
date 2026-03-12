"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CreatePostModal from "@/components/CreatePostModal";
import { LoadingBanner, PostSkeletonCard, ProfileInfoSkeleton, StatSkeleton } from "@/components/LoadingState";
import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import { getFacts, getStoredUser, getToken, getUserById } from "@/services/api";

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const viewedUserId = searchParams.get("userId");
  const currentUser = getStoredUser();

  const loadProfile = async () => {
    setIsLoading(true);
    setError("");
    try {
      if (viewedUserId) {
        const selectedUser = await getUserById(viewedUserId);
        setUser(selectedUser);
      } else {
        setUser(currentUser);
      }

      const data = await getFacts();
      const normalizedFacts = Array.isArray(data) ? data : data?.facts || [];
      setPosts(normalizedFacts);
    } catch (loadError) {
      setError(loadError.response?.data?.message || "Unable to load profile data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }

    loadProfile();
  }, [router, viewedUserId]);

  const userPosts = useMemo(() => {
    if (!user) return posts;

    return posts.filter((post) => {
      const authorId = post.userId || post.user?._id || post.user?.id;
      const localUserId = user.id || user._id;
      const authorName = post.username || post.user?.name;
      return (localUserId && authorId && authorId === localUserId) || authorName === user.name;
    });
  }, [posts, user]);

  return (
    <main className="page-shell">
      <Navbar onCreatePost={() => setIsCreateModalOpen(true)} />
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={loadProfile}
      />

      <section className="mt-6 grid gap-5 md:mt-8 md:gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="order-first space-y-4 xl:order-none">
          <div className="glass-panel rounded-[1.6rem] border border-white/80 p-5 shadow-card sm:rounded-[2rem] sm:p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Profile</p>
            {isLoading ? (
              <ProfileInfoSkeleton />
            ) : (
              <>
                <h1 className="mt-2 font-[var(--font-display)] text-2xl font-bold sm:text-3xl">
                  {user?.name || "DailyMind user"}
                </h1>
                <p className="mt-2 text-sm text-slate-600">
                  {user?.email || "No user data found in local storage."}
                </p>
              </>
            )}
            <div className="mt-6 rounded-3xl bg-slate-100 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Posts shared</p>
              {isLoading ? (
                <StatSkeleton />
              ) : (
                <p className="mt-2 font-[var(--font-display)] text-4xl font-bold">{userPosts.length}</p>
              )}
            </div>
          </div>
        </aside>

        <div className="space-y-4">
          {isLoading ? (
            <>
              <LoadingBanner message="Fetching your profile facts and activity." />

              {Array.from({ length: 2 }).map((_, index) => (
                <PostSkeletonCard key={index} compact />
              ))}
            </>
          ) : null}

          {error ? (
            <div className="rounded-[2rem] border border-rose-100 bg-rose-50 p-5 text-sm text-rose-600">
              {error}
            </div>
          ) : null}

          {!isLoading && !userPosts.length ? (
            <div className="glass-panel rounded-[1.6rem] border border-white/80 p-6 shadow-card sm:rounded-[2rem] sm:p-8">
              <h2 className="font-[var(--font-display)] text-2xl font-semibold">No facts posted yet</h2>
              <p className="mt-2 text-sm text-slate-600">
                Once you share a fact, it will appear here as part of your learning archive.
              </p>
            </div>
          ) : null}

          {userPosts.map((post) => (
            <PostCard
              key={post.id || post._id}
              post={post}
              currentUser={currentUser}
              onPostUpdated={loadProfile}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
