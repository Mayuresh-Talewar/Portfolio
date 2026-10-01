---
name: op-portfolio-design
description: Design + build rules for Mayuresh's ONE PIECE-flavoured "manga of my life" portfolio (Next 16, Tailwind 4, GSAP). Use for any visual, layout, motion or Luffy-rig change to this site, or when reviewing screenshots of it. Upgraded after every design pass; append lessons, don't rewrite history.
---

# OP portfolio design: rules that survived review

## The concept (client, non-negotiable)
Cover → Ch.1–5 (chronological) → Gaiden → Status Window → Finale. Each chapter is a Gear (career power-up). Ch.1–2 B&W ink,
Ch.3–4 ink + red spot, Ch.5 = Gear 5 climax where the page floods into full color. Gear meter in the nav; Grand Line chart nav
with a ship on a MotionPath; wanted-poster profile card; island-arrival chapter titles. Legal: no Oda logo/Jolly Roger/official
art; Luffy only behind `siteConfig.features.luffy`, credit in footer + cover, robots Disallow /art/luffy/, none in OG/meta.

## System (where things live)
- Tokens: `@theme` in `src/app/globals.css` (ink, paper, parchment, straw, jolly, jolly-ink for red TEXT, sea, sea-deep, foam).
  Print modes via `data-mode` on `<section>` set `--page/--spot/--spot-text`. Shapes: radius 0 everywhere; only bubbles are round.
- Fonts (layout.tsx, next/font): Dela Gothic One = logotype/titles, Bangers = SFX only, Comic Neue bold caps = manga captions
  and bubbles, Archivo (wdth axis) = body/UI. Katakana falls back to system JP gothic (decorative, aria-hidden).
- Utilities: `.cut .cut-a|b|c|d` diagonal panels (ink ::before + inset fill ::after sharing one clip shape = true slanted
  border; panel color via `--panel-bg`), `.caption`, `.bubble`, `.ribbon`, `.sfx` (paint-order stroke), `.logotype`, `.btn-*`,
  textures `.tone .speedlines .rays .parchment .chart-grid`. Grain = one fixed body::after, never on scrolling layers.
- Composition: one `ChapterSpread` per chapter = dominant island-arrival title panel (8 cols) + narration column (4 cols,
  captions overlap the panel edge) + record panel + burst stats; flip every other chapter. Ch.5 opens with the pinned `GearFive`.
- Motion leaves in `src/components/motion/*` and `src/components/luffy/*`; everything else is a server component.

## Lessons (append-only)
1. Compose PAGES, not sections: one dominant panel per spread, diagonal cuts, lettering overlapping panel edges. Stacked
   web sections with eyebrow + h2 + grid read as "template dressed as manga" (rejected once already).
2. The cover must answer the recruiter in one glance: logotype name, red ribbon title, Resume + Contact, all above the fold at
   390px. Size the logotype to its column (≈6.6vw desktop, 12vw mobile); at 10vw it collided with the poster.
3. tailwind-merge trap: `cn("leading-x", "text-[size]")` DROPS the leading. Put `leading-*` after any `text-*` size in cn().
4. Tailwind 4 `rotate-/scale-/translate-` utilities stack with GSAP transforms. Never put them on an element GSAP transforms;
   put static tilt on a wrapper instead.
5. SplitText with `mask: "words"` clips Dela's tall glyphs at leading 0.92. Animate unmasked chars and `split.revert()` on
   complete so the final DOM is the plain heading.
6. Gear 5 flood: drive one CSS var `--flood` (0→1) on the section from the scrubbed timeline; unset = full color, so no-JS and
   reduced motion get the finished page. Section backdrop uses opacity(--flood), the pinned splash a clip-circle(--flood).
   Toggle `data-flooded` at progress 0.6 for panel colors (stylesheet !important beats inline custom props).
7. Pins: Gear 5 splash (desktop +110%), Gomu Gomu panel (+110%), Gaiden horizontal strip. Lazy pins created after first paint
   need `refreshPriority` + `ScrollTrigger.sort(); refresh()`. Measure layout only after a full scroll pass (heights jump).
8. Mobile nav: 9 islands x 40px fit 390 only if the top row (logo + meter + Resume) stays ≤ 366px. Check
   `document.documentElement.scrollWidth === innerWidth` at 390 after every nav change.
9. Gear meter: a skewed CSS gauge (filled segments), never glyph boxes or `<meter>` styling: empty skewed boxes read as tofu.
10. Luffy art (Art Studio SVGs, viewBox 600x800, stable ids): display via next/image `unoptimized`; animate parts only through
    `LuffyRig`, which fetches by path lazily, namespaces ids per instance, and keeps the static image as fallback (reduced
    motion, no JS, missing file, fetch error). Code against ids optionally: a missing part just skips that behavior.
11. The rig stores rest poses as `transform="rotate(n)"` + CSS transform-origin. Run `adopt()` before tweening a group, or
    GSAP re-bases it to origin 0,0 and the part jumps. svgOrigin on freshly created/cloned nodes produced absurd translates:
    for generated geometry, tween attributes (`attr: { width }`) and set transform strings yourself.
