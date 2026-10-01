"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

/** Cookbook §9b: the poster drops from its nail, swings and settles like paper. Once; reduced motion = static. */
export function WantedDrop({ children }: { children: ReactNode }) {
  const el = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.ok, () => {
      gsap
        .timeline({ delay: 0.35 })
        .from(el.current, { yPercent: -45, rotation: -14, autoAlpha: 0, duration: 0.45, ease: "power2.in" })
        .to(el.current, { keyframes: { rotation: [8, -4.5, 2, 0], easeEach: "sine.inOut" }, duration: 1.3 });
    });
  });
  return (
    <div ref={el} className="origin-top">
      {children}
    </div>
  );
}
