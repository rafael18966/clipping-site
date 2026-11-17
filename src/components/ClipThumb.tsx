import { Flame } from "lucide-react";
import type { Clip } from "@/lib/site";

type Props = Pick<Clip, "caption" | "highlight" | "score" | "duration" | "gradient"> & {
  className?: string;
};

export function ClipThumb({ caption, highlight, score, duration, gradient, className = "" }: Props) {
  return (
    <div className={`relative aspect-[9/16] overflow-hidden rounded-xl border border-white/10 ${gradient} ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.22),transparent_55%)]" />
      <div className="absolute left-1/2 top-[24%] aspect-square w-[36%] -translate-x-1/2 rounded-full bg-black/30" />
      <div className="absolute bottom-0 left-1/2 h-[42%] w-[80%] -translate-x-1/2 rounded-t-full bg-black/30" />

      <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-xs font-semibold text-accent backdrop-blur">
        <Flame className="size-3" />
        {score}
      </span>
      <span className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 font-mono text-[11px] text-white backdrop-blur">
        {duration}
      </span>

      <p className="absolute inset-x-2 bottom-[16%] text-center text-[13px] font-extrabold uppercase leading-tight text-white [text-shadow:0_2px_6px_rgba(0,0,0,0.7)]">
        {caption.split(" ").map((word, i) => (
          <span key={i} className={word === highlight ? "text-accent" : undefined}>
            {word}{" "}
          </span>
        ))}
      </p>
    </div>
  );
}
