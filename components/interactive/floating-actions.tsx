"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const AiAssistant = dynamic(() => import("@/components/interactive/ai-assistant").then((mod) => mod.AiAssistant), {
  ssr: false,
});

const WhatsAppFab = dynamic(() => import("@/components/interactive/whatsapp-fab").then((mod) => mod.WhatsAppFab), {
  ssr: false,
});

const enabledRoutes = new Set(["/", "/services", "/contact", "/lab", "/portfolio", "/about"]);

export function FloatingActions() {
  const pathname = usePathname();
  const enabled =
    enabledRoutes.has(pathname) || pathname.startsWith("/portfolio/") || pathname.startsWith("/insights/");

  if (!enabled) return null;

  return (
    <>
      <AiAssistant />
      <WhatsAppFab />
    </>
  );
}
