import { readFile } from "node:fs/promises";
import { config } from "./config.ts";
import type { Word } from "./media.ts";

export type Sentence = { text: string; start: number; end: number };

type DeepgramWord = { word: string; punctuated_word?: string; start: number; end: number; language?: string };
type DeepgramResponse = {
  results?: {
    channels?: {
      detected_language?: string;
      alternatives?: {
        words?: DeepgramWord[];
        paragraphs?: { paragraphs?: { sentences?: Sentence[] }[] };
      }[];
    }[];
  };
};

function sentencesFromWords(words: Word[]): Sentence[] {
  const sentences: Sentence[] = [];
  let current: Word[] = [];
  for (const word of words) {
    current.push(word);
    if (/[.!?…]$/.test(word.text) || current.length >= 40) {
      sentences.push({ text: current.map((w) => w.text).join(" "), start: current[0].start, end: word.end });
      current = [];
    }
  }
  if (current.length) {
    sentences.push({ text: current.map((w) => w.text).join(" "), start: current[0].start, end: current.at(-1)!.end });
  }
  return sentences;
}

function mostCommon(values: (string | undefined)[]) {
  const counts = new Map<string, number>();
  for (const v of values) if (v) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}

export async function transcribe(audioPath: string) {
  const audio = await readFile(audioPath);
  const url = "https://api.deepgram.com/v1/listen?model=nova-3&language=multi&smart_format=true&paragraphs=true";
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Token ${config.deepgramKey}`, "Content-Type": "audio/mpeg" },
    body: audio,
    signal: AbortSignal.timeout(20 * 60 * 1000),
  });
  if (!res.ok) throw new Error(`Deepgram ${res.status}: ${(await res.text()).slice(0, 500)}`);

  const json = (await res.json()) as DeepgramResponse;
  const channel = json.results?.channels?.[0];
  const alt = channel?.alternatives?.[0];
  const raw = alt?.words ?? [];
  const words: Word[] = raw.map((w) => ({ text: w.punctuated_word ?? w.word, start: w.start, end: w.end }));

  const fromParagraphs = (alt?.paragraphs?.paragraphs ?? []).flatMap((p) => p.sentences ?? []);
  const sentences = fromParagraphs.length > 0 ? fromParagraphs : sentencesFromWords(words);
  const language = channel?.detected_language ?? mostCommon(raw.map((w) => w.language));

  return { words, sentences, language };
}
