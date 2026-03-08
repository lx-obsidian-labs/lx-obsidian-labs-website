import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

export type RequestContext = {
  requestId: string;
  route: string;
};

export function createRequestContext(request: Request, route: string): RequestContext {
  const incoming = request.headers.get("x-request-id")?.trim();
  return {
    requestId: incoming || randomUUID(),
    route,
  };
}

export function withRequestId<T extends NextResponse>(response: T, ctx: RequestContext) {
  response.headers.set("x-request-id", ctx.requestId);
  return response;
}

export function logInfo(ctx: RequestContext, event: string, meta: Record<string, unknown> = {}) {
  console.info(JSON.stringify({ level: "info", event, route: ctx.route, requestId: ctx.requestId, ...meta }));
}

export function logError(ctx: RequestContext, event: string, error: unknown, meta: Record<string, unknown> = {}) {
  const message = error instanceof Error ? error.message : "Unknown error";
  console.error(JSON.stringify({ level: "error", event, route: ctx.route, requestId: ctx.requestId, message, ...meta }));
}
