# Motion Cookbook (RND-003 → RND-008: GSAP)
Status: DONE · Owner: R&D · 2026-10-02 · Stack: Next 16.3.8, React 19.2.8, Tailwind 4, **`gsap` 3.15.0 + `@gsap/react` 2.1.2** (`motion` removed). Supersedes the `motion/react` version.

**Verified**: every TS/TSX block below is inlined from a scratch copy of `src/` (the real `src/types`, `src/data`, `src/components`, plus the proposed `src/lib/gsap.ts` in §0 and the `perch` type from §8.2). That copy passed `tsc --noEmit` against `node_modules/gsap/types` (strict, project tsconfig) and `eslint` with the project config, both with 0 problems. Nothing in `src/` was edited. Not verified: runtime and visual tuning (ranges, offsets, art alignment). Those need a browser and the real art.

## 0. Ground rules
- **One import point.** `src/lib/gsap.ts` currently registers only `ScrollTrigger` + `useGSAP`. **Replace it with the version below** (Senior Dev owns `src/`). Every recipe imports `gsap`, `ScrollTrigger`, `SplitText`, `MotionPathPlugin`, `useGSAP` and `MQ` from `@/lib/gsap`.
- **Registration (checked in the 3.15 sources).** All plugins ship in the public `gsap` package: `gsap/ScrollTrigger`, `gsap/SplitText`, `gsap/MotionPathPlugin` (+ `gsap/DrawSVGPlugin`, `gsap/MorphSVGPlugin`, `gsap/ScrollSmoother`, which we don't need).
  - **SplitText MUST be registered.** Unregistered, it falls back to `window.gsap`, which is undefined with ESM imports. It then misses `gsap.context` (no auto-revert) and resolves selector strings document-wide.
  - **MotionPathPlugin MUST be registered**, or the `motionPath` property is ignored.
  - We don't use DrawSVG: strokes are drawn with `pathLength={1}` + `strokeDasharray={1}` and a tween of `strokeDashoffset` 1 → 0.
- **useGSAP = cleanup.** Every tween, ScrollTrigger, `gsap.matchMedia()` and `SplitText` created inside the callback belongs to its context and is reverted on unmount. A matchMedia created inside a context is pushed to that context and inherits its `scope`. Route changes unmount, so nothing leaks.
  - With `dependencies` and no `revertOnUpdate`, the context is **not** reverted between runs (used on purpose in §8.4).
  - Tweens created later from event/scroll callbacks are outside the scope. Query elements explicitly there (§9d).
- **Reduced motion and mobile.** Inside `useGSAP`, use `const mm = gsap.matchMedia(); mm.add(MQ.ok | MQ.desk | {…conditions}, fn)`. `MQ.desk`/`MQ.mob` already include "motion OK". Reduced motion always gets the **final, readable state** (`gsap.set` or `tl.progress(x)`), never a hidden one.
- **Tailwind 4 trap.** `scale-*`, `rotate-*` and `translate-*` utilities compile to the individual CSS `scale`/`rotate`/`translate` properties, which **multiply with GSAP's `transform`**. Never put `scale-*` or `rotate-*` on an element GSAP scales or rotates; give it an inline `style={{ transform: "scale(0)" }}` instead (GSAP parses it). `translate-*` is safe only on elements GSAP doesn't move.
- **Boundaries.** `page.tsx`, every `<section>`, headings and copy stay server components. Client leaves live in `src/components/motion/*` (kebab-case, matching the repo) and wrap server `children` where needed (`ColorReveal`, `IslandTitle`, `WantedDrop`, `GaidenStrip`, `GearUp`). `Tear`, `InkPoof`, `GearMeter` and `GearArt` are server-safe.
- **Section contract** (unchanged): `<Section part>` renders `<section id={id} data-chapter={id} data-mode={colorMode} aria-labelledby>`.
- **Perf.** Animate only transform/opacity/autoAlpha. The exceptions are the one-off `filter` fade (§4) and the Gear 5 `--flood` scrub (§9d). `next/image`: `priority` is deprecated in Next 16, so use `loading="eager" fetchPriority="high"`.

```ts
"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";

// Register once, client only. Import everything GSAP from here, never from "gsap/*" directly.
if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, SplitText, MotionPathPlugin, useGSAP);

/** gsap.matchMedia() conditions. `ok` = motion allowed; `desk`/`mob` already include `ok`. */
export const MQ = {
  ok: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  desk: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
  mob: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
} as const;

export { gsap, ScrollTrigger, SplitText, MotionPathPlugin, useGSAP };
```

## 1. Guide character: greeting, 4th-wall break, hand-off
**Technique (unchanged): a scrubbed hero timeline, then a state hand-off to the fixed layer (no shared-layout jump).** The hero layers are out by hero progress 0.5. That is exactly when the cover's bottom edge crosses the viewport centre, when the chapter observer (§2a) marks Ch.1 active, and when the Traveler (§8) takes over. This assumes a `100svh` cover. If the cover is taller, move the `0.4 → 0.5` exit to `(h - 0.5vh) / h`.
Timeline (hero progress `p`): 0.05-0.12 hello → break-out pose · 0-0.3 scale 1 → 1.3 and rise · 0.15-0.22 tear opens · 0.2-0.3 cracks draw · 0.22 single impact frame + バリッ · 0.4-0.5 exit.

### 1a. Entry greeting (`guide-entry.tsx`)
```tsx
"use client";
import Image from "next/image";
import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

// Pose 01 + "Hello!" bubble. The body never starts at opacity 0 (LCP).
export function GuideEntry() {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.ok, () => {
        gsap.from(root.current, { scale: 0.92, y: 16, duration: 0.6, ease: "back.out(2)" });
        gsap.from(".bubble", { scale: 0, autoAlpha: 0, delay: 0.5, duration: 0.4, ease: "back.out(2.5)", transformOrigin: "0% 100%" });
      });
      mm.add(MQ.reduce, () => {
        gsap.from(".bubble", { autoAlpha: 0, delay: 0.5, duration: 0.3 });
      });
    },
    { scope: root },
  );
  return (
    <div ref={root} className="relative size-full origin-bottom">
      <Image
        src="/guide/01-wave-hello.webp"
        alt="Mayuresh, drawn as a manga character, waving hello"
        fill
        loading="eager"
        fetchPriority="high"
        sizes="(min-width: 768px) 40vw, 80vw"
        className="object-contain"
      />
      <p className="bubble absolute -top-2 right-0">Hello!</p>
    </div>
  );
}
```
- **LCP**: the body animates `scale`/`y` from its rendered state and never starts at opacity 0. **Reduced motion**: the bubble just fades in.

### 1b. Break-out (`break-out.tsx`), mounted in the cover's `data-slot="break-out"` (cover: `relative isolate h-svh overflow-hidden`)
```tsx
"use client";
import Image from "next/image";
import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { GuideEntry } from "./guide-entry";
import { Tear } from "./tear";

const BOX = "absolute inset-x-0 bottom-0 mx-auto aspect-[3/4] h-[85%] origin-bottom"; // 2 copies of pose 02: body under the border, head over it
const Layer = ({ z, clip }: { z: string; clip: string }) => (
  <div className={`bo-layer opacity-0 ${BOX} ${z}`}>
    <Image src="/guide/02-break-out.webp" alt="" fill sizes="40vw" className="object-contain" style={{ clipPath: clip }} />
  </div>
);

// One timeline, length 1 = hero scroll progress 0..1 (same ranges as the old motion version).
export function BreakOut() {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ ok: MQ.ok, reduce: MQ.reduce }, (ctx) => {
        const reduce = Boolean(ctx.conditions?.reduce);
        let hit = false;
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          paused: reduce,
          scrollTrigger: reduce ? undefined : { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        tl.fromTo(".bo-layer", { scale: 1, yPercent: 0 }, { scale: 1.3, yPercent: -10, duration: 0.3 }, 0)
          .to(".bo-layer", { yPercent: -40, duration: 0.2 }, 0.3)
          .fromTo(".bo-layer", { opacity: 0 }, { opacity: 1, duration: 0.07 }, 0.05)
          .to(".bo-layer", { opacity: 0, duration: 0.1 }, 0.4) // out by 0.5 = dock takes over
          .to(".bo-hello", { opacity: 0, duration: 0.07 }, 0.05)
          .fromTo(".tear-hole", { scale: 0 }, { scale: 1, duration: 0.07 }, 0.15)
          .to(".tear-crack", { strokeDashoffset: 0, duration: 0.1 }, 0.2)
          .fromTo(".tear-sfx", { opacity: 0 }, { opacity: 1, duration: 0.03 }, 0.22)
          .to(".tear-sfx", { opacity: 0, duration: 0.2 }, 0.25)
          .add(() => {
            if (hit || reduce) return; // one impact frame per page load (WCAG 2.3.1)
            hit = true;
            gsap.fromTo(".bo-flash", { opacity: 1 }, { opacity: 0, duration: 0.1, ease: "none" });
          }, 0.22)
          .set({}, {}, 1);
        if (reduce) tl.progress(0.35); // static broken-out frame
      });
    },
    { scope: root },
  );
  return (
    <div ref={root} className="absolute inset-0 isolate">
      <Layer z="z-0" clip="inset(40% 0 0 0)" />
      <div className="absolute inset-4 z-10 border-4 border-ink" />
      <Tear />
      <Layer z="z-20" clip="inset(0 0 60% 0)" />
      <div className={`bo-hello ${BOX} z-20`}>
        <GuideEntry />
      </div>
      <div aria-hidden className="bo-flash pointer-events-none absolute inset-0 z-30 bg-white opacity-0 mix-blend-difference" />
    </div>
  );
}
```
- **Two `Layer`s**: a transformed element is its own stacking context, so two copies of pose 02 with complementary `clip-path` sandwich the border (`z-10`). Tune the 40/60 split to the art's shoulder line.
- **Impact frame**: a 100 ms white `mix-blend-difference` sheet, fired once per load from a timeline callback.
- **Reduced motion**: the same timeline, paused at `progress(0.35)`: a static broken-out frame, with no scrub, flash or exit.
- **Perf**: one scrubbed timeline, transform/opacity plus dash offsets, and no layout reads.

### 1c. Torn border + cracks + SFX (`tear.tsx`): **now a server component**, animated by 1b's timeline
```tsx
// Server component: static markup, animated by BreakOut's timeline (classes tear-hole / tear-crack / tear-sfx).
const HOLE = "M30 40 L45 22 L58 34 L75 12 L92 30 L110 8 L124 28 L145 14 L156 36 L172 30 L160 52 L140 50 L128 70 L108 54 L90 72 L78 52 L55 64 L50 46 Z";
const CRACKS = ["M30 40 L12 30 L-20 34", "M172 30 L190 12 L222 8", "M90 72 L84 90 L70 110", "M140 50 L160 78 L190 84", "M110 8 L114 -14"];

export function Tear() {
  return (
    <div aria-hidden className="pointer-events-none absolute left-1/2 top-4 z-[15] h-24 w-56 -translate-x-1/2 -translate-y-1/2">
      <svg viewBox="0 0 200 80" className="tear-hole absolute inset-0 size-full" style={{ transform: "scale(0)" }}>
        <path d={HOLE} fill="var(--paper)" stroke="var(--ink)" strokeWidth={3} strokeLinejoin="miter" />
      </svg>
      <svg viewBox="0 0 200 80" className="absolute inset-0 size-full overflow-visible">
        {CRACKS.map((d) => (
          // pathLength=1 + dasharray 1: draw by tweening strokeDashoffset 1 -> 0 (no DrawSVG plugin needed)
          <path key={d} className="tear-crack" d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1} fill="none" stroke="var(--ink)" strokeWidth={2} />
        ))}
      </svg>
      <span className="tear-sfx sfx absolute -right-20 -top-8 rotate-[-8deg] opacity-0">バリッ</span>
    </div>
  );
}
```

## 2. Guide dock
### 2a. Active chapter: one observer (`use-active-chapter.ts`), unchanged (no animation library)
```ts
"use client";
import { useEffect, useState } from "react";

// One IntersectionObserver over every server-rendered <section id="x" data-chapter="x">.
// Active = the section under a thin band at the viewport's vertical center.
export function useActiveChapter() {
  const [active, setActive] = useState("cover");
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive((e.target as HTMLElement).dataset.chapter ?? "cover")),
      { rootMargin: "-49% 0px -50% 0px" },
    );
    document.querySelectorAll("[data-chapter]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}
```
- `chapter-nav.tsx` already runs its own observer. Two observers are negligible; move to a context if a third consumer appears.
- **2b / 2c removed**: superseded by `src/data/chapters.ts` `guide` data and by §8.6. The fallback if travel is cut is §8.6 with `<Traveler>` unmounted.

### 2d. Typewriter (`typewriter.tsx`)
```tsx
"use client";
import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

// Replay with key={line}. AT reads the full line once; per-char spans are aria-hidden and never reflow.
export function Typewriter({ text }: { text: string }) {
  const root = useRef<HTMLSpanElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.ok, () => {
      gsap.from(root.current!.children, { opacity: 0, duration: 0.01, stagger: 0.03, ease: "none" });
    });
  });
  return (
    <>
      <span className="sr-only">{text}</span>
      <span ref={root} aria-hidden>
        {[...text].map((c, i) => (
          <span key={i}>{c}</span>
        ))}
      </span>
    </>
  );
}
```
- Opacity steps only, so there's no reflow. The full line is in `sr-only` and there's deliberately no `aria-live`. **Reduced motion**: the whole line shows at once.

## 3. Chapter transitions
### 3a. Title ink wipe (`ink-wipe.tsx`). §9c `IslandTitle` is the upgraded version; keep this for non-chapter headings
```tsx
"use client";
import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

// <header className="relative overflow-hidden"><h2>…</h2><InkWipe /></header>
export function InkWipe() {
  const el = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.ok, () => {
      gsap.to(el.current, { scaleX: 0, duration: 0.55, ease: "power3.inOut", scrollTrigger: { trigger: el.current, start: "top 75%", once: true } });
    });
    mm.add(MQ.reduce, () => {
      gsap.set(el.current, { scaleX: 0 });
    });
  });
  return <div ref={el} aria-hidden className="absolute inset-0 z-10 origin-right bg-ink" />;
}
```
- **Reduced motion**: `scaleX(0)` at once. **Known ceiling**: without JS the sheet covers the title (accepted for a JS-required portfolio).

### 3b. Panels staggering in: **pure CSS** (unchanged)
```css
/* globals.css. Server markup: <div className="panel panel-in" style={{ "--i": i } as React.CSSProperties}> */
@keyframes panel-in { from { opacity: 0; transform: translateY(24px) scale(0.98); } }
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .panel-in {
      animation: panel-in linear both;
      animation-timeline: view();
      animation-range: entry 0% entry calc(45% + var(--i, 0) * 12%); /* --i staggers siblings in one row */
    }
  }
}
```

## 4. B&W → color reveal, one-shot (`color-reveal.tsx`) for Gaiden screenshots
```tsx
"use client";
import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

// Wrap the media of a color chapter (Gaiden screenshots), not the whole section.
export function ColorReveal({ children }: { children: React.ReactNode }) {
  const el = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.ok, () => {
      gsap.to(el.current, {
        filter: "grayscale(0)",
        duration: 0.8,
        ease: "power1.out",
        clearProps: "filter", // steady state: no filter, no stacking context
        scrollTrigger: { trigger: el.current, start: "top 70%", once: true },
      });
    });
  });
  return (
    <div ref={el} className="color-reveal" style={{ filter: "grayscale(1)" }}>
      {children}
    </div>
  );
}
```
```css
@media (prefers-reduced-motion: reduce) { .color-reveal { filter: none !important; } } /* color shown, no fade */
```
- SSR ships `grayscale(1)`, so there's no color flash. `clearProps` drops the filter afterwards, which leaves zero steady-state cost and no stacking context. The scrubbed AI Arc flood is §9d.

## 5. Focus/speed-line hero background: CSS only (unchanged)
```tsx
// focus-lines.tsx (server). First child of the cover section (relative isolate overflow-hidden).
export function FocusLines() {
  return <div aria-hidden className="focus-lines pointer-events-none absolute -inset-1/4 -z-10" />;
}
```
```css
.focus-lines {
  background: repeating-conic-gradient(from 0deg at 50% 50%, var(--ink) 0 0.6deg, transparent 0.6deg 5deg);
  mask-image: radial-gradient(circle at 50% 50%, transparent 26%, #000 72%);
  animation: focus-in 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
@keyframes focus-in { from { scale: 1.15; opacity: 0; } }
@supports (animation-timeline: scroll()) {
  .focus-lines { animation: focus-in 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) both, focus-spin linear both; animation-timeline: auto, scroll(root); animation-range: normal, 0 100vh; }
}
@keyframes focus-spin { to { rotate: 6deg; } }
@media (prefers-reduced-motion: reduce) { .focus-lines { animation: none; } }
```

## 6. Reading progress + chapter nav
### 6a. Ink bar (`reading-progress.tsx`). Optional now that §9a shows progress; keep it for mobile
```tsx
"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

// 1:1 with the user's own scroll, so it isn't autonomous motion: no reduced-motion branch needed.
export function ReadingProgress() {
  const el = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.fromTo(el.current, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: true } });
  });
  return <div ref={el} aria-hidden style={{ transform: "scaleX(0)" }} className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-ink" />;
}
```
### 6b. Chapter rail: **replaced** by the existing `chapter-nav.tsx` (top bar; swap its `<meter>` for §9a's `GearMeter`) plus the §9a Grand Line chart on desktop. Both keep the rail's contract: `aria-current`, `sr-only` names and ≥44 px targets.

## 7. Building the character so it feels alive (art strategy unchanged; tooling now CSS + GSAP)
| Option | Life it buys | Extra art | Verdict |
|---|---|---|---|
| a) Pose swaps (one WebP per pose) | Leaps, squash/stretch, lean, breathing; the face is frozen | None | Base layer |
| **a+) Pose swaps + 2 face overlays per pose** | Plus blinking and a mouth flap synced to the typewriter | 2 tiny overlays per pose | **PICK** for the guide |
| b) Layered rig | Arm/head motion | 5+ parts per pose | **Only for the Luffy Gear art** (doc 10), where a stretch is the point: §9f |
| c) Inline SVG with `<g>` parts | Same as a+ | Named groups | Only if the art arrives as clean SVG < 30 KB per pose |

