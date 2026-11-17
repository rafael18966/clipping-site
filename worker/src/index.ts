import { setTimeout as sleep } from "node:timers/promises";
import { limits } from "./config.ts";
import { db, type Project } from "./db.ts";
import { processProject } from "./process.ts";
import { startServer } from "./server.ts";
import { configureCors, deleteObject } from "./storage.ts";

async function requeueInterrupted() {
  // A single worker runs jobs, so anything still "processing" at boot was cut off by a restart.
  const { error } = await db
    .from("projects")
    .update({ status: "queued", progress: "En attente" })
    .eq("status", "processing");
  if (error) console.error("requeue failed", error);
}

async function jobLoop() {
  for (;;) {
    try {
      const { data, error } = await db.rpc("claim_next_project");
      if (error) throw error;
      const project = (data as Project[] | null)?.[0];
      if (project) {
        await processProject(project);
        continue;
      }
    } catch (err) {
      console.error("job loop error", err);
    }
    await sleep(3000);
  }
}

async function cleanup() {
  const now = Date.now();
  const retention = new Date(now - limits.sourceRetentionDays * 86_400_000).toISOString();
  const staleUpload = new Date(now - 86_400_000).toISOString();

  const { data: old } = await db
    .from("projects")
    .select("id, source_key")
    .is("source_deleted_at", null)
    .in("status", ["done", "failed"])
    .lt("finished_at", retention)
    .limit(200);
  const { data: abandoned } = await db
    .from("projects")
    .select("id, source_key")
    .eq("status", "uploading")
    .lt("created_at", staleUpload)
    .limit(200);

  for (const p of old ?? []) {
    await deleteObject(p.source_key);
    await db.from("projects").update({ source_deleted_at: new Date().toISOString() }).eq("id", p.id);
  }
  for (const p of abandoned ?? []) {
    await deleteObject(p.source_key).catch(() => {});
    await db
      .from("projects")
      .update({ status: "failed", error: "L’envoi de la vidéo a été interrompu.", source_deleted_at: new Date().toISOString() })
      .eq("id", p.id);
  }
  if ((old?.length ?? 0) + (abandoned?.length ?? 0) > 0) {
    console.log(`cleanup: ${old?.length ?? 0} expired sources, ${abandoned?.length ?? 0} abandoned uploads`);
  }
}

startServer();
await configureCors().catch((err) => console.error("bucket CORS setup failed", err));
await requeueInterrupted();
setInterval(() => cleanup().catch((err) => console.error("cleanup failed", err)), 3_600_000);
cleanup().catch((err) => console.error("cleanup failed", err));
jobLoop();
