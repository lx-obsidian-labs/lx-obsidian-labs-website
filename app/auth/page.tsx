import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Auth",
  description: "Sign in or create your Obsidian Creator account.",
  alternates: { canonical: "/auth" },
};

export default function AuthPage() {
  return (
    <Section className="bg-surface py-20">
      <div className="mx-auto max-w-xl rounded-xl border bg-white p-6 md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Creator Access</p>
        <h1 className="mt-3 text-3xl font-bold">Sign In to Obsidian Creator</h1>
        <p className="mt-3 text-sm text-muted">Use your email to access Creator projects. Your saved work is scoped to your account.</p>
        <AuthForm />
      </div>
    </Section>
  );
}
