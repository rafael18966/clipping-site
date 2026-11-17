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

export const navLinks = [
  { label: "Fonctionnalités", href: "/#fonctionnalites" },
  { label: "Comment ça marche", href: "/#comment-ca-marche" },
  { label: "Tarifs", href: "/#tarifs" },
  { label: "FAQ", href: "/#faq" },
];

export const platforms = ["YouTube", "TikTok", "Instagram Reels", "YouTube Shorts", "LinkedIn", "X", "Facebook"];

export type Plan = {
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
    name: "Gratuit",
    description: "Pour tester l’outil sur tes premières vidéos.",
    monthly: 0,
    yearly: 0,
    features: ["60 minutes de vidéo / mois", "Export 720p avec filigrane", "Sous-titres automatiques", "1 modèle de sous-titres"],
    cta: "Commencer gratuitement",
  },
  {
    name: "Pro",
    description: "Pour les créateurs qui publient chaque semaine.",
    monthly: null,
    yearly: null,
    features: [
      "300 minutes de vidéo / mois",
      "Export 1080p sans filigrane",
      "Score de viralité par clip",
      "Recadrage intelligent 9:16, 1:1, 16:9",
      "Tous les modèles de sous-titres",
      "Publication programmée",
    ],
    cta: "Essayer Pro",
    featured: true,
  },
  {
    name: "Studio",
    description: "Pour les agences et les équipes de contenu.",
    monthly: null,
    yearly: null,
    features: [
      "1 000 minutes de vidéo / mois",
      "Tout ce qui est inclus dans Pro",
      "Espaces de travail partagés",
      "Kit de marque (polices, logo, couleurs)",
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
    a: "Un lien YouTube ou un fichier vidéo importé depuis ton ordinateur (MP4, MOV). D’autres sources arriveront ensuite.",
  },
  {
    q: "Puis-je modifier les clips générés ?",
    a: "Oui. Chaque clip peut être raccourci, rallongé, recadré, et ses sous-titres corrigés avant l’export.",
  },
  {
    q: "Dans quelles langues les sous-titres sont-ils disponibles ?",
    a: "Le français et l’anglais en priorité, avec plus de vingt langues prévues.",
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
