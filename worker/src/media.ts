import { spawn } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";

export type Word = { text: string; start: number; end: number };

function run(cmd: string, args: string[], cwd?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (d) => (stdout += d));
    child.stderr.on("data", (d) => (stderr = (stderr + d).slice(-4000)));
    child.on("error", reject);
    child.on("close", (code) => (code === 0 ? resolve(stdout) : reject(new Error(`${cmd} exited ${code}: ${stderr}`))));
  });
}

export async function probe(path: string) {
  const out = await run("ffprobe", [
    "-v", "error",
    "-show_entries", "format=duration:stream=codec_type",
    "-of", "json",
    path,
  ]);
  const info = JSON.parse(out) as { format?: { duration?: string }; streams?: { codec_type?: string }[] };
  const streams = info.streams ?? [];
  return {
    duration: Number(info.format?.duration ?? 0),
    hasVideo: streams.some((s) => s.codec_type === "video"),
    hasAudio: streams.some((s) => s.codec_type === "audio"),
  };
}

export function extractAudio(source: string, out: string) {
  return run("ffmpeg", ["-y", "-v", "error", "-i", source, "-vn", "-ac", "1", "-ar", "16000", "-c:a", "libmp3lame", "-b:a", "48k", out]);
}

const ACCENT = "&H4DFFC8&";
const WHITE = "&HFFFFFF&";

function assTime(t: number) {
  const cs = Math.max(0, Math.round(t * 100));
  const h = Math.floor(cs / 360000);
  const m = Math.floor((cs % 360000) / 6000);
  const s = Math.floor((cs % 6000) / 100);
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(cs % 100).padStart(2, "0")}`;
}

function clean(word: string) {
  return word.replace(/[{}\\]/g, "").toLocaleUpperCase();
}

function groupWords(words: Word[]): Word[][] {
  const groups: Word[][] = [];
  let current: Word[] = [];
  for (const word of words) {
    const prev = current.at(-1);
    const chars = current.reduce((n, w) => n + w.text.length + 1, 0);
    if (prev && (current.length >= 3 || chars + word.text.length > 18 || word.start - prev.end > 0.7)) {
      groups.push(current);
      current = [];
    }
    current.push(word);
    if (/[.!?…,;:]$/.test(word.text)) {
      groups.push(current);
      current = [];
    }
  }
  if (current.length) groups.push(current);
  return groups;
}

export function buildSubtitles(words: Word[], clipStart: number, duration: number, watermark?: string) {
  const local = words
    .map((w) => ({ text: w.text, start: w.start - clipStart, end: w.end - clipStart }))
    .filter((w) => w.end > 0 && w.start < duration);

  const lines = [
    "[Script Info]",
    "ScriptType: v4.00+",
    "PlayResX: 1080",
    "PlayResY: 1920",
    "WrapStyle: 0",
    "ScaledBorderAndShadow: yes",
    "",
    "[V4+ Styles]",
    "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
    "Style: Caption,DejaVu Sans,84,&H00FFFFFF,&H00FFFFFF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,7,2,2,70,70,560,1",
    "Style: Mark,DejaVu Sans,40,&H40FFFFFF,&H00FFFFFF,&H90000000,&H00000000,-1,0,0,0,100,100,0,0,1,3,0,9,50,50,80,1",
    "",
    "[Events]",
    "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text",
  ];

  const groups = groupWords(local);
  groups.forEach((group, g) => {
    const nextStart = groups[g + 1]?.[0]?.start ?? duration;
    const groupEnd = Math.min(nextStart, group.at(-1)!.end + 0.4, duration);
    group.forEach((word, i) => {
      const start = i === 0 ? Math.max(0, word.start) : word.start;
      const end = i < group.length - 1 ? group[i + 1].start : groupEnd;
      if (end <= start) return;
      const text = group
        .map((w, j) => (j === i ? `{\\c${ACCENT}}${clean(w.text)}{\\c${WHITE}}` : clean(w.text)))
        .join(" ");
      lines.push(`Dialogue: 0,${assTime(start)},${assTime(end)},Caption,,0,0,0,,${text}`);
    });
  });

  if (watermark) lines.push(`Dialogue: 1,${assTime(0)},${assTime(duration)},Mark,,0,0,0,,${clean(watermark)}`);
  return lines.join("\n") + "\n";
}

export async function renderClip(opts: {
  dir: string;
  source: string;
  start: number;
  duration: number;
  subtitles: string;
  height: 1280 | 1920;
  out: string;
}) {
  const width = opts.height === 1920 ? 1080 : 720;
  await writeFile(join(opts.dir, "subs.ass"), opts.subtitles);
  // Relative "subs.ass" with cwd=dir avoids escaping the path inside the filter graph.
  await run(
    "ffmpeg",
    [
      "-y", "-v", "error",
      "-ss", opts.start.toFixed(2),
      "-i", opts.source,
      "-t", opts.duration.toFixed(2),
      "-vf", `scale=${width}:${opts.height}:force_original_aspect_ratio=increase,crop=${width}:${opts.height},setsar=1,ass=subs.ass`,
      "-c:v", "libx264", "-preset", "veryfast", "-crf", "23", "-pix_fmt", "yuv420p",
      "-c:a", "aac", "-b:a", "128k", "-ac", "2",
      "-movflags", "+faststart",
      opts.out,
    ],
    opts.dir,
  );
}

export function thumbnail(video: string, at: number, out: string) {
  return run("ffmpeg", ["-y", "-v", "error", "-ss", at.toFixed(2), "-i", video, "-frames:v", "1", "-vf", "scale=360:-2", "-q:v", "4", out]);
}
