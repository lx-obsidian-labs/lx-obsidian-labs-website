import { ImageResponse } from "next/og";
import { caseStudies } from "@/lib/data";

type Params = { params: Promise<{ slug: string }> };

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({ params }: Params) {
  const { slug } = await params;
  const study = caseStudies.find((item) => item.slug === slug);
  const title = study?.title ?? "Case Study";

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0b0b0d", color: "white", padding: "64px", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ color: "#e11d48", fontSize: 28, fontWeight: 700, letterSpacing: 2 }}>LX Obsidian Labs</div>
          <div style={{ marginTop: 16, fontSize: 58, fontWeight: 800, maxWidth: "1000px" }}>{title}</div>
          <div style={{ marginTop: 12, fontSize: 28, color: "#d4d4d8" }}>Dynamic Case Study</div>
        </div>
      </div>
    ),
    size,
  );
}
