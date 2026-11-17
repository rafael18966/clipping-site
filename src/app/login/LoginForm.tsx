"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { login } from "@/app/auth/actions";
import { Notice, SubmitButton, inputClass } from "@/components/AuthCard";

const linkMessages: Record<string, string> = {
  lien: "Ce lien n’a pas pu être utilisé ici (déjà servi, expiré, ou ouvert dans un autre navigateur). Si tu viens de confirmer ton adresse, connecte-toi simplement.",
};

export function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") ?? "";
  const [state, action, pending] = useActionState(login, undefined);
  const info = linkMessages[params.get("message") ?? ""];

  return (
    <>
      <form action={action} className="mt-6 space-y-4">
        <input type="hidden" name="next" value={next} />
        <Notice error={state?.error} message={state?.error ? undefined : info} />
        <label className="block text-sm font-medium">
          E-mail
          <input name="email" type="email" required autoComplete="email" placeholder="toi@exemple.com" className={inputClass} />
        </label>
        <label className="block text-sm font-medium">
          <span className="flex items-center justify-between">
            Mot de passe
            <Link href="/mot-de-passe-oublie" className="text-xs font-normal text-muted hover:text-white">
              Mot de passe oublié ?
            </Link>
          </span>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className={inputClass}
          />
        </label>
        <SubmitButton pending={pending}>Se connecter</SubmitButton>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        Pas encore de compte ?{" "}
        <Link href={next ? `/signup?next=${encodeURIComponent(next)}` : "/signup"} className="font-medium text-white hover:text-accent">
          Créer un compte
        </Link>
      </p>
    </>
  );
}
