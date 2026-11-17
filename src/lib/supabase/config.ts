// The publishable key is meant to be public; data is protected by row level security.
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://mvzmsnghaqmmfzfkvfcv.supabase.co";
export const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_Qn6QDku7kUIfjhxxR7TCoQ_YudOasb-";

export function safeNext(value: unknown, fallback = "/dashboard") {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return fallback;
  }
  return value;
}
