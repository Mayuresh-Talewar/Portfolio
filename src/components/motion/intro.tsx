"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

const SEEN = "vol1-opened";

/**
 * Opening the volume (one client leaf). The page is SSR'd underneath; this is a fixed overlay.
 * First visit per session (~1.3s): ink cover + VOL.1 stamp slams, the cover splits along a diagonal cut and
 * swings open (LCP text uncovered by ~0.8s), then the hero cascades: name → ribbon → copy → CTAs → poster drop.
 * Repeat visits: a 0.3s wipe. Click / any key skips. Reduced motion: overlay hidden by CSS, nothing runs.
 * No-JS safety net: a CSS animation hides the overlay at 1.5s.
 */
export function Intro() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.ok, () => {
        const el = root.current!;
        let seen = false;
        try {
          seen = sessionStorage.getItem(SEEN) === "1";
          sessionStorage.setItem(SEEN, "1");
        } catch {}
        const hero = (n: string) => gsap.utils.toArray<HTMLElement>(`[data-intro="${n}"]`);
        gsap.set(el, { animation: "none", autoAlpha: 1 }); // JS owns it now
        const tl = gsap.timeline({ onComplete: () => gsap.set(el, { display: "none" }) });

        if (seen) {
          tl.to(el, { autoAlpha: 0, duration: 0.3, ease: "power2.out" });
        } else {
          tl.from(".intro-stamp", { scale: 2.6, rotation: -18, autoAlpha: 0, duration: 0.3, ease: "back.out(2.2)" }, 0.05)
            .to(".intro-a", { xPercent: -105, rotation: -6, duration: 0.45, ease: "power3.inOut", transformOrigin: "0% 0%" }, 0.25)
            .to(".intro-b", { xPercent: 105, rotation: 6, duration: 0.45, ease: "power3.inOut", transformOrigin: "100% 100%" }, 0.25)
            .to(".intro-stamp", { scale: 0.6, autoAlpha: 0, duration: 0.25, ease: "power2.in" }, 0.25)
            .from(hero("name"), { yPercent: -30, scale: 1.3, rotation: -4, autoAlpha: 0, stagger: 0.08, duration: 0.45, ease: "back.out(1.8)" }, 0.55)
            .from(hero("ribbon"), { scaleX: 0, transformOrigin: "0% 50%", duration: 0.35, ease: "power3.out" }, 0.75)
            .from(hero("copy"), { y: 14, autoAlpha: 0, stagger: 0.06, duration: 0.3, ease: "power2.out" }, 0.82)
            .from(hero("poster"), { yPercent: -40, rotation: -14, autoAlpha: 0, duration: 0.35, ease: "power2.in", transformOrigin: "50% 0%" }, 0.7)
            .to(hero("poster"), { keyframes: { rotation: [7, -3.5, 1.5, 0], easeEach: "sine.inOut" }, duration: 0.55 }, 1.05);
        }
        const skip = () => tl.progress(1);
        addEventListener("keydown", skip, { once: true });
        el.addEventListener("pointerdown", skip, { once: true });
        return () => removeEventListener("keydown", skip);
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden className="intro fixed inset-0 z-[80] overflow-hidden">
      <div className="intro-a absolute inset-0 bg-ink [clip-path:polygon(0_0,100%_0,0_100%)]">
        <div className="speedlines absolute -inset-1/4 opacity-20" style={{ "--lines": "#fbf7ee" } as React.CSSProperties} />
      </div>
      <div className="intro-b absolute inset-0 bg-jolly [clip-path:polygon(100%_0,100%_100%,0_100%)]">
        <div className="tone absolute inset-0 opacity-30" />
      </div>
      <div className="intro-stamp absolute top-1/2 left-1/2 grid size-40 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[6px] border-ink bg-straw text-center font-display text-4xl leading-[0.9] text-ink shadow-[8px_8px_0_var(--color-ink)] md:size-52 md:text-5xl">
        <span>
          VOL.
          <br />1
        </span>
      </div>
    </div>
  );
}
