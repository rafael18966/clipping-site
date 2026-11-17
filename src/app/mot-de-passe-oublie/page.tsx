"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestPasswordReset } from "@/app/auth/actions";
import { AuthCard, Notice, SubmitButton, inputClass } from "@/components/AuthCard";

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState(requestPasswordReset, undefined);

  return (
    <AuthCard
      title="Mot de passe oublié"
      subtitle="On t’envoie un lien pour en choisir un nouveau."
      footer={
        <Link href="/login" className="hover:text-white">
          Retour à la connexion
        </Link>
      }
    >
      {state?.message ? (
        <div className="mt-6">
          <Notice message={state.message} />
        </div>
      ) : (
        <form action={action} className="mt-6 space-y-4">
          <Notice error={state?.error} />
          <label className="block text-sm font-medium">
            E-mail
            <input name="email" type="email" required autoComplete="email" placeholder="toi@exemple.com" className={inputClass} />
          </label>
          <SubmitButton pending={pending}>Envoyer le lien</SubmitButton>
        </form>
      )}
    </AuthCard>
  );
}
