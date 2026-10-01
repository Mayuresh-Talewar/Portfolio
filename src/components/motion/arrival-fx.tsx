"use client";

import { useRef } from "react";
import { gsap, MQ, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { DUR, EASE, STAGGER } from "@/lib/motion";
import type { Chapter } from "@/types";

/**
 * "Island arrival" for a chapter title panel ([data-arrival], server markup): the arc ribbon unfurls,
 * the h2 chars rise out of word masks, then the Gear's power-up hits the SFX lettering:
 * G1 boing stretch · G2 steam burst · G3 inflate + pop · G4 haki ink coat + bounce. Plays once.
 * Then the rest of the spread reveals in reading order (captions > record > products > bursts), one batch
 * per scroll entry: panels uncover with an ink clip wipe (EASE.reveal), bursts land with EASE.impact.
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
      // No masks: Dela's tall glyphs would be clipped by mask boxes at this tight leading. Revert when done.
      const split = h2 ? SplitText.create(h2, { type: "words,chars" }) : null;
      const sfx = q(".sfx");
      const tl = gsap.timeline({ scrollTrigger: { trigger: panel, start: "top 72%", once: true } });

      tl.from(q("[data-ribbon]"), { scaleX: 0, duration: DUR.move, ease: EASE.move })
        .from(
          split?.chars ?? [],
          { yPercent: 70, autoAlpha: 0, rotation: () => gsap.utils.random(-14, 14), duration: 0.5, stagger: STAGGER.char, ease: EASE.impact, onComplete: () => split?.revert() },
          0.12,
        )
        .from(q("[data-landfall]"), { autoAlpha: 0, x: -24, duration: DUR.move, ease: EASE.move }, 0.45)
        .from(q(".kana"), { autoAlpha: 0, y: -30, duration: DUR.move, ease: EASE.move }, 0.6);

      const at = 0.35;
      if (gear === 1) {
        tl.from(q("[data-lines]"), { scale: 1.7, autoAlpha: 0, duration: DUR.reveal, ease: EASE.reveal }, 0)
          .from(sfx, { scaleX: 2.8, scaleY: 0.35, autoAlpha: 0, duration: 1.2, ease: "elastic.out(1.1, 0.28)", transformOrigin: "100% 50%" }, at);
      }
      if (gear === 2) {
        tl.from(sfx, { x: desk ? -260 : -120, skewX: 35, autoAlpha: 0, duration: 0.55, ease: EASE.move }, at)
          .fromTo(
          q("[data-puff]"),
          { scale: 0, x: 0, y: 0, autoAlpha: 1 },
          {
            scale: () => gsap.utils.random(1.2, 2.2),
            x: (i: number) => Math.cos(i * 1.7) * (desk ? 160 : 90),
            y: (i: number) => -40 - Math.abs(Math.sin(i * 1.7)) * (desk ? 120 : 70),
            autoAlpha: 0,
            duration: 1.3,
            stagger: 0.07,
            ease: EASE.move,
          },
          at + 0.15,
        );
      }
      if (gear === 3) {
        tl.fromTo(q("[data-balloon]"), { scale: 0.05, autoAlpha: 1 }, { scale: 1, duration: 0.55, ease: EASE.impact }, at)
          .to(q("[data-balloon]"), { scale: 1.3, autoAlpha: 0, duration: 0.12, ease: EASE.exit }, at + 0.6)
          .from(sfx, { scale: 3.2, autoAlpha: 0, duration: 0.5, ease: EASE.impact }, at + 0.62);
      }
      if (gear === 4) {
        tl.fromTo(q("[data-coat]"), { scaleY: 0, transformOrigin: "50% 100%" }, { scaleY: 1, duration: 0.35, ease: EASE.exit }, 0)
          .set(q("[data-coat]"), { transformOrigin: "50% 0%" })
          .to(q("[data-coat]"), { scaleY: 0, duration: DUR.move, ease: EASE.swing })
          .from(sfx, { y: -220, autoAlpha: 0, duration: 1, ease: "bounce.out" }, "-=0.2");
      }
      // Reading order = DOM order within the spread. clip-path is not a transform, so it never fights the
      // Tailwind tilt utilities on captions; it is cleared on complete so the ink box-shadows show again.
      const section = panel.closest("section")!;
      const read = Array.from(section.querySelectorAll<HTMLElement>("[data-caption], [data-panel]"));
      const bursts = Array.from(section.querySelectorAll<HTMLElement>("[data-burst]"));
      gsap.set(read, { clipPath: "inset(0 0 100% 0)" });
      gsap.set(bursts, { scale: 0, rotation: -8 });
      const batches = [
        ...ScrollTrigger.batch(read, {
          start: "top 88%",
          once: true,
          onEnter: (els) =>
            gsap.to(els, { clipPath: "inset(0 0 0% 0)", duration: DUR.reveal, ease: EASE.reveal, stagger: STAGGER.panel, clearProps: "clipPath" }),
        }),
        ...ScrollTrigger.batch(bursts, {
          start: "top 90%",
          once: true,
          onEnter: (els) => gsap.to(els, { scale: 1, rotation: 0, duration: 0.5, ease: EASE.impact, stagger: STAGGER.panel, delay: 0.15 }),
        }),
      ];
      return () => {
        split?.revert();
        batches.forEach((t) => t.kill());
      };
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
