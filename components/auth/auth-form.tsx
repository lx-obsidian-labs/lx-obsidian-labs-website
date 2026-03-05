"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type SessionState = {
  authenticated: boolean;
  user?: {
    id: string;
    email: string;
    name?: string | null;
  };
};

export function AuthForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState("");
  const [session, setSession] = useState<SessionState>({ authenticated: false });

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/auth/session", { cache: "no-store" });
      const data = (await res.json().catch(() => null)) as SessionState | null;
      if (res.ok && data) {
        setSession(data);
      }
    })();
  }, []);

  const signIn = async () => {
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      const data = (await res.json().catch(() => null)) as (SessionState & { error?: string }) | null;
      if (!res.ok || !data) {
        throw new Error(data?.error || "Unable to sign in.");
      }
      setSession(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setStatus("idle");
    }
  };

  const signOut = async () => {
    setStatus("loading");
    setError("");
    try {
      await fetch("/api/auth/session", { method: "DELETE" });
      setSession({ authenticated: false });
    } catch {
      setError("Unable to sign out.");
    } finally {
      setStatus("idle");
    }
  };

  if (session.authenticated) {
    return (
      <div className="mt-6 space-y-3 rounded-md border bg-surface p-4">
        <p className="text-sm font-semibold">You are signed in</p>
        <p className="text-sm text-muted">{session.user?.name || "Creator User"} • {session.user?.email}</p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/creator">Go to Creator</Link>
          </Button>
          <Button variant="secondary" onClick={signOut} disabled={status === "loading"}>
            {status === "loading" ? "Signing out..." : "Sign out"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="grid gap-3">
        <input
          className="h-11 rounded-md border px-3 text-sm"
          type="email"
          placeholder="Work email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="h-11 rounded-md border px-3 text-sm"
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <Button onClick={signIn} disabled={status === "loading" || email.trim().length < 5} className="w-full">
        {status === "loading" ? "Signing in..." : "Continue"}
      </Button>
      <p className="text-xs text-muted">This signs you in and scopes Creator projects to your account.</p>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