Overlay deliverables (`<pose>.blink.webp`, `<pose>.talk.webp`, optional `.arm2`, `08-leap`, `.bw`) and their CSS are unchanged:
```tsx
<img src={`/guide/${pose}.blink.webp`} alt="" className="blink absolute inset-0 size-full object-contain" />
<img src={`/guide/${pose}.talk.webp`} alt="" className="flap absolute inset-0 size-full object-contain"
  style={{ animationIterationCount: Math.ceil((section.guide.line.length * 0.03) / 0.24) }} />
```
```css
.guide-alive { animation: breathe 2.8s ease-in-out infinite alternate; transform-origin: bottom; }
@keyframes breathe { to { scale: 1 1.015; } }      /* `scale` property on the INNER box: GSAP transforms the outer layer */
.blink { opacity: 0; animation: blink 4.2s steps(1) infinite; }
@keyframes blink { 0%, 95% { opacity: 0; } 96%, 98% { opacity: 1; } }
.flap { opacity: 0; animation: flap 0.24s steps(1); }
@keyframes flap { 50% { opacity: 1; } }
.bubble-life { animation: bubble-life 5.3s forwards; }
@keyframes bubble-life { 0% { opacity: 0; scale: 0.85; } 5%, 94% { opacity: 1; scale: 1; } 100% { opacity: 0; visibility: hidden; } }
@media (prefers-reduced-motion: reduce) { .guide-alive, .blink, .flap, .bubble-life { animation: none; } }
```
**Ink-poof (ドロン cloud), now CSS-only**: it hides each pose swap. Re-key it on every pose change.
```tsx
// Server-safe, CSS-only (.ink-poof keyframes). Re-key on every pose change: it hides the swap frame.
const BLOTS = [[20, 50, 16], [42, 30, 20], [66, 34, 17], [84, 56, 14], [34, 70, 18], [62, 72, 19], [50, 52, 22]];
export function InkPoof() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden className="ink-poof pointer-events-none absolute inset-0 size-full">
      {BLOTS.map(([cx, cy, r]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="var(--paper)" stroke="var(--ink)" strokeWidth={2} />
      ))}
    </svg>
  );
}
```

