"use client";

import { MessageCircleMore } from "lucide-react";
import { track } from "@/lib/analytics";

export function WhatsAppFab() {
  return (
    <a
      href="https://wa.me/27762982399"
      target="_blank"
      rel="noreferrer"
      aria-label="Contact LX Obsidian Labs on WhatsApp"
      className="fixed bottom-6 left-6 z-50 inline-flex h-14 items-center gap-2 rounded-full bg-[#16a34a] px-4 text-sm font-semibold text-white shadow-lg transition hover:bg-[#15803d]"
      onClick={() => track("whatsapp_click", { source: "floating_cta" })}
    >
      <MessageCircleMore className="h-5 w-5" /> WhatsApp
    </a>
  );
}
