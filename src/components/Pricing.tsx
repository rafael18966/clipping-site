"use client";

import Link from "next/link";
import { useState } from "react";
import { Check } from "lucide-react";
import { plans } from "@/lib/site";

export function Pricing() {
  const [yearly, setYearly] = useState(true);
  const hasPaidPrices = plans.some((plan) => plan.monthly);

  return (
    <section id="tarifs" className="scroll-mt-20 border-y border-line bg-surface/40 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-accent">Tarifs</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Un prix simple, qui suit ton rythme
          </h2>
        </div>

        {hasPaidPrices && (
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-full border border-line bg-bg p-1 text-sm">
              {[
                { label: "Mensuel", value: false },
                { label: "Annuel · −20 %", value: true },
              ].map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => setYearly(option.value)}
                  aria-pressed={yearly === option.value}
                  className={`rounded-full px-4 py-2 font-medium transition-colors ${
                    yearly === option.value ? "bg-white text-black" : "text-muted hover:text-white"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => {
            const price = yearly ? plan.yearly : plan.monthly;
            return (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border bg-bg p-7 ${
                  plan.featured ? "border-accent shadow-[0_0_60px_-20px] shadow-accent/50" : "border-line"
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-7 rounded-full bg-accent px-3 py-0.5 text-xs font-semibold text-accent-ink">
                    Recommandé
                  </span>
                )}
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted lg:min-h-10">{plan.description}</p>
                {price === null ? (
                  <p className="mt-6 flex h-12 items-center text-2xl font-semibold tracking-tight text-muted">
                    Prix à venir
                  </p>
                ) : (
                  <p className="mt-6 flex h-12 items-baseline gap-1">
                    <span className="text-5xl font-semibold tracking-tight">{price} €</span>
                    <span className="text-sm text-muted">/ mois</span>
                  </p>
                )}
                <p className="mt-1 h-5 text-xs text-muted">
                  {price ? (yearly ? `Facturé ${price * 12} € par an` : "Facturé chaque mois") : null}
                </p>
                <Link
                  href="/signup"
                  className={`mt-6 flex h-11 items-center justify-center rounded-full font-semibold transition-colors ${
                    plan.featured
                      ? "bg-accent text-accent-ink hover:bg-white"
                      : "border border-line text-white hover:border-white"
                  }`}
                >
                  {plan.cta}
                </Link>
                <ul className="mt-7 space-y-3 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-3 text-zinc-300">
                      <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