## 8. Chapter travel: one fixed layer, leaps between perches
**Unchanged pick: event-driven leaps, not a scroll-scrubbed path.** A scrubbed path leaves him hanging mid-air when the reader stops, and fast flings teleport him. Leaps are time-based, always land, and interrupt cleanly (`killTweensOf` + restart from the current position). Scroll velocity still adds a ±6° lean.

### 8.1 Storyboard (desktop): unchanged
```
 SCROLL    SECTION (mode)            GUIDE ACTION                                PERCH / MOVE
 cover     COVER (color)             01 wave-hello → 02 break-out + バリッ        inside hero (§1)
 p .5      hand-off                  fixed layer jump-cuts to its first perch (invisible)
 Ch.1-4    bw / duo                  crouch, arc ⌒, poof, pose                  left/right · top/mid/bottom · peek/ledge/free
 Ch.5      The AI Arc (COLOR)        lands 04 point; grayscale → color with the §9d Gear 5 flood
 Gaiden … Finale                     ⌒ leaps; finale walks to the CTA [data-guide-target], 06 wave-bye
 MOBILE   64px bust bottom-left, CSS hop per chapter, tap for bubble.
 REDUCED  jump cut to each perch, 300 ms pose fade, no poof/lean/idle loops.
```

### 8.2 Data: proposed `guide.perch` (Senior Dev owns `src/types`)
```ts
// src/types/index.ts: add `perch?: Perch` to Guide
export type Perch = {
  side: "left" | "right" | "center";
  y: "top" | "mid" | "bottom";
  spot: "peek" | "ledge" | "free";
  move?: "leap" | "walk" | "none";
  target?: string; // CSS selector to land beside (finale CTA: [data-guide-target], already on the Send button)
};
```
Values: `cover {center,mid,free,move:"none"}` · `the-beginning {left,mid,peek}` · `academy-arc {right,top,ledge}` · `first-quest {left,bottom,free}` · `forging-the-blade {right,mid,peek}` · `the-ai-arc {left,top,ledge}` · `gaiden {right,bottom,free}` · `status-window {left,mid,peek}` · `finale {center,bottom,free,move:"walk",target:"[data-guide-target]"}`.

### 8.3 Perch math (`perch.ts`), unchanged, plus its check (`node --experimental-strip-types perch.check.ts` → "perch ok")
```ts
import type { Perch } from "@/types";

export const DEFAULT_PERCH: Perch = { side: "right", y: "bottom", spot: "free" };
export const GUIDE_W = 150, GUIDE_H = 200, GUTTER = 24, RAIL = 56;

// Top-left px of the fixed guide layer for a perch. Pure: checked by perch.check.ts.
export function perchToXY(p: Perch, vw: number, vh: number, w = GUIDE_W, h = GUIDE_H) {
  const x =
    p.side === "center" ? (vw - w) / 2
    : p.spot === "peek" ? (p.side === "left" ? -w / 2 : vw - w / 2)
    : p.side === "left" ? GUTTER
    : vw - w - GUTTER - RAIL;
  const y = p.y === "top" ? Math.round(vh * 0.12) : p.y === "mid" ? (vh - h) / 2 : vh - h - GUTTER;
  return { x, y };
}
```
```ts
import assert from "node:assert";
import { perchToXY } from "./perch.ts";
const vw = 1440, vh = 900;
assert.deepEqual(perchToXY({ side: "left", y: "top", spot: "free" }, vw, vh), { x: 24, y: 108 });
assert.deepEqual(perchToXY({ side: "right", y: "bottom", spot: "free" }, vw, vh), { x: 1440 - 150 - 24 - 56, y: 900 - 200 - 24 });
assert.deepEqual(perchToXY({ side: "left", y: "mid", spot: "peek" }, vw, vh), { x: -75, y: 350 });
assert.deepEqual(perchToXY({ side: "right", y: "mid", spot: "peek" }, vw, vh), { x: 1365, y: 350 });
assert.deepEqual(perchToXY({ side: "center", y: "bottom", spot: "peek" }, vw, vh), { x: 645, y: 676 });
console.log("perch ok");
```

