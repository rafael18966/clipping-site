"use server";

import { redirect } from "next/navigation";
import type { AuthError } from "@supabase/supabase-js";
import { site } from "@/lib/site";
import { safeNext } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export type FormState = { error?: string; message?: string } | undefined;

const MIN_PASSWORD = 8;

function field(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function describe(error: AuthError): string {
  switch (error.code) {
    case "invalid_credentials":
      return "E-mail ou mot de passe incorrect.";
    case "email_not_confirmed":
      return "Confirme d’abord ton adresse e-mail grâce au lien reçu par mail.";
    case "user_already_exists":
    case "email_exists":
      return "Un compte existe déjà avec cette adresse. Connecte-toi.";
    case "weak_password":
      return `Mot de passe trop faible : utilise au moins ${MIN_PASSWORD} caractères, en mélangeant lettres et chiffres.`;
    case "same_password":
      return "Choisis un mot de passe différent de l’ancien.";
    case "email_address_invalid":
    case "validation_failed":
      return "Cette adresse e-mail n’est pas valide.";
    case "email_address_not_authorized":
      return "Les inscriptions par e-mail ne sont pas encore ouvertes. Reviens très bientôt !";
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return "Trop de tentatives. Réessaie dans quelques minutes.";
    default:
      return "Une erreur est survenue. Réessaie dans un instant.";
  }
}

export async function login(_: FormState, formData: FormData): Promise<FormState> {
  const email = field(formData, "email");
  const password = formData.get("password");
  if (!email || typeof password !== "string" || !password) return { error: "Renseigne ton e-mail et ton mot de passe." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: describe(error) };

  redirect(safeNext(formData.get("next")));
}

export async function signup(_: FormState, formData: FormData): Promise<FormState> {
  const email = field(formData, "email");
  const password = formData.get("password");
  if (!email) return { error: "Renseigne ton adresse e-mail." };
  if (typeof password !== "string" || password.length < MIN_PASSWORD) {
    return { error: `Le mot de passe doit contenir au moins ${MIN_PASSWORD} caractères.` };
  }
  if (formData.get("terms") !== "on") return { error: "Tu dois accepter les conditions pour créer un compte." };

  const next = safeNext(formData.get("next"));
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${site.url}/auth/confirm?next=${encodeURIComponent(next)}` },
  });
  if (error) return { error: describe(error) };

  if (data.session) redirect(next);
  return { message: `Presque fini ! Ouvre le lien envoyé à ${email} pour activer ton compte.` };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function requestPasswordReset(_: FormState, formData: FormData): Promise<FormState> {
  const email = field(formData, "email");
  if (!email) return { error: "Renseigne ton adresse e-mail." };

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${site.url}/auth/confirm?next=/nouveau-mot-de-passe`,
  });
  if (error && error.code !== "user_not_found") return { error: describe(error) };

  return { message: `Si un compte existe pour ${email}, tu vas recevoir un lien pour choisir un nouveau mot de passe.` };
}

export async function updatePassword(_: FormState, formData: FormData): Promise<FormState> {
  const password = formData.get("password");
  if (typeof password !== "string" || password.length < MIN_PASSWORD) {
    return { error: `Le mot de passe doit contenir au moins ${MIN_PASSWORD} caractères.` };
  }
  if (password !== formData.get("confirm")) return { error: "Les deux mots de passe ne correspondent pas." };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: describe(error) };

  redirect("/dashboard");
}
