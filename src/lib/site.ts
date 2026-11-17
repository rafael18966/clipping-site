export const site = {
  name: "ClipWave",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
  description:
    "Transforme tes longues vidéos en clips courts prêts à poster sur TikTok, Reels et Shorts, grâce à l’IA.",
};

// null = pas encore renseigné : la page affiche « à compléter ».
export const legal = {
  ownerName: null as string | null,
  status: null as string | null,
  siret: null as string | null,
  address: null as string | null,
  email: null as string | null,
  vatNote: "TVA non applicable, article 293 B du Code général des impôts" as string | null,
  mediator: null as string | null,
  sourceVideoRetentionDays: 30,
  lastUpdated: "17 novembre 2026",
};

export const legalLinks = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Confidentialité", href: "/confidentialite" },
  { label: "Conditions générales", href: "/conditions" },
];

export const navLinks = [
  { label: "Fonctionnalités", href: "/#fonctionnalites" },
  { label: "Comment ça marche", href: "/#comment-ca-marche" },
  { label: "Tarifs", href: "/#tarifs" },
  { label: "FAQ", href: "/#faq" },
];

export const platforms = ["YouTube", "TikTok", "Instagram Reels", "YouTube Shorts", "LinkedIn", "X", "Facebook"];

export type PlanId = "free" | "pro" | "studio";

export type Plan = {
  id: PlanId;
  name: string;
  description: string;
  monthly: number | null;
  yearly: number | null;
  features: string[];
  cta: string;
  featured?: boolean;
};

export const plans: Plan[] = [
  {
    id: "free",
    name: "Gratuit",
    description: "Pour tester l’outil sur tes premières vidéos.",
    monthly: 0,
    yearly: 0,
    features: ["60 minutes de vidéo / mois", "Export 720p avec filigrane", "Sous-titres automatiques", "Score de viralité par clip"],
    cta: "Commencer gratuitement",
  },
  {
    id: "pro",
    name: "Pro",
    description: "Pour les créateurs qui publient chaque semaine.",
    monthly: null,
    yearly: null,
    features: [
      "300 minutes de vidéo / mois",
      "Export 1080p sans filigrane",
      "Score de viralité par clip",
      "Format vertical 9:16",
      "Sous-titres mot à mot",
    ],
    cta: "Essayer Pro",
    featured: true,
  },
  {
    id: "studio",
    name: "Studio",
    description: "Pour les agences et les équipes de contenu.",
    monthly: null,
    yearly: null,
    features: [
      "1 000 minutes de vidéo / mois",
      "Tout ce qui est inclus dans Pro",
      "Support prioritaire",
    ],
    cta: "Choisir Studio",
  },
];

export const faq = [
  {
    q: "Quels types de vidéos fonctionnent le mieux ?",
    a: "Les contenus parlés : podcasts, interviews, lives, webinaires, vlogs face caméra, formations. Plus il y a de parole, plus l’IA trouve de moments forts.",
  },
  {
    q: "Quelles sources sont acceptées ?",
    a: "Un fichier vidéo importé depuis ton ordinateur ou ton téléphone (MP4, MOV), jusqu’à 2 Go et 3 heures. L’import par lien YouTube arrivera plus tard.",
  },
  {
    q: "Combien de temps prend le traitement ?",
    a: "Quelques minutes pour une vidéo d’une heure. Tu peux fermer la page pendant l’analyse : tes clips t’attendront dans ton espace.",
  },
  {
    q: "Dans quelles langues les sous-titres sont-ils disponibles ?",
    a: "Plus de 50 langues, dont le français, l’anglais, l’espagnol, l’allemand, l’italien, le portugais et l’arabe. La langue est détectée automatiquement.",
  },
  {
    q: "Puis-je annuler à tout moment ?",
    a: "Oui, l’abonnement est sans engagement. Tu gardes l’accès jusqu’à la fin de la période payée.",
  },
];

export type Clip = {
  id: number;
  title: string;
  caption: string;
  highlight: string;
  score: number;
  duration: string;
  gradient: string;
};

export const demoClips: Clip[] = [
  {
    id: 1,
    title: "Le déclic qui a tout changé",
    caption: "C’est là que tout a changé",
    highlight: "changé",
    score: 98,
    duration: "0:42",
    gradient: "bg-linear-to-br from-fuchsia-500 to-indigo-900",
  },
  {
    id: 2,
    title: "L’erreur que font 90 % des débutants",
    caption: "Personne ne te le dit",
    highlight: "Personne",
    score: 94,
    duration: "0:31",
    gradient: "bg-linear-to-br from-amber-400 to-rose-800",
  },
  {
    id: 3,
    title: "Sa routine du matin en 30 secondes",
    caption: "Je me lève à 5h",
    highlight: "5h",
    score: 91,
    duration: "0:28",
    gradient: "bg-linear-to-br from-emerald-400 to-cyan-900",
  },
  {
    id: 4,
    title: "Pourquoi il a refusé un million",
    caption: "J’ai dit non",
    highlight: "non",
    score: 89,
    duration: "0:55",
    gradient: "bg-linear-to-br from-sky-400 to-violet-900",
  },
  {
    id: 5,
    title: "Le conseil qu’il aurait aimé recevoir",
    caption: "Commence avant d’être prêt",
    highlight: "prêt",
    score: 86,
    duration: "0:37",
    gradient: "bg-linear-to-br from-orange-400 to-fuchsia-900",
  },
  {
    id: 6,
    title: "Ce que personne ne voit en coulisses",
    caption: "La vérité est moins glamour",
    highlight: "vérité",
    score: 83,
    duration: "0:49",
    gradient: "bg-linear-to-br from-teal-300 to-blue-900",
  },
  {
    id: 7,
    title: "Sa méthode pour ne jamais procrastiner",
    caption: "Deux minutes, pas plus",
    highlight: "Deux",
    score: 79,
    duration: "0:24",
    gradient: "bg-linear-to-br from-rose-400 to-purple-900",
  },
  {
    id: 8,
    title: "La question qui l’a laissé sans voix",
    caption: "Là, j’ai rien su répondre",
    highlight: "rien",
    score: 76,
    duration: "0:33",
    gradient: "bg-linear-to-br from-lime-300 to-emerald-900",
  },
];
