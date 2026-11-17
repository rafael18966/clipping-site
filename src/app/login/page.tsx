import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "@/components/AuthCard";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Connexion", robots: { index: false }, alternates: { canonical: null } };

export default function LoginPage() {
  return (
    <AuthCard title="Connexion" subtitle="Accède à tes projets et à tes clips.">
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