### 8.4 Travel engine (`use-leap.ts`): arc, squash/stretch, interrupt
```ts
"use client";
import { useRef, useState, type RefObject } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import type { Perch } from "@/types";
import { GUIDE_H, GUIDE_W, perchToXY } from "./perch";

const place = (p: Perch) => {
  const r = p.target ? document.querySelector(p.target)?.getBoundingClientRect() : undefined;
  return r ? { x: r.left - GUIDE_W - 16, y: r.bottom - GUIDE_H } : perchToXY(p, innerWidth, innerHeight);
};

// Flies the fixed guide layer to `perch` whenever the active section `id` changes.
// Arc = x tween + y keyframes [apex, target]; squash/stretch on scaleX/scaleY (volume kept: sx ≈ 2 - sy).
export function useLeap(layer: RefObject<HTMLDivElement | null>, id: string, perch: Perch) {
  const [airborne, setAirborne] = useState(false);
  const current = useRef(perch); // latest perch for the resize handler (written in the effect, not in render)

  // Resize = jump cut to the current perch. Registered once; useGSAP removes it on unmount.
  useGSAP(() => {
    const onResize = () => gsap.set(layer.current, place(current.current));
    addEventListener("resize", onResize);
    return () => removeEventListener("resize", onResize);
  });

  useGSAP(
    () => {
      current.current = perch;
      const el = layer.current;
      if (!el) return;
      gsap.killTweensOf(el); // a newer chapter mid-air restarts from the current position
      const { x: tx, y: ty } = place(perch);
      if (perch.move === "none" || !matchMedia(MQ.desk).matches) {
        gsap.set(el, { x: tx, y: ty, scaleX: 1, scaleY: 1 }); // jump cut: mobile, reduced motion, cover
        setAirborne(false);
        return;
      }
      const walk = perch.move === "walk", d = walk ? 1.2 : 0.6;
      const peak = walk ? ty - 8 : Math.min(Number(gsap.getProperty(el, "y")), ty) - 120; // apex above the higher end
      setAirborne(true);
      const tl = gsap.timeline({ onComplete: () => setAirborne(false) });
      if (!walk) tl.to(el, { scaleY: 0.85, scaleX: 1.15, duration: 0.08 }); // anticipation crouch
      tl.addLabel("air")
        .to(el, { x: tx, duration: d, ease: walk ? "none" : "power1.inOut" }, "air")
        .to(el, { keyframes: [{ y: peak, duration: d * 0.45, ease: "power2.out" }, { y: ty, duration: d * 0.55, ease: "power2.in" }] }, "air")
        .to(el, { scaleY: walk ? 1 : 1.12, scaleX: walk ? 1 : 0.88, duration: d * 0.4 }, "air") // stretch in the air
        .fromTo(el, { scaleY: 0.86, scaleX: 1.14 }, { scaleY: 1, scaleX: 1, duration: 0.5, ease: "elastic.out(1, 0.35)", immediateRender: false }); // landing squash
    },
    { dependencies: [id, perch] },
  );
  return airborne;
}
```
- The arc is a linear-ish `x` plus `y` keyframes (ease-out up, ease-in down), which gives a parabola. `dependencies: [id, perch]` without `revertOnUpdate`, so a new chapter doesn't snap him back. `killTweensOf` stops the old leap mid-air. `perch` objects are module constants from `chapters.ts`, so the deps are stable.

### 8.5 The layer (`traveler.tsx`): pose swap, B&W → color, bubble, scroll lean
```tsx
"use client";
import { useRef } from "react";
import { gsap, MQ, ScrollTrigger, useGSAP } from "@/lib/gsap";
import type { Part } from "@/types";
import { InkPoof } from "./ink-poof";
import { DEFAULT_PERCH, GUIDE_H, GUIDE_W } from "./perch";
import { Typewriter } from "./typewriter";
import { useLeap } from "./use-leap";

export const poseSrc = (pose: string) => `/guide/${pose}.webp`;

// The one fixed character layer (desktop). Mobile + toggle live in GuideDock.
export function Traveler({ section, hidden }: { section: Part; hidden: boolean }) {
  const layer = useRef<HTMLDivElement>(null);
  const perch = section.guide.perch ?? DEFAULT_PERCH;
  const airborne = useLeap(layer, section.id, perch);

  // Scroll lean: velocity kicks rotation up to ±6°, then it eases back to 0 (GSAP "skew on scroll" pattern).
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.desk, () => {
      const proxy = { r: 0 }, clamp = gsap.utils.clamp(-6, 6);
      const setR = gsap.quickSetter(layer.current, "rotation", "deg");
      ScrollTrigger.create({
        onUpdate: (self) => {
          const r = clamp(self.getVelocity() / 500);
          if (Math.abs(r) <= Math.abs(proxy.r)) return;
          proxy.r = r;
          gsap.to(proxy, { r: 0, duration: 0.8, ease: "power3", overwrite: true, onUpdate: () => setR(proxy.r) });
        },
      });
    });
  });

  const pose = airborne ? (section.guide.enterPose ?? "03-walk") : section.guide.pose;
  const show = section.id !== "cover" && !hidden; // cover: BreakOut owns him
  return (
    <div
      ref={layer}
      aria-hidden
      style={{ width: GUIDE_W, height: GUIDE_H, opacity: show ? 1 : 0 }}
      className="pointer-events-none fixed left-0 top-0 z-40 hidden origin-bottom transition-opacity md:block"
    >
      <div className={`guide-alive relative size-full transition-[filter] duration-700 ${section.colorMode === "color" ? "" : "grayscale"}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={pose} src={poseSrc(pose)} alt="" className="pose-in absolute inset-0 size-full object-contain" />
        <InkPoof key={`poof-${pose}`} />
        {perch.spot === "ledge" && <span className="absolute -bottom-1 -left-1/4 h-1 w-[150%] bg-ink" />}
      </div>
      {show && !airborne && (
        <p key={section.id} className={`bubble bubble-life absolute bottom-full mb-2 w-max max-w-[280px] ${perch.side === "right" ? "right-1/3" : "left-1/3"}`}>
          <Typewriter text={section.guide.line} />
        </p>
      )}
    </div>
  );
}
```
- **Lean**: the GSAP "skew on scroll" pattern. Velocity kicks the rotation, a proxy tween eases it back, and `quickSetter` writes it. That's one transform per frame, shared with the leap.
- **Ch.5 color**: non-`color` sections get `grayscale` on the 150×200 inner box (a 700 ms CSS transition).

### 8.6 Owner, mobile, toggle, preload (`guide-dock.tsx`; mount once in `guide-layer.tsx` behind the flag)
```tsx
"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { chapters, parts } from "@/data/chapters";
import type { Part } from "@/types";
import { poseSrc, Traveler } from "./traveler";
import { Typewriter } from "./typewriter";
import { useActiveChapter } from "./use-active-chapter";

