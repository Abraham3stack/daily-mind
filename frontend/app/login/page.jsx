"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, loginUser, saveAuth } from "@/services/api";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (getToken()) {
      router.replace("/feed");
    }
  }, [router]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await loginUser(formData);
      saveAuth(response);
      router.push("/feed");
    } catch (submitError) {
      setError(submitError.response?.data?.message || "Unable to log in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page-shell flex items-center justify-center">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-card lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden bg-ink px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="font-[var(--font-display)] text-sm uppercase tracking-[0.35em] text-teal-200">
              DailyMind
            </p>
            <h1 className="mt-4 font-[var(--font-display)] text-5xl font-bold leading-tight">
              Share one new thing you learned today.
            </h1>
            <p className="mt-6 max-w-md text-base text-slate-300">
              A focused social feed for curious minds. Post discoveries, browse insights, and keep your learning streak visible.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
            Fact-first posting, clean conversation threads, and a profile built around what you know.
          </div>
        </div>

        <div className="glass-panel px-6 py-10 sm:px-10">
          <div className="mx-auto max-w-md">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-700">Welcome back</p>
            <h2 className="mt-3 font-[var(--font-display)] text-4xl font-bold text-ink">Log in</h2>
            <p className="mt-3 text-sm text-slate-600">Continue to your DailyMind feed.</p>

            <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-teal-600"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-teal-600"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </label>

              {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p> : null}

              <button
                className="w-full rounded-2xl bg-ink px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Log in"}
              </button>
            </form>

            <p className="mt-6 text-sm text-slate-600">
              No account yet?{" "}
              <Link className="font-semibold text-teal-700" href="/register">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
