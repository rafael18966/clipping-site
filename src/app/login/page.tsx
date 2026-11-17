import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = { title: "Connexion", robots: { index: false }, alternates: { canonical: null } };

const inputClass =
  "mt-1.5 h-11 w-full rounded-xl border border-line bg-bg px-3 outline-none placeholder:text-muted/60 focus:border-accent/60";

export default function LoginPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <Logo />
      <div className="mt-8 w-full max-w-sm rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight">Connexion</h1>
        <p className="mt-1 text-sm text-muted">Accède à tes projets et à tes clips.</p>

        <form action="/dashboard" className="mt-6 space-y-4">
          <label className="block text-sm font-medium">
            E-mail
            <input type="email" required autoComplete="email" placeholder="toi@exemple.com" className={inputClass} />
          </label>
          <label className="block text-sm font-medium">
            Mot de passe
            <input type="password" required autoComplete="current-password" placeholder="••••••••" className={inputClass} />
          </label>
          <button
            type="submit"
            className="h-11 w-full rounded-full bg-accent font-semibold text-accent-ink transition-colors hover:bg-white"
          >
            Se connecter
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-muted">
          Démo : aucune authentification réelle pour l’instant, le formulaire ouvre directement le tableau de bord.
        </p>
      </div>
      <Link href="/" className="mt-6 text-sm text-muted hover:text-white">
        ← Retour à l’accueil
      </Link>
    </main>
  );
}
