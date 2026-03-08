import { NextResponse } from "next/server";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { claimIdempotencyKey } from "@/lib/idempotency";
import { fetchJsonWithRetry } from "@/lib/http-client";
import { createRequestContext, logError, logInfo, withRequestId } from "@/lib/server-observability";
import { siteRatingSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const ctx = createRequestContext(request, "/api/engagement/rating");
  try {
    const ip = getClientIp(request);
    const idem = await claimIdempotencyKey({
      namespace: "engagement_rating",
      key: request.headers.get("x-idempotency-key"),
      identifier: ip,
      ttlSec: 600,
    });
    if (!idem.accepted) {
      return withRequestId(NextResponse.json({ error: "Duplicate request detected." }, { status: 409 }), ctx);
    }

    const limiter = await rateLimit({
      namespace: "site_rating",
      identifier: ip,
      limit: 8,
      windowSec: 3600,
    });

    if (!limiter.success) {
      return withRequestId(NextResponse.json({ error: "Too many rating attempts. Try again later." }, { status: 429 }), ctx);
    }

    const raw = (await request.json()) as unknown;
    const parsed = siteRatingSchema.safeParse(raw);
    if (!parsed.success) {
      return withRequestId(NextResponse.json({ error: "Invalid rating payload." }, { status: 400 }), ctx);
    }

    const payload = parsed.data;
    const webhook = process.env.FEEDBACK_WEBHOOK_URL;
    const resendApiKey = process.env.RESEND_API_KEY;
    const destination = process.env.LEAD_TO_EMAIL;

    const jobs: Array<Promise<{ ok: boolean; status: number }>> = [];

    if (webhook) {
      jobs.push(
        fetchJsonWithRetry(webhook, {
          method: "POST",
          timeoutMs: 10000,
          retries: 1,
          body: { type: "site_rating", ...payload },
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
            subject: `Site rating: ${payload.rating}/5`,
            html: `<h2>Site Rating</h2><p><strong>Rating:</strong> ${payload.rating}/5</p><p><strong>Page:</strong> ${payload.page}</p><p><strong>Email:</strong> ${payload.email || "N/A"}</p><p><strong>Feedback:</strong> ${payload.feedback || "No written feedback"}</p>`,
          },
        }).then(() => ({ ok: true, status: 200 })).catch(() => ({ ok: false, status: 502 })),
      );
    }

    if (jobs.length) {
      const results = await Promise.all(jobs);
      if (!results.some((result) => result.ok)) {
        return withRequestId(NextResponse.json({ error: "Unable to process rating right now." }, { status: 502 }), ctx);
      }
    }

    logInfo(ctx, "engagement_rating_success");
    return withRequestId(NextResponse.json({ ok: true }), ctx);
  } catch (error) {
    logError(ctx, "engagement_rating_error", error);
    return withRequestId(NextResponse.json({ error: "Unexpected rating error." }, { status: 500 }), ctx);
  }
}
