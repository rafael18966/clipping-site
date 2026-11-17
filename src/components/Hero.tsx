import Link from "next/link";
import { ArrowRight, Play, Upload } from "lucide-react";
import { demoClips, platforms } from "@/lib/site";
import { ClipThumb } from "./ClipThumb";

const segments = [
  { left: "8%", width: "7%" },
  { left: "27%", width: "5%" },
  { left: "46%", width: "9%" },
  { left: "71%", width: "6%" },
  { left: "86%", width: "5%" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 pb-20 pt-16 text-center sm:px-6 sm:pt-24">
        <span className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-muted">
          <span className="mr-1.5 inline-block size-1.5 rounded-full bg-accent align-middle" />
          Clipping vidéo par IA
        </span>

        <h1 className="mt-6 max-w-4xl text-balance text-4xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
          1 longue vidéo, 10 clips viraux. <span className="text-accent">En un clic.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-pretty text-lg text-muted">
          L’IA repère les meilleurs moments de tes podcasts, lives et interviews, les recadre au format vertical et
          ajoute les sous-titres. Tu n’as plus qu’à poster.
        </p>

        <div className="mt-9 flex w-full flex-col items-center gap-3">
          <Link
            href="/dashboard"
            className="flex h-14 items-center gap-2.5 rounded-full bg-accent px-7 text-lg font-semibold text-accent-ink transition-transform hover:scale-[1.03]"
          >
            <Upload className="size-5" />
            Importer ma vidéo
          </Link>
          <p className="text-sm text-muted">Gratuit jusqu’à 60 minutes de vidéo par mois · sans carte bancaire</p>
        </div>

        <div className="mt-16 grid w-full items-center gap-6 rounded-3xl border border-line bg-surface/60 p-4 sm:p-6 lg:grid-cols-[1.15fr_auto_1fr]">
          <div className="text-left">
            <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-linear-to-br from-zinc-700 to-zinc-900">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.14),transparent_50%)]" />
              <span className="absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/15 backdrop-blur">
                <Play className="size-6 fill-white text-white" />
              </span>
              <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 font-mono text-xs">
                1:24:07
              </span>
            </div>
            <div className="relative mt-3 h-2 rounded-full bg-surface-2">
              {segments.map((s) => (
                <span key={s.left} className="absolute inset-y-0 rounded-full bg-accent" style={s} />
              ))}
            </div>
            <p className="mt-3 text-sm text-muted">
              <span className="font-medium text-white">Vidéo source</span> · 5 moments forts détectés
            </p>
          </div>

          <ArrowRight className="mx-auto size-6 rotate-90 text-accent lg:rotate-0" />

          <div className="grid grid-cols-3 gap-3">
            {demoClips.slice(0, 3).map((clip) => (
              <ClipThumb key={clip.id} {...clip} />
            ))}
          </div>
        </div>

        <div className="mt-14 w-full">
          <p className="text-xs font-medium uppercase tracking-widest text-muted">Prêt à poster sur</p>
          <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-semibold text-zinc-500">
            {platforms.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
