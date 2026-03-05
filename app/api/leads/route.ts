import { NextResponse } from "next/server";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { leadPayloadSchema } from "@/lib/validation";

type LeadPayload = {
  projectType?: string;
  budgetRange?: string;
  timeline?: string;
  name?: string;
  email?: string;
  company?: string;
  message?: string;
  website?: string;
  startedAt?: number;
};

function buildEmailHtml(payload: LeadPayload) {
  return `
    <h2>New Lead - LX Obsidian Labs</h2>
    <p><strong>Name:</strong> ${payload.name ?? ""}</p>
    <p><strong>Email:</strong> ${payload.email ?? ""}</p>
    <p><strong>Company:</strong> ${payload.company ?? ""}</p>
    <p><strong>Project Type:</strong> ${payload.projectType ?? ""}</p>
    <p><strong>Budget Range:</strong> ${payload.budgetRange ?? ""}</p>
    <p><strong>Timeline:</strong> ${payload.timeline ?? ""}</p>
    <p><strong>Message:</strong><br/>${payload.message ?? ""}</p>
  `;
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
          body: JSON.stringify(payload),
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
            subject: `New lead: ${payload.projectType}`,
            html: buildEmailHtml(payload),
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

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
