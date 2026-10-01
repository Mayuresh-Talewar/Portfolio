"use client";

import { useRef } from "react";
import type { Chapter } from "@/types";
import { gsap, MQ, SplitText, useGSAP } from "@/lib/gsap";
import { DUR, EASE, STAGGER } from "@/lib/motion";

/**
 * Mid-episode anime eyecatch before a chapter: an ink field with the chapter numeral, then a circle wipe opens
 * onto the card (arc ribbon, "GEAR N", vertical katakana, the chapter's SFX). Decorative: the chapter's own
 * h2 carries the meaning, so the whole card is aria-hidden.
 * Desktop: pinned under the nav and scrubbed (+60%). Mobile: plays once, no pin.
 * Reduced motion / no JS: nothing registers; the markup is the finished card.
 * Not rendered before Ch.5: the pinned Gear Five splash already is that chapter's eyecatch.
 */
export function Eyecatch({ chapter: c }: { chapter: Chapter }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add({ desk: MQ.desk, mob: MQ.mob }, (ctx) => {
        const { desk } = ctx.conditions as { desk: boolean };
        const call = SplitText.create(el.querySelector(".ec-call"), { type: "chars" });
        const tl = gsap.timeline({
          scrollTrigger: desk
            ? { trigger: el, start: "top 59px", end: "+=60%", pin: true, scrub: 0.5, anticipatePin: 1 }
            : { trigger: el, start: "top 70%", once: true },
        });
        tl.from(".ec-num", { scale: 1.25, duration: DUR.reveal, ease: EASE.move })
          .fromTo(".ec-wipe", { clipPath: "circle(0% at 50% 50%)" }, { clipPath: "circle(75% at 50% 50%)", duration: DUR.reveal, ease: EASE.reveal }, 0.35)
          .from(".ec-ribbon", { scaleX: 0, duration: DUR.move, ease: EASE.move }, 0.75)
          .from(".ec-cap", { y: 16, autoAlpha: 0, duration: DUR.move, ease: EASE.move }, 1.05)
          .from(call.chars, { yPercent: 110, scale: 0.4, autoAlpha: 0, stagger: STAGGER.char, duration: DUR.move, ease: EASE.impact }, 0.8)
          .from(".ec-kana", { yPercent: -40, autoAlpha: 0, duration: DUR.move, ease: EASE.move }, 1)
          .from(".ec-sfx", { scale: 2.4, rotation: -20, autoAlpha: 0, duration: DUR.fast, ease: EASE.impact }, 1.1);
        if (desk) tl.set({}, {}, 1.8); // hold the finished card for the last stretch of the pin
        return () => call.revert();
      });
    },
    { scope: root },
  );

  if (c.gear === 5) return null;
  const sfx = c.sfx[0];

  return (
    <div ref={root} aria-hidden data-mode={c.colorMode} className="eyecatch">
      <span className="ec-num">{c.number}</span>
      <div className="ec-wipe">
        <div className="speedlines absolute -inset-1/4 opacity-20" />
        <span className="ec-ghost">{c.number}</span>
        <div className="relative flex flex-col items-center px-4 text-center">
          <p className="ec-ribbon ribbon text-sm md:text-lg">{c.arcTitle}</p>
          <p className="ec-call sfx mt-4 text-[clamp(5rem,19vw,15rem)]">GEAR {c.gear}</p>
          <p className="ec-cap caption mt-6 text-sm md:text-base">Ch.{c.number}, {c.title}</p>
        </div>
        {sfx?.kana && <span className="ec-kana kana">{sfx.kana}</span>}
        {sfx && <span className="ec-sfx sfx">{sfx.text}!</span>}
      </div>
    </div>
  );
}
