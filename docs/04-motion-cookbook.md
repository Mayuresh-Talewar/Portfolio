# Motion Cookbook (RND-003)
Status: DONE · Owner: R&D · 2026-10-02 · Inputs: `02-research-report.md` §2, §7 · Stack: Next 16.3.8, React 19.2.8, Tailwind 4, `motion` 13.5.0 (`motion/react`)

**Verified**: every TSX file below was type-checked (`tsc --strict`, project compiler options), linted with the project's `eslint.config.mjs` (next core-web-vitals + TS: 0 errors), and server-rendered with `react-dom/server` (no throw). All checks ran in a scratch folder; nothing was added to `src/`. Visual tuning (exact ranges, offsets, art alignment) still needs the real pose art in a browser.

## 0. Ground rules
- **Boundaries**: `page.tsx` and every `<section>`, `h1`/`h2` and copy stay **server components**. Only these leaves are `"use client"`: `Providers`, `GuideEntry`, `BreakOut`, `Tear`, `GuideDock`, `Typewriter`, `useActiveChapter`, `InkWipe`, `ColorReveal`, `ReadingProgress`, `ChapterRail`. A client leaf may wrap server `children` (`ColorReveal`). Suggested home: `src/components/motion/*`, data in `src/data/guide.ts`.
- **Section contract**: every chapter is `<section id="ch5" data-chapter="ch5">` with `id === data-chapter`. The cover is `id="cover" data-chapter="cover"`. One IntersectionObserver reads these attributes (§2).
- **Reduced motion, global**: `MotionConfig reducedMotion="user"` turns off **transform and layout** animations app-wide but keeps opacity/color. It does **not** affect values bound through `style={{ x: motionValue }}` (scroll-linked), so `BreakOut` handles reduced motion itself.
- **Perf, global**: animate only transform/opacity (filter once, §4). In motion 13 only `opacity`, `clipPath`, `filter`, `backgroundColor` and full `transform` run on the native scroll timeline (`motion-dom` `acceleratedValues`). `scale`/`y` scroll values run on motion's rAF loop, which is fine for 1-3 elements. **Next 16**: `next/image` `priority` is deprecated. Use `loading="eager" fetchPriority="high"` (or `preload`).
- **Version notes**: `staggerChildren` is deprecated. Use `transition={{ delayChildren: stagger(0.03) }}`.

```tsx
// Providers.tsx  (app/layout.tsx: <body><Providers>{children}</Providers></body>)
"use client";
import { MotionConfig } from "motion/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
```

## 1. Guide character: greeting, 4th-wall break, hand-off
**Technique pick: `useScroll` transforms in the hero, then a state hand-off to the dock (no `layoutId`).** A `layoutId` jump from a scrolling panel to a `position: fixed` dock measures layout in the middle of a scroll, so it snaps on fast scrolls and on scroll-up. Scroll-linked transforms are reversible, need zero layout reads and stay on transform/opacity. The hand-off is one shared boundary: the hero character fades out by hero progress 0.5. That is exactly when the cover's bottom edge crosses the viewport's center line, which is the same moment the chapter observer (§2) marks Ch.1 active and the dock slides in. This assumes a `100svh` cover. If the cover is taller, move the `0.4 → 0.5` exit range to `(h - 0.5vh) / h`.

Timeline (hero scroll progress `p`, `["start start","end start"]`): 0.05-0.12 hello → break-out pose · 0-0.3 scale 1 → 1.3 and rise · 0.15-0.22 tear opens · 0.2-0.3 cracks draw · 0.22 single impact frame + バリッ · 0.4-0.5 exit → dock.

### 1a. Entry greeting (`GuideEntry.tsx`)
```tsx
"use client";
import Image from "next/image";
import { motion } from "motion/react";

// Pose 01 + "Hello!" bubble. Starts at opacity 1 so the LCP isn't held back.
export function GuideEntry() {
  return (
    <motion.div
      className="relative size-full origin-bottom"
      initial={{ scale: 0.92, y: 16 }}
      animate={{ scale: 1, y: 0 }}
      transition={{ type: "spring", bounce: 0.45, duration: 0.6 }}
    >
      <Image
        src="/guide/01-wave-hello.webp"
        alt="Mayuresh, drawn as a manga character, waving hello"
        fill
        loading="eager"
        fetchPriority="high"
        sizes="(min-width: 768px) 40vw, 80vw"
        className="object-contain"
      />
      <motion.p
        className="bubble absolute -top-2 right-0"
        style={{ originX: 0, originY: 1 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: "spring", bounce: 0.5 }}
      >
        Hello!
      </motion.p>
    </motion.div>
  );
}
```
- **Reduced motion**: `MotionConfig` skips the scale/y pop. The bubble still fades in (opacity is allowed).
- **Perf**: the character is likely the LCP element. Never start it at `opacity: 0`, because Chrome doesn't count invisible paints and the LCP would wait for hydration. Use the `eager` + `fetchPriority="high"` hero image only. The SSR test confirmed a `<link rel="preload">` is emitted.

