"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

/**
 * Cookbook §9e: desktop + motion OK = pinned horizontal strip scrubbed by vertical scroll.
 * Otherwise a native snap row (desktop) or a swipe row (mobile: no pin, ~2.5k px shorter than a stack).
 * Children: one `.gaiden-card` per project.
 */
export function GaidenStrip({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.desk, () => {
        const wrap = root.current!;
        const track = wrap.querySelector<HTMLElement>(".gaiden-track")!;
        const dist = () => Math.max(0, track.scrollWidth - wrap.clientWidth);
        gsap.set(wrap, { overflow: "clip" }); // clip, not hidden: focus can't scroll it behind GSAP's back
        const tween = gsap.to(track, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: { trigger: wrap, start: "top 80px", end: () => `+=${dist()}`, pin: true, scrub: 0.5, invalidateOnRefresh: true },
        });
        // Keyboard: Tab to an off-screen card scrolls the page to where that card is in view.
        const onFocus = (e: FocusEvent) => {
          const card = (e.target as HTMLElement).closest<HTMLElement>(".gaiden-card");
          const st = tween.scrollTrigger;
          if (!card || !st) return;
          const p = gsap.utils.clamp(0, 1, card.offsetLeft / Math.max(1, dist()));
          window.scrollTo({ top: st.start + p * (st.end - st.start) });
        };
        track.addEventListener("focusin", onFocus);
        return () => track.removeEventListener("focusin", onFocus);
      });
    },
    { scope: root },
  );
  return (
    <div ref={root} className="-mx-3 snap-x snap-mandatory scroll-px-3 overflow-x-auto px-3 pt-2 pb-4 md:mx-0 md:scroll-px-0 md:px-0">
      <div className="gaiden-track flex w-max items-stretch gap-4 pr-3 md:gap-6 md:pr-8">{children}</div>
    </div>
  );
}
