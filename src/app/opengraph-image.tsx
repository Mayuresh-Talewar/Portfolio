import { ImageResponse } from "next/og";
import { seo } from "./seo";

export const alt = `${seo.name}, ${seo.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPER = "#fafaf7";
const INK = "#0a0a0a";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: 40,
          background: PAPER,
        }}
      >
        {/* manga panel: thick ink border, screentone halftone fill */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: 56,
            border: `10px solid ${INK}`,
            backgroundColor: PAPER,
            backgroundImage: `radial-gradient(${INK} 22%, transparent 24%)`,
            backgroundSize: "18px 18px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignSelf: "flex-start",
              background: PAPER,
              border: `6px solid ${INK}`,
              padding: "28px 40px",
              color: INK,
            }}
          >
            <div style={{ fontSize: 28, letterSpacing: 8, textTransform: "uppercase" }}>
              Vol. 01
            </div>
            <div style={{ fontSize: 92, fontWeight: 900, lineHeight: 1 }}>{seo.name}</div>
            <div style={{ fontSize: 40, marginTop: 16 }}>{seo.title}</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