### 1b. Break-out (`BreakOut.tsx`). Mount it inside the server cover: `<section id="cover" data-chapter="cover" className="relative isolate h-svh overflow-hidden"><BreakOut /></section>`
```tsx
"use client";
import Image from "next/image";
import { useRef } from "react";
import { motion, useAnimate, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionStyle } from "motion/react";
import { GuideEntry } from "./GuideEntry";
import { Tear } from "./Tear";
const BOX = "absolute inset-x-0 bottom-0 mx-auto aspect-[3/4] h-[85%] origin-bottom"; // 2 copies of pose 02, 1 transform: body under the border, head over it
const Layer = ({ z, clip, style }: { z: string; clip: string; style: MotionStyle }) => (
  <motion.div style={style} className={`${BOX} ${z}`}>
    <Image src="/guide/02-break-out.webp" alt="" fill sizes="40vw" className="object-contain" style={{ clipPath: clip }} />
  </motion.div>
);
export function BreakOut() {
  const ref = useRef<HTMLDivElement>(null), hit = useRef(false);
  const [flash, animate] = useAnimate<HTMLDivElement>();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const frozen = useMotionValue(0.35); // reduced motion: the broken-out frame, static
  const reduce = useReducedMotion();
  const p = reduce ? frozen : scrollYProgress;
  const style = {
    scale: useTransform(p, [0, 0.3], [1, 1.3]),
    y: useTransform(p, [0, 0.3, 0.5], ["0%", "-10%", "-40%"]),
    opacity: useTransform(p, [0.05, 0.12, 0.4, 0.5], [0, 1, 1, 0]), // out by 0.5 = dock takes over
  };
  const hello = useTransform(p, [0.05, 0.12], [1, 0]);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (hit.current || v < 0.22 || reduce) return; // one impact frame per page load, never loops (WCAG 2.3.1)
    hit.current = true; animate(flash.current, { opacity: [1, 0] }, { duration: 0.1, ease: "linear" });
  });
  return (
    <div ref={ref} className="absolute inset-0 isolate">
      <Layer z="z-0" clip="inset(40% 0 0 0)" style={style} />
      <div className="absolute inset-4 z-10 border-4 border-ink" />
      <Tear p={p} />
      <Layer z="z-20" clip="inset(0 0 60% 0)" style={style} />
      <motion.div style={{ opacity: hello }} className={`${BOX} z-20`}><GuideEntry /></motion.div>
      <div ref={flash} aria-hidden className="pointer-events-none absolute inset-0 z-30 bg-white opacity-0 mix-blend-difference" />
    </div>
  );
}
```
- **Why two `Layer`s**: a transformed element creates its own stacking context, so a single image can't sit both under and over the border. Two copies of the same file (decoded once) with complementary `clip-path: inset()` sandwich the border (`z-10`): the body stays inside the panel and the head/arm pop over the frame. Tune the `40%`/`60%` split to the art's shoulder line.
- **Impact frame**: a white `mix-blend-difference` sheet flashes for 100 ms, which reads as an inverted manga impact frame. It fires once per page load.
- **Reduced motion**: `p` is frozen at 0.35, so the user sees a static broken-out composition (tear, cracks, overflow) with no scrub, no flash and no exit.
- **Perf**: `scale`/`y`/`opacity` on 2 layers plus 1 SVG, with no layout reads. The pose 02 image loads lazily (not eager), so it doesn't compete with the LCP.

### 1c. Torn border + cracks + SFX (`Tear.tsx`)
```tsx
"use client";
import { motion, useTransform, type MotionValue } from "motion/react";

const HOLE = "M30 40 L45 22 L58 34 L75 12 L92 30 L110 8 L124 28 L145 14 L156 36 L172 30 L160 52 L140 50 L128 70 L108 54 L90 72 L78 52 L55 64 L50 46 Z";
const CRACKS = ["M30 40 L12 30 L-20 34", "M172 30 L190 12 L222 8", "M90 72 L84 90 L70 110", "M140 50 L160 78 L190 84", "M110 8 L114 -14"];

// Torn hole in the panel's top border + cracks + SFX. Transform/pathLength only; no animated mask.
export function Tear({ p }: { p: MotionValue<number> }) {
  const scale = useTransform(p, [0.15, 0.22], [0, 1]);
  const draw = useTransform(p, [0.2, 0.3], [0, 1]);
  const sfx = useTransform(p, [0.22, 0.25, 0.45], [0, 1, 0]);
  return (
    <div aria-hidden className="pointer-events-none absolute left-1/2 top-4 z-[15] h-24 w-56 -translate-x-1/2 -translate-y-1/2">
      <motion.svg viewBox="0 0 200 80" className="absolute inset-0 size-full" style={{ scale }}>
        <path d={HOLE} fill="var(--paper)" stroke="var(--ink)" strokeWidth={3} strokeLinejoin="miter" />
      </motion.svg>
      <svg viewBox="0 0 200 80" className="absolute inset-0 size-full overflow-visible">
        {CRACKS.map((d) => (
          <motion.path key={d} d={d} fill="none" stroke="var(--ink)" strokeWidth={2} style={{ pathLength: draw }} />
        ))}
      </svg>
      <motion.span style={{ opacity: sfx }} className="sfx absolute -right-20 -top-8 rotate-[-8deg]">バリッ</motion.span>
    </div>
  );
}
```
- **Mask decision**: a paper-filled jagged SVG patch over the border does the same job as a `mask-image` hole. Animating its `scale` stays on the compositor, while animating `mask-size` repaints the border every frame. If Design wants a true see-through hole (showing a texture behind), put the same `HOLE` path in a `mask-image` data URL on a static layer and still animate only that layer's transform.
- **Reduced motion**: driven by the frozen `p`, so it renders static. **Perf**: 5 short paths, `pathLength` is a cheap dash update, and the whole block is `aria-hidden`.

