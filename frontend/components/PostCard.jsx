"use client";

import { useEffect, useState } from "react";
import CommentSection from "@/components/CommentSection";
import { likeFact } from "@/services/api";

export default function PostCard({ post, currentUser, onPostUpdated }) {
  const [showComments, setShowComments] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes ?? post.likesCount ?? 0);
  const [likedBy, setLikedBy] = useState(post.likedBy || []);
  const [likeError, setLikeError] = useState("");

  useEffect(() => {
    setLikesCount(post.likes ?? post.likesCount ?? 0);
    setLikedBy(post.likedBy || []);
  }, [post.likes, post.likesCount, post.likedBy]);

  const currentUserId = currentUser?.id || currentUser?._id;
  const authorId = post.userId || post.user?._id || post.user?.id;
  const hasLiked = Boolean(currentUserId && likedBy.some((userId) => String(userId) === String(currentUserId)));
  const isOwnPost = Boolean(currentUserId && authorId && String(authorId) === String(currentUserId));

  const handleLike = async () => {
    if (!currentUserId || isOwnPost) return;

    const previousLikedBy = likedBy;
    const previousLikesCount = likesCount;
    const nextLikedBy = hasLiked
      ? likedBy.filter((userId) => String(userId) !== String(currentUserId))
      : [...likedBy, String(currentUserId)];
    setLikeError("");
    setLikedBy(nextLikedBy);
    setLikesCount(hasLiked ? Math.max(0, previousLikesCount - 1) : previousLikesCount + 1);

    try {
      const response = await likeFact(post.id || post._id);
      const updatedFact = response?.fact;

      if (updatedFact) {
        setLikedBy(updatedFact.likedBy || nextLikedBy);
        setLikesCount(updatedFact.likes ?? nextLikedBy.length);
      }
    } catch (error) {
      setLikedBy(previousLikedBy);
      setLikesCount(previousLikesCount);
      setLikeError(error.response?.data?.message || "Unable to like post.");
    }
  };

  const createdDate = post.createdAt || post.created_at || post.date;
  const commentCount = post.comments?.length || 0;

  return (
    <article className="glass-panel rounded-[1.6rem] border border-white/80 p-4 shadow-card sm:rounded-[2rem] sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-700">
            {post.category || "General"}
          </p>
          <h2 className="mt-3 text-base font-semibold leading-7 text-slate-900 sm:text-lg sm:leading-8">
            {post.text || post.fact}
          </h2>
        </div>
        <div className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {post.username || post.user?.name || "Anonymous"}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-500">
        <span>{likesCount} likes</span>
        <span>{commentCount} comments</span>
        {createdDate ? <span>{new Date(createdDate).toLocaleDateString()}</span> : null}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
        <button
          className={`like-toggle-btn rounded-full px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
            hasLiked
              ? "bg-amber-200 text-amber-800"
              : isOwnPost
                ? "bg-slate-200 text-slate-500"
                : "bg-amber-100 text-amber-700 hover:bg-amber-200"
          }`}
          type="button"
          onClick={handleLike}
          disabled={isOwnPost}
        >
          {isOwnPost ? "Your post" : hasLiked ? "Unlike" : "Like"}
        </button>
        <button
          className="comment-toggle-btn rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
          type="button"
          onClick={() => setShowComments((current) => !current)}
        >
          {showComments ? "Hide comments" : "Comment"}
        </button>
      </div>

      {likeError ? <p className="mt-3 text-sm text-rose-600">{likeError}</p> : null}

      {showComments ? (
        <CommentSection
          postId={post.id || post._id}
          comments={post.comments || []}
          onCommentAdded={onPostUpdated}
        />
      ) : null}
    </article>
  );
}
