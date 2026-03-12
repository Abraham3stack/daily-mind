"use client";

import { useState } from "react";
import { addCommentToFact } from "@/services/api";

export default function CommentSection({ postId, comments = [], onCommentAdded }) {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!comment.trim()) return;

    setError("");
    setIsSubmitting(true);

    try {
      await addCommentToFact(postId, { text: comment.trim() });
      setComment("");
      onCommentAdded?.();
    } catch (submitError) {
      setError(submitError.response?.data?.message || "Unable to add comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-5 border-t border-slate-200 pt-5">
      <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
        <input
          className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-teal-600"
          type="text"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Add a comment"
        />
        <button
          className="rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Posting..." : "Comment"}
        </button>
      </form>

      {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}

      <div className="mt-4 space-y-3">
        {comments.map((entry, index) => (
          <div key={entry.id || entry._id || index} className="rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold text-slate-800">
                {entry.username || entry.user?.name || "Community member"}
              </p>
              {entry.createdAt ? (
                <p className="text-xs text-slate-500">{new Date(entry.createdAt).toLocaleDateString()}</p>
              ) : null}
            </div>
            <p className="mt-2 text-sm text-slate-600">{entry.text || entry.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
