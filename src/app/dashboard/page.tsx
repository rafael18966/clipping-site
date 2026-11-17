import type { Metadata } from "next";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth";
import { Dashboard } from "./Dashboard";

export const metadata: Metadata = { title: "Tableau de bord", robots: { index: false }, alternates: { canonical: null } };

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex-1" />}>
      <DashboardForUser />
    </Suspense>
  );
}

async function DashboardForUser() {
  const user = await getCurrentUser();
  return <Dashboard email={user.email} plan={user.plan} />;
}
