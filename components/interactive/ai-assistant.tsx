"use client";

import { useMemo, useState } from "react";
import { Loader2, MessageCircle, SendHorizontal, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";

type Message = {
  role: "user" | "assistant";
  text: string;
};

const starter = "Hi, I am the LX AI Business Assistant. Ask me about software, design, automation, or estimates.";

export function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", text: starter }]);

  const canSend = useMemo(() => input.trim().length > 2 && !loading, [input, loading]);

  const onSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: "user" as const, text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    track("ai_assistant_message", { source: "floating_assistant" });

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages.slice(-8) }),
      });

      if (!response.ok) {
        throw new Error("assistant_request_failed");
      }

      const data = (await response.json()) as { reply?: string };
      const reply = data.reply?.trim();
      if (!reply) {
        throw new Error("assistant_empty_reply");
      }

      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "I am having trouble connecting right now. Please use WhatsApp or the contact form and we will respond quickly.",
        },
      ]);
      track("ai_assistant_error", { source: "floating_assistant" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        aria-label="Open AI assistant"
        className="fixed bottom-6 right-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg transition hover:bg-[#be123c]"
        onClick={() => {
          setOpen((v) => !v);
          track("ai_assistant_toggle", { source: "floating_assistant" });
        }}
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {open ? (
        <div className="fixed bottom-24 right-6 z-50 w-[92vw] max-w-sm rounded-xl border bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <p className="inline-flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-accent" /> LX AI Assistant
            </p>
            <button className="text-xs text-muted" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>

          <div className="max-h-72 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((msg, index) => (
              <div
                key={`${msg.role}-${index}`}
                className={msg.role === "user" ? "ml-8 rounded-md bg-[#111111] p-3 text-sm text-white" : "mr-8 rounded-md bg-surface p-3 text-sm text-[#111111]"}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="flex gap-2 border-t p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void onSend();
              }}
              className="h-10 flex-1 rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-accent"
              placeholder="Ask about your project..."
            />
            <Button className="h-10 px-3" onClick={() => void onSend()} disabled={!canSend}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizontal className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
}
