"use client";

import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

// Register once, client only. Import everything GSAP from here, never from "gsap/*" directly.
// SplitText must be registered or it misses gsap.context (no auto-revert) (cookbook §0).
if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, SplitText, MotionPathPlugin, useGSAP);

/** gsap.matchMedia() conditions. `ok` = motion allowed; `desk`/`mob` already include `ok`. */
export const MQ = {
  ok: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  desk: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
  mob: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
} as const;

export { gsap, ScrollTrigger, SplitText, MotionPathPlugin, useGSAP };
