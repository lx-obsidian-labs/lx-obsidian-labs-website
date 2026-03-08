"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";

async function postJson(path: string, body: Record<string, unknown>) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => null)) as { error?: string } | null;
  if (!res.ok) throw new Error(data?.error || "Request failed.");
}

export function EngagementCenter() {
  const [rating, setRating] = useState(5);
  const [ratingFeedback, setRatingFeedback] = useState("");
  const [ratingEmail, setRatingEmail] = useState("");
  const [ratingState, setRatingState] = useState<{ loading: boolean; message: string; error: string }>({ loading: false, message: "", error: "" });

  const [emailForm, setEmailForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [emailState, setEmailState] = useState<{ loading: boolean; message: string; error: string }>({ loading: false, message: "", error: "" });

  const [newsletter, setNewsletter] = useState({ name: "", email: "", interests: "" });
  const [newsletterState, setNewsletterState] = useState<{ loading: boolean; message: string; error: string }>({ loading: false, message: "", error: "" });

  const submitRating = async () => {
    setRatingState({ loading: true, message: "", error: "" });
    try {
      await postJson("/api/engagement/rating", {
        rating,
        feedback: ratingFeedback,
        email: ratingEmail || undefined,
        page: "home",
      });
      track("site_rating_submit", { rating });
      setRatingState({ loading: false, message: "Thanks for rating the site.", error: "" });
      setRatingFeedback("");
    } catch (err) {
      setRatingState({ loading: false, message: "", error: err instanceof Error ? err.message : "Unable to submit rating." });
    }
  };

  const submitEmail = async () => {
    setEmailState({ loading: true, message: "", error: "" });
    try {
      await postJson("/api/engagement/email", emailForm);
      track("quick_email_submit", { source: "engagement_center" });
      setEmailState({ loading: false, message: "Message sent. Our team will reply soon.", error: "" });
      setEmailForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setEmailState({ loading: false, message: "", error: err instanceof Error ? err.message : "Unable to send message." });
    }
  };

  const submitNewsletter = async () => {
    setNewsletterState({ loading: true, message: "", error: "" });
    try {
      const interests = newsletter.interests
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      await postJson("/api/engagement/newsletter", {
        name: newsletter.name,
        email: newsletter.email,
        interests,
      });
      track("newsletter_subscribe", { source: "engagement_center" });
      setNewsletterState({ loading: false, message: "Subscribed. You will receive our updates.", error: "" });
      setNewsletter({ name: "", email: "", interests: "" });
    } catch (err) {
      setNewsletterState({ loading: false, message: "", error: err instanceof Error ? err.message : "Unable to subscribe." });
    }
  };

  return (
    <div className="rounded-2xl border bg-white p-6 md:p-10">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Engagement Center</p>
      <h2 className="mt-3 text-2xl font-bold md:text-4xl">Rate the site, send a message, or join the newsletter.</h2>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <article className="rounded-xl border bg-surface p-5">
          <h3 className="text-lg font-semibold">Rate this site</h3>
          <div className="mt-3 flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                className={`h-9 w-9 rounded-md border text-sm font-semibold ${rating >= value ? "border-accent bg-accent text-white" : "bg-white"}`}
              >
                {value}
              </button>
            ))}
          </div>
          <textarea
            rows={3}
            className="mt-3 w-full rounded-md border px-3 py-2 text-sm"
            placeholder="Optional feedback"
            value={ratingFeedback}
            onChange={(e) => setRatingFeedback(e.target.value)}
          />
          <input
            className="mt-3 h-10 w-full rounded-md border px-3 text-sm"
            type="email"
            placeholder="Optional email"
            value={ratingEmail}
            onChange={(e) => setRatingEmail(e.target.value)}
          />
          <Button className="mt-3 w-full" onClick={submitRating} disabled={ratingState.loading}>
            {ratingState.loading ? "Submitting..." : "Submit Rating"}
          </Button>
          {ratingState.message ? <p className="mt-2 text-xs text-green-700">{ratingState.message}</p> : null}
          {ratingState.error ? <p className="mt-2 text-xs text-red-700">{ratingState.error}</p> : null}
        </article>

        <article className="rounded-xl border bg-surface p-5">
          <h3 className="text-lg font-semibold">Send quick email</h3>
          <div className="mt-3 grid gap-2">
            <input className="h-10 rounded-md border px-3 text-sm" placeholder="Name" value={emailForm.name} onChange={(e) => setEmailForm((p) => ({ ...p, name: e.target.value }))} />
            <input className="h-10 rounded-md border px-3 text-sm" type="email" placeholder="Email" value={emailForm.email} onChange={(e) => setEmailForm((p) => ({ ...p, email: e.target.value }))} />
            <input className="h-10 rounded-md border px-3 text-sm" placeholder="Subject" value={emailForm.subject} onChange={(e) => setEmailForm((p) => ({ ...p, subject: e.target.value }))} />
            <textarea rows={3} className="rounded-md border px-3 py-2 text-sm" placeholder="Message" value={emailForm.message} onChange={(e) => setEmailForm((p) => ({ ...p, message: e.target.value }))} />
          </div>
          <Button className="mt-3 w-full" onClick={submitEmail} disabled={emailState.loading || !emailForm.email || !emailForm.message}>
            {emailState.loading ? "Sending..." : "Send Email"}
          </Button>
          {emailState.message ? <p className="mt-2 text-xs text-green-700">{emailState.message}</p> : null}
          {emailState.error ? <p className="mt-2 text-xs text-red-700">{emailState.error}</p> : null}
        </article>

        <article className="rounded-xl border bg-surface p-5">
          <h3 className="text-lg font-semibold">Newsletter</h3>
          <div className="mt-3 grid gap-2">
            <input className="h-10 rounded-md border px-3 text-sm" placeholder="Name (optional)" value={newsletter.name} onChange={(e) => setNewsletter((p) => ({ ...p, name: e.target.value }))} />
            <input className="h-10 rounded-md border px-3 text-sm" type="email" placeholder="Email" value={newsletter.email} onChange={(e) => setNewsletter((p) => ({ ...p, email: e.target.value }))} />
            <input className="h-10 rounded-md border px-3 text-sm" placeholder="Interests (comma separated)" value={newsletter.interests} onChange={(e) => setNewsletter((p) => ({ ...p, interests: e.target.value }))} />
          </div>
          <Button className="mt-3 w-full" onClick={submitNewsletter} disabled={newsletterState.loading || !newsletter.email}>
            {newsletterState.loading ? "Subscribing..." : "Subscribe"}
          </Button>
          {newsletterState.message ? <p className="mt-2 text-xs text-green-700">{newsletterState.message}</p> : null}
          {newsletterState.error ? <p className="mt-2 text-xs text-red-700">{newsletterState.error}</p> : null}
        </article>
      </div>
    </div>
  );
}
