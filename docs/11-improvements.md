# 11 · Improvements to look premium (RND-009)

Evidence: `final-full-1440-*.png`, `final-full-390.png` (captured 04:03, just before the art-free pass), `08-reference-analysis.md`,
`src/app/page.tsx`, `src/components/**`. No characters anywhere. No new deps: GSAP 3.15 (SplitText, ScrollTrigger, MotionPath) is enough.
Ranked by impact ÷ effort. S = under 1h, M = half day, L = a day.

**1. Fill the holes the art left with "object splash" panels (S-M, highest impact).** Weak: the cover right column, the Ch.1 PISTOL panel
and the Ch.2-4 title panels were built around a figure; without it the cover reads as half a page and the title panels have empty art slots.
Fix: give each slot a non-character subject rendered in the same ink style: a giant SFX word as the art (`.sfx` at `clamp(8rem,22vw,18rem)`,
cropped by the panel edge, `rotate(-8deg)`), with `.speedlines` focused on it and a `.tone` gradient. Cover: scale the poster up (col-span-5 to 6,
`rotate(2.5deg)` plus a nail/rope hang shadow `drop-shadow(14px 18px 0 rgb(26 22 18/.25))`) so it IS the hero visual. Files: `page.tsx`, `chapter-spread.tsx`, `globals.css`.

**2. Lock a real type scale and caption quality (S).** Weak: record titles (`text-xl/2xl`) are tiny next to 6rem chapter titles; body is 16px Archivo
at long measure; Comic Neue captions at 0.95rem look cheap; the Ch.5 record leaves the right half empty. Fix: tokens in `@theme`:
`--text-display clamp(3rem,7vw,6.5rem)`, `--text-h2 clamp(2.4rem,5vw,4.5rem)`, `--text-h3 clamp(1.5rem,2.4vw,2.1rem)`, body `1.0625rem/1.65`,
`max-w-[62ch]`. Captions 1.05rem, `letter-spacing:.03em`, `line-height:1.3`, `font-stretch` none. Record highlights go `md:columns-2` when > 3 items.
Files: `globals.css`, `chapter-spread.tsx`, `chapter-header.tsx`.

**3. Product bento with a hero number per tile (S).** Weak: Ch.5 tiles (AI Meeting Assistant, Material Management) are flat colour blocks with
empty bottoms. Fix: each tile gets its metric as a display numeral (`-50%`, `-45%`, `10k+`, `-40%`) in `font-display text-[clamp(3rem,6vw,5.5rem)]`
anchored bottom-right, `-webkit-text-stroke` ink, plus a `.tone` corner; add `metric` to the product data. Files: `chapter-spread.tsx`, `data/chapters.ts`, `types`.

**4. Panel and card micro-interactions (S).** Weak: chapter panels and products have no hover; project cards only de-grayscale; buttons just nudge.
Fix: `.panel,.cut` hover = `translate(-3px,-3px)` with ink shadow growing 4px to 8px (`transition: 260ms cubic-bezier(.2,.9,.1,1)`); project image
`scale(1.04)` + speedlines layer fading in behind the title; `.btn` gets a straw/ink fill wipe (`::before` `clip-path: inset(0 100% 0 0)` to `inset(0)`)
and `:active` stamp. Desktop only (`@media (hover:hover)`). No custom cursor (a11y/perf); instead a pointer-tracked tone spotlight on the
lead project card via `--mx/--my` set by one `gsap.quickSetter`. Files: `globals.css`, `project-card.tsx`.

**5. Anime "eyecatch" between chapters (M, the big no-art wow).** Weak: chapters butt together with a 3px rule; same pacing every time.
Fix: a 70svh interstitial before Ch.2-5: ink field, huge chapter numeral + vertical katakana + "Gear N", a straw circle wipe
(`clip-path: circle(0%)` to `circle(75%)`) scrubbed by ScrollTrigger (`start:"top top"`, `pin:true`, `end:"+=60%"`), chars via SplitText
`back.out(1.7)` stagger .03. Mobile: plays once, no pin. Reduced motion: static card. Files: new `motion/eyecatch.tsx`, `page.tsx`.

**6. Vary the four chapter compositions (M).** Weak: Ch.1-4 repeat one template (title panel + offset captions + record + bursts), mirrored;
by Ch.4 it reads as a list. Fix: Ch.1 full-bleed splash title (no box, text on rays), Ch.2 three vertical tier panels (`grid-cols-[2fr_1fr_1fr]`),
Ch.3 diagonal versus split (two `cut` panels sharing one slash, stats in the red half), Ch.4 keep current. Drive by a `layout` field per chapter.
Files: `chapter-spread.tsx`, `data/chapters.ts`.

**7. Choreograph reveals in reading order with one easing language (S-M).** Weak: only title panels animate; records, captions, bursts pop in
statically; mixed easings. Fix: one `[data-panel]` batch reveal (`ScrollTrigger.batch`, `clip-path: inset(0 0 100% 0)` to `inset(0)`,
`expo.out` .8s, stagger .08) ordered title > captions > record > bursts; bursts `scale 0 to 1, back.out(2.2)` with a 2deg overshoot.
Standardise on `power3.out` (moves), `expo.out` (reveals), `back.out` (impacts) in `lib/gsap.ts`. Files: new `motion/panel-reveal.tsx`, `lib/gsap.ts`.

**8. Living cover and finale backdrops (S).** Weak: rays, sea and finale are static wallpaper; finale bottom is now empty after the art left.
Fix: rays layer rotates 360deg in 240s (CSS, transform only, off under reduced motion); sea SVG gets a second wave path translating `-50%` in 9s
loop, plus a small ink ship riding it via MotionPath; finale ends on an anime end card: "To be continued" arrow wipes in from left on enter
with a `DON!` beat, then "End of Vol. 1". Files: `page.tsx`, `globals.css`.

**9. Status Window: fewer chips, more hierarchy (S-M).** Weak: 9 boxes x 60+ equal chips reads like a dashboard; nothing is emphasised.
Fix: top row = 3 "signature skills" (LLM/RAG, Full stack, System design) as big straw display words with one-line proof; remaining groups
as compact chips. Enter effect: window frame draws (border `scaleX` from 0) then rows type on with a 1-frame scanline. Files: `page.tsx`, `skill-group.tsx`, `data/skills.ts`.

**10. Mobile: cut the 20,000px scroll and the double-row nav (M).** Weak: 390px page is ~20k px; sticky nav takes 2 rows (~100px); route is
8 stacked cards; 160px stat bursts. Fix: nav one row (logo + gear + current chapter label + resume; pips move into a `<details>` sheet);
route becomes a horizontal `snap-x` strip of islands; record highlights beyond 3 into `<details>` "Full log"; bursts `w-28`;
captions full-bleed with no rotation. Files: `chapter-nav.tsx`, `page.tsx`, `chapter-spread.tsx`, `stat-list.tsx`.

Skipped on purpose: ScrollSmoother (fights the existing pins; add only if scroll feels light after #5/#7), custom cursor, any new font download
beyond what `next/font` already loads.
