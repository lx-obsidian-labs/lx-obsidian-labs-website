import type { Metadata } from "next";
import { Section } from "@/components/layout/section";

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
        <h1 className="mt-3 text-3xl font-bold">Login / Register</h1>
        <p className="mt-3 text-sm text-muted">Authentication backend will be connected in the next phase. This page is ready for provider integration.</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button className="rounded-md border bg-surface px-4 py-2 text-sm font-semibold">Login</button>
          <button className="rounded-md border bg-surface px-4 py-2 text-sm font-semibold">Register</button>
        </div>
      </div>
    </Section>
  );
}
