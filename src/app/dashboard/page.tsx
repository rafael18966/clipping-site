import type { Metadata } from "next";
import { Suspense } from "react";
import { Dashboard } from "./Dashboard";

export const metadata: Metadata = { title: "Tableau de bord", robots: { index: false }, alternates: { canonical: null } };

export default function DashboardPage() {
  return (
    <Suspense>
      <Dashboard />
    </Suspense>
  );
}
