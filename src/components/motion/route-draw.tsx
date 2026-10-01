"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

/** The contents chart's sea route inks itself in as the chart scrolls through (scrub). Reduced motion: drawn. */
export function RouteDraw({ d, className }: { d: string; className?: string }) {
  const svg = useRef<SVGSVGElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.ok, () => {
        gsap.fromTo(
          ".route-ink",
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: svg.current, start: "top 85%", end: "bottom 45%", scrub: 0.6 } },
        );
      });
    },
    { scope: svg },
  );
  return (
    <svg ref={svg} aria-hidden viewBox="0 0 1000 200" preserveAspectRatio="none" className={className}>
      <path d={d} fill="none" stroke="#0f5c93" strokeOpacity="0.3" strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <path
        className="route-ink"
        d={d}
        pathLength={1}
        strokeDasharray={1}
        fill="none"
        stroke="#d62718"
        strokeWidth="3.5"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