## 2. Guide dock
### 2a. Active chapter: one observer (`useActiveChapter.ts`), shared with the rail (§6)
```tsx
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
- **Why not `useInView` per section**: that needs a client wrapper around each section, which would turn the sections into client components. One observer reading `data-chapter` keeps every section on the server.
- **Perf**: no scroll listener, and state changes only at chapter boundaries. The two consumers (dock and rail) mean two observers, which is negligible. Move it to a context if a third consumer appears.

### 2b. Data (`src/data/guide.ts`). **Superseded by §8**: guide data already lives in `src/data/chapters.ts` (`guide: { pose, line, enterPose? }`), so don't create `guide.ts`
```ts
// No entry = no dock (cover: hero owns him; finale: he lives in the last panel).
export const GUIDE: Record<string, { pose: string; line: string }> = {
  ch1: { pose: "04-point", line: "Nagpur, 2018. Where it all started." },
  ch5: { pose: "04-point", line: "This is the arc I'm in right now!" },
  skills: { pose: "05-think", line: "My status window. No fake levels." },
};
```

### 2c. Dock: pose swap, bubble, Hide toggle, mobile 64px head (`GuideDock.tsx`). **Superseded by §8.6**, which keeps the mobile head and the toggle and replaces the static desktop dock with the traveling layer. Kept here as the fallback if travel is cut.
```tsx
"use client";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { GUIDE } from "@/data/guide";
import { Typewriter } from "./Typewriter";
import { useActiveChapter } from "./useActiveChapter";

export function GuideDock() {
  const chapter = useActiveChapter();
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false); // mobile: bubble only on tap
  const g = GUIDE[chapter];
  return (
    <aside aria-label="Guide" className="fixed bottom-4 left-4 z-40 flex flex-col items-start gap-2 md:left-auto md:right-14 md:items-end">
      <AnimatePresence>
        {g && !hidden && ( // no entry (cover, finale) = no dock: the hero hands off here
          <motion.div key="dock" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} className="flex items-end gap-2 md:flex-row-reverse">
            <div className="relative hidden aspect-[3/4] h-[200px] md:block">
              <AnimatePresence initial={false}>
                <motion.div key={g.pose} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="absolute inset-0">
                  <Image src={`/guide/${g.pose}.webp`} alt="" fill sizes="150px" className="object-contain" />
                </motion.div>
              </AnimatePresence>
            </div>
            <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Guide: show message" className="relative size-16 overflow-hidden rounded-full border-[3px] border-ink bg-paper md:hidden">
              <Image src="/guide/07-bust.webp" alt="" fill sizes="64px" />
            </button>
            <p className={`bubble max-w-56 ${open ? "" : "hidden md:block"}`}><Typewriter key={chapter} text={g.line} /></p>
          </motion.div>
        )}
      </AnimatePresence>
      {g && <button type="button" aria-pressed={hidden} onClick={() => setHidden((h) => !h)} className="min-h-11 px-3 text-sm underline">
        {hidden ? "Show guide" : "Hide guide"}
      </button>}
    </aside>
  );
}
```
- **Layout**: the dock sits at `right-14` on desktop so it clears the chapter rail. On mobile it sits bottom-left at 64px (≥44px target), clear of the CTAs and the progress pill.
- **Reduced motion**: `MotionConfig` drops the `y`/`scale`, so poses swap with a 150 ms fade and the dock fades in. `Typewriter` shows the whole line at once.
- **Perf**: one fixed element and opacity/transform only. Images in `display:none` branches (`hidden md:block`) aren't fetched on load, so mobile never downloads full-body poses. Each pose (≤80 KB) is fetched on its first chapter. If the first swap flashes empty, warm the cache with `new Image().src = ...` on idle.
- **Skipped**: walking bob, hiding while a form field has focus, auto-hiding the mobile bubble, and persisting "Hide" across reloads. Add each one only if QA asks.

### 2d. Typewriter (`Typewriter.tsx`)
```tsx
"use client";
import { motion, stagger, useReducedMotion } from "motion/react";

// Replay with key={line}. AT reads the full line once; per-char spans are aria-hidden.
// Chars fade in at opacity 0 -> 1 in place, so the bubble never reflows.
export function Typewriter({ text }: { text: string }) {
  const reduce = useReducedMotion();
  return (
    <>
      <span className="sr-only">{text}</span>
      <motion.span aria-hidden initial="off" animate="on" transition={{ delayChildren: stagger(reduce ? 0 : 0.03) }}>
        {[...text].map((c, i) => (
          <motion.span key={i} variants={{ off: { opacity: 0 }, on: { opacity: 1 } }} transition={{ duration: 0 }}>
            {c}
          </motion.span>
        ))}
      </motion.span>
    </>
  );
}
```
- **Perf**: ~40 spans per line, with opacity steps only and no layout shift. There's deliberately no `aria-live`, because a chatty guide is noise for screen readers.

## 3. Chapter transitions
### 3a. Title page reveal (`InkWipe.tsx`), inside the server title panel
```tsx
"use client";
import { motion } from "motion/react";

