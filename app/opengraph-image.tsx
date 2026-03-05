import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "64px",
          background: "#111111",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ color: "#e11d48", fontSize: 30, fontWeight: 700, textTransform: "uppercase", letterSpacing: 3 }}>LX Obsidian Labs</div>
        <div style={{ marginTop: 20, fontSize: 64, fontWeight: 800, lineHeight: 1.08 }}>Software, Design & Systems</div>
      </div>
    ),
    size,
  );
}
