import { ImageResponse } from "next/og";
import { seo } from "./seo";

export const alt = `${seo.name}, ${seo.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPER = "#F4F4F1";
const INK = "#1B1B1B";
const RED = "#D1172F";

// Fetch only the glyphs we render (tiny TTF subset). Runs at build: the image is static.
// ponytail: falls back to the default font if Google Fonts is unreachable at build time.
async function delaGothic(text: string) {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=Dela+Gothic+One&text=${encodeURIComponent(text)}`)
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    return url ? await (await fetch(url)).arrayBuffer() : null;
  } catch {
    return null;
  }
}

export default async function Image() {
  // Dela is the only registered font, so all text uses it; subset must cover every rendered glyph.
  const font = await delaGothic(`VOL. 01${seo.name}${seo.title}`);
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
            <div style={{ width: 120, height: 10, background: RED, margin: "12px 0 20px" }} />
            <div style={{ fontSize: 92, lineHeight: 1.05, fontFamily: "Dela Gothic One" }}>
              {seo.name}
            </div>
            <div style={{ fontSize: 40, marginTop: 16 }}>{seo.title}</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: font ? [{ name: "Dela Gothic One", data: font, style: "normal", weight: 400 }] : [],
    },
  );
}
