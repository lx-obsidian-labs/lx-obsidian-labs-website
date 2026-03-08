import { NextResponse } from "next/server";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { claimIdempotencyKey } from "@/lib/idempotency";
import { fetchJsonWithRetry } from "@/lib/http-client";
import { createRequestContext, logError, logInfo, withRequestId } from "@/lib/server-observability";
import { leadPayloadSchema } from "@/lib/validation";
import { scoreLead } from "@/lib/lead-scoring";

type LeadPayload = {
  projectType?: string;
  budgetRange?: string;
  timeline?: string;
  name?: string;
  email?: string;
  company?: string;
  currentTools?: string;
  primaryGoal?: string;
  message?: string;
  website?: string;
  startedAt?: number;
};

function buildEmailHtml(
  payload: LeadPayload,
  intelligence: { score: number; priority: "low" | "medium" | "high"; routingTag: string },
) {
  return `
    <h2>New Lead - LX Obsidian Labs</h2>
    <p><strong>Priority:</strong> ${intelligence.priority.toUpperCase()}</p>
    <p><strong>Lead Score:</strong> ${intelligence.score}/100</p>
    <p><strong>Routing Tag:</strong> ${intelligence.routingTag}</p>
    <p><strong>Name:</strong> ${payload.name ?? ""}</p>
    <p><strong>Email:</strong> ${payload.email ?? ""}</p>
    <p><strong>Company:</strong> ${payload.company ?? ""}</p>
    <p><strong>Current Tools:</strong> ${payload.currentTools ?? ""}</p>
    <p><strong>Primary Goal:</strong> ${payload.primaryGoal ?? ""}</p>
    <p><strong>Project Type:</strong> ${payload.projectType ?? ""}</p>
    <p><strong>Budget Range:</strong> ${payload.budgetRange ?? ""}</p>
    <p><strong>Timeline:</strong> ${payload.timeline ?? ""}</p>
    <p><strong>Message:</strong><br/>${payload.message ?? ""}</p>
  `;
}

function buildWhatsAppUrl(
  payload: LeadPayload,
  intelligence: { score: number; priority: "low" | "medium" | "high"; routingTag: string },
) {
  const lines = [
    "New LX Obsidian Labs Lead",
    `Name: ${payload.name ?? ""}`,
    `Email: ${payload.email ?? ""}`,
    `Company: ${payload.company ?? ""}`,
    `Project Type: ${payload.projectType ?? ""}`,
    `Budget: ${payload.budgetRange ?? ""}`,
    `Timeline: ${payload.timeline ?? ""}`,
    `Primary Goal: ${payload.primaryGoal ?? ""}`,
    `Tools: ${payload.currentTools ?? ""}`,
    `Priority: ${intelligence.priority.toUpperCase()}`,
    `Score: ${intelligence.score}/100`,
    `Routing: ${intelligence.routingTag}`,
    `Message: ${payload.message ?? ""}`,
  ];

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/27762982399?text=${text}`;
}

export async function POST(request: Request) {
  const ctx = createRequestContext(request, "/api/leads");
  try {
    const rawPayload = (await request.json()) as LeadPayload;
    const ip = getClientIp(request);

    const idem = await claimIdempotencyKey({
      namespace: "leads",
      key: request.headers.get("x-idempotency-key"),
      identifier: ip,
      ttlSec: 600,
    });
    if (!idem.accepted) {
      return withRequestId(NextResponse.json({ error: "Duplicate submission detected. Please wait before retrying." }, { status: 409 }), ctx);
    }

    const limiter = await rateLimit({
      namespace: "leads",
      identifier: ip,
      limit: 5,
      windowSec: 600,
    });

    if (!limiter.success) {
      return withRequestId(NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 }), ctx);
    }

    const parsed = leadPayloadSchema.safeParse(rawPayload);
    if (!parsed.success) {
      return withRequestId(NextResponse.json({ error: "Invalid submission payload" }, { status: 400 }), ctx);
    }

    const payload = parsed.data;
    const intelligence = scoreLead(payload);

    if (typeof payload.startedAt === "number") {
      const elapsedMs = Date.now() - payload.startedAt;
      if (elapsedMs < 2500) {
        return withRequestId(NextResponse.json({ error: "Submission too fast" }, { status: 400 }), ctx);
      }
    }

    const webhook = process.env.LEAD_WEBHOOK_URL;
    const resendApiKey = process.env.RESEND_API_KEY;
    const leadToEmail = process.env.LEAD_TO_EMAIL;

    const jobs: Array<Promise<{ channel: string; ok: boolean; status: number }>> = [];

    if (webhook) {
      jobs.push(
        fetchJsonWithRetry(webhook, {
          method: "POST",
          timeoutMs: 12000,
          retries: 1,
          body: {
            ...payload,
            leadScore: intelligence.score,
            leadPriority: intelligence.priority,
            routingTag: intelligence.routingTag,
          },
        }).then(() => ({ channel: "webhook", ok: true, status: 200 })).catch(() => ({ channel: "webhook", ok: false, status: 502 })),
      );
    }

    if (resendApiKey && leadToEmail) {
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
            to: [leadToEmail],
            subject: `[${intelligence.priority.toUpperCase()}] New lead: ${payload.projectType}`,
            html: buildEmailHtml(payload, intelligence),
          },
        }).then(() => ({ channel: "resend", ok: true, status: 200 })).catch(() => ({ channel: "resend", ok: false, status: 502 })),
      );
    }

    if (!jobs.length) {
      return withRequestId(NextResponse.json({ error: "No lead delivery channel configured" }, { status: 500 }), ctx);
    }

    const results = await Promise.all(jobs);
    const succeeded = results.filter((result) => result.ok);
    const failed = results.filter((result) => !result.ok);

    if (!succeeded.length) {
      return withRequestId(NextResponse.json(
        {
          error: "Lead delivery failed",
          details: failed.map((result) => ({ channel: result.channel, status: result.status })),
        },
        { status: 502 },
      ), ctx);
    }

    logInfo(ctx, "lead_submit_success", { priority: intelligence.priority, score: intelligence.score });
    return withRequestId(NextResponse.json({
      ok: true,
      delivery: {
        channelsAttempted: results.length,
        channelsSucceeded: succeeded.length,
        channelsFailed: failed.map((result) => ({ channel: result.channel, status: result.status })),
      },
      leadScore: intelligence.score,
      leadPriority: intelligence.priority,
      routingTag: intelligence.routingTag,
      whatsappUrl: buildWhatsAppUrl(payload, intelligence),
    }), ctx);
  } catch (error) {
    logError(ctx, "lead_submit_error", error);
    return withRequestId(NextResponse.json({ error: "Unexpected server error" }, { status: 500 }), ctx);
  }
}
