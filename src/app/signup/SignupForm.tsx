"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { signup } from "@/app/auth/actions";
import { Notice, SubmitButton, inputClass } from "@/components/AuthCard";

export function SignupForm() {
  const next = useSearchParams().get("next") ?? "";
  const [state, action, pending] = useActionState(signup, undefined);

  if (state?.message) {
    return (
      <div className="mt-6">
        <Notice message={state.message} />
        <p className="mt-4 text-sm text-muted">Pense à vérifier tes spams si tu ne le vois pas d’ici quelques minutes.</p>
      </div>
    );
  }

  return (
    <>
      <form action={action} className="mt-6 space-y-4">
        <input type="hidden" name="next" value={next} />
        <Notice error={state?.error} />
        <label className="block text-sm font-medium">
          E-mail
          <input name="email" type="email" required autoComplete="email" placeholder="toi@exemple.com" className={inputClass} />
        </label>
        <label className="block text-sm font-medium">
          Mot de passe
          <input
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="8 caractères minimum"
            className={inputClass}
          />
        </label>
        <label className="flex gap-3 text-sm text-muted">
          <input name="terms" type="checkbox" required className="mt-0.5 size-4 shrink-0 accent-[var(--color-accent)]" />
          <span>
            J’ai 15 ans ou plus et j’accepte les{" "}
            <Link href="/conditions" target="_blank" className="text-white underline hover:text-accent">
              conditions générales
            </Link>{" "}
            et la{" "}
            <Link href="/confidentialite" target="_blank" className="text-white underline hover:text-accent">
              politique de confidentialité
            </Link>
            .
          </span>
        </label>
        <SubmitButton pending={pending}>Créer mon compte</SubmitButton>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        Déjà un compte ?{" "}
        <Link href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"} className="font-medium text-white hover:text-accent">
          Se connecter
        </Link>
      </p>
    </>
  );
}