const ORDER: Part[] = [parts.cover, ...chapters, parts.gaiden, parts.status, parts.finale]; // reading order
export function GuideDock() {
  const id = useActiveChapter();
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false); // mobile: bubble only on tap
  const i = ORDER.findIndex((s) => s.id === id), s = ORDER[i];
  useEffect(() => { // warm the cache for the next section's poses (plain <img>, so the URL matches)
    const n = ORDER[i + 1];
    if (n) [n.guide.pose, n.guide.enterPose ?? "03-walk"].forEach((p) => { new window.Image().src = poseSrc(p); });
  }, [i]);
  if (!s) return null;
  return (
    <>
      <Traveler section={s} hidden={hidden} />
      <aside aria-label="Guide" className="fixed bottom-4 left-4 z-40 flex flex-col items-start gap-2 md:left-auto md:right-14 md:items-end">
        {id !== "cover" && !hidden && ( // mobile: re-keyed per chapter = a small CSS hop (.hop)
          <div key={id} className="hop flex items-end gap-2 md:hidden">
            <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Guide: show message" className="relative size-16 overflow-hidden rounded-full border-[3px] border-ink bg-paper">
              <Image src="/guide/07-bust.webp" alt="" fill sizes="64px" />
            </button>
            {open && <p className="bubble max-w-56"><Typewriter text={s.guide.line} /></p>}
          </div>
        )}
        {id !== "cover" && (
          <button type="button" aria-pressed={hidden} onClick={() => setHidden((h) => !h)} className="min-h-11 px-3 text-sm underline">
            {hidden ? "Show guide" : "Hide guide"}
          </button>
        )}
      </aside>
    </>
  );
}
```
- **Mobile**: the Traveler is `display:none`, and `useLeap` jump-cuts (`MQ.desk` fails). The 64px bust re-keys per chapter, which plays the CSS `.hop`. **Hide guide** is the pause control for the idle loops.

### 8.7 Perf budget (60 fps, mid-range Android)
- One composited layer per moving thing. GSAP batches x/y/scale/rotation into one `transform` write per tick. There are no scroll listeners besides ScrollTrigger's single shared one.
- Bytes: one pose ≤80 KB plus ~5 KB of overlays on screen. The next section's poses are preloaded.
- Verify with DevTools Performance at 4× CPU: no long tasks and no "Layout" in leap or scrub frames.

### 8.8 Conflicts for the coordinator
- Design spec §7-8 still says `layoutId` hand-off. That's obsolete: there's no `motion` anymore, so use the §1/§8 pattern.
- `PoseId` comment: the files are `.webp` (unchanged note).

## 9. One Piece recipes (RND-008)
Chapter → Gear comes from `chapters[].gear` (1–5, already in `src/data/chapters.ts`). **Every recipe works with `siteConfig.features.luffy === false`.** Art layers are only added as server-rendered children behind the flag.

### 9a. Grand Line chart nav + Gear meter (`grand-line-chart.tsx`, `gear-meter.tsx`)
The ship (a Sunny-style hull with a lion figurehead dot) sails route segment *i* while section *i* scrolls (top-center → bottom-center). It docks exactly when the observer flips `aria-current` to the next island. The route inks in behind it. Pass it the same `contents: NavItem[]` that `page.tsx` builds for `ChapterNav`.
```tsx
"use client";
import { useRef } from "react";
import type { NavItem } from "@/components/chapter-nav";
import { gsap, MQ, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { GearMeter } from "./gear-meter";
import { useActiveChapter } from "./use-active-chapter";

const W = 64, H = 560;

// Desktop "Grand Line chart": islands = sections, the ship sails segment i while section i scrolls
// (top-center → bottom-center), so it docks exactly when the observer marks the next island active.
export function GrandLineChart({ items }: { items: NavItem[] }) {
  const root = useRef<HTMLElement>(null);
  const active = useActiveChapter();
  const pts = items.map((_, i) => ({ x: i % 2 ? 44 : 20, y: 16 + (i * (H - 32)) / Math.max(1, items.length - 1) }));
  const segs = pts.slice(1).map((p, i) => `M${pts[i].x} ${pts[i].y} Q${i % 2 ? 4 : 60} ${(pts[i].y + p.y) / 2} ${p.x} ${p.y}`);
  const idx = items.findIndex((i) => i.id === active);
  const gear = Math.max(0, ...items.slice(0, idx + 1).map((i) => i.gear ?? 0));

  useGSAP(
    () => {
      const ship = root.current!.querySelector<SVGGElement>(".ship")!;
      const wakes = root.current!.querySelectorAll<SVGPathElement>(".wake");
      gsap.set(ship, pts[0]);
      const mm = gsap.matchMedia();
      mm.add({ ok: MQ.ok, reduce: MQ.reduce }, (ctx) => {
        items.slice(0, -1).forEach((it, i) => {
          const sec = document.getElementById(it.id);
          if (!sec) return;
          if (ctx.conditions?.reduce) { // no sailing: jump to the island, route fully drawn
            gsap.set(wakes[i], { strokeDashoffset: 0 });
            ScrollTrigger.create({ trigger: sec, start: "bottom center", onEnter: () => gsap.set(ship, pts[i + 1]), onLeaveBack: () => gsap.set(ship, pts[i]) });
            return;
          }
          gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: sec, start: "top center", end: "bottom center", scrub: 0.6 } })
            .to(ship, { motionPath: { path: wakes[i] } }, 0) // not aligned: path coords = the ship's x/y (ship is drawn around 0,0)
            .to(wakes[i], { strokeDashoffset: 0 }, 0); // ink the route behind it
        });
      });
    },
    { scope: root },
  );

  return (
    <nav ref={root} aria-label="Chapter chart" className="grand-line fixed right-2 top-1/2 z-40 -translate-y-1/2" style={{ width: W }}>
      <GearMeter gear={gear} />
      <div className="relative" style={{ height: H }}>
        <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} aria-hidden className="absolute inset-0 overflow-visible">
          {segs.map((d) => (
            <path key={`r-${d}`} d={d} fill="none" stroke="var(--ink)" strokeOpacity={0.25} strokeDasharray="3 4" />
          ))}
          {segs.map((d) => (
            <path key={`w-${d}`} className="wake" d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1} fill="none" stroke="var(--ink)" strokeWidth={2} />
          ))}
          {pts.map((p, i) => (
            <circle key={items[i].id} cx={p.x} cy={p.y} r={5} stroke="var(--ink)" strokeWidth={2} fill={i <= idx ? "var(--ink)" : "var(--paper)"} />
          ))}
          <g className="ship">
            <path d="M-9 1 H9 L6 7 H-6 Z M0 1 V-11 M0 -10 L8 -3 H0" fill="var(--paper)" stroke="var(--ink)" strokeWidth={1.5} strokeLinejoin="round" />
            <circle cx={9} cy={1} r={2.5} fill="var(--accent, var(--ink))" /> {/* figurehead */}
          </g>
        </svg>
        <ol>
          {items.map((it, i) => (
            <li key={it.id} className="absolute" style={{ left: pts[i].x - 22, top: pts[i].y - 22 }}>
              <a href={`#${it.id}`} aria-current={it.id === active ? "true" : undefined} className="block size-11 rounded-full">
                <span className="sr-only">{it.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
```
```tsx
// Server-safe (no hooks). Drop-in for the <meter> in chapter-nav.tsx; `gear` = highest gear reached.
export function GearMeter({ gear, max = 5 }: { gear: number; max?: number }) {
  return (
    <p className="flex items-center gap-1 font-mono text-xs font-bold">
      <span className="sr-only">
        Power level: Gear {gear} of {max}
      </span>
      <span aria-hidden key={gear} className="gear-pop w-6">
        G{gear}
      </span>
      {Array.from({ length: max }, (_, i) => (
        <span aria-hidden key={i} data-on={i < gear || undefined} className="gear-pip" />
      ))}
    </p>
  );
}
```
- **MotionPath, checked in the source**: without `align`, the raw path coordinates become the target's x/y. So a ship drawn around (0,0) in the same SVG rides the path exactly, with no measuring and nothing to re-align on resize.
- **Reduced motion**: the route is fully drawn and the ship jumps island to island. **Mobile and short screens**: hidden by CSS (`.grand-line`). The top `chapter-nav` plus the `GearMeter` cover it.
- **`chapter-nav.tsx`**: replace the `<meter>` block with `<GearMeter gear={gear} />`. The sr text "Power level: Gear n of 5" replaces the meter label.

### 9b. Wanted-poster drop-in (`wanted-drop.tsx`)
```tsx
"use client";
import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

// Bounty/profile card: drops from its pin, then swings and settles like paper. Wrap server children.
export function WantedDrop({ children }: { children: React.ReactNode }) {
  const el = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.ok, () => {
      gsap
        .timeline({ scrollTrigger: { trigger: el.current, start: "top 80%", once: true } })
        .from(el.current, { yPercent: -60, rotation: -14, autoAlpha: 0, duration: 0.45, ease: "power2.in" })
        .to(el.current, { keyframes: { rotation: [9, -5, 2, 0], easeEach: "sine.inOut" }, duration: 1.3 });
    });
  });
  return (
    <div ref={el} className="origin-top">
      {children}
    </div>
  );
}
```
- The pin is at the top (`origin-top`). It drops with a fast ease-in, then a damped 4-keyframe swing (`easeEach: "sine.inOut"`). It runs once. **Reduced motion**: static card. Use our own poster frame, never the Marine "WANTED" layout (doc 10 §5).

### 9c. Island-arrival chapter titles (`island-title.tsx`): SplitText + ink wipe + wave underline
```tsx
"use client";
import { useRef } from "react";
import { gsap, MQ, SplitText, useGSAP } from "@/lib/gsap";

// "Island arrival": ink sheet wipes off, title chars rise out of word masks, a wave underline inks in.
// Wrap the SERVER heading: <IslandTitle><ChapterHeader … /></IslandTitle>. The h2 stays server HTML.
export function IslandTitle({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const h = root.current!.querySelector("h1, h2");
      const mm = gsap.matchMedia();
      mm.add(MQ.ok, () => {
        if (!h) return;
        const split = SplitText.create(h, { type: "words,chars", mask: "words" }); // aria: "auto" keeps the heading readable
        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: "top 75%", once: true } })
          .to(".ink-sheet", { scaleX: 0, duration: 0.5, ease: "power3.inOut" })
          .from(split.chars, { yPercent: 110, duration: 0.5, stagger: 0.025, ease: "back.out(1.6)" }, "-=0.2")
          .to(".wave", { strokeDashoffset: 0, duration: 0.6, ease: "power2.out" }, "-=0.3");
        return () => split.revert();
      });
      mm.add(MQ.reduce, () => {
        gsap.set(".ink-sheet", { scaleX: 0 });
        gsap.set(".wave", { strokeDashoffset: 0 });
      });
    },
    { scope: root },
  );
  return (
    <div ref={root} className="relative">
      {children}
      <div aria-hidden className="ink-sheet absolute inset-0 z-10 origin-right bg-ink" />
      <svg aria-hidden viewBox="0 0 200 8" preserveAspectRatio="none" className="mt-1 h-2 w-48">
        <path className="wave" d="M0 4 Q12.5 0 25 4 T50 4 T75 4 T100 4 T125 4 T150 4 T175 4 T200 4" pathLength={1} strokeDasharray={1} strokeDashoffset={1} fill="none" stroke="var(--ink)" strokeWidth={2} vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}
