"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createFact } from "@/services/api";

const categoryOptions = [
  "Science",
  "Technology",
  "Psychology",
  "History",
  "Weird Facts"
];

export default function FactForm({ onSuccess, onCancel, isModal = false }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fact: "Today I learned...",
    category: "Science"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await createFact(formData);
      onSuccess?.(response);

      if (!onSuccess) {
        router.push("/feed");
      }
    } catch (submitError) {
      setError(submitError.response?.data?.message || "Unable to publish fact.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className={`rounded-[2rem] border p-6 shadow-card sm:p-8 ${
        isModal ? "bg-white" : "glass-panel border-white/80"
      }`}
    >
      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">New fact</p>
      <h2 className="mt-2 font-[var(--font-display)] text-3xl font-bold">Write your post</h2>
      <p className="mt-3 text-sm text-slate-600">
        Keep the opening phrase and make the insight specific enough to be useful.
      </p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Fact</span>
          <textarea
            className="min-h-[180px] w-full rounded-[1.5rem] border border-slate-200 bg-white px-4 py-4 outline-none transition focus:border-teal-600"
            name="fact"
            value={formData.fact}
            onChange={handleChange}
            placeholder="Today I learned..."
            required
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Category</span>
          <select
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-teal-600"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p> : null}

        <button
          className="w-full rounded-2xl bg-ink px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Publishing..." : "Publish fact"}
        </button>

        {onCancel ? (
          <button
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        ) : null}
      </form>
    </section>
  );
}
