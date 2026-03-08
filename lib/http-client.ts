type JsonValue = Record<string, unknown>;

type FetchJsonOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: JsonValue;
  timeoutMs?: number;
  retries?: number;
};

export async function fetchJsonWithRetry(url: string, options: FetchJsonOptions = {}) {
  const {
    method = "GET",
    headers = {},
    body,
    timeoutMs = 20000,
    retries = 1,
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
        cache: "no-store",
      });

      const data = (await response.json().catch(() => null)) as JsonValue | null;
      clearTimeout(timeout);

      if (!response.ok) {
        const message = (data?.error as string | undefined) || `HTTP ${response.status}`;
        throw new Error(message);
      }

      return { response, data };
    } catch (error) {
      clearTimeout(timeout);
      lastError = error instanceof Error ? error : new Error("Request failed");
      if (attempt === retries) break;
      await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1)));
    }
  }

  throw lastError || new Error("Request failed");
}