```
- Use `<IslandTitle><ChapterHeader … /></IslandTitle>`, so the `h2` stays server HTML. SplitText `aria: "auto"` (the default) puts an `aria-label` on the heading and hides the char spans. `mask: "words"` clips the rising chars. The split is reverted by the context, and explicitly on branch change.

### 9d. Gear-up transition (`gear-up.tsx`): the chapter-change power-up, including the AI Arc B&W → color climax
A pinned beat at the top of each chapter (desktop: `pin`, `+=80%`, `scrub: 0.5`; mobile: unpinned, plays once over 1.6 s; reduced: final frame). The old Gear squashes away, the new Gear's effect plays, then "GEAR n!" SFX lettering:
| Gear (chapter) | FX without art | Extra with art (`<GearArt>`) |
|---|---|---|
| 1 (Diploma) | Speed lines zoom in, "GOMU GOMU NO… PISTOL" | G1 body; the actual stretch is §9f `PistolArm` at the end of Ch.1 |
| 2 (B.Tech) | **Steam burst**: 8 puffs fly out + pink flush | G1 → G2 body swap under the burst, steam fx layer |
| 3 (Internship) | **Inflate**: a giant balloon circle grows, then pops | G2 → G3, giant-fist fx layer inflates |
| 4 (Softtronix) | **Haki ink coat**: ink rises from the bottom, text flips to paper (`data-done`) | G3 → G4, haki-arm fx layer |
| 5 (Crestline AI Arc) | **White flash + elastic wobble + color flood**: cloud puffs, halftone burst, `--flood` 0 → 1 greys the `.flood-media` back into color, `data-mode` bw → color | G4 → G5 swap hidden by the flash, then hair/cloud rubber wobble + "shishishi" laugh (≈3 s, stops) |
```tsx
"use client";
import { useRef } from "react";
import { laugh } from "@/components/luffy/laugh";
import { gsap, MQ, SplitText, useGSAP } from "@/lib/gsap";
import type { Chapter } from "@/types";

type Gear = Chapter["gear"];
const CALL: Record<Gear, string> = { 1: "GOMU GOMU NO…", 2: "GEAR 2!", 3: "GEAR 3!", 4: "GEAR 4!", 5: "GEAR 5!" };
const MOVE: Record<Gear, string> = { 1: "PISTOL", 2: "JET PISTOL", 3: "GIGANT PISTOL", 4: "KONG GUN", 5: "SHISHISHI!" };
const PUFFS = 8;

/**
 * Pinned power-up beat, first child of each chapter <Section>. Timeline length 1:
 * 0–.15 old gear squashes away · .1–.5 gear FX · .32 art swap under the FX peak · .35–.55 "GEAR n!" SFX · .55 data-done.
 * Art is optional: pass <GearArt> as children (features.luffy). Without it this is a pure SFX/FX moment.
 */
