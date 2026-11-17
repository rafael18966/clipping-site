import Link from "next/link";
import {
  CalendarClock,
  Captions,
  ChevronDown,
  Crop,
  Flame,
  Languages,
  Link2,
  Share2,
  Sparkles,
  Wand2,
} from "lucide-react";
import { faq } from "@/lib/site";

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-semibold text-accent">{eyebrow}</p>
      <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-pretty text-muted">{subtitle}</p>}
    </div>
  );
}

const features = [
  {
    icon: Sparkles,
    title: "Détection des moments forts",
    text: "L’IA analyse la transcription et repère les passages qui accrochent : punchlines, histoires, conseils.",
  },
  {
    icon: Flame,
    title: "Score de viralité",
    text: "Chaque clip reçoit une note sur 100 pour t’aider à choisir lequel publier en premier.",
  },
  {
    icon: Captions,
    title: "Sous-titres animés",
    text: "Des sous-titres précis, mot par mot, avec des modèles prêts à l’emploi et des mots-clés mis en avant.",
  },
  {
    icon: Crop,
    title: "Recadrage intelligent",
    text: "Le cadre suit la personne qui parle et s’adapte au 9:16, au 1:1 ou au 16:9.",
  },
  {
    icon: Languages,
    title: "Multilingue",
    text: "Transcription et sous-titres dans plusieurs langues, avec traduction en option.",
  },
  {
    icon: CalendarClock,
    title: "Publication programmée",
    text: "Planifie tes clips sur TikTok, Reels et Shorts sans quitter l’outil.",
  },
];

export function Features() {
  return (
    <section id="fonctionnalites" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Fonctionnalités"
          title="Tout ce qu’il faut pour passer du long au court"
          subtitle="Un seul outil remplace le dérushage, le montage, le recadrage et le sous-titrage."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-accent/40"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-accent/10 text-accent">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  {
    icon: Link2,
    title: "Colle ton lien",
    text: "Un lien YouTube ou un fichier depuis ton ordinateur. Rien à installer.",
  },
  {
    icon: Wand2,
    title: "L’IA découpe",
    text: "Transcription, sélection des meilleurs moments, recadrage et sous-titres en quelques minutes.",
  },
  {
    icon: Share2,
    title: "Ajuste et publie",
    text: "Retouche si besoin, télécharge en HD ou programme la publication.",
  },
];

export function HowItWorks() {
  return (
    <section id="comment-ca-marche" className="scroll-mt-20 border-y border-line bg-surface/40 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow="Comment ça marche" title="Trois étapes, zéro montage" />
        <ol className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="relative rounded-2xl border border-line bg-bg p-6">
              <span className="font-mono text-sm text-accent">0{i + 1}</span>
              <Icon className="absolute right-6 top-6 size-5 text-muted" />
              <h3 className="mt-4 text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading eyebrow="FAQ" title="Questions fréquentes" />
        <div className="mt-12 divide-y divide-line rounded-2xl border border-line bg-surface">
          {faq.map((item) => (
            <details key={item.q} className="group px-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-medium [&::-webkit-details-marker]:hidden">
                {item.q}
                <ChevronDown className="size-5 shrink-0 text-muted transition-transform group-open:rotate-180" />
              </summary>
              <p className="pb-5 text-sm leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Cta() {
  return (
    <section className="px-4 pb-20 sm:px-6 sm:pb-28">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-accent px-6 py-16 text-center text-accent-ink sm:py-20">
        <h2 className="mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
          Ta prochaine vidéo virale est déjà dans tes rushs.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-accent-ink/75">
          Essaie gratuitement, sans carte bancaire. Tes premiers clips sont prêts en quelques minutes.
        </p>
        <Link
          href="/signup"
          className="mt-8 inline-flex h-12 items-center rounded-full bg-black px-7 font-semibold text-white transition-transform hover:scale-[1.03]"
        >
          Créer mes premiers clips
        </Link>
      </div>
    </section>
  );
}
