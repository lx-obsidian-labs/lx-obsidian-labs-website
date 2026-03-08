import { NextResponse } from "next/server";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { claimIdempotencyKey } from "@/lib/idempotency";
import { fetchJsonWithRetry } from "@/lib/http-client";
import { createRequestContext, logError, logInfo, withRequestId } from "@/lib/server-observability";
import { quickEmailSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const ctx = createRequestContext(request, "/api/engagement/email");
  try {
    const ip = getClientIp(request);
    const idem = await claimIdempotencyKey({
      namespace: "engagement_email",
      key: request.headers.get("x-idempotency-key"),
      identifier: ip,
      ttlSec: 600,
    });
    if (!idem.accepted) {
      return withRequestId(NextResponse.json({ error: "Duplicate request detected." }, { status: 409 }), ctx);
    }

    const limiter = await rateLimit({
      namespace: "quick_email",
      identifier: ip,
      limit: 5,
      windowSec: 900,
    });

    if (!limiter.success) {
      return withRequestId(NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 }), ctx);
    }

    const raw = (await request.json()) as unknown;
    const parsed = quickEmailSchema.safeParse(raw);
    if (!parsed.success) {
      return withRequestId(NextResponse.json({ error: "Invalid email payload." }, { status: 400 }), ctx);
    }

    const payload = parsed.data;
    const resendApiKey = process.env.RESEND_API_KEY;
    const destination = process.env.LEAD_TO_EMAIL;
    const webhook = process.env.FEEDBACK_WEBHOOK_URL;

    const jobs: Array<Promise<{ ok: boolean; status: number }>> = [];

    if (webhook) {
      jobs.push(
        fetchJsonWithRetry(webhook, {
          method: "POST",
          timeoutMs: 10000,
          retries: 1,
          body: { type: "quick_email", ...payload },
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
            reply_to: payload.email,
            subject: `[Quick Email] ${payload.subject}`,
            html: `<h2>Quick Email</h2><p><strong>Name:</strong> ${payload.name}</p><p><strong>Email:</strong> ${payload.email}</p><p><strong>Subject:</strong> ${payload.subject}</p><p><strong>Message:</strong><br/>${payload.message}</p>`,
          },
        }).then(() => ({ ok: true, status: 200 })).catch(() => ({ ok: false, status: 502 })),
      );
    }

    if (!jobs.length) {
      return withRequestId(NextResponse.json({ error: "Email channel is not configured." }, { status: 503 }), ctx);
    }

    const results = await Promise.all(jobs);
    if (!results.some((result) => result.ok)) {
      return withRequestId(NextResponse.json({ error: "Unable to send message right now." }, { status: 502 }), ctx);
    }

    logInfo(ctx, "engagement_email_success");
    return withRequestId(NextResponse.json({ ok: true }), ctx);
  } catch (error) {
    logError(ctx, "engagement_email_error", error);
    return withRequestId(NextResponse.json({ error: "Unexpected email error." }, { status: 500 }), ctx);
  }
}
