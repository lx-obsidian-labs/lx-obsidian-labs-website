import { NextResponse } from "next/server";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { claimIdempotencyKey } from "@/lib/idempotency";
import { fetchJsonWithRetry } from "@/lib/http-client";
import { createRequestContext, logError, logInfo, withRequestId } from "@/lib/server-observability";
import { newsletterSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const ctx = createRequestContext(request, "/api/engagement/newsletter");
  try {
    const ip = getClientIp(request);
    const idem = await claimIdempotencyKey({
      namespace: "engagement_newsletter",
      key: request.headers.get("x-idempotency-key"),
      identifier: ip,
      ttlSec: 600,
    });
    if (!idem.accepted) {
      return withRequestId(NextResponse.json({ error: "Duplicate request detected." }, { status: 409 }), ctx);
    }

    const limiter = await rateLimit({
      namespace: "newsletter",
      identifier: ip,
      limit: 8,
      windowSec: 3600,
    });

    if (!limiter.success) {
      return withRequestId(NextResponse.json({ error: "Too many newsletter requests. Please try later." }, { status: 429 }), ctx);
    }

    const raw = (await request.json()) as unknown;
    const parsed = newsletterSchema.safeParse(raw);
    if (!parsed.success) {
      return withRequestId(NextResponse.json({ error: "Invalid newsletter payload." }, { status: 400 }), ctx);
    }

    const payload = parsed.data;
    const webhook = process.env.NEWSLETTER_WEBHOOK_URL || process.env.FEEDBACK_WEBHOOK_URL;
    const resendApiKey = process.env.RESEND_API_KEY;
    const destination = process.env.LEAD_TO_EMAIL;

    const jobs: Array<Promise<{ ok: boolean; status: number }>> = [];

    if (webhook) {
      jobs.push(
        fetchJsonWithRetry(webhook, {
          method: "POST",
          timeoutMs: 10000,
          retries: 1,
          body: { type: "newsletter", ...payload },
        }).then(() => ({ ok: true, status: 200 })).catch(() => ({ ok: false, status: 502 })),
      );
    }

    if (resendApiKey && destination) {
      jobs.push(
        fetchJsonWithRetry("https://api.resend.com/emails", {
          method: "POST",
          timeoutMs: 12000,
          retries: 1,
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: {
            from: "LX Obsidian Labs <onboarding@resend.dev>",
            to: [destination],
            subject: "New newsletter subscription",
            html: `<h2>Newsletter Subscription</h2><p><strong>Email:</strong> ${payload.email}</p><p><strong>Name:</strong> ${payload.name || "N/A"}</p><p><strong>Interests:</strong> ${payload.interests.join(", ") || "N/A"}</p>`,
          },
        }).then(() => ({ ok: true, status: 200 })).catch(() => ({ ok: false, status: 502 })),
      );
    }

    if (!jobs.length) {
      return withRequestId(NextResponse.json({ error: "Newsletter channel is not configured." }, { status: 503 }), ctx);
    }

    const results = await Promise.all(jobs);
    if (!results.some((result) => result.ok)) {
      return withRequestId(NextResponse.json({ error: "Unable to subscribe right now." }, { status: 502 }), ctx);
    }

    logInfo(ctx, "engagement_newsletter_success");
    return withRequestId(NextResponse.json({ ok: true }), ctx);
  } catch (error) {
    logError(ctx, "engagement_newsletter_error", error);
    return withRequestId(NextResponse.json({ error: "Unexpected newsletter error." }, { status: 500 }), ctx);
  }
}
