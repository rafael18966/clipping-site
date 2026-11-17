import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { limits, planNames } from "./config.ts";
import { db, updateProject, usage, type Project } from "./db.ts";
import { clipCount, findHighlights } from "./highlights.ts";
import { buildSubtitles, extractAudio, probe, renderClip, thumbnail } from "./media.ts";
import { downloadToFile, uploadFile } from "./storage.ts";
import { transcribe } from "./transcribe.ts";

// Errors with a message meant for the user; anything else shows a generic message.
export class UserError extends Error {}

const minutes = (seconds: number) => Math.ceil(seconds / 60);

export async function processProject(project: Project) {
  const dir = await mkdtemp(join(tmpdir(), `job-${project.id}-`));
  const log = (msg: string) => console.log(`[${project.id}] ${msg}`);
  const step = (progress: string) => {
    log(progress);
    return updateProject(project.id, { progress });
  };

  try {
    const source = join(dir, "source");
    await downloadToFile(project.source_key, source);

    const info = await probe(source).catch(() => null);
    if (!info || !info.hasVideo) throw new UserError("Ce fichier n’est pas une vidéo lisible.");
    if (!info.hasAudio) throw new UserError("Cette vidéo ne contient pas de son : impossible de trouver des moments forts.");
    if (info.duration > limits.maxDurationSeconds) throw new UserError("La vidéo dépasse la durée maximale de 3 heures.");

    const { plan, usedSeconds, limitSeconds } = await usage(project.user_id, project.id);
    if (usedSeconds + info.duration > limitSeconds) {
      const leftMinutes = Math.max(0, Math.floor((limitSeconds - usedSeconds) / 60));
      throw new UserError(
        `Cette vidéo dure ${minutes(info.duration)} min, mais il te reste ${leftMinutes} min ce mois-ci avec l’offre ${planNames[plan] ?? plan}.`,
      );
    }
    await updateProject(project.id, { duration_seconds: Math.round(info.duration * 100) / 100 });

    await step("Transcription");
    const audio = join(dir, "audio.mp3");
    await extractAudio(source, audio);
    const { words, sentences, language } = await transcribe(audio);
    if (words.length < 20) throw new UserError("Pas assez de paroles détectées dans la vidéo pour créer des clips.");
    await updateProject(project.id, { language });

    await step("Choix des meilleurs moments");
    const highlights = await findHighlights(sentences, clipCount(info.duration));
    if (highlights.length === 0) throw new UserError("Aucun moment assez fort n’a été trouvé dans cette vidéo.");

    const free = plan === "free";
    for (const [i, h] of highlights.entries()) {
      await step(`Montage des clips (${i + 1}/${highlights.length})`);
      const duration = h.end - h.start;
      const video = join(dir, `clip-${i}.mp4`);
      const thumb = join(dir, `clip-${i}.jpg`);
      const subtitles = buildSubtitles(words, h.start, duration, free ? "ClipWave" : undefined);
      await renderClip({ dir, source, start: h.start, duration, subtitles, height: free ? 1280 : 1920, out: video });
      await thumbnail(video, Math.min(1.5, duration / 3), thumb);

      const base = `clips/${project.user_id}/${project.id}/${i + 1}`;
      await uploadFile(`${base}.mp4`, video, "video/mp4");
      await uploadFile(`${base}.jpg`, thumb, "image/jpeg");

      const { error } = await db.from("clips").insert({
        project_id: project.id,
        user_id: project.user_id,
        position: i + 1,
        title: h.title,
        hook: h.hook,
        score: h.score,
        start_seconds: Math.round(h.start * 100) / 100,
        end_seconds: Math.round(h.end * 100) / 100,
        video_key: `${base}.mp4`,
        thumb_key: `${base}.jpg`,
      });
      if (error) throw error;
      await rm(video, { force: true });
    }

    await updateProject(project.id, { status: "done", progress: null, finished_at: new Date().toISOString() });
    log(`done: ${highlights.length} clips`);
  } catch (err) {
    console.error(`[${project.id}] failed`, err);
    const message =
      err instanceof UserError ? err.message : "Le traitement a échoué à cause d’une erreur de notre côté. Réessaie plus tard.";
    await updateProject(project.id, {
      status: "failed",
      progress: null,
      error: message,
      finished_at: new Date().toISOString(),
    }).catch((e) => console.error(`[${project.id}] could not mark failed`, e));
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
