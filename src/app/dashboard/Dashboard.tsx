"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  Download,
  Flame,
  Loader2,
  LogOut,
  Plus,
  Upload,
} from "lucide-react";
import { logout } from "@/app/auth/actions";
import { Logo } from "@/components/Logo";
import {
  api,
  formatDuration,
  uploadFile,
  type Clip,
  type ProjectDetail,
  type ProjectSummary,
  type Usage,
} from "@/lib/engine";
import { plans, type PlanId } from "@/lib/site";

const MAX_BYTES = 2 * 1024 ** 3;
const steps = ["En attente", "Préparation", "Transcription", "Choix des meilleurs moments", "Montage des clips"];
const dateFormat = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" });

function StatusDot({ status }: { status: ProjectSummary["status"] }) {
  const color =
    status === "done" ? "bg-accent" : status === "failed" ? "bg-red-400" : "animate-pulse bg-amber-300";
  return <span className={`size-2 shrink-0 rounded-full ${color}`} />;
}

function ProjectList({ projects, current }: { projects: ProjectSummary[]; current: string | null }) {
  if (projects.length === 0) return <p className="px-3 text-sm text-muted">Aucun projet pour l’instant.</p>;
  return (
    <ul className="space-y-0.5">
      {projects.map((p) => (
        <li key={p.id}>
          <Link
            href={`/dashboard?projet=${p.id}`}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm ${
              p.id === current ? "bg-surface-2 text-white" : "text-muted hover:bg-surface-2/60 hover:text-white"
            }`}
          >
            <StatusDot status={p.status} />
            <span className="min-w-0 flex-1 truncate">{p.title}</span>
            <span className="shrink-0 text-xs text-muted">{dateFormat.format(new Date(p.createdAt))}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function UsageBar({ usage }: { usage: Usage | null }) {
  if (!usage) return null;
  const ratio = Math.min(1, usage.usedMinutes / Math.max(1, usage.limitMinutes));
  return (
    <div>
      <p className="text-muted">
        {usage.usedMinutes} / {usage.limitMinutes} min utilisées ce mois-ci
      </p>
      <div className="mt-2 h-1.5 rounded-full bg-surface-2">
        <div className="h-full rounded-full bg-accent" style={{ width: `${ratio * 100}%` }} />
      </div>
    </div>
  );
}

function UploadView({ usage, onCreated }: { usage: Usage | null; onCreated: (id: string) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const busy = progress !== null;

  useEffect(() => {
    if (!busy) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [busy]);

  async function start(file: File) {
    setError(null);
    if (!file.type.startsWith("video/")) return setError("Choisis un fichier vidéo (MP4, MOV…).");
    if (file.size > MAX_BYTES) return setError("La vidéo doit faire moins de 2 Go.");
    try {
      setProgress(0);
      const { id, uploadUrl } = await api<{ id: string; uploadUrl: string }>("/projects", {
        method: "POST",
        body: { filename: file.name, size: file.size, type: file.type },
      });
      await uploadFile(uploadUrl, file, setProgress);
      await api(`/projects/${id}/start`, { method: "POST" });
      onCreated(id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue.");
      setProgress(null);
    }
  }

  const outOfMinutes = usage !== null && usage.usedMinutes >= usage.limitMinutes;

  return (
    <section className="mx-auto max-w-2xl text-center">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Quelle vidéo veux-tu découper ?</h1>
      <p className="mt-3 text-muted">
        Importe une vidéo où l’on parle (podcast, interview, live…). L’IA en tire les meilleurs moments.
      </p>

      <input
        ref={input}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) start(file);
        }}
      />

      {busy ? (
        <div className="mt-8 rounded-2xl border border-line bg-surface p-6 text-left sm:p-8">
          <p className="font-medium">{progress < 1 ? "Envoi de la vidéo…" : "Démarrage de l’analyse…"}</p>
          <p className="mt-1 text-sm text-muted">Garde cette page ouverte pendant l’envoi.</p>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-surface-2">
            <div className="h-full rounded-full bg-accent transition-[width]" style={{ width: `${progress * 100}%` }} />
          </div>
          <p className="mt-2 text-right font-mono text-xs text-muted">{Math.round(progress * 100)} %</p>
        </div>
      ) : (
        <button
          type="button"
          disabled={outOfMinutes}
          onClick={() => input.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) start(file);
          }}
          className={`mt-8 flex w-full flex-col items-center gap-3 rounded-2xl border-2 border-dashed px-6 py-14 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
            dragging ? "border-accent bg-accent/5 text-white" : "border-line text-muted hover:border-accent/60 hover:text-white"
          }`}
        >
          <span className="grid size-12 place-items-center rounded-full bg-accent text-accent-ink">
            <Upload className="size-5" />
          </span>
          <span className="text-lg font-medium text-white">Importer une vidéo</span>
          <span className="text-sm">Glisse-la ici ou clique pour la choisir · MP4, MOV · 2 Go max</span>
        </button>
      )}

      {outOfMinutes && !busy && (
        <p className="mt-4 text-sm text-amber-300">
          Tu as utilisé toutes tes minutes ce mois-ci. Elles seront rechargées le 1er du mois.
        </p>
      )}
      {error && (
        <p role="alert" className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}
    </section>
  );
}

function ProcessingView({ project }: { project: ProjectSummary }) {
  const progress = project.progress ?? "En attente";
  const current = Math.max(0, steps.findIndex((s) => progress.startsWith(s)));
  return (
    <section className="mx-auto max-w-xl rounded-2xl border border-line bg-surface p-6 sm:p-8">
      <h1 className="text-xl font-semibold">Analyse en cours…</h1>
      <p className="mt-1 truncate text-sm text-muted">{project.title}</p>
      <ul className="mt-6 space-y-3 text-sm">
        {steps.map((step, i) => (
          <li key={step} className={`flex items-center gap-3 ${i > current ? "text-muted/50" : ""}`}>
            {i < current ? (
              <Check className="size-4 text-accent" />
            ) : i === current ? (
              <Loader2 className="size-4 animate-spin text-accent" />
            ) : (
              <span className="size-4 rounded-full border border-line" />
            )}
            {i === current ? progress : step}
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-muted">
        Compte quelques minutes selon la longueur de la vidéo. Tu peux fermer cette page : tes clips t’attendront ici.
      </p>
    </section>
  );
}

function ClipCard({ clip }: { clip: Clip }) {
  return (
    <li className="flex flex-col rounded-2xl border border-line bg-surface p-3">
      <div className="relative">
        <video
          src={clip.videoUrl}
          poster={clip.thumbUrl}
          controls
          playsInline
          preload="none"
          className="aspect-[9/16] w-full rounded-xl bg-black object-cover"
        />
        <span className="pointer-events-none absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-xs font-semibold text-accent">
          <Flame className="size-3" />
          {clip.score}
        </span>
        <span className="pointer-events-none absolute right-2 top-2 rounded-full bg-black/70 px-2 py-0.5 font-mono text-[11px]">
          {formatDuration(clip.durationSeconds)}
        </span>
      </div>
      <h2 className="mt-3 text-sm font-semibold leading-5">{clip.title}</h2>
      {clip.hook && <p className="mt-1 line-clamp-3 flex-1 text-xs leading-relaxed text-muted">{clip.hook}</p>}
      <a
        href={clip.downloadUrl}
        className="mt-3 flex h-9 items-center justify-center gap-1.5 rounded-lg bg-white text-xs font-semibold text-black transition-colors hover:bg-accent"
      >
        <Download className="size-3.5" />
        Télécharger
      </a>
    </li>
  );
}

function ProjectView({ id, onChange }: { id: string; onChange: () => void }) {
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const lastStatus = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    async function load() {
      try {
        const data = await api<ProjectDetail>(`/projects/${id}`);
        if (cancelled) return;
        setProject(data);
        setError(null);
        if (lastStatus.current && lastStatus.current !== data.status) onChange();
        lastStatus.current = data.status;
        if (data.status === "queued" || data.status === "processing") timer = setTimeout(load, 4000);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Une erreur est survenue.");
        timer = setTimeout(load, 8000);
      }
    }
    load();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [id, onChange]);

  if (!project) {
    return error ? (
      <p role="alert" className="text-sm text-red-300">{error}</p>
    ) : (
      <Loader2 className="mx-auto mt-20 size-6 animate-spin text-muted" />
    );
  }

  if (project.status === "failed") {
    return (
      <section className="mx-auto max-w-xl rounded-2xl border border-red-500/30 bg-red-500/5 p-6 sm:p-8">
        <AlertTriangle className="size-6 text-red-300" />
        <h1 className="mt-4 text-xl font-semibold">Cette vidéo n’a pas pu être traitée</h1>
        <p className="mt-2 text-sm text-zinc-300">{project.error}</p>
        <p className="mt-1 truncate text-sm text-muted">{project.title}</p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-black"
        >
          <Plus className="size-4" />
          Essayer une autre vidéo
        </Link>
      </section>
    );
  }

  if (project.status !== "done") return <ProcessingView project={project} />;

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {project.clips.length} clip{project.clips.length > 1 ? "s" : ""} prêt{project.clips.length > 1 ? "s" : ""}
          </h1>
          <p className="mt-1 truncate text-sm text-muted">{project.title}</p>
        </div>
        <Link
          href="/dashboard"
          className="flex h-10 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium hover:border-white"
        >
          <Plus className="size-4" />
          Nouvelle vidéo
        </Link>
      </div>
      <ul className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {project.clips.map((clip) => (
          <ClipCard key={clip.id} clip={clip} />
        ))}
      </ul>
    </section>
  );
}

export function Dashboard({ email, plan }: { email: string; plan: PlanId }) {
  const router = useRouter();
  const current = useSearchParams().get("projet");
  const planName = plans.find((p) => p.id === plan)?.name ?? "Gratuit";
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [usage, setUsage] = useState<Usage | null>(null);

  const refresh = useCallback(() => {
    api<ProjectSummary[]>("/projects").then(setProjects).catch(() => {});
    api<Usage>("/usage").then(setUsage).catch(() => {});
  }, []);

  useEffect(refresh, [refresh]);

  const onCreated = (id: string) => {
    refresh();
    router.push(`/dashboard?projet=${id}`);
  };

  return (
    <div className="flex min-h-screen flex-1">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-line bg-surface/50 p-4 md:flex">
        <div className="px-2 py-2">
          <Logo />
        </div>
        <Link
          href="/dashboard"
          className={`mt-6 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
            current ? "text-muted hover:text-white" : "bg-surface-2 text-white"
          }`}
        >
          <Plus className="size-4" />
          Nouveau projet
        </Link>
        <p className="mt-6 px-3 text-xs font-medium uppercase tracking-wide text-muted">Mes projets</p>
        <div className="mt-2 min-h-0 flex-1 overflow-y-auto">
          <ProjectList projects={projects} current={current} />
        </div>
        <div className="mt-4 space-y-3 rounded-xl border border-line bg-bg p-4 text-sm">
          <p className="font-medium">Offre {planName}</p>
          <UsageBar usage={usage} />
          <p className="truncate text-muted" title={email}>
            {email}
          </p>
          <form action={logout}>
            <button type="submit" className="flex items-center gap-2 text-muted transition-colors hover:text-white">
              <LogOut className="size-4" />
              Se déconnecter
            </button>
          </form>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <div className="flex h-16 items-center justify-between border-b border-line px-4 md:hidden">
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

        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-12">
          {current ? (
            <>
              <Link href="/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-white md:hidden">
                <ArrowLeft className="size-4" />
                Mes projets
              </Link>
              <ProjectView key={current} id={current} onChange={refresh} />
            </>
          ) : (
            <>
              <UploadView usage={usage} onCreated={onCreated} />
              <div className="mx-auto mt-12 max-w-2xl space-y-4 rounded-2xl border border-line bg-surface p-4 text-sm md:hidden">
                <p className="font-medium">Offre {planName}</p>
                <UsageBar usage={usage} />
                <p className="pt-2 text-xs font-medium uppercase tracking-wide text-muted">Mes projets</p>
                <ProjectList projects={projects} current={current} />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
