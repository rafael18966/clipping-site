import Link from "next/link";
import { Logo } from "./Logo";

export const inputClass =
  "mt-1.5 h-11 w-full rounded-xl border border-line bg-bg px-3 text-base outline-none placeholder:text-muted/60 focus:border-accent/60";

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <Logo />
      <div className="mt-8 w-full max-w-sm rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted">{subtitle}</p>
        {children}
      </div>
      {footer && <div className="mt-6 text-center text-sm text-muted">{footer}</div>}
      <Link href="/" className="mt-4 text-sm text-muted hover:text-white">
        ← Retour à l’accueil
      </Link>
    </main>
  );
}

export function Notice({ error, message }: { error?: string; message?: string }) {
  if (error) {
    return (
      <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-300">
        {error}
      </p>
    );
  }
  if (message) {
    return (
      <p role="status" className="rounded-xl border border-accent/30 bg-accent/10 px-3 py-2.5 text-sm text-accent">
        {message}
      </p>
    );
  }
  return null;
}

export function SubmitButton({ pending, children }: { pending: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-11 w-full rounded-full bg-accent font-semibold text-accent-ink transition-colors hover:bg-white disabled:opacity-60"
    >
      {pending ? "Un instant…" : children}
    </button>
  );
}
