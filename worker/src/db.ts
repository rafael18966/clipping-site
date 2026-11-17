import { createClient } from "@supabase/supabase-js";
import { config, limits } from "./config.ts";

// Secret key: bypasses row level security, so every query must scope by user itself.
export const db = createClient(config.supabaseUrl, config.supabaseSecretKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export type Project = {
  id: string;
  user_id: string;
  title: string;
  status: "uploading" | "queued" | "processing" | "done" | "failed";
  progress: string | null;
  error: string | null;
  source_key: string;
  source_size: number | null;
  duration_seconds: number | null;
  language: string | null;
  source_deleted_at: string | null;
  created_at: string;
  started_at: string | null;
  finished_at: string | null;
};

export async function userIdFromToken(token: string): Promise<string | null> {
  const { data, error } = await db.auth.getClaims(token);
  if (error || !data?.claims?.sub) return null;
  return data.claims.sub;
}

export async function getPlan(userId: string): Promise<string> {
  const { data } = await db.from("profiles").select("plan").eq("id", userId).single();
  return data?.plan ?? "free";
}

function monthStart(): string {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
}

export async function usage(userId: string, excludeProjectId?: string) {
  let query = db
    .from("projects")
    .select("duration_seconds")
    .eq("user_id", userId)
    .in("status", ["processing", "done"])
    .gte("created_at", monthStart())
    .not("duration_seconds", "is", null);
  if (excludeProjectId) query = query.neq("id", excludeProjectId);
  const { data, error } = await query;
  if (error) throw error;

  const usedSeconds = (data ?? []).reduce((sum, row) => sum + Number(row.duration_seconds), 0);
  const plan = await getPlan(userId);
  const limitMinutes = limits.monthlyMinutes[plan] ?? limits.monthlyMinutes.free;
  return { plan, usedSeconds, limitSeconds: limitMinutes * 60 };
}

export async function updateProject(id: string, fields: Partial<Project>) {
  const { error } = await db.from("projects").update(fields).eq("id", id);
  if (error) throw error;
}
