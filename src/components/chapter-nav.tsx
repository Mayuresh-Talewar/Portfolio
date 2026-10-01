"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

export type NavItem = { id: string; label: string; short: string; gear?: number };

// Pip ink per gear: ink (1-2), red spot (3-4), straw (5).
const PIP = ["", "var(--color-ink)", "var(--color-ink)", "var(--color-jolly)", "var(--color-jolly)", "var(--color-straw)"];

/**
 * Sticky Grand Line chart: islands = chapter links, a ship sails the route as you read
 * (MotionPathPlugin, one ScrollTrigger per section). Gear meter = highest gear reached.
 */
export function ChapterNav({
  items,
  resume,
  maxGear = 5,
}: {
  items: NavItem[];
  resume: string;
  maxGear?: number;
}) {
  const [active, setActive] = useState(items[0]?.id);
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLElement>(null);
  const route = useRef<SVGPathElement>(null);
  const ship = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -55% 0px" },
    );
    for (const { id } of items) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [items]);

  useGSAP(
    (context) => {
      // MotionPathPlugin only drives this ship, so it loads after first paint instead of in the main bundle.
      let alive = true;
      import("gsap/MotionPathPlugin").then(({ MotionPathPlugin }) => {
        if (!alive) return;
        gsap.registerPlugin(MotionPathPlugin);
        context.add(() => {
          const last = items.length - 1;
          const sail = gsap.to(ship.current, {
            motionPath: { path: route.current!, align: route.current!, alignOrigin: [0.5, 0.8] },
            ease: "none",
            paused: true,
          });
          const pos = { p: 0 };
          const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          const to = gsap.quickTo(pos, "p", {
            duration: reduce ? 0 : 0.7,
            ease: "power3.out",
            onUpdate: () => {
              sail.progress(pos.p);
            },
          });
          items.forEach(({ id }, i) => {
            const el = document.getElementById(id);
            if (!el) return;
            ScrollTrigger.create({
              trigger: el,
              start: "top 55%",
              end: "bottom 55%",
              onUpdate: (s) => to(Math.min(1, (i + (i < last ? s.progress : 0)) / last)),
              onToggle: (s) => s.isActive && to(Math.min(1, (i + (i < last ? s.progress : 0)) / last)),
            });
          });
          // The route SVG stretches with the nav, so re-measure the path on resize.
          const onResize = () => {
            sail.invalidate();
            sail.progress(pos.p);
          };
          window.addEventListener("resize", onResize);
          return () => window.removeEventListener("resize", onResize);
        });
      });
      return () => {
        alive = false;
      };
    },
    { scope: root, dependencies: [items] },
  );

  const idx = items.findIndex((i) => i.id === active);
  const gear = Math.max(0, ...items.slice(0, idx + 1).map((i) => i.gear ?? 0));
  const activeLabel = items[idx]?.label;
  const segments = items.length - 1;
  // Identical S-curve per segment => equal arc length, so island i sits at progress i/segments.
  const d = `M0 12${" c33 -11 67 11 100 0".repeat(segments)}`;

  return (
    <header
      ref={root}
      data-gear={gear}
      onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
      className="sticky top-0 z-40 border-b-[3px] border-ink bg-paper transition-colors duration-500 data-[gear='5']:bg-parchment"
    >
      <div className="relative mx-auto grid max-w-[1400px] grid-cols-[auto_1fr_auto_auto] items-center gap-x-2.5 bg-inherit px-3 md:grid-cols-[auto_minmax(0,1fr)_auto_auto] md:gap-x-6 md:px-6">
        <a href="#cover" className="py-2 font-display text-[0.85rem] leading-none whitespace-nowrap md:text-xl">
          M<span className="text-jolly-ink">.</span>TALEWAR
        </a>

        {/* Mobile: one row. The chart folds into a sheet under this toggle; it stays laid out (invisible) so the ship's path measures. */}
        <button
          type="button"
          aria-expanded={open}
          aria-controls="chapter-chart"
          onClick={() => setOpen((o) => !o)}
          className="flex h-11 items-center gap-1.5 justify-self-start md:hidden"
        >
          <span className="sr-only">Chapters, now reading {activeLabel}</span>
          <span
            aria-hidden
            className="grid h-7 min-w-7 place-items-center border-2 border-ink bg-jolly px-1 font-display text-[0.7rem] leading-none text-paper"
            style={{ borderRadius: "46% 54% 42% 58% / 55% 45% 55% 45%" }}
          >
            {items[idx]?.short}
          </span>
          <span aria-hidden className={`nav-caret transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </button>

        <nav
          id="chapter-chart"
          aria-label="Chapters"
          onClick={(e) => (e.target as Element).closest("a") && setOpen(false)}
          className={`relative h-14 max-md:absolute max-md:inset-x-0 max-md:top-[calc(100%+3px)] max-md:border-b-[3px] max-md:border-ink max-md:bg-inherit max-md:px-2 max-md:transition-[opacity,translate,visibility] max-md:duration-200 md:col-start-2 md:row-start-1 ${
            open ? "" : "max-md:invisible max-md:-translate-y-2 max-md:opacity-0"
          }`}
        >
          <svg
            aria-hidden
            viewBox={`0 0 ${segments * 100} 24`}
            preserveAspectRatio="none"
            className="absolute top-1/2 left-[24px] h-5 w-[calc(100%-48px)] -translate-y-1/2 overflow-visible text-sea md:left-[18px] md:w-[calc(100%-36px)]"
          >
            <path
              ref={route}
              d={d}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="3 5"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <div ref={ship} aria-hidden className="pointer-events-none absolute top-0 left-0 z-0 w-7">
            <ShipMark />
          </div>
          <ol className="relative z-10 flex h-full items-center justify-between">
            {items.map((i, n) => {
              const current = i.id === active;
              const passed = n < idx;
              return (
                <li key={i.id}>
                  <a
                    href={`#${i.id}`}
                    title={i.label}
                    aria-current={current ? "true" : undefined}
                    className="group grid h-11 w-10 place-items-center md:w-9"
                  >
                    <span
                      className={`grid h-7 min-w-7 place-items-center border-2 border-ink px-1 font-display text-[0.7rem] leading-none transition-[background-color,transform] duration-300 group-hover:-translate-y-0.5 ${
                        current
                          ? "scale-110 bg-jolly text-paper"
                          : passed
                            ? "bg-straw text-ink"
                            : "bg-paper text-ink"
                      }`}
                      style={{ borderRadius: "46% 54% 42% 58% / 55% 45% 55% 45%" }}
                    >
                      {i.short}
                    </span>
                    <span className="sr-only">{i.label}</span>
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="flex items-center gap-1 md:col-start-3 md:gap-1.5">
          <span id="gear-meter-label" className="font-sfx text-base leading-none tracking-wide md:text-xl">
            Gear
          </span>
          <meter aria-labelledby="gear-meter-label" min={0} max={maxGear} value={gear} className="sr-only" />
          {/* Gauge bar (CSS only, no glyphs): ink frame, filled segments per Gear reached. */}
          <span aria-hidden className="flex h-4 -skew-x-12 gap-[2px] border-2 border-ink bg-paper p-[2px]">
            {Array.from({ length: maxGear }, (_, n) => (
              <span
                key={n}
                className="w-1.5 transition-colors duration-300 md:w-2.5"
                style={{ background: n < gear ? PIP[n + 1] : "rgb(26 22 18 / 0.12)" }}
              />
            ))}
          </span>
          <span aria-hidden className="w-3 font-display text-base leading-none md:w-4 md:text-lg">
            {gear}
          </span>
        </div>

        <a href={resume} download className="btn btn-straw btn-sm px-2.5! text-[0.78rem]! md:col-start-4 md:px-[0.9rem]! md:text-[0.85rem]!">
          Resume
        </a>
      </div>
      <p className="sr-only" aria-live="polite">
        {activeLabel ? `Now reading: ${activeLabel}` : ""}
      </p>
    </header>
  );
}

/** Our own little sloop (no Jolly Roger, no straw hat). */
export function ShipMark() {
  return (
    <svg viewBox="0 0 32 28" className="block h-auto w-full drop-shadow-[2px_2px_0_rgba(26,22,18,0.25)]">
      <path d="M16 2v19" stroke="#1a1612" strokeWidth="2" />
      <path d="M17 3c6 3 8 9 7 15H17z" fill="#fbf7ee" stroke="#1a1612" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M17 9h7.3M17 13.5h7.6" stroke="#d62718" strokeWidth="2.2" />
      <path d="M15 5c-4 3-6 8-6 13h6z" fill="#fbf7ee" stroke="#1a1612" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M16 2l6 2-6 2" fill="#d62718" stroke="#1a1612" strokeWidth="1" />
      <path d="M3 20h26l-4 6H7z" fill="#c9762c" stroke="#1a1612" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}