// <header className="relative overflow-hidden"><h2>Ch.5 The AI Arc</h2><InkWipe /></header>
export function InkWipe() {
  return (
    <motion.div
      aria-hidden
      className="absolute inset-0 z-10 origin-right bg-ink"
      initial={{ scaleX: 1 }}
      whileInView={{ scaleX: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.55, ease: [0.7, 0, 0.3, 1] }}
    />
  );
}
```
- **Reduced motion**: `MotionConfig` snaps the wipe to `scaleX(0)` instantly. **Perf**: `scaleX` stays on the compositor, which is cheaper than animating `clip-path: inset()` (that repaints). The `h2` is server HTML, so SEO and AT are unaffected. Known ceiling: with JS disabled the ink sheet stays in place over the title. Accepted for a JS-required portfolio.

### 3b. Panels staggering in: **pure CSS** (scroll-driven), with zero JS and no client boundary
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
- **Fallback**: browsers without scroll-timeline support (older Firefox) and reduced-motion users get static, fully visible panels. **Perf**: runs off the main thread on the compositor. It reverses on scroll-up, which suits panels. If one-shot reveals are wanted instead, copy `InkWipe`'s `whileInView` + `once` pattern into a `Reveal` client leaf.

## 4. B&W → color reveal (`ColorReveal.tsx`)
**Pick: CSS `filter: grayscale()` animated once, ending at `filter: none`.** The overlay approach (a stacked gray copy fading out) doubles image bytes and decodes for every screenshot. Motion runs `filter` through WAAPI (it's in `acceleratedValues`), so Chrome composites the 0.8 s fade, and `transitionEnd` removes the filter afterwards. The steady-state cost is 0, and no lingering filter creates a stacking context that would break `position: fixed` children.
```tsx
"use client";
import { motion } from "motion/react";

