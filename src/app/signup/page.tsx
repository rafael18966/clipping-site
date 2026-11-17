import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "@/components/AuthCard";
import { SignupForm } from "./SignupForm";

export const metadata: Metadata = { title: "Créer un compte", robots: { index: false }, alternates: { canonical: null } };

export default function SignupPage() {
  return (
    <AuthCard title="Créer un compte" subtitle="Gratuit, sans carte bancaire.">
      <Suspense>
        <SignupForm />
      </Suspense>
    </AuthCard>
  );
}
