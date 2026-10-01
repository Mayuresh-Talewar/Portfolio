"use client";

import { useRef } from "react";
import { gsap, MQ, SplitText, useGSAP } from "@/lib/gsap";
import type { Chapter } from "@/types";

/**
 * "Island arrival" for a chapter title panel ([data-arrival], server markup): the arc ribbon unfurls,
 * the h2 chars rise out of word masks, then the Gear's power-up hits the SFX lettering:
 * G1 boing stretch · G2 steam burst · G3 inflate + pop · G4 haki ink coat + bounce. Plays once.
 * Reduced motion: nothing registers; the static markup is the final frame.
 */
export function ArrivalFx({ gear }: { gear: Chapter["gear"] }) {
  const anchor = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const panel = anchor.current?.closest<HTMLElement>("[data-arrival]");
    if (!panel) return;
    const q = (s: string) => Array.from(panel.querySelectorAll<HTMLElement>(s));
    const mm = gsap.matchMedia();
    mm.add({ desk: MQ.desk, mob: MQ.mob }, (ctx) => {
      const { desk } = ctx.conditions as { desk: boolean };
      const h2 = panel.querySelector("h2");
      const split = h2 ? SplitText.create(h2, { type: "words,chars", mask: "words" }) : null;
      const sfx = q(".sfx");
      const tl = gsap.timeline({ scrollTrigger: { trigger: panel, start: "top 72%", once: true } });

      tl.from(q("[data-ribbon]"), { scaleX: 0, duration: 0.45, ease: "power3.out" })
        .from(split?.chars ?? [], { yPercent: 115, duration: 0.55, stagger: 0.022, ease: "back.out(1.7)" }, 0.12)
        .from(q("[data-landfall]"), { autoAlpha: 0, x: -24, duration: 0.4, ease: "power2.out" }, 0.45)
        .from(q(".kana"), { autoAlpha: 0, y: -30, duration: 0.4, ease: "power2.out" }, 0.6);

      const at = 0.35;
      if (gear === 1) {
        tl.from(q("[data-lines]"), { scale: 1.7, autoAlpha: 0, duration: 0.7, ease: "power3.out" }, 0)
          .from(sfx, { scaleX: 2.8, scaleY: 0.35, autoAlpha: 0, duration: 1.2, ease: "elastic.out(1.1, 0.28)", transformOrigin: "100% 50%" }, at);
      }
      if (gear === 2) {
        tl.from(sfx, { x: desk ? -260 : -120, skewX: 35, autoAlpha: 0, duration: 0.55, ease: "power4.out" }, at).fromTo(
          q("[data-puff]"),
          { scale: 0, x: 0, y: 0, autoAlpha: 1 },
          {
            scale: () => gsap.utils.random(1.2, 2.2),
            x: (i: number) => Math.cos(i * 1.7) * (desk ? 160 : 90),
            y: (i: number) => -40 - Math.abs(Math.sin(i * 1.7)) * (desk ? 120 : 70),
            autoAlpha: 0,
            duration: 1.3,
            stagger: 0.07,
            ease: "power2.out",
          },
          at + 0.15,
        );
      }
      if (gear === 3) {
        tl.fromTo(q("[data-balloon]"), { scale: 0.05, autoAlpha: 1 }, { scale: 1, duration: 0.55, ease: "back.out(1.3)" }, at)
          .to(q("[data-balloon]"), { scale: 1.3, autoAlpha: 0, duration: 0.12, ease: "power1.in" }, at + 0.6)
          .from(sfx, { scale: 3.2, autoAlpha: 0, duration: 0.5, ease: "back.out(2.2)" }, at + 0.62);
      }
      if (gear === 4) {
        tl.fromTo(q("[data-coat]"), { scaleY: 0, transformOrigin: "50% 100%" }, { scaleY: 1, duration: 0.35, ease: "power2.in" }, 0)
          .set(q("[data-coat]"), { transformOrigin: "50% 0%" })
          .to(q("[data-coat]"), { scaleY: 0, duration: 0.45, ease: "power3.inOut" })
          .from(sfx, { y: -220, autoAlpha: 0, duration: 1, ease: "bounce.out" }, "-=0.2");
      }
      return () => split?.revert();
    });
  });

  return (
    <>
      <span ref={anchor} hidden />
      {gear === 3 && (
        <span
          aria-hidden
          data-balloon
          className="pointer-events-none absolute top-[-10%] right-[-10%] size-[min(90vw,34rem)] rounded-full border-[5px] border-ink bg-paper opacity-0"
          style={{ backgroundImage: "radial-gradient(circle at 35% 30%, #fff 0 18%, transparent 19%)" }}
        />
      )}
      {gear === 4 && (
        <span aria-hidden data-coat className="pointer-events-none absolute inset-0 z-30 bg-ink" style={{ transform: "scaleY(0)" }} />
      )}
    </>
  );
}
