import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#111111", color: "white", padding: "64px", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ color: "#e11d48", fontSize: 28, fontWeight: 700, letterSpacing: 2 }}>LX Obsidian Labs</div>
          <div style={{ marginTop: 16, fontSize: 62, fontWeight: 800 }}>Start Your Project</div>
          <div style={{ marginTop: 12, fontSize: 28, color: "#d4d4d8" }}>Book a consultation or message us on WhatsApp.</div>
        </div>
      </div>
    ),
    size,
  );
}
