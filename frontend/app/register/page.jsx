"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, registerUser, saveAuth } from "@/services/api";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
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
      const response = await registerUser(formData);
      saveAuth(response);
      router.push("/feed");
    } catch (submitError) {
      setError(submitError.response?.data?.message || "Unable to create account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page-shell flex items-center justify-center">
      <section className="w-full max-w-2xl rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-card sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-coral">Join DailyMind</p>
        <h1 className="mt-3 font-[var(--font-display)] text-4xl font-bold text-ink">Create your account</h1>
        <p className="mt-3 max-w-xl text-sm text-slate-600">
          Start a feed built around learning. Share one useful fact each day and build a public archive of what you know.
        </p>

        <form className="mt-10 grid gap-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Name</span>
            <input
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-teal-600"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ada Lovelace"
              required
            />
          </label>

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
              placeholder="Create a password"
              required
            />
          </label>

          {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p> : null}

          <button
            className="rounded-2xl bg-ink px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-600">
          Already registered?{" "}
          <Link className="font-semibold text-teal-700" href="/login">
            Log in
          </Link>
        </p>
      </section>
    </main>
  );
}
