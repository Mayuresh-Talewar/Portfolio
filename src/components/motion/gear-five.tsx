"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MQ, SplitText, useGSAP } from "@/lib/gsap";

const PUFFS = 10;

/**
 * The climax beat at the top of the AI Arc (cookbook §9d, Gear 5 only). Desktop: pinned + scrubbed.
 * Mobile: plays once. Timeline 0→1: "GEAR 4" squashes away · cloud puffs burst · one white flash (.3)
 * · rubber-hose wobble · --flood 0→1 on the section (B&W page floods into color) · "GEAR 5" pops.
 * Reduced motion / no JS: --flood unset = full color, data-flooded="true" from the server.
 */
export function GearFive({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const section = el.closest<HTMLElement>("[data-flood]");
      const mm = gsap.matchMedia();
      mm.add({ desk: MQ.desk, mob: MQ.mob }, (ctx) => {
        const { desk } = ctx.conditions as { desk: boolean };
        const setFlooded = (p: number) => section?.setAttribute("data-flooded", String(p > 0.6));
        if (section) gsap.set(section, { "--flood": 0 });
        setFlooded(0);
        const call = SplitText.create(el.querySelector(".gear-call"), { type: "chars" });
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          onUpdate: () => setFlooded(tl.progress()),
          scrollTrigger: desk
            ? { trigger: el, start: "top 59px", end: "+=110%", pin: true, scrub: 0.5, anticipatePin: 1 }
            : { trigger: el, start: "top 60%", toggleActions: "play none none none" },
        });
        tl.fromTo(".gear-prev", { autoAlpha: 1 }, { scaleY: 0, scaleX: 1.4, autoAlpha: 0, duration: 0.12, ease: "power2.in" }, 0.02)
          .fromTo(
            ".puff",
            { scale: 0, x: 0, y: 0, autoAlpha: 1 },
            {
              scale: () => gsap.utils.random(1.2, 2),
              x: (i: number) => Math.cos((i / PUFFS) * Math.PI * 2) * 0.46 * innerWidth,
              y: (i: number) => Math.sin((i / PUFFS) * Math.PI * 2) * 0.4 * innerHeight,
              duration: 0.3,
              ease: "power2.out",
            },
            0.1,
          )
          .to(".puff", { autoAlpha: 0, duration: 0.12 }, 0.4)
          .fromTo(".gear-flash", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.06 }, 0.3)
          .to(".gear-flash", { autoAlpha: 0, duration: 0.2 }, 0.42)
          .fromTo(".gear-stage", { scaleX: 1.3, scaleY: 0.75, skewX: -8 }, { scaleX: 1, scaleY: 1, skewX: 0, duration: 0.45, ease: "elastic.out(1.2, 0.3)" }, 0.42)
          .fromTo(".halftone", { autoAlpha: 0 }, { autoAlpha: 0.5, duration: 0.1 }, 0.42)
          .to(".halftone", { autoAlpha: 0, duration: 0.2 }, 0.62)
          .from(call.chars, { yPercent: 120, scale: 0, autoAlpha: 0, stagger: 0.02, duration: 0.14, ease: "back.out(2.4)" }, 0.36)
          .from(".gear-beat", { scale: 0, rotation: (i: number) => (i ? 25 : -25), autoAlpha: 0, stagger: 0.08, duration: 0.18, ease: "back.out(2.5)" }, 0.56)
          .from(".gear-line", { autoAlpha: 0, y: 24, duration: 0.12 }, 0.66)
          .set({}, {}, 1);
        if (section) tl.fromTo(section, { "--flood": 0 }, { "--flood": 1, duration: 0.4 }, 0.46);
        if (!desk) tl.duration(2.2);
        return () => {
          call.revert();
          section?.setAttribute("data-flooded", "true");
          if (section) gsap.set(section, { clearProps: "--flood" });
        };
      });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="relative isolate mb-10 ml-[calc(50%-50vw)] grid min-h-[86svh] w-screen place-items-center overflow-hidden border-b-[3px] border-ink md:mb-16 md:h-[calc(100svh-59px)]"
    >
      <div aria-hidden className="flood-burst rays absolute inset-0 -z-10" style={{ "--ray-a": "#f6c233", "--ray-b": "#f9d36b", "--sx": "50%", "--sy": "50%" } as React.CSSProperties} />
      <div aria-hidden className="speedlines absolute -inset-1/4 -z-10 opacity-25" />
      <div aria-hidden className="halftone absolute inset-0 z-10" />
      {Array.from({ length: PUFFS }, (_, i) => (
        <span key={i} aria-hidden className="puff absolute top-1/2 left-1/2 -mt-[8vmin] -ml-[8vmin] size-[16vmin] rounded-full" />
      ))}
      <div className="gear-stage relative z-10 grid size-full place-items-center px-4 text-center">{children}</div>
      <div aria-hidden className="gear-flash absolute inset-0 z-20 bg-white" />
    </div>
  );
}
