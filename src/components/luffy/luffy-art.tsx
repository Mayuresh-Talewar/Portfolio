import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import type { Chapter } from "@/types";

export type LuffyMode = "bw" | "color";

/**
 * Path of a Gear illustration (Art Studio files, referenced by path and never copied), or null when the file
 * isn't there yet: callers then fall back to the SFX-only Gear-up. Checked at build (the page is static).
 */
export function luffySrc(gear: Chapter["gear"], mode: LuffyMode) {
  const file = `luffy-g${gear}-${mode}.svg`;
  return existsSync(path.join(process.cwd(), "public", "art", "luffy", file)) ? `/art/luffy/${file}` : null;
}

/**
 * Server component. Render ONLY behind `siteConfig.features.luffy` (the takedown kill switch, docs/10 §5).
 * Alt text describes the action, never the trademark.
 */
export function LuffyArt({
  gear,
  mode,
  alt,
  className,
  style,
  eager,
  ...data
}: {
  gear: Chapter["gear"];
  mode: LuffyMode;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  eager?: boolean;
} & { [k: `data-${string}`]: string | undefined }) {
  const src = luffySrc(gear, mode);
  if (!src) return null;
  return (
    <Image
      src={src}
      alt={alt}
      width={600}
      height={800}
      unoptimized
      loading={eager ? "eager" : "lazy"}
      draggable={false}
      className={className}
      style={style}
      {...data}
    />
  );
}