export function GearUp({ gear, children }: { gear: Gear; children?: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = root.current!;
      const section = el.closest<HTMLElement>("[data-chapter]");
      const hasArt = !!el.querySelector("[data-art]");
      const mm = gsap.matchMedia();
      mm.add({ desk: MQ.desk, mob: MQ.mob, reduce: MQ.reduce }, (ctx) => {
        const { desk, reduce } = ctx.conditions as { desk: boolean; reduce: boolean };
        const mode = section?.dataset.mode;
        let woke = false;
        if (gear === 5 && section && !reduce) section.dataset.mode = "bw"; // until the climax
        const done = (p: number) => {
          el.toggleAttribute("data-done", p > 0.55); // CSS: gear-4 text flips to paper on the ink coat, etc.
          if (gear !== 5) return;
          if (section) section.dataset.mode = p > 0.6 ? "color" : "bw"; // the B&W → color climax
          if (p > 0.6 && !woke && !reduce && hasArt) {
            woke = true; // Gear 5 swap settles into a short rubber wobble + laugh (≈3 s, then stops)
            gsap.to(el.querySelectorAll('[data-art="hair"], [data-art="cloud"]'), { scaleX: 0.96, scaleY: 1.05, yoyo: true, repeat: 7, duration: 0.35, ease: "sine.inOut", transformOrigin: "50% 100%" });
            laugh(el);
          }
        };
        const split = SplitText.create(el.querySelector(".gear-call"), { type: "chars" });
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          paused: reduce,
          onUpdate: () => done(tl.progress()),
          scrollTrigger: reduce
            ? undefined
            : desk
              ? { trigger: el, start: "top top", end: "+=80%", pin: true, scrub: 0.5 }
              : { trigger: el, start: "top 65%", toggleActions: "play none none none" }, // mobile: no pin, plays once
        });
        if (!desk) tl.duration(1.6);
        tl.to(".gear-prev", { scaleY: 0, autoAlpha: 0, duration: 0.15, ease: "power2.in" }, 0);
        if (gear === 1) tl.fromTo(".gear-lines", { scale: 1.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.3 }, 0.1);
        if (gear === 2) {
          tl.fromTo(".gear-tint", { autoAlpha: 0 }, { autoAlpha: 0.5, duration: 0.15 }, 0.1).to(".gear-tint", { autoAlpha: 0, duration: 0.25 }, 0.3);
        }
        if (gear === 2 || gear === 5) { // steam burst (G2) / Nika clouds (G5): puffs fly out from the centre
          const r = () => 0.42 * Math.min(innerWidth, innerHeight);
          tl.fromTo(".puff", { scale: 0, x: 0, y: 0, autoAlpha: 1 }, {
            scale: 1.6,
            x: (i: number) => Math.cos((i / PUFFS) * Math.PI * 2) * r(),
            y: (i: number) => Math.sin((i / PUFFS) * Math.PI * 2) * r(),
            duration: 0.35,
            ease: "power2.out",
          }, 0.12).to(".puff", { autoAlpha: 0, duration: 0.15 }, 0.42);
        }
        if (gear === 3) tl.fromTo(".balloon", { scale: 0.1 }, { scale: 1, duration: 0.3, ease: "back.out(1.4)" }, 0.1).to(".balloon", { scale: 1.25, autoAlpha: 0, duration: 0.08 }, 0.42); // inflate, pop
        if (gear === 4) tl.fromTo(".ink-coat", { scaleY: 0 }, { scaleY: 1, duration: 0.3, ease: "power2.in" }, 0.1); // haki coat rises
        if (gear === 5) {
          tl.fromTo(".gear-flash", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1 }, 0.3)
            .to(".gear-flash", { autoAlpha: 0, duration: 0.2 }, 0.45)
            .fromTo(".gear-stage", { scaleX: 1.25, scaleY: 0.8 }, { scaleX: 1, scaleY: 1, duration: 0.4, ease: "elastic.out(1.2, 0.3)" }, 0.45) // cartoon wobble
            .fromTo(".halftone", { autoAlpha: 0 }, { autoAlpha: 0.6, duration: 0.15 }, 0.45)
            .to(".halftone", { autoAlpha: 0, duration: 0.25 }, 0.65);
          if (section) tl.fromTo(section, { "--flood": 0 }, { "--flood": 1, duration: 0.4 }, 0.5); // grayscale → color on .flood-media
        }
        if (hasArt) {
          tl.to('[data-art="prev"]', { autoAlpha: 0, duration: 0.05 }, 0.32)
            .fromTo('[data-art="body"]', { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.15, ease: "back.out(2)" }, 0.32);
          if (gear !== 1 && gear !== 5) tl.fromTo('[data-art="fx"]', { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.2, ease: "back.out(1.5)" }, 0.38);
        }
        tl.from(split.chars, { yPercent: 120, scale: 0, autoAlpha: 0, stagger: 0.02, duration: 0.15, ease: "back.out(2)" }, 0.35)
          .from(".gear-move", { autoAlpha: 0, y: 20, duration: 0.1 }, 0.5)
          .set({}, {}, 1);
        if (reduce) tl.progress(1); // static final frame, chapter already in color
        return () => {
          split.revert();
          if (section && mode) section.dataset.mode = mode;
        };
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} data-gear={gear} aria-hidden className="gear-up relative isolate grid h-svh place-items-center overflow-hidden">
      {gear === 1 && <div className="gear-lines absolute -inset-1/4" />}
      {gear === 2 && <div className="gear-tint absolute inset-0" />}
      {(gear === 2 || gear === 5) &&
        Array.from({ length: PUFFS }, (_, i) => <span key={i} className="puff absolute left-1/2 top-1/2 -ml-[9vmin] -mt-[9vmin] size-[18vmin] rounded-full" />)}
      {gear === 3 && <div className="balloon absolute size-[90vmin] rounded-full border-[6px] border-ink bg-paper" />}
      {gear === 4 && <div className="ink-coat absolute inset-0 origin-bottom bg-ink" />}
      {gear === 5 && (
        <>
          <div className="halftone absolute inset-0" />
          <div className="gear-flash absolute inset-0 z-20 bg-paper" />
        </>
      )}
      <div className="gear-stage relative z-10 grid size-full place-items-center text-center">
        {children}
        <p className="gear-prev sfx absolute">{gear > 1 ? `GEAR ${gear - 1}` : "BASE"}</p>
        <div>
          <p className="gear-call sfx text-[clamp(3rem,14vw,10rem)] leading-none">{CALL[gear]}</p>
          <p className="gear-move mt-2 font-mono font-bold tracking-widest">{MOVE[gear]}</p>
        </div>
      </div>
    </div>
  );
}
```
- **Gear 5 is the one-time climax.** There's one white-out (no repeated flashing, so WCAG 2.3.1 is OK), and the scrub is reversible. `data-mode` toggles at progress 0.6 in both directions, and the original mode is restored on unmount. Reduced motion lands directly in full color.
- **Placement**: first child inside the chapter's `<Section>`. Make it full-bleed with `className="ml-[calc(50%-50vw)] w-screen"` on a wrapper (no translate tricks on pinned elements) and set `html { overflow-x: clip }`. The AI Arc media/product grid must sit in `<div className="flood-media">`.
- **Cost**: 5 pins × 80% adds about 4 viewports of scroll. If that feels long, use `end: "+=50%"` or pin only Gear 5.

### 9e. Pinned horizontal Gaiden strip (`gaiden-strip.tsx`)
```tsx
"use client";
import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

// Desktop + motion OK: pinned horizontal strip scrubbed by vertical scroll.
// Otherwise: native horizontal scroll with snap (CSS default below), mobile stacks vertically.
// Children: one <div className="gaiden-card w-[min(80vw,640px)] shrink-0 snap-start"> per project.
export function GaidenStrip({ children }: { children: React.ReactNode }) {
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
          scrollTrigger: { trigger: wrap, start: "top top", end: () => `+=${dist()}`, pin: true, scrub: 0.5, invalidateOnRefresh: true },
        });
        // Keyboard: Tab to an off-screen card scrolls the page to where that card is in view.
        const onFocus = (e: FocusEvent) => {
          const card = (e.target as HTMLElement).closest<HTMLElement>(".gaiden-card"), st = tween.scrollTrigger;
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
    <div ref={root} className="overflow-x-auto md:snap-x md:snap-mandatory">
      <div className="gaiden-track flex flex-col gap-6 md:w-max md:flex-row">{children}</div>
    </div>
  );
}
```
- Children: `projects.map(p => <div className="gaiden-card w-[min(80vw,640px)] shrink-0 snap-start" id={`project-${p.id}`}><ProjectCard … /></div>)`.
- **Keyboard**: Tab into an off-screen card scrolls the page to the matching scrub position. `overflow: clip` stops the browser from scrolling the strip behind GSAP.
- **Anchors**: `#project-x` links land on the strip's start, which is acceptable. **Reduced motion and mobile**: native scroll (snap row on desktop, stacked on mobile).