// Wrap the media of a color chapter, not the whole section (smaller filter texture).
export function ColorReveal({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="color-reveal"
      initial={{ filter: "grayscale(1)" }}
      whileInView={{ filter: "grayscale(0)", transitionEnd: { filter: "none" } }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
```
```css
@media (prefers-reduced-motion: reduce) { .color-reveal { filter: none !important; } } /* color shown, no fade */
```
- `children` stay server components. The SSR output contains `grayscale(1)`, so there's no color flash before hydration. Wrap image grids, not text blocks (text is ink already), to keep the filtered area small.

## 5. Focus/speed-line hero background: CSS only, server component
```tsx
// FocusLines.tsx (no "use client"). Place first inside the cover section (relative isolate overflow-hidden).
export function FocusLines() {
  return <div aria-hidden className="focus-lines pointer-events-none absolute -inset-1/4 -z-10" />;
}
```
```css
.focus-lines {
  background: repeating-conic-gradient(from 0deg at 50% 50%, var(--ink) 0 0.6deg, transparent 0.6deg 5deg);
  mask-image: radial-gradient(circle at 50% 50%, transparent 26%, #000 72%); /* clear center for the character */
  animation: focus-in 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) both; /* one zoom on load */
}
@keyframes focus-in { from { scale: 1.15; opacity: 0; } }
@supports (animation-timeline: scroll()) {
  .focus-lines { animation: focus-in 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) both, focus-spin linear both; animation-timeline: auto, scroll(root); animation-range: normal, 0 100vh; }
}
@keyframes focus-spin { to { rotate: 6deg; } } /* separate property from `scale`: no conflict */
@media (prefers-reduced-motion: reduce) { .focus-lines { animation: none; } }
```
- **Motion**: one load zoom, then a slow rotate that only moves while the user scrolls. There's no infinite loop, so WCAG 2.2.2 (pause control) isn't triggered. **Perf**: the gradient and mask are rasterized once, and `scale`/`rotate` only move the layer. `-inset-1/4` keeps the rotated corners off-screen. **Reduced motion**: static lines.

## 6. Reading progress + chapter nav
### 6a. Ink bar (`ReadingProgress.tsx`)
```tsx
"use client";
import { motion, useScroll } from "motion/react";

export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  return <motion.div aria-hidden style={{ scaleX: scrollYProgress }} className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-ink" />;
}
```
- **Reduced motion**: none needed. The bar is 1:1 with the user's own scroll, so it isn't autonomous motion. **Perf**: a single `scaleX`. A zero-JS alternative is `animation-timeline: scroll(root)` on a `scaleX` keyframe; swap to it if bundle trimming matters (it stays static without support).

### 6b. Chapter rail, active state (`ChapterRail.tsx`)
```tsx
"use client";
import { motion } from "motion/react";
import { useActiveChapter } from "./useActiveChapter";

export function ChapterRail({ chapters }: { chapters: { id: string; label: string; name: string }[] }) {
  const active = useActiveChapter();
  return (
    <nav aria-label="Chapters" className="fixed right-2 top-1/2 z-40 hidden -translate-y-1/2 md:block">
      <ol className="flex flex-col gap-1">
        {chapters.map((c) => (
          <li key={c.id}>
            <a href={`#${c.id}`} aria-current={active === c.id ? "true" : undefined} className="relative isolate grid min-h-11 min-w-11 place-items-center border-2 border-ink text-sm aria-[current=true]:text-paper">
              {active === c.id && <motion.span layoutId="rail-ink" className="absolute inset-0 -z-10 bg-ink" />}
              {c.label}<span className="sr-only">: {c.name}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
```
- `layoutId` is the right tool here, unlike §1: both ends live in the same fixed container, so the ink block slides between tabs with no scroll-measurement issues. **Reduced motion**: `MotionConfig` disables layout animation, so the block jumps. **Perf**: one transform per chapter change. Add `html { scroll-behavior: smooth }` under `prefers-reduced-motion: no-preference` for the anchor jumps. The mobile "Ch.4 / 5" pill can reuse `useActiveChapter()` as is.

## Open items for Engineering
- Ranges in §1 are tuned for a `100svh` cover and the 1200 × 1600 pose canvas. Re-tune the clip split (40/60) and the tear position against the real art.
- Tokens assumed: `--ink`, `--paper`, utilities `bg-ink`, `border-ink`, `text-paper`, and the classes `.bubble` and `.sfx`. Take their final names from `03-design-spec.md`.

---

# Character Build & Chapter Travel (RND-004)
Status: DONE · 2026-10-02 · All code below was type-checked against a scratch copy of the real `src/types/index.ts` + `src/data/chapters.ts` (plus the proposed `perch` field) and linted with the project eslint config (0 problems). `perchToXY` passes its assert check. Nothing in `src/` was edited.

## 7. Building the character so it feels alive
| Option | Life it buys | Extra art | Engineering | Perf | Verdict |
|---|---|---|---|---|---|
| a) Pose swaps (one WebP per pose) + motion transforms | Leaps, squash/stretch, lean, breathing: whole-body life only; the face is frozen | None | Lowest | Best: one `<img>` | Base layer |
| **a+) Pose swaps + 2 face overlays per pose** | a) **plus** blinking and a mouth flap synced to the typewriter. That's most of the "alive" read at a 200px render size | 2 tiny transparent overlays per pose (~2-5 KB each) | +2 `<img>` + 3 CSS keyframes | Overlays toggle `opacity` with `steps()`: compositor only | **PICK** |
| b) Layered rig (body/head/arm/eyelids/mouth) | Adds an arm-wave loop and head tilt | ~5 parts × 7 poses = 35+ cut parts with overlap-painted joints, pivot coordinates, and a matching cut line per pose | High: per-part pivots, seam bugs on rotation | 5-6 layers per pose | Not worth it: 3-5× the art cost, AI kits can't cut clean parts consistently, and the arm motion barely reads at 200px. Fake the wave with a 2-frame overlay (below) |
| c) Inline SVG with grouped `<g>` parts | Same as a+ via `<g class="blink">`/`<g class="flap">`, no extra files | Groups named in the SVG | Same CSS as a+ | Traced manga art is often 100-500 KB / thousands of paths: bloats HTML, isn't cached, slow first raster | Only if the art arrives as clean SVG < 30 KB per pose. The same CSS applies to the `<g>`s |

**Deliverables for a+ (artist or AI art kit).** Every file uses the same canvas and registration as its base pose (1200 × 1600; `02` 1600 × 1600; `07` 512 × 512) with a transparent background:
| File | Poses | Content |
|---|---|---|
| `<pose>.webp` | 01-07 (placeholders exist) | Base pose as a **color master** (§8.5 derives B&W with `grayscale`) |
| `<pose>.blink.webp` | 01, 03, 04, 05, 06, 07 | Closed eyelids only (painted over the open eyes); everything else transparent |
| `<pose>.talk.webp` | 01, 04, 05, 06, 07 | Open mouth only; everything else transparent |
| `01-wave-hello.arm2.webp` (optional) | 01 | Waving arm at its 2nd angle, for a 2-frame wave loop (same `steps()` trick as blink) |
| `08-leap.webp` (optional) | new | Mid-air stretched pose. Without it, `enterPose ?? 03-walk` is shown in the air |
| `<pose>.bw.webp` (optional) | any | Hand-inked B&W version, only if `grayscale(1)` of the color master looks muddy |
| Layered PSD/CSP source | all | So overlays can be re-cut later |

**Face overlays recipe** (inside `.guide-alive` in `Traveler`, after the base image; raw `<img>` so preload URLs match):
```tsx
<img src={`/guide/${pose}.blink.webp`} alt="" className="blink absolute inset-0 size-full object-contain" />
<img src={`/guide/${pose}.talk.webp`} alt="" className="flap absolute inset-0 size-full object-contain"
  style={{ animationIterationCount: Math.ceil((section.guide.line.length * 0.03) / 0.24) }} /> {/* flaps while 30ms/char types */}
```
```css
.guide-alive { animation: breathe 2.8s ease-in-out infinite alternate; transform-origin: bottom; }
@keyframes breathe { to { scale: 1 1.015; } }      /* `scale` property: no clash with motion's transform on the parent */
.blink { opacity: 0; animation: blink 4.2s steps(1) infinite; }
@keyframes blink { 0%, 95% { opacity: 0; } 96%, 98% { opacity: 1; } }
.flap { opacity: 0; animation: flap 0.24s steps(1); }
@keyframes flap { 50% { opacity: 1; } }
.bubble-life { animation: bubble-life 5.3s forwards; }   /* design spec: bubble auto-hides after 5s */
@keyframes bubble-life { 0% { opacity: 0; scale: 0.85; } 5%, 94% { opacity: 1; scale: 1; } 100% { opacity: 0; visibility: hidden; } }
@media (prefers-reduced-motion: reduce) { .guide-alive, .blink, .flap, .bubble-life { animation: none; } }
```
Infinite breathing and blinking are decorative. "Hide guide" is the WCAG 2.2.2 pause control, and reduced motion turns them off. Overlay `<img>` lines need `{/* eslint-disable-next-line @next/next/no-img-element */}`.

**Pose transitions, the manga way. Pick: squash/stretch on takeoff and landing + an ink-poof that hides the swap.**
- Crossfade: rejected. Two half-transparent bodies read as a ghost, not manga.
- Smear frame: needs a drawn smear per transition (art cost).
- Ink-poof (ドロン cloud): this is how manga hides a costume or pose change. It's 7 SVG blots doing `scale`/`opacity` for 280 ms, re-keyed on every pose change, and the swap happens under it. Squash/stretch (`scaleY` with inverse `scaleX`) is free and sells weight.
```tsx
// InkPoof.tsx
"use client";
import { motion } from "motion/react";

// Manga ドロン cloud. Re-keyed on every pose change: it hides the swap frame, so there's no double image.
const BLOTS = [[20, 50, 16], [42, 30, 20], [66, 34, 17], [84, 56, 14], [34, 70, 18], [62, 72, 19], [50, 52, 22]];
export function InkPoof() {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      className="pointer-events-none absolute inset-0 size-full"
      initial={{ scale: 0.5, opacity: 1 }}
      animate={{ scale: 1.4, opacity: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      {BLOTS.map(([cx, cy, r]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="var(--paper)" stroke="var(--ink)" strokeWidth={2} />
      ))}
    </motion.svg>
  );
}
```

## 8. Chapter travel: one fixed layer, leaps between perches
**Pick: the chapter observer (§2a) sets the target perch, and `animate()` flies the layer there on a keyframed arc.** I rejected a scroll-scrubbed path (`useScroll` + `useTransform` keyed to measured chapter offsets) for three reasons: he'd hang mid-air whenever the reader stops scrolling, the offsets need re-measuring on every resize, font or image load, and fast flings teleport him. Event-driven leaps are time-based, always land, and interrupt cleanly, because a newer `animate()` on the same motion value stops the old one. `useScroll` still adds life: scroll velocity → spring → a ±6° lean.

### 8.1 Storyboard (desktop)
```
 SCROLL    SECTION (mode)            GUIDE ACTION                                PERCH / MOVE
 ──────────────────────────────────────────────────────────────────────────────────────────────
 0         COVER (color)             01 wave-hello  "Hello!"     ┌──────────┐   inside hero panel (§1a)
                                                                 │   \o/    │
 p .15-.3  cover scrolls             02 break-out: tear, cracks  │ ▔▔╲o╱▔▔  │   BreakOut (§1b) + バリッ
                                     + one impact frame          └───/ \────┘
 p .5      hand-off                  hero copy fades; fixed layer jump-cuts to center/mid (invisible)
 ──────────────────────────────────────────────────────────────────────────────────────────────
 Ch.1      The Beginning (bw)        crouch, arc ⌒, poof, 04 point             left  mid    peek   |o
 Ch.2      Academy Arc (bw)          ⌒ leap across, 05 think                    right top    ledge  o? on ▔▔▔
 Ch.3      First Quest (duo)         ⌒ 04 point                                 left  bottom free
 Ch.4      Forging the Blade (duo)   ⌒ 04 point                                 right mid    peek   o|
 Ch.5      The AI Arc (COLOR)        ⌒ in 03 walk, lands 04 point;             left  top    ledge
                                     grayscale -> color over 700ms  "And then the world got color."
 Gaiden    Side Stories (color)      ⌒ 04 point                                 right bottom free
 Status    Status Window (night)     ⌒ 05 think (grayscale again)               left  mid    peek
 Finale    To Be Continued (color)   flat walk in 03 walk to the CTA, 06 wave-bye   center bottom walk
                                     "...written with you."      [ Send ] o/     target [data-guide-target]
 MOBILE   64px bust bottom-left, 16px hop per chapter, tap for bubble.
 REDUCED  no travel: jump cut to each perch, 300ms pose fade, no poof/lean/idle loops.
```

### 8.2 Data: proposed `guide.perch` (proposal only; the Senior Dev owns `src/types` + `src/data/chapters.ts`)
```ts
// src/types/index.ts: add `perch?: Perch` to Guide ({ pose, line, enterPose?, perch? })
/** Viewport-relative perch of the one fixed guide layer (desktop). */
export type Perch = {
  side: "left" | "right" | "center";
  y: "top" | "mid" | "bottom";
  /** peek = half off-screen from the gutter; ledge = stands on a drawn panel-border strip; free = standing. */
  spot: "peek" | "ledge" | "free";
  /** leap = jump arc (default); walk = flat walk (finale); none = jump cut (cover). */
  move?: "leap" | "walk" | "none";
  /** Optional CSS selector to land beside (finale CTA). Measured once on landing; wins over side/y. */
  target?: string;
};
```
Values per the storyboard (a missing `perch` falls back to `DEFAULT_PERCH` = right/bottom/free): `cover {center,mid,free,move:"none"}` · `the-beginning {left,mid,peek}` · `academy-arc {right,top,ledge}` · `first-quest {left,bottom,free}` · `forging-the-blade {right,mid,peek}` · `the-ai-arc {left,top,ledge}` · `gaiden {right,bottom,free}` · `status-window {left,mid,peek}` · `finale {center,bottom,free,move:"walk",target:"[data-guide-target]"}`. Put `data-guide-target` on the finale's contact CTA. The section contract is unchanged (§0): `<section id={part.id} data-chapter={part.id}>`.

### 8.3 Perch math (`perch.ts`) + its one check
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
// perch.check.ts: `node --experimental-strip-types perch.check.ts` prints "perch ok" (verified)
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

### 8.4 Travel engine (`useLeap.ts`): arc, squash/stretch, pose state machine
The state machine runs `perched(pose)` → section change → `airborne(enterPose ?? "03-walk")` → land → `perched(new pose)` + poof + bubble. A newer section mid-air restarts it from the current position, so it can't get stuck.
```ts
"use client";
import { useEffect, useState } from "react";
import { animate, useMotionValue, useReducedMotion } from "motion/react";
import type { Perch } from "@/types";
import { GUIDE_H, GUIDE_W, perchToXY } from "./perch";

// Moves the fixed guide layer to `perch` whenever the active section `id` changes.
export function useLeap(id: string, perch: Perch) {
  const reduce = useReducedMotion();
  const x = useMotionValue(-200), y = useMotionValue(300), sy = useMotionValue(1);
  const [airborne, setAirborne] = useState(false);
  useEffect(() => {
    const place = () => {
      const r = perch.target ? document.querySelector(perch.target)?.getBoundingClientRect() : undefined;
      return r ? { x: r.left - GUIDE_W - 16, y: r.bottom - GUIDE_H } : perchToXY(perch, innerWidth, innerHeight);
    };
    const onResize = () => { const p = place(); x.jump(p.x); y.jump(p.y); };
    addEventListener("resize", onResize);
    const off = () => removeEventListener("resize", onResize);
    const { x: tx, y: ty } = place();
    if (reduce || perch.move === "none" || !matchMedia("(min-width: 768px)").matches) { onResize(); return off; } // jump cut
    let live = true;
    const walk = perch.move === "walk", d = walk ? 1.2 : 0.6;
    const peak = walk ? ty - 8 : Math.min(y.get(), ty) - 120; // arc apex above the higher end
    (async () => {
      setAirborne(true);
      if (!walk) await animate(sy, 0.85, { duration: 0.08 }); // anticipation crouch
      await Promise.all([
        animate(x, tx, { duration: d, ease: walk ? "linear" : [0.3, 0, 0.3, 1] }),
        animate(y, [y.get(), peak, ty], { duration: d, times: [0, 0.45, 1], ease: ["easeOut", "easeIn"] }),
        animate(sy, walk ? 1 : [1.12, 1], { duration: d }), // stretch in the air
      ]);
      if (!live) return; // a newer chapter took over mid-air; its animate() already stopped ours
      setAirborne(false);
      animate(sy, [0.86, 1], { type: "spring", stiffness: 500, damping: 14 }); // landing squash
    })();
    return () => { live = false; off(); };
  }, [id, perch, reduce, x, y, sy]);
  return { x, y, sy, airborne, reduce };
}
```
- **Arc**: `x` eases across while `y` runs `[start, apex, target]` keyframes, with ease-out going up and ease-in coming down, which gives a parabola. The walk is the same call with an 8px bob and linear `x`. `perch` objects are module constants from `chapters.ts`, so the deps are stable.

### 8.5 The layer (`Traveler.tsx`): pose swap, B&W → color, bubble, scroll lean
```tsx
"use client";
import { AnimatePresence, motion, useScroll, useSpring, useTransform, useVelocity } from "motion/react";
import type { Part } from "@/types";
import { InkPoof } from "./InkPoof";
import { DEFAULT_PERCH, GUIDE_H, GUIDE_W } from "./perch";
import { Typewriter } from "./Typewriter";
import { useLeap } from "./useLeap";

export const poseSrc = (pose: string) => `/guide/${pose}.webp`;

// The one fixed character layer (desktop). Mobile + toggle live in GuideDock.
export function Traveler({ section, hidden }: { section: Part; hidden: boolean }) {
  const perch = section.guide.perch ?? DEFAULT_PERCH;
  const { x, y, sy, airborne, reduce } = useLeap(section.id, perch);
  const sx = useTransform(sy, (v) => 2 - v); // keep volume: squash = wider, stretch = thinner
  const { scrollY } = useScroll();
  const lean = useTransform(useSpring(useVelocity(scrollY), { stiffness: 300, damping: 40 }), [-3000, 3000], [-6, 6]);
  const pose = airborne ? (section.guide.enterPose ?? "03-walk") : section.guide.pose;
  const show = section.id !== "cover" && !hidden; // cover: BreakOut owns him
  return (
    <motion.div aria-hidden style={{ x, y, scaleX: sx, scaleY: sy, rotate: reduce ? 0 : lean, width: GUIDE_W, height: GUIDE_H }}
      animate={{ opacity: show ? 1 : 0 }} className="pointer-events-none fixed left-0 top-0 z-40 hidden origin-bottom md:block">
      <div className={`guide-alive relative size-full transition-[filter] duration-700 ${section.colorMode === "color" ? "" : "grayscale"}`}>
        <AnimatePresence initial={false}>
          <motion.img key={pose} src={poseSrc(pose)} alt="" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0.3 : 0.05 }} className="absolute inset-0 size-full object-contain" />
        </AnimatePresence>
        {!reduce && <InkPoof key={pose} />}
        {perch.spot === "ledge" && <span className="absolute -bottom-1 -left-1/4 h-1 w-[150%] bg-ink" />}
      </div>
      {show && !airborne && (
        <p key={section.id} className={`bubble bubble-life absolute bottom-full mb-2 w-max max-w-[280px] ${perch.side === "right" ? "right-1/3" : "left-1/3"}`}>
          <Typewriter text={section.guide.line} />
        </p>
      )}
    </motion.div>
  );
}
```
- **Ch.5 color**: the art ships as color masters. Sections whose `colorMode` isn't `"color"` (bw/duo/night) get `grayscale` on the inner 150×200 box, and entering Ch.5 transitions it off over 700 ms (steady state is free). The story then reads B&W in Ch.1-4 → color in Ch.5, with color on the cover, Gaiden and finale. That's one art set, not two. If grayscale looks muddy, ship `<pose>.bw.webp` files and pick the file by mode in `poseSrc`.
- **Bubble**: re-keyed per section, so it re-types, flaps, and auto-hides after 5 s. Design spec §9 makes the guide `aria-hidden` (every line's facts are in the section copy), so the bubble isn't announced. That's intended.

### 8.6 Owner, mobile, toggle, preload (`GuideDock.tsx`, replaces §2c; mount once at the end of `page.tsx`)
```tsx
"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { chapters, parts } from "@/data/chapters";
import type { Part } from "@/types";
import { poseSrc, Traveler } from "./Traveler";
import { Typewriter } from "./Typewriter";
import { useActiveChapter } from "./useActiveChapter";

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
        <AnimatePresence mode="wait">
          {id !== "cover" && !hidden && ( // mobile: re-keyed per chapter = a small hop
            <motion.div key={id} animate={{ y: [0, -16, 0] }} exit={{ opacity: 0, transition: { duration: 0.1 } }} className="flex items-end gap-2 md:hidden">
              <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Guide: show message" className="relative size-16 overflow-hidden rounded-full border-[3px] border-ink bg-paper">
                <Image src="/guide/07-bust.webp" alt="" fill sizes="64px" />
              </button>
              {open && <p className="bubble max-w-56"><Typewriter text={s.guide.line} /></p>}
            </motion.div>
          )}
        </AnimatePresence>
        {id !== "cover" && <button type="button" aria-pressed={hidden} onClick={() => setHidden((h) => !h)} className="min-h-11 px-3 text-sm underline">{hidden ? "Show guide" : "Hide guide"}</button>}
      </aside>
    </>
  );
}
```
- **Mobile (<768px)**: `Traveler` is `display:none`, and `useLeap` jump-cuts (no animation work). The 64px bust hops 16px each chapter, and the bubble opens on tap.
- **Reduced motion**: no travel (jump cut to each perch), no poof, no lean, no idle loops. The pose fades over 300 ms per chapter, and `MotionConfig` drops the mobile hop.
- **Hide guide**: one toggle hides both the traveler and the mobile head, and it doubles as the pause control for the idle loops. There's no persistence across reloads (add `localStorage` if asked).

### 8.7 Perf budget (target: 60 fps on a mid-range Android, Moto G / Galaxy A class)
- **One composited layer**: x, y, scaleX, scaleY and rotate collapse into a single `transform` write per frame. Opacity and the `steps()` overlays stay on the compositor. The one filter is a static `grayscale` on a 150×200 box, transitioned once.
- **JS per frame**: motion's rAF loop only runs during a 0.6 s leap and while the lean spring settles, well under 1 ms per frame. There are no scroll listeners (one IntersectionObserver). The only layout read is a single `getBoundingClientRect` on the finale landing.
- **Bytes**: on screen at once, one pose ≤80 KB + overlays ~5 KB. The next section's `pose` + `enterPose` are preloaded on arrival, so swaps never flash blank. Total guide art is ~0.6 MB, spread lazily across the scroll. Mobile loads only the 512px bust.
- **Verify**: DevTools Performance at 4× CPU throttle should show no long tasks and no "Layout" in leap frames. Then check on a real device via remote debugging.

### 8.8 Conflicts for the coordinator
- **Design spec §7-8**: it specifies one `GuideCharacter` with a shared `layoutId="guide"` for the dock hand-off. This cookbook uses a fixed layer + `animate()` instead (reasons in §1 and §8). The spec's "Break-out 0.6-1 … layoutId hand-off" row should be updated.
- **Pose file format**: the `PoseId` comment in `src/types` says `public/guide/<id>.svg`, but `public/guide/` holds `.webp`. The recipes use `.webp`.
- **Dock hiding**: hiding the guide over the footer and while a form field has focus (design spec §9) isn't implemented. Add a `focusin`/`focusout` listener on the contact form if QA wants it.
