"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Captions,
  Check,
  Download,
  FolderOpen,
  Info,
  Link2,
  Loader2,
  LogOut,
  Pencil,
  Plus,
  Settings,
  Sparkles,
  Upload,
} from "lucide-react";
import { ClipThumb } from "@/components/ClipThumb";
import { Logo } from "@/components/Logo";
import { logout } from "@/app/auth/actions";
import { demoClips, plans, type PlanId } from "@/lib/site";

type Status = "idle" | "processing" | "done";

const processingSteps = [
  "Import de la vidéo",
  "Transcription audio",
  "Détection des moments forts",
  "Recadrage 9:16 et sous-titres",
];

const sidebar = [
  { icon: Plus, label: "Nouveau projet", active: true },
  { icon: FolderOpen, label: "Mes projets" },
  { icon: Captions, label: "Sous-titres" },
  { icon: Settings, label: "Réglages" },
];

export function Dashboard({ email, plan }: { email: string; plan: PlanId }) {
  const planName = plans.find((p) => p.id === plan)?.name ?? "Gratuit";
  const initialUrl = useSearchParams().get("url") ?? "";
  const [url, setUrl] = useState(initialUrl);
  const [source, setSource] = useState(initialUrl);
  const [started, setStarted] = useState(Boolean(initialUrl));
  const [progress, setProgress] = useState(0);
  const fileInput = useRef<HTMLInputElement>(null);
  const status: Status = !started ? "idle" : progress >= 100 ? "done" : "processing";

  useEffect(() => {
    if (status !== "processing") return;
    const timer = setInterval(() => setProgress((p) => Math.min(100, p + 2)), 90);
    return () => clearInterval(timer);
  }, [status]);

  function start(name: string) {
    setSource(name);
    setProgress(0);
    setStarted(true);
  }

  function reset() {
    setUrl("");
    setSource("");
    setProgress(0);
    setStarted(false);
  }

  const currentStep = Math.min(processingSteps.length - 1, Math.floor(progress / (100 / processingSteps.length)));

  return (
    <div className="flex min-h-screen flex-1">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-line bg-surface/50 p-4 md:flex">
        <div className="px-2 py-2">
          <Logo />
        </div>
        <nav className="mt-6 space-y-1 text-sm">
          {sidebar.map(({ icon: Icon, label, active }) => (
            <div
              key={label}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 ${
                active ? "bg-surface-2 font-medium text-white" : "text-muted"
              }`}
            >
              <Icon className="size-4" />
              {label}
              {!active && (
                <span className="ml-auto rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-wide">
                  Bientôt
                </span>
              )}
            </div>
          ))}
        </nav>
        <div className="mt-auto rounded-xl border border-line bg-bg p-4 text-sm">
          <p className="font-medium">Offre {planName}</p>
          <p className="mt-1 truncate text-muted" title={email}>
            {email}
          </p>
          <form action={logout} className="mt-3">
            <button type="submit" className="flex items-center gap-2 text-muted transition-colors hover:text-white">
              <LogOut className="size-4" />
              Se déconnecter
            </button>
          </form>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <div className="flex h-16 items-center justify-between border-b border-line px-4 sm:px-8 md:hidden">
          <Logo />
          <form action={logout}>
            <button
              type="submit"
              aria-label="Se déconnecter"
              className="grid size-10 place-items-center rounded-lg border border-line text-muted hover:text-white"
            >
              <LogOut className="size-4" />
            </button>
          </form>
        </div>

        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-12">
          <p className="flex items-start gap-2 rounded-xl border border-line bg-surface px-4 py-3 text-sm text-muted">
            <Info className="mt-0.5 size-4 shrink-0 text-accent" />
            Mode démo : le traitement et les clips ci-dessous sont simulés. Le moteur de clipping n’est pas encore
            branché.
          </p>

          {status === "idle" && (
            <section className="mt-10 text-center">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Quelle vidéo veux-tu découper ?</h1>
              <p className="mt-3 text-muted">Colle un lien ou importe un fichier pour générer tes clips.</p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (url.trim()) start(url.trim());
                }}
                className="mx-auto mt-8 flex max-w-2xl flex-col gap-2 rounded-2xl border border-line bg-surface p-2 focus-within:border-accent/60 sm:flex-row"
              >
                <label className="flex flex-1 items-center gap-2 px-3">
                  <Link2 className="size-5 shrink-0 text-muted" />
                  <span className="sr-only">Lien de la vidéo</span>
                  <input
                    type="text"
                    inputMode="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=…"
                    className="h-11 w-full bg-transparent outline-none placeholder:text-muted/70"
                  />
                </label>
                <button
                  type="submit"
                  disabled={!url.trim()}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl bg-accent px-5 font-semibold text-accent-ink disabled:opacity-40"
                >
                  <Sparkles className="size-4" />
                  Générer les clips
                </button>
              </form>

              <input
                ref={fileInput}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) start(file.name);
                }}
              />
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className="mx-auto mt-4 flex w-full max-w-2xl flex-col items-center gap-2 rounded-2xl border border-dashed border-line px-6 py-10 text-muted transition-colors hover:border-accent/60 hover:text-white"
              >
                <Upload className="size-6" />
                <span className="font-medium">Importer un fichier vidéo</span>
                <span className="text-xs">MP4 ou MOV</span>
              </button>
            </section>
          )}

          {status === "processing" && (
            <section className="mx-auto mt-10 max-w-xl rounded-2xl border border-line bg-surface p-6 sm:p-8">
              <h1 className="text-xl font-semibold">Analyse en cours…</h1>
              <p className="mt-1 truncate text-sm text-muted">{source}</p>

              <div
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                className="mt-6 h-2 overflow-hidden rounded-full bg-surface-2"
              >
                <div className="h-full rounded-full bg-accent transition-[width]" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-2 text-right font-mono text-xs text-muted">{progress} %</p>

              <ul className="mt-4 space-y-3 text-sm">
                {processingSteps.map((step, i) => (
                  <li key={step} className={`flex items-center gap-3 ${i > currentStep ? "text-muted/50" : ""}`}>
                    {i < currentStep ? (
                      <Check className="size-4 text-accent" />
                    ) : i === currentStep ? (
                      <Loader2 className="size-4 animate-spin text-accent" />
                    ) : (
                      <span className="size-4 rounded-full border border-line" />
                    )}
                    {step}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {status === "done" && (
            <section className="mt-10">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    {demoClips.length} clips générés
                  </h1>
                  <p className="mt-1 truncate text-sm text-muted">{source}</p>
                </div>
                <button
                  type="button"
                  onClick={reset}
                  className="flex h-10 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium hover:border-white"
                >
                  <Plus className="size-4" />
                  Nouvelle vidéo
                </button>
              </div>

              <ul className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {demoClips.map((clip) => (
                  <li key={clip.id} className="rounded-2xl border border-line bg-surface p-3">
                    <ClipThumb {...clip} />
                    <h2 className="mt-3 line-clamp-2 min-h-10 text-sm font-medium leading-5">{clip.title}</h2>
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        disabled
                        title="Disponible quand le moteur de clipping sera branché"
                        className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-white text-xs font-semibold text-black disabled:opacity-50"
                      >
                        <Download className="size-3.5" />
                        Télécharger
                      </button>
                      <button
                        type="button"
                        disabled
                        title="Éditeur à venir"
                        aria-label="Éditer le clip"
                        className="grid size-9 place-items-center rounded-lg border border-line disabled:opacity-50"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
