import Link from "next/link";
import { Scissors } from "lucide-react";
import { site } from "@/lib/site";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
      <span className="grid size-7 place-items-center rounded-lg bg-accent text-accent-ink">
        <Scissors className="size-4" strokeWidth={2.5} />
      </span>
      <span className="text-lg">{site.name}</span>
    </Link>
  );
}
