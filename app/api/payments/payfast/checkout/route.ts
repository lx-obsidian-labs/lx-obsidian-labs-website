import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createRequestContext, logError, logInfo, withRequestId } from "@/lib/server-observability";

const checkoutSchema = z.object({
  amount: z.number().positive().max(1_000_000),
  itemName: z.string().trim().min(2).max(100).optional(),
  itemDescription: z.string().trim().max(255).optional(),
  donorName: z.string().trim().max(120).optional(),
  donorEmail: z.email().optional(),
  customStr1: z.string().trim().max(255).optional(),
  customStr2: z.string().trim().max(255).optional(),
  customStr3: z.string().trim().max(255).optional(),
});

function encode(value: string) {
  return encodeURIComponent(value).replace(/%20/g, "+");
}

function buildSignature(payload: Record<string, string>, passphrase: string) {
  const serialized = Object.entries(payload)
    .filter(([, value]) => value !== "")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${encode(value)}`)
    .join("&");

  const base = passphrase ? `${serialized}&passphrase=${encode(passphrase)}` : serialized;
  return createHash("md5").update(base).digest("hex");
}

function resolveBaseUrl(request: Request) {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") || "https";
  return host ? `${proto}://${host}` : "https://lxobsidianlabs.vercel.app";
}

export async function POST(request: Request) {
  const ctx = createRequestContext(request, "/api/payments/payfast/checkout");

  try {
    const merchantId = process.env.PAYFAST_MERCHANT_ID;
    const merchantKey = process.env.PAYFAST_MERCHANT_KEY;
    const passphrase = process.env.PAYFAST_PASSPHRASE || "";
    const sandbox = process.env.PAYFAST_SANDBOX === "true";

    if (!merchantId || !merchantKey) {
      return withRequestId(NextResponse.json({ error: "PayFast credentials are not configured." }, { status: 503 }), ctx);
    }

    const parsed = checkoutSchema.safeParse(await request.json());
    if (!parsed.success) {
      return withRequestId(NextResponse.json({ error: "Invalid PayFast checkout payload." }, { status: 400 }), ctx);
    }

    const payload = parsed.data;
    const amount = payload.amount.toFixed(2);
    const baseUrl = resolveBaseUrl(request);
    const paymentId = `robotics-${Date.now()}`;
    const [firstName, ...rest] = (payload.donorName || "Supporter").split(" ").filter(Boolean);
    const lastName = rest.join(" ");

    const fields: Record<string, string> = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: `${baseUrl}/robotics?support=success`,
      cancel_url: `${baseUrl}/robotics?support=cancelled`,
      notify_url: `${baseUrl}/api/payments/payfast/notify`,
      name_first: firstName || "Supporter",
      name_last: lastName,
      email_address: payload.donorEmail || "supporter@lxobsidianlabs.local",
      m_payment_id: paymentId,
      amount,
      item_name: payload.itemName || "Robotics Program Donation",
      item_description: payload.itemDescription || "Support for LX Obsidian Labs robotics research and prototyping.",
      custom_str1: payload.customStr1 || "",
      custom_str2: payload.customStr2 || "",
      custom_str3: payload.customStr3 || "",
    };

    const signature = buildSignature(fields, passphrase);
    const params = new URLSearchParams({ ...fields, signature });
    const processUrl = sandbox ? "https://sandbox.payfast.co.za/eng/process" : "https://www.payfast.co.za/eng/process";

    logInfo(ctx, "payfast_checkout_created", { paymentId, amount, sandbox });
    return withRequestId(NextResponse.json({ ok: true, checkoutUrl: `${processUrl}?${params.toString()}`, paymentId }), ctx);
  } catch (error) {
    logError(ctx, "payfast_checkout_error", error);
    return withRequestId(NextResponse.json({ error: "Could not initialize PayFast checkout." }, { status: 500 }), ctx);
  }
}
