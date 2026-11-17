"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Link2, Sparkles } from "lucide-react";

export function LinkInput() {
  const router = useRouter();
  const [url, setUrl] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = url.trim();
    router.push(value ? `/dashboard?url=${encodeURIComponent(value)}` : "/dashboard");
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full max-w-xl flex-col gap-2 rounded-2xl border border-line bg-surface p-2 shadow-2xl shadow-black/50 focus-within:border-accent/60 sm:flex-row sm:rounded-full"
    >
      <label className="flex flex-1 items-center gap-2 px-3">
        <Link2 className="size-5 shrink-0 text-muted" />
        <span className="sr-only">Lien de la vidéo</span>
        <input
          type="text"
          inputMode="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Colle un lien YouTube…"
          className="h-11 w-full bg-transparent text-base text-white outline-none placeholder:text-muted/70"
        />
      </label>
      <button
        type="submit"
        className="flex h-11 items-center justify-center gap-2 rounded-full bg-accent px-5 font-semibold text-accent-ink transition-transform hover:scale-[1.02] active:scale-100"
      >
        <Sparkles className="size-4" />
        Obtenir mes clips
      </button>
    </form>
  );
}
