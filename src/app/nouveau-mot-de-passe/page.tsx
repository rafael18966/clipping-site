"use client";

import { useActionState } from "react";
import { updatePassword } from "@/app/auth/actions";
import { AuthCard, Notice, SubmitButton, inputClass } from "@/components/AuthCard";

export default function NewPasswordPage() {
  const [state, action, pending] = useActionState(updatePassword, undefined);

  return (
    <AuthCard title="Nouveau mot de passe" subtitle="Choisis le mot de passe que tu utiliseras désormais.">
      <form action={action} className="mt-6 space-y-4">
        <Notice error={state?.error} />
        <label className="block text-sm font-medium">
          Nouveau mot de passe
          <input name="password" type="password" required minLength={8} autoComplete="new-password" className={inputClass} />
        </label>
        <label className="block text-sm font-medium">
          Confirme le mot de passe
          <input name="confirm" type="password" required minLength={8} autoComplete="new-password" className={inputClass} />
        </label>
        <SubmitButton pending={pending}>Enregistrer</SubmitButton>
      </form>
    </AuthCard>
  );
}
