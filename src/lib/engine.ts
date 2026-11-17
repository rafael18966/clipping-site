import { createClient } from "./supabase/client";

export const engineUrl = process.env.NEXT_PUBLIC_ENGINE_URL ?? "https://worker-production-91062481.up.railway.app";

export type ProjectStatus = "uploading" | "queued" | "processing" | "done" | "failed";

export type ProjectSummary = {
  id: string;
  title: string;
  status: ProjectStatus;
  progress: string | null;
  error: string | null;
  durationSeconds: number | null;
  createdAt: string;
};

export type Clip = {
  id: string;
  position: number;
  title: string;
  hook: string | null;
  score: number;
  durationSeconds: number;
  videoUrl: string;
  downloadUrl: string;
  thumbUrl: string;
};

export type ProjectDetail = ProjectSummary & { clips: Clip[] };
export type Usage = { plan: string; usedMinutes: number; limitMinutes: number };

const supabase = createClient();

async function token() {
  const { data } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token;
  if (!accessToken) {
    window.location.href = "/login?next=/dashboard";
    throw new Error("Session expirée.");
  }
  return accessToken;
}

export async function api<T>(path: string, init?: { method?: string; body?: unknown }): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${engineUrl}${path}`, {
      method: init?.method ?? "GET",
      headers: { Authorization: `Bearer ${await token()}`, "Content-Type": "application/json" },
      body: init?.body === undefined ? undefined : JSON.stringify(init.body),
    });
  } catch {
    throw new Error("Impossible de joindre le serveur de traitement. Réessaie dans un instant.");
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error ?? "Une erreur est survenue.");
  return json as T;
}

export function uploadFile(url: string, file: File, onProgress: (ratio: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(e.loaded / e.total);
    xhr.onload = () => (xhr.status < 300 ? resolve() : reject(new Error("L’envoi de la vidéo a échoué.")));
    xhr.onerror = () => reject(new Error("L’envoi de la vidéo a été interrompu. Vérifie ta connexion."));
    xhr.send(file);
  });
}

export function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}
