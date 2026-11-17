import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import type { Sentence } from "./transcribe.ts";

// Reads ANTHROPIC_API_KEY from the environment.
const client = new Anthropic();

const HighlightsSchema = z.object({
  clips: z.array(
    z.object({
      start_sentence: z.number().int(),
      end_sentence: z.number().int(),
      title: z.string(),
      hook: z.string(),
      score: z.number().int(),
    }),
  ),
});

export type Highlight = { start: number; end: number; title: string; hook: string; score: number };

const MIN_SECONDS = 12;
const MAX_SECONDS = 90;

const SYSTEM = `You are an expert short-form video editor who turns long videos (podcasts, interviews, lives, talks) into vertical clips for TikTok, Instagram Reels and YouTube Shorts.

You receive a transcript split into numbered sentences, each with its start and end time. Pick the moments most likely to perform well as standalone short videos.

A good clip:
- makes sense on its own, without the rest of the video;
- grabs attention in its first seconds (a strong claim, a question, a surprising fact, an emotional moment, a punchline);
- ends on a complete thought, never mid-sentence;
- lasts between 20 and 75 seconds (absolute limits: ${MIN_SECONDS} to ${MAX_SECONDS} seconds).

For each clip return:
- start_sentence and end_sentence: the numbers of the first and last sentences of the clip (inclusive);
- title: a short, catchy title (under 60 characters) written in the language of the transcript;
- hook: one sentence explaining why this moment works, in the language of the transcript;
- score: an honest estimate from 0 to 100 of the clip's viral potential. Use the full range; do not give every clip a high score.

Clips must not overlap. Return them sorted from highest to lowest score. If the transcript contains fewer good moments than requested, return fewer clips rather than weak ones.`;

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function clipCount(durationSeconds: number) {
  return Math.min(10, Math.max(3, Math.round(durationSeconds / 240)));
}

export async function findHighlights(sentences: Sentence[], wanted: number): Promise<Highlight[]> {
  const transcript = sentences
    .map((s, i) => `[${i}] ${formatTime(s.start)}-${formatTime(s.end)} ${s.text}`)
    .join("\n");

  const response = await client.beta.messages.parse({
    model: "claude-opus-5-5",
    max_tokens: 16000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "medium", format: betaZodOutputFormat(HighlightsSchema) },
    system: SYSTEM,
    messages: [
      {
        role: "user",
        content: `Find up to ${wanted} clips in this transcript.\n\n<transcript>\n${transcript}\n</transcript>`,
      },
    ],
  });

  if (response.stop_reason === "refusal") throw new Error("Claude declined to analyse this transcript");
  const parsed = response.parsed_output;
  if (!parsed) throw new Error(`No structured output (stop_reason: ${response.stop_reason})`);

  return normalize(parsed.clips, sentences, wanted);
}

function normalize(clips: z.infer<typeof HighlightsSchema>["clips"], sentences: Sentence[], wanted: number) {
  const last = sentences.length - 1;
  const result: Highlight[] = [];

  for (const clip of [...clips].sort((a, b) => b.score - a.score)) {
    const first = Math.min(Math.max(clip.start_sentence, 0), last);
    let end = Math.min(Math.max(clip.end_sentence, first), last);
    const start = sentences[first].start;
    while (end > first && sentences[end].end - start > MAX_SECONDS) end--;

    const clipStart = Math.max(0, start - 0.15);
    const clipEnd = sentences[end].end + 0.35;
    if (clipEnd - clipStart < MIN_SECONDS || clipEnd - clipStart > MAX_SECONDS + 1) continue;
    if (result.some((r) => clipStart < r.end && clipEnd > r.start)) continue;

    result.push({
      start: clipStart,
      end: clipEnd,
      title: clip.title.trim().slice(0, 80) || "Clip",
      hook: clip.hook.trim().slice(0, 300),
      score: Math.min(100, Math.max(0, Math.round(clip.score))),
    });
    if (result.length >= wanted) break;
  }
  return result;
}
