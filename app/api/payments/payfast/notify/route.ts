import { NextResponse } from "next/server";
import { createRequestContext, logInfo, withRequestId } from "@/lib/server-observability";

export async function POST(request: Request) {
  const ctx = createRequestContext(request, "/api/payments/payfast/notify");
  const body = await request.text();

  logInfo(ctx, "payfast_notify_received", { size: body.length });
  return withRequestId(new NextResponse("OK", { status: 200 }), ctx);
}

export async function GET(request: Request) {
  const ctx = createRequestContext(request, "/api/payments/payfast/notify");
  return withRequestId(new NextResponse("OK", { status: 200 }), ctx);
}
