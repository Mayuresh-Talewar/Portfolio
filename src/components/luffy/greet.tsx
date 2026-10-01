"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

/** Speech bubble for the hello/goodbye rigs: pops in after the figure lands. Reduced motion: static. */
export function Greet({ children, on = "load", className }: { children: ReactNode; on?: "load" | "scroll"; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.ok, () => {
        gsap.from("[data-bubble]", {
          scale: 0,
          autoAlpha: 0,
          duration: 0.35,
          ease: "back.out(2.2)",
          transformOrigin: "0% 100%",
          ...(on === "load" ? { delay: 1.6 } : { delay: 0.7, scrollTrigger: { trigger: root.current, start: "top 85%", once: true } }),
        });
      });
    },
    { scope: root },
  );
  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
