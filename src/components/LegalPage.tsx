import { legal } from "@/lib/site";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

export function Fill({ value }: { value: string | null }) {
  if (value) return <>{value}</>;
  return <span className="rounded bg-amber-400/15 px-1.5 py-0.5 text-amber-300">[à compléter]</span>;
}

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-3 text-sm text-muted">Dernière mise à jour : {legal.lastUpdated}</p>
          <div className="mt-10 space-y-4 leading-relaxed text-zinc-300 [&_a]:text-accent [&_a]:underline [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-1.5">
            {children}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
