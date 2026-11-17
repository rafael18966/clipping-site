import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { randomUUID } from "node:crypto";
import { config, limits } from "./config.ts";
import { db, usage, userIdFromToken, type Project } from "./db.ts";
import { downloadUrl, objectSize, uploadUrl } from "./storage.ts";

class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function send(res: ServerResponse, status: number, body: unknown) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

function cors(req: IncomingMessage, res: ServerResponse) {
  const origin = req.headers.origin;
  if (origin && config.allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
    res.setHeader("Access-Control-Max-Age", "3600");
  }
}

async function readJson(req: IncomingMessage): Promise<Record<string, unknown>> {
  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 10_000) throw new HttpError(413, "Requête trop volumineuse.");
  }
  try {
    return raw ? JSON.parse(raw) : {};
  } catch {
    throw new HttpError(400, "JSON invalide.");
  }
}

async function requireUser(req: IncomingMessage) {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const userId = token ? await userIdFromToken(token) : null;
  if (!userId) throw new HttpError(401, "Connecte-toi pour continuer.");
  return userId;
}

async function ownedProject(userId: string, id: string): Promise<Project> {
  const { data } = await db.from("projects").select("*").eq("id", id).eq("user_id", userId).maybeSingle();
  if (!data) throw new HttpError(404, "Projet introuvable.");
  return data as Project;
}

function slug(text: string) {
  return (
    text
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase()
      .slice(0, 60) || "clip"
  );
}

function publicProject(p: Project) {
  return {
    id: p.id,
    title: p.title,
    status: p.status,
    progress: p.progress,
    error: p.error,
    durationSeconds: p.duration_seconds === null ? null : Number(p.duration_seconds),
    createdAt: p.created_at,
  };
}

async function createProject(userId: string, body: Record<string, unknown>) {
  const filename = typeof body.filename === "string" ? body.filename : "";
  const size = typeof body.size === "number" ? body.size : 0;
  const type = typeof body.type === "string" ? body.type : "";
  if (!filename || !type.startsWith("video/")) throw new HttpError(400, "Choisis un fichier vidéo (MP4, MOV…).");
  if (size <= 0 || size > limits.maxUploadBytes) throw new HttpError(400, "La vidéo doit faire moins de 2 Go.");

  const { usedSeconds, limitSeconds } = await usage(userId);
  if (usedSeconds >= limitSeconds) {
    throw new HttpError(403, "Tu as utilisé toutes tes minutes ce mois-ci. Elles seront rechargées le 1er du mois.");
  }

  const id = randomUUID();
  const title = filename.replace(/\.[^.]+$/, "").slice(0, 120) || "Ma vidéo";
  const sourceKey = `sources/${userId}/${id}`;
  const { error } = await db
    .from("projects")
    .insert({ id, user_id: userId, title, status: "uploading", source_key: sourceKey, source_size: size });
  if (error) throw error;

  return { id, uploadUrl: await uploadUrl(sourceKey, type, size) };
}

async function startProject(userId: string, id: string) {
  const project = await ownedProject(userId, id);
  if (project.status !== "uploading") return publicProject(project);
  if ((await objectSize(project.source_key)) === null) throw new HttpError(409, "La vidéo n’a pas fini d’être envoyée.");

  const { data, error } = await db
    .from("projects")
    .update({ status: "queued", progress: "En attente" })
    .eq("id", id)
    .eq("status", "uploading")
    .select("*")
    .single();
  if (error) throw error;
  return publicProject(data as Project);
}

async function listProjects(userId: string) {
  const { data, error } = await db
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .neq("status", "uploading")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return (data as Project[]).map(publicProject);
}

async function getProject(userId: string, id: string) {
  const project = await ownedProject(userId, id);
  const { data, error } = await db
    .from("clips")
    .select("*")
    .eq("project_id", id)
    .eq("user_id", userId)
    .order("position");
  if (error) throw error;

  const clips = await Promise.all(
    (data ?? []).map(async (c) => ({
      id: c.id as string,
      position: c.position as number,
      title: c.title as string,
      hook: c.hook as string | null,
      score: c.score as number,
      durationSeconds: Number(c.end_seconds) - Number(c.start_seconds),
      videoUrl: await downloadUrl(c.video_key),
      downloadUrl: await downloadUrl(c.video_key, `${String(c.position).padStart(2, "0")}-${slug(c.title)}.mp4`),
      thumbUrl: await downloadUrl(c.thumb_key),
    })),
  );
  return { ...publicProject(project), clips };
}

async function route(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url ?? "/", "http://localhost");
  const parts = url.pathname.split("/").filter(Boolean);

  if (req.method === "GET" && url.pathname === "/health") return send(res, 200, { ok: true });

  const userId = await requireUser(req);

  if (req.method === "GET" && url.pathname === "/usage") {
    const u = await usage(userId);
    return send(res, 200, {
      plan: u.plan,
      usedMinutes: Math.ceil(u.usedSeconds / 60),
      limitMinutes: Math.round(u.limitSeconds / 60),
    });
  }
  if (parts[0] === "projects") {
    if (parts.length === 1 && req.method === "GET") return send(res, 200, await listProjects(userId));
    if (parts.length === 1 && req.method === "POST") return send(res, 201, await createProject(userId, await readJson(req)));
    if (parts.length === 2 && req.method === "GET") return send(res, 200, await getProject(userId, parts[1]));
    if (parts.length === 3 && parts[2] === "start" && req.method === "POST") {
      return send(res, 200, await startProject(userId, parts[1]));
    }
  }
  throw new HttpError(404, "Introuvable.");
}

export function startServer() {
  const server = createServer(async (req, res) => {
    cors(req, res);
    if (req.method === "OPTIONS") {
      res.writeHead(204);
      return res.end();
    }
    try {
      await route(req, res);
    } catch (err) {
      if (err instanceof HttpError) return send(res, err.status, { error: err.message });
      console.error("request failed", req.method, req.url, err);
      send(res, 500, { error: "Erreur du serveur. Réessaie dans un instant." });
    }
  });
  server.listen(config.port, () => console.log(`worker listening on ${config.port}`));
}
