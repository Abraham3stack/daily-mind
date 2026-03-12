"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { clearAuth, searchUsers } from "@/services/api";
import ThemeToggle from "@/components/ThemeToggle";

const navLinks = [
  { href: "/feed", label: "Feed" },
  { href: "/profile", label: "Profile" }
];

export default function Navbar({ onCreatePost }) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      setIsResultsOpen(false);
      return undefined;
    }

    const timeoutId = window.setTimeout(async () => {
      setIsSearching(true);
      try {
        const users = await searchUsers(searchTerm.trim());
        setResults(users);
        setIsResultsOpen(true);
      } catch (error) {
        setResults([]);
        setIsResultsOpen(true);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsResultsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) return undefined;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  const handleSelectUser = (userId) => {
    setSearchTerm("");
    setResults([]);
    setIsResultsOpen(false);
    setIsMobileMenuOpen(false);
    router.push(`/profile?userId=${userId}`);
  };

  const searchBlock = (
    <div className="relative">
      <input
        className="w-full rounded-2xl border border-teal-200/80 bg-white px-4 py-3 text-sm text-slate-700 shadow-[0_18px_45px_-28px_rgba(15,118,110,0.55)] outline-none ring-1 ring-white/70 transition focus:border-teal-600 focus:shadow-[0_22px_55px_-26px_rgba(15,118,110,0.65)]"
        type="search"
        placeholder="Search users by name or email"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        onFocus={() => {
          if (results.length) {
            setIsResultsOpen(true);
          }
        }}
      />

      {isResultsOpen ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] max-h-[60vh] overflow-y-auto rounded-2xl border border-teal-100 bg-white shadow-[0_24px_70px_-30px_rgba(15,23,42,0.4)]">
          {isSearching ? (
            <p className="px-4 py-3 text-sm text-slate-500">Searching users...</p>
          ) : null}

          {!isSearching && results.length ? (
            <div className="py-2">
              {results.map((user) => (
                <button
                  key={user.id}
                  className="flex w-full flex-col items-start gap-2 px-4 py-3 text-left transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                  type="button"
                  onClick={() => handleSelectUser(user.id)}
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                  <span className="rounded-full bg-teal-50 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-teal-700">
                    {user.streak || 0} streak
                  </span>
                </button>
              ))}
            </div>
          ) : null}

          {!isSearching && searchTerm.trim() && !results.length ? (
            <p className="px-4 py-3 text-sm text-slate-500">No users found.</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );

  const navItems = (
    <>
      {navLinks.map((link) => {
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-full px-4 py-2 text-center text-sm font-medium transition ${
              isActive ? "bg-ink text-white" : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            {link.label}
          </Link>
        );
      })}

      {onCreatePost ? (
        <button
          className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          type="button"
          onClick={() => {
            setIsMobileMenuOpen(false);
            onCreatePost();
          }}
        >
          Create Post
        </button>
      ) : (
        <Link
          href="/create"
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            pathname === "/create" ? "bg-ink text-white" : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          Create Post
        </Link>
      )}

      <button
        className="rounded-full bg-coral px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        type="button"
        onClick={handleLogout}
      >
        Logout
      </button>
    </>
  );

  return (
    <header className="glass-panel navbar-shell sticky top-2 z-20 rounded-[1.4rem] border border-white/80 px-3 py-3 shadow-card sm:top-4 sm:rounded-[1.75rem] sm:px-6 sm:py-4">
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex items-center justify-between gap-3">
          <Link className="flex items-center gap-3 self-start" href="/feed">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ink font-[var(--font-display)] text-base font-bold text-white sm:h-11 sm:w-11 sm:text-lg">
              D
            </div>
            <div>
              <p className="font-[var(--font-display)] text-lg font-bold sm:text-xl">DailyMind</p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500 sm:text-xs sm:tracking-[0.25em]">
                Learn out loud
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 xl:flex xl:flex-wrap">
            {navItems}
            <ThemeToggle />
          </nav>

          <div className="flex items-center gap-2 xl:hidden">
            <ThemeToggle />
          <button
            className="nav-surface group flex h-11 w-11 items-center justify-center rounded-2xl border border-white/80 bg-white shadow-[0_18px_45px_-28px_rgba(15,23,42,0.45)] transition hover:bg-slate-50"
            type="button"
            onClick={() => setIsMobileMenuOpen((current) => !current)}
            aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="relative flex h-5 w-5 items-center justify-center">
                <span
                  className={`absolute h-0.5 w-5 rounded-full bg-slate-800 transition duration-300 ${
                    isMobileMenuOpen ? "rotate-45" : "-translate-y-1.5"
                  }`}
                />
                <span
                  className={`absolute h-0.5 w-5 rounded-full bg-slate-800 transition duration-300 ${
                    isMobileMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute h-0.5 w-5 rounded-full bg-slate-800 transition duration-300 ${
                    isMobileMenuOpen ? "-rotate-45" : "translate-y-1.5"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        <div className="hidden xl:block">
          {searchBlock}
        </div>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-sm transition duration-300 xl:hidden ${
          isMobileMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <div
        className={`mobile-drawer fixed right-0 top-0 z-50 flex h-screen w-full max-w-sm flex-col gap-5 border-l border-white/70 bg-[linear-gradient(180deg,rgba(248,250,252,0.98),rgba(238,246,246,0.96))] px-4 py-5 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.4)] transition duration-300 sm:px-5 ${
          isMobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        } xl:hidden`}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-[var(--font-display)] text-lg font-bold text-ink">Menu</p>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">DailyMind</p>
          </div>
          <button
            className="nav-surface flex h-10 w-10 items-center justify-center rounded-2xl border border-white/80 bg-white text-lg text-slate-700 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.45)]"
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            ×
          </button>
        </div>

        <div className="nav-surface rounded-[1.6rem] border border-white/80 bg-white/70 p-3 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.35)]">
          {searchBlock}
        </div>

        <nav className="grid gap-3">
          {navItems}
        </nav>
        <div className="rounded-[1.6rem] bg-ink px-4 py-5 text-white shadow-[0_24px_60px_-30px_rgba(15,23,42,0.55)]">
          <p className="text-xs uppercase tracking-[0.3em] text-teal-200">Quick tip</p>
          <p className="mt-3 text-sm text-slate-200">
            Search for users, jump to profiles, and create a new fact without leaving the current screen.
          </p>
        </div>
      </div>
    </header>
  );
}
