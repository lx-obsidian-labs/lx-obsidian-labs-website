import { NextResponse } from "next/server";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
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
  try {
    const rawPayload = (await request.json()) as LeadPayload;
    const ip = getClientIp(request);

    const limiter = await rateLimit({
      namespace: "leads",
      identifier: ip,
      limit: 5,
      windowSec: 600,
    });

    if (!limiter.success) {
      return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });
    }

    const parsed = leadPayloadSchema.safeParse(rawPayload);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid submission payload" }, { status: 400 });
    }

    const payload = parsed.data;
    const intelligence = scoreLead(payload);

    if (typeof payload.startedAt === "number") {
      const elapsedMs = Date.now() - payload.startedAt;
      if (elapsedMs < 2500) {
        return NextResponse.json({ error: "Submission too fast" }, { status: 400 });
      }
    }

    const webhook = process.env.LEAD_WEBHOOK_URL;
    const resendApiKey = process.env.RESEND_API_KEY;
    const leadToEmail = process.env.LEAD_TO_EMAIL;

    const jobs: Array<Promise<{ channel: string; ok: boolean; status: number }>> = [];

    if (webhook) {
      jobs.push(
        fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payload,
            leadScore: intelligence.score,
            leadPriority: intelligence.priority,
            routingTag: intelligence.routingTag,
          }),
        }).then(async (res) => {
          await res.text();
          return {
            channel: "webhook",
            ok: res.ok,
            status: res.status,
          };
        }),
      );
    }

    if (resendApiKey && leadToEmail) {
      jobs.push(
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "LX Obsidian Labs <onboarding@resend.dev>",
            to: [leadToEmail],
            subject: `[${intelligence.priority.toUpperCase()}] New lead: ${payload.projectType}`,
            html: buildEmailHtml(payload, intelligence),
          }),
        }).then(async (res) => {
          await res.text();
          return {
            channel: "resend",
            ok: res.ok,
            status: res.status,
          };
        }),
      );
    }

    if (!jobs.length) {
      return NextResponse.json({ error: "No lead delivery channel configured" }, { status: 500 });
    }

    const results = await Promise.all(jobs);
    const failed = results.filter((result) => !result.ok);

    if (failed.length > 0) {
      return NextResponse.json(
        {
          error: "Lead delivery failed",
          details: failed.map((result) => ({ channel: result.channel, status: result.status })),
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      leadScore: intelligence.score,
      leadPriority: intelligence.priority,
      routingTag: intelligence.routingTag,
      whatsappUrl: buildWhatsAppUrl(payload, intelligence),
    });
  } catch {
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