12. Rubber stretch that looks right: hide the resting upper arm (keep the sleeve cap), grow a dedicated tube from the shoulder
    by its width attribute (ink weight stays exact), and slide a cloned, enlarged fist along the tube end. Never scale the
    real arm: non-uniform scale smears the ink and the nested fist.
13. One Luffy per moment: Ch.1 = Gomu Gomu panel only, Ch.2–4 = transformation in the title panel (prev Gear → this Gear:
    squash, white flash, swap, elastic overshoot, hat/hair follow-through, laugh), Ch.5 = splash swap under the flash, cover =
    hello wave, finale = goodbye wave. Keep art inside the diagonal cut: bottom offset `calc(var(--cut) + 6px)`.
14. Idle loops (breathing, blink) only after the entrance and only while on screen (IntersectionObserver pause).
15. Verification: headless Edge `--virtual-time-budget` does not advance GSAP (rAF), so GSAP from-states look hidden there.
    Use the CDP script (real time, 900/735px viewports, scroll through to fire triggers, then capture) for motion review, and
    `--force-prefers-reduced-motion` / CDP emulated media for the static full page. A background Chrome tab also freezes GSAP
    (document.visibilityState === "hidden"); that's the environment, not a bug.
16. Duotone project screenshots (grayscale + multiply on foam) avoid the "laptop UI card grid" look; color returns on hover/focus.

### DEV-A (object splash + type scale, docs/11 #1-#2)
- Object splash = the chapter's first SFX word as the art: `.sfx` at `clamp(7.5rem,19vw,16rem)` in a `[data-sfx]` wrapper that
  carries the static `±8deg` tilt and bleeds off the top (`-top-[0.06em]`) and the outer edge; the `.cut` clip-path crops it.
  At 22vw/18rem with no top bleed the -8deg word drops into the title block: budget the word to the top ~45% of the panel.
  Kana goes on the INNER side of the word (outer side gets cropped away). Speedlines `--sx/--sy` point at the word; `.splash-tone`
  masks the halftone radially from `--tone-at`. Ch.5 keeps the outlined numeral (its SFX already lives in the Gear 5 splash).
- Type tokens (`@theme`): `text-display`, `text-h2`, `text-h3` (fluid clamps with paired line-heights). Body 1.0625rem/1.65,
  `max-w-[62ch]`; captions/bubbles 1.05rem/1.3, caption tracking .03em. Don't put `text-[size]` on `.caption`: let the class own it.
  Long record lists (>3) go `md:columns-2` + `break-inside-avoid`. tailwind-merge may read `text-h3` as a color: avoid cn() with a color.
- Cover: 6/6 grid, poster wrapper `md:max-w-[29rem]` overriding the figure's own max-w via `[&_[data-poster]]:max-w-none`;
  rope (SVG, non-scaling stroke) + nail ride inside `[data-intro=poster]` so the intro swing moves them; hang shadow is a
  `drop-shadow-[14px_18px_0_rgb(26_22_18/0.25)]` on the tilted wrapper.
- `min-h-[100svh]` cover makes `--window-size=1440,16000` screenshots useless (cover fills it). Use the CDP script with a real
  900px viewport + `captureBeyondViewport` for full pages; keep per-dev output in its own scratchpad subfolder.

### DEV-B (eyecatch + one easing language, docs/11 #5 #7)
- Easing: `src/lib/motion.ts` owns `EASE` (move power3.out, reveal expo.out, impact back.out(2), exit power2.in, swing
  power3.inOut), `DUR` and `STAGGER`. New tweens import from there; only scrubs (`none`) and gear character eases (G1 elastic,
  G4 bounce, G5 rubber wobble, poster pendulum) stay literal, because they ARE the gear.
- Eyecatch (`components/eyecatch.tsx`, CSS `/* DEV-B */`): ink field + paper-outlined numeral, then a `.ec-wipe` circle
  (0% to 75%, covers the corners at both 1440 and 390) onto `--ec-bg` = paper for bw chapters, jolly for duo (print modes beat
  "straw wipe"). Desktop pinned at `top 59px` (nav height) `+=60%`, scrubbed; mobile plays once. Skipped before Ch.5: two
  back-to-back fullscreen pins is one too many, and the Gear Five splash already is that chapter's eyecatch. Keep the
  pre-wipe beat visible at progress 0 (no autoAlpha on the numeral) or the card enters as a blank black hole.
- Reading-order reveal lives in ArrivalFx (it already owns the spread): `ScrollTrigger.batch` over `[data-caption],[data-panel]`
  (DOM order = reading order), `clip-path: inset(0 0 100% 0)` to `inset(0 0 0% 0)` + `clearProps` (else the ink box-shadows
  stay clipped); bursts `[data-burst]` scale 0 + -8deg to EASE.impact. clip-path is not a transform, so tilt utilities are safe.
- CDP capture for pins: scroll to the pin-spacer's top minus the nav, then step `frac * pinDistance`; a fixed sleep after each
  scroll (scrub 0.5) is enough. Worktrees have no node_modules and Turbopack rejects a junction to the main one: `npm ci`.
