import { redirect } from "next/navigation";
import type { PlanId } from "./site";
import { createClient } from "./supabase/server";

export type CurrentUser = { id: string; email: string; plan: PlanId };

export async function getCurrentUser(): Promise<CurrentUser> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("plan").eq("id", claims.sub).single();

  return {
    id: claims.sub,
    email: typeof claims.email === "string" ? claims.email : "",
    plan: (profile?.plan as PlanId | undefined) ?? "free",
  };
}
