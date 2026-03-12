"use client";

import { useEffect } from "react";
import FactForm from "@/components/FactForm";

export default function CreatePostModal({ isOpen, onClose, onCreated }) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 p-3 backdrop-blur-sm sm:p-4 sm:items-center">
      <div
        className="absolute inset-0"
        aria-hidden="true"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-2xl">
        <div className="mb-2 flex justify-end sm:mb-3">
          <button
            className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-card transition hover:bg-white"
            type="button"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <FactForm
          isModal
          onCancel={onClose}
          onSuccess={() => {
            onCreated?.();
            onClose?.();
          }}
        />
      </div>
    </div>
  );
}
