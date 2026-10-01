"use client";

import { useEffect } from "react";

/**
 * Page-wide, render-less helpers for the CSS-first ambient layer (DEV-D, globals.css):
 * - pointer spotlight: sets --mx/--my on the hovered `.panel`/`.cut` (fine pointers only);
 * - `[data-live]` loops pause offscreen (`data-paused`);
 * - `[data-cue]` one-shot entrances: armed (hidden) on mount, "go" when first seen. No JS / reduced motion = final state.
 */
export function Ambient() {
  useEffect(() => {
    const off: (() => void)[] = [];

    if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
      const onMove = (e: PointerEvent) => {
        const el = (e.target as Element | null)?.closest<HTMLElement>(".panel, .cut");
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      };
      document.addEventListener("pointermove", onMove, { passive: true });
      off.push(() => document.removeEventListener("pointermove", onMove));
    }

    const live = new IntersectionObserver((es) => {
      for (const e of es) e.target.toggleAttribute("data-paused", !e.isIntersecting);
    });
    document.querySelectorAll("[data-live]").forEach((el) => live.observe(el));
    off.push(() => live.disconnect());

    if (matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      const cue = new IntersectionObserver(
        (es) => {
          for (const e of es) {
            if (!e.isIntersecting) continue;
            e.target.setAttribute("data-cue", "go");
            cue.unobserve(e.target);
          }
        },
        { rootMargin: "0px 0px -20% 0px" },
      );
      document.querySelectorAll("[data-cue]").forEach((el) => {
        el.setAttribute("data-cue", "armed");
        cue.observe(el);
      });
      off.push(() => cue.disconnect());
    }

    return () => off.forEach((f) => f());
  }, []);
  return null;
}