### 9f. Luffy layers (only when `siteConfig.features.luffy`; files per doc 10)
**Pistol stretch (`luffy/pistol-arm.tsx`)**. The stretch layer scales from its left joint, and the forearm and fist ride its right end. All parts share the 3000×4000 canvas, so they stack pixel-perfectly with `fill`. The tube's top and bottom ink lines keep their thickness under `scaleX`.
```tsx
"use client";
import Image from "next/image";
import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

const W = 3000; // doc 10 canvas width (all parts share it, so they stack pixel-perfectly)
const PARTS = ["body", "shoulder", "upper-arm", "stretch", "forearm", "fist", "fx"] as const;
const src = (part: string, mode: string) => `/art/luffy/luffy-g1-${part}-${mode}.webp`;

/**
 * Gear 1 "Gomu Gomu no Pistol", scrubbed: the stretch layer scales from its left joint while forearm + fist ride
 * its right end, so the ink outline never distorts vertically. Server parent renders it only when features.luffy.
 * stretchStart/stretchEnd = the stretch segment's x on the 3000px canvas (from the artist's `pivots` layer).
 */
export function PistolArm({ stretchStart, stretchEnd, mode = "bw", reach = 0.55 }: { stretchStart: number; stretchEnd: number; mode?: "bw" | "color"; reach?: number }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.ok, () => {
        const seg = () => (root.current!.offsetWidth * (stretchEnd - stretchStart)) / W; // segment width in px
        const px = () => innerWidth * reach; // how far the fist travels
        const ride = '[data-part="forearm"], [data-part="fist"]';
        gsap
          .timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: root.current, start: "center center", end: "+=120%", pin: true, scrub: 0.4, invalidateOnRefresh: true } })
          .fromTo('[data-part="stretch"]', { scaleX: 1 }, { scaleX: () => 1 + px() / seg(), duration: 0.6 }, 0)
          .fromTo(ride, { x: 0 }, { x: () => px(), duration: 0.6 }, 0)
          .fromTo('[data-part="fx"]', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1 }, 0.5) // motion lines at full reach
          .to('[data-part="stretch"]', { scaleX: 1, duration: 0.12, ease: "power4.in" }, 0.85) // snaps back
          .to(ride, { x: 0, duration: 0.12, ease: "power4.in" }, 0.85)
          .to('[data-part="fx"]', { autoAlpha: 0, duration: 0.05 }, 0.85);
      });
    },
    { scope: root },
  );
  return (
    <div ref={root} className="relative aspect-[3/4] h-[70svh] max-w-full">
      {PARTS.map((p) => (
        <Image
          key={p}
          data-part={p}
          src={src(p, mode)}
          alt={p === "body" ? "Straw-hat pirate (fan art) throwing a stretching rubber punch" : ""}
          fill
          sizes="(min-width: 768px) 53svh, 100vw"
          className="object-contain"
          style={p === "stretch" ? { transformOrigin: `${(stretchStart / W) * 100}% 50%` } : p === "fx" ? { opacity: 0, visibility: "hidden" } : undefined}
        />
      ))}
    </div>
  );
}
```
**Laugh frame swap (`luffy/laugh.ts`)**, used by §9d Gear 5 and reusable anywhere the mouth layers exist:
```ts
import { gsap } from "@/lib/gsap";

// "Shishishi": flips two open-mouth overlays over the closed grin (doc 10 G5 layers mouth-a / mouth-b).
// 3 laughs ≈ 0.9 s, well under the 5 s WCAG 2.2.2 limit. Returns undefined when the art isn't there.
export function laugh(scope: Element, times = 3) {
  const a = scope.querySelector('[data-art="mouth-a"]'), b = scope.querySelector('[data-art="mouth-b"]');
  if (!a || !b) return;
  return gsap
    .timeline({ repeat: times - 1 })
    .set(a, { autoAlpha: 1 })
    .set(a, { autoAlpha: 0 }, 0.12)
    .set(b, { autoAlpha: 1 }, 0.12)
    .set(b, { autoAlpha: 0 }, 0.24)
    .set({}, {}, 0.3);
}
```
**Gear art layers for `<GearUp>` (`luffy/gear-art.tsx`, server)**:
```tsx
import Image from "next/image";
import type { Chapter } from "@/types";

type Gear = Chapter["gear"];
// Layers per Gear signature illustration (doc 10 §2). "prev" = the previous Gear's body, faded out under the FX peak.
const LAYERS: Record<Gear, string[]> = {
  1: ["body"],
  2: ["body", "fx"], // fx = steam
  3: ["body", "fx"], // fx = giant bone-balloon fist
  4: ["body", "fx"], // fx = haki arms + steam scarf
  5: ["body", "hair", "cloud", "mouth-a", "mouth-b"],
};
const HIDDEN = new Set(["fx", "mouth-a", "mouth-b"]);
const src = (g: number, part: string, mode: "bw" | "color") => `/art/luffy/luffy-g${g}-${part}-${mode}.webp`;

/** Server component. Render ONLY inside `siteConfig.features.luffy && …`, as children of <GearUp>. */
export function GearArt({ gear, mode }: { gear: Gear; mode: "bw" | "color" }) {
  return (
    <div className="absolute inset-0 -z-10 mx-auto aspect-[3/4] h-full max-w-full">
      {gear > 1 && <Image data-art="prev" src={src(gear - 1, "body", mode)} alt="" fill sizes="(min-width: 768px) 60svh, 100vw" className="object-contain" />}
      {LAYERS[gear].map((p) => (
        <Image
          key={p}
          data-art={p}
          src={src(gear, p, mode)}
          alt={p === "body" ? `Straw-hat pirate (fan art) powering up: Gear ${gear}` : ""}
          fill
          sizes="(min-width: 768px) 60svh, 100vw"
          className="object-contain"
          style={HIDDEN.has(p) ? { opacity: 0, visibility: "hidden" } : undefined}
        />
      ))}
    </div>
  );
}
```
**Wiring (server `page.tsx`, inside `chapters.map`)**:
```tsx
<Section key={c.id} part={c}>
  <div className="ml-[calc(50%-50vw)] w-screen">
    <GearUp gear={c.gear}>{siteConfig.features.luffy && <GearArt gear={c.gear} mode={c.gear === 5 ? "color" : "bw"} />}</GearUp>
  </div>
  <IslandTitle><ChapterHeader id={`${c.id}-title`} eyebrow={`Ch.${c.number} · ${c.gearName}`} title={c.title} label={`${c.subtitle} · ${c.period}`} /></IslandTitle>
  {/* …copy… ; Ch.5 products inside <div className="flood-media">…</div> */}
  {c.gear === 1 && siteConfig.features.luffy && <PistolArm stretchStart={/* from pivots */ 1450} stretchEnd={1750} />}
</Section>
```
`stretchStart`/`stretchEnd` are placeholders until the artist's `pivots` layer arrives. Flag off means none of the `/art/luffy/*` URLs are rendered or requested.

### 9g. CSS for §7–§9 (add to `globals.css`; colours via tokens)
```css
.ink-poof { animation: ink-poof 0.28s ease-out forwards; }
@keyframes ink-poof { from { scale: 0.5; opacity: 1; } to { scale: 1.4; opacity: 0; } }
.pose-in { animation: pose-in 50ms linear; }
@keyframes pose-in { from { opacity: 0; } }
.hop { animation: hop 0.4s ease-out; }
@keyframes hop { 50% { translate: 0 -16px; } }

.grand-line { display: none; }
@media (min-width: 768px) and (min-height: 680px) { .grand-line { display: block; } }
.grand-line a:focus-visible { outline: 3px solid var(--ink); outline-offset: 2px; }

.gear-pip { width: 0.5rem; height: 0.75rem; border: 2px solid currentColor; transform: skewX(-12deg); transition: background-color 0.2s; }
.gear-pip[data-on] { background: currentColor; }
.gear-pop { display: inline-block; animation: gear-pop 0.35s cubic-bezier(0.3, 1.6, 0.5, 1); }
@keyframes gear-pop { from { scale: 1.8; } }

.gear-up :is(.gear-tint, .halftone, .gear-flash, .puff) { opacity: 0; visibility: hidden; } /* GSAP autoAlpha owns them */
.gear-lines { background: repeating-conic-gradient(from 0deg at 50% 50%, var(--ink) 0 0.6deg, transparent 0.6deg 5deg); mask-image: radial-gradient(circle, transparent 26%, #000 72%); }
.gear-tint { background: var(--gear2-pink); mix-blend-mode: multiply; }
.puff { background: var(--paper); border: 3px solid var(--ink); }
.halftone { background: radial-gradient(var(--ink) 30%, transparent 32%) 0 0 / 8px 8px; mix-blend-mode: multiply; }
.gear-up[data-gear="4"][data-done] .gear-stage { color: var(--paper); }
.flood-media { filter: grayscale(calc(1 - var(--flood, 1))); } /* unset = full color (no JS, reduced motion) */

@media (prefers-reduced-motion: reduce) {
  .ink-poof { display: none; }
  .pose-in { animation-duration: 0.3s; }
  .hop, .gear-pop { animation: none; }
  .gear-pip { transition: none; }
}
```
New token: `--gear2-pink` (Design picks it; suggested: a light pink that passes as a tint under ink).

## 10. Open items
- **Senior Dev**: replace `src/lib/gsap.ts` (§0), add `Perch` to `src/types` (§8.2), swap the `<meter>` for `GearMeter`, add the §9g CSS and the `--ink`/`--paper`/`--gear2-pink` tokens (globals still has only `--background`/`--foreground`), and set `html { overflow-x: clip }`.
- **QA in a browser**: pin spacing with 5 Gear pins + the Gaiden pin (call `ScrollTrigger.refresh()` once after fonts/images if triggers drift), mobile Safari address-bar resize, and reduced motion end-to-end.
- **Art**: tune `PistolArm` pivots and the BreakOut 40/60 split against the real files.

