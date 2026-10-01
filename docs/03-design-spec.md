# Design Spec — "Vol. 1: Mayuresh Talewar" (DES-003)
Status: REV 2 after CD-001, FOR RE-REVIEW · Owner: Design Studio · 2026-10-02 · Inputs: `01`, `02` (§7), `04-motion-cookbook.md`, `06-character-art-kit.md` · Preview: `docs/design-preview.html`

**Design Read:** developer portfolio for AI/full-stack recruiters, told as a printed manga volume (ink-on-paper chapters that gain color as the story reaches the present), raw shōnen-print language, built with native CSS + Tailwind 4 `@theme`; animation stack per client: GSAP + ScrollTrigger (2D in CSS/SVG, Three.js only for 3D). This spec stays library-agnostic.
**Dials:** VARIANCE 7 (diagonal gutters, bleeds; 1 col on mobile) · MOTION 6 (one cover impact, one ink-bleed, quiet elsewhere) · DENSITY 4.
**Character: SKIPPED for Phase 1, not dropped.** Layouts reserve its slots (marked **[P2 slot]**) so it can be added later without a redesign. All character specs live in **Appendix P2**.

## 1. The color arc
The past is ink. Color arrives once he finds his craft.
| Part | Mode | Why |
|---|---|---|
| Cover | **color** | Tankōbon covers are color; it's the recruiter fast path |
| Ch.1 The Beginning, Ch.2 Academy Arc | **bw** (ink + screentone, halftone images) | Origin flashback |
| Ch.3 First Quest, Ch.4 Forging the Blade | **duo** (ink + red spot ink) | Work begins, so the first ink of color appears |
| Ch.5 The AI Arc | **color** (ink-bleed entry) | Present day, the climax |
| Gaiden 外伝 (projects) | **color** spread | Real screenshots need color |
| Status Window (skills) | **night** (always #1B1B1B) | "System window" black page; the only inversion |
| Finale: To Be Continued… | **color** | The future, written with the reader |
Modes are set with `data-mode="bw|duo|color|night"` on `<section>`; components read tokens and never hardcode colors.

## 2. Color tokens (`globals.css` → `@theme`), all measured WCAG 2.x
| Token | Light (default) | Night edition | Use | Contrast |
|---|---|---|---|---|
| `--color-paper` | `#F4F4F1` | `#1B1B1B` | page / panel fill | ink on paper 15.6:1 |
| `--color-ink` | `#1B1B1B` | `#F4F4F1` | text, frames, obi band | — |
| `--color-ink-muted` | `#5A5A5A` | `#B4B4AE` | captions, meta | 6.3:1 / 8.3:1 |
| `--color-accent` | `#D1172F` Shōnen red | `#FF6B6B` | CTA, active tab, spot ink | 4.9:1 on paper / 6.2:1 on ink |
| `--color-on-accent` | `#FFFFFF` | `#1B1B1B` | CTA label | 5.4:1 / 6.2:1 (measured: `#1B1B1B` on `#FF6B6B` = 6.21) |
| `--color-cyan` | `#0B6AA0` print cyan | `#6FB3DE` | color-chapter fills, misregistration | white 5.9:1 |
| `--color-yellow` | `#FFD400` process yellow | `#FFD400` | bursts, marker under ink | ink 12.0:1, never a text color |
| `--color-cyan-wash` / `-yellow-wash` / `-red-wash` | `#E3F1F7` / `#FFF4D6` / `#FFE9E6` | **`#1B1B1B`** (washes off) | panel backgrounds under ink | ink ≥14.8:1 |
- **Light (paper) is the default regardless of OS.** Night edition is opt-in: header button with a constant label "Night edition", `aria-pressed` toggles `data-theme="dark"` on `<html>`, remembered in localStorage. No `prefers-color-scheme` auto-switch.
- **Night rule:** every dark panel is `#1B1B1B`. No navy, no olive, no tinted darks. Color survives only as small solid spot-ink fills (CTA, active tab, bursts, marker underline).
- Accent lock: red is the only accent. Cyan/yellow are process inks, used only inside `color` chapters and never on CTAs. Chromatic hues stay in 0-50° / 195-205°.
- **Banned palettes** (ui-ux-pro-max `colors.csv` AI rows + taste-skill): purple/violet/indigo (`#7C3AED` `#6366F1` `#A78BFA`), blue→purple / pink→purple gradients, neon cyan+magenta, glow on dark navy (`#0F172A` `#1E1B4B`), Tailwind slate+indigo, lavender washes (`#FAF5FF`), mesh/aurora blobs, glass tints, beige+brass, old-site lime `#eef8ce`.

## 3. Typography (Google Fonts via `next/font`, all OFL, verified in google/fonts `ofl/`)
| Role | Font | Size | Notes |
|---|---|---|---|
| Cover `h1` (the ONLY h1) | Dela Gothic One | `clamp(2.25rem, 4vw, 3.75rem)` | lh 1.02 |
| **Obi title band** | Dela Gothic One on ink | `clamp(1.5rem, 2.6vw, 2.25rem)` | "Full Stack Engineer (AI/LLM)", paper on ink |
| Chapter number "Ch.N" | Dela Gothic One, spot red | `clamp(4rem, 11vw, 8.5rem)` | 8px paper text-stroke knocks out the frame it breaks |
| `h2` chapter name / `h3` | Dela Gothic One | `clamp(2rem,4vw,3.25rem)` / `1.5rem` | |
| Body, labels | Zen Kaku Gothic New 400/500/700 | `1.0625rem` | lh 1.65, max 65ch |
| **Bubble + caption lettering** | **Comic Neue 700, ALL CAPS** | `1rem` (min 15px) | lh 1.2, +0.02em. Reads like manga hand-lettering; never body copy |
| Stats, page no., Status Window | JetBrains Mono 500 | stats `1.5-1.75rem`, meta `.8125rem` | |
| SFX (decor) | Dela Gothic One | `clamp(2rem,4.5vw,3.5rem)` | yellow fill, 3px ink stroke, -8°, `aria-hidden` |

## 4. Spacing · radius · border · shadow · texture
- **Spacing** 4px base: `4 8 12 16 24 32 48 64 96`. Panel padding 24 (mobile 20). Section gap 72-96.
- **Radius** 0. By rule: oval bubbles `50%`, thumb tabs `0 6px 6px 0`, mobile pill `9999px`.
- **Border:** `--frame 3px ink`. Hand-inked variant `.rough` (static `feTurbulence` + `feDisplacementMap` scale 3.5 on a pseudo-element frame) is for the cover, chapter titles and the Finale only, never on moving elements. Inner 1.5-2px.
- **Shadow (5):** plain panels have **no shadow, frame only**. Hard `4px 4px 0 ink` (hover 6, press 0 + translate 4px) on **buttons and clickable ProjectCards only**.
- **Screentone:** CSS radial-gradient dots, 4-8px. Never behind text.
- **Paper grain (D):** one fixed `body::after` SVG-noise layer, 3% opacity, `pointer-events:none`, z 70.
- **Misregistration (D):** `text-shadow: -1px 0 cyan, 1px 0 red` on **color-chapter titles only**.
- **z-index:** content 0 · rough frame 3 · cover slot 4 · captions 5 · rail 30 · [P2] guide 40 · progress 50 · dialog 60 · grain 70.

## 5. Panel grid
- `max-w-[1280px]`, 12 cols, gutter = paper 16px (12 mobile). Spans: splash 12, half 6, major 8 / minor 4, third 4.
- **Diagonal gutter cuts (6):** 1-2 per spread. The left panel gets `clip-path: polygon(0 0,100% 0,calc(100% - 44px) 100%,0 100%)`, the right one the mirror plus `margin-left:-44px`. The outline comes from `filter: drop-shadow(±3px)` on a **wrapper** (clip-path would cut a border). Removed below 1024px.
- **Bleed (6):** one image per chapter bleeds 48px past its frame (Gaiden: Shadow Monarch, top-left).
- **[P2 slot] perches:** each chapter keeps ≥ 72px outer gutter on its perch side (Appendix P2 table) and no content in that band.
- LTR Z-reading; DOM order = visual order.

## 6. Per-chapter layout (no character in Phase 1)
| Section | Mode | Layout | Key components | Lettering / impact |
|---|---|---|---|---|
| Cover | color | `major` cover: paper knockout copy column (h1, obi band, pitch) cut diagonally against the art column (cyan wash + focus lines centred on the **[P2 slot]**) holding a ドン burst; `minor` ProfileCard (no name/title: CTAs first, 4 stats, full TOC) | `VolumeCover`, `ObiBand`, `ProfileCard`, `ContentsList` | Caption "VOL. 1. THE STORY SO FAR."; impact on load: focus lines zoom 1.25→1 and burst pops 1.7→1 |
| Ch.1 The Beginning | bw | `ChapterTitle` + half/half, halftone image | `Panel`, `HalftoneImage` | Narrator caption "NAGPUR, 2018…" |
| Ch.2 Academy Arc | bw | major/minor with diagonal gutter, CGPA in mono | `Panel` | — |
| Ch.3 First Quest | duo | wide + 2× half, red spot rule | `Panel` | — |
| Ch.4 Forging the Blade | duo | title page: "Ch.4" breaks the top frame, tapered speed lines on paper (top 58% only), red spot bar | `ChapterTitle` | — |
| Ch.5 The AI Arc | color | ink-bleed entry; Bento (Meeting Assistant major, Smart Email, RAG, MMS); StatBurst row + ドン | `BentoGrid`, `StatBurst`, `HalftoneImage wipe` | Oval callout "CURRENT ARC!" |
| Gaiden | color | Shadow Monarch splash (bleed) + ProjectCards (half) | `ProjectCard` | — |
| Status Window | night | one night panel, 5 groups (auto-fit 200px) | `StatusWindow` | mono SYSTEM header |
| Finale | color | major form + minor shout + **[P2 slot] landing beside Send** (`data-guide-target`) | `ContactPanel` | Shout "THE NEXT CHAPTER IS WRITTEN WITH YOU!" |
Every chapter `h2` is the flavor name, with the plain label + years directly under it. **Bubbles are never attributed to a person** in Phase 1: oval = callouts, caption box = narrator, shout = CTA.

## 7. Components (data from `src/data/*`)
| Component | Props | Notes |
|---|---|---|
| `Panel` | `span`, `cut?: 'right'\|'left'`, `rough?`, `tone?`, `fill?: 'paper'\|'cyan'\|'yellow'\|'red'`, `bleed?`, `pageNo?` | cut ⇒ wrapper drop-shadow outline |
| `ChapterSection` | `id`, `mode`, `chapter`, `perchSide?` ([P2]) | sets `data-mode`, `data-chapter` |
| `ChapterTitle` | `number`, `title`, `label`, `years`, `speedLines?` | number breaks the top frame |
| `VolumeCover` | `name`, `title`, `pitch`, `slot?: ReactNode` | `slot` = [P2] break-out zone, default `ImpactBurst` |
| `ObiBand` | `children` | ink band, Dela, bleeds to the panel's left edge |
| `ImpactBurst` / `StatBurst` | `glyph` / `value`, `label` | yellow starburst, drop-shadow outline |
| `SpeechBubble` | `variant: 'oval'\|'caption'\|'shout'`, `tail?: 'right'\|'left'\|'none'`, `text` | tall oval (≈170×210), small hooked tail, Comic Neue caps |
| `HalftoneImage` | `src`, `alt`, `mode: 'static'\|'wipe'` | bw/duo: grayscale + dots; Ch.5: dot layer wipes off on view |
| `InkBleed` (client) | `children` | Ch.5 entry, see §8 |
| `ProfileCard` | `org`, `location`, `stats`, `ctas`, `chapters` | no name/title (the h1 lives on the cover) |
| `ContentsDialog` | `chapters`, `currentId` | native `<dialog>`, Esc, focus return; also mobile nav |
| `ThumbIndex` (C) | `chapters`, `activeId` | desktop page-edge tabs (1-5, G, S, F), current = red, `aria-current`; mobile → "Ch.4 / 5" pill |
| `ProjectCard` | `title`, `summary`, `href`, `image` | the whole card is the link; halftone→color on hover/focus; hard shadow |
| `StatusWindow` | `groups` | always night, no levels/percentages |
| `ReadingProgress`, `Button`, `ContactPanel` | as v1 | |

## 8. Motion (library-agnostic: transform/opacity/clip-path only)
Tokens: `--ease-ink cubic-bezier(.16,1,.3,1)`, `--ease-snap cubic-bezier(.7,0,.84,0)`; 150 / 250 / 500 / 700ms.
| Effect | Trigger | Motion | Reduced motion |
|---|---|---|---|
| Cover impact | load, once | focus lines scale 1.25→1 + fade; burst scale 1.7→1, 550ms | static |
| Panel reveal | element enters viewport (top hits 85%), once | clip-path `inset(0 100% 0 0)`→`inset(0)`, 500ms, stagger 80ms | shown |
| Halftone wipe (B) | Ch.5 image scroll range: entry 30% → cover 50% | dot/grey layer `clip-path inset(0)→inset(0 0 0 100%)` | color shown |
| **Ink-bleed into Ch.5 (E)** | Ch.5 panel 35% visible, **once**, time-based (not scrubbed) | wash layer masked by a circle with a **static** `feTurbulence` + `feDisplacementMap` (scale 14); circle scale 0→1, 900ms. Content is never hidden: only the wash bleeds in. Fallback if it janks on a mid Android: `clip-path` ink-splash polygon | wash shown |
| Chapter title | in view | `ChapterTitle` page-turn 700ms | instant |
| CTA / ProjectCard | hover, press | translate + shadow | colour only |
| Progress bar | scroll | `scaleX` | kept |
No infinite loops, no raw `window` scroll listeners (use the stack's scroll triggers), WebGL only for opt-in 3D, never behind text. Max one flash per page (reserved for P2 break-out).

## 9. Responsive
- Breakpoints `768 · 1024 · 1280`. ≥1024: cover 8/4 split, cuts on. 768-1023: cover and card full width, cuts off.
- **<768 fast path (1):** the cover becomes a short banner: h1 + obi band on paper, then a 180px art strip (caption + burst; pitch hidden). The ProfileCard follows with **CTAs first**. Measured at 375×667: h1, title band and CTAs all within the first 667px of the cover (CTA bottom ≈ 600px from the cover top).
- <768: 1 col, bursts 2-up, thumb index → pill + dialog, speed-line SFX hidden. Touch targets ≥ 44px.

## 10. Accessibility
- One `h1` (cover name). Sections `aria-labelledby` + `h2`. Skip link to Contents.
- Contrast per §2. No text on focus lines (paper knockout behind the cover copy), speed lines limited to the top 58% of title pages, washes only under ink.
- Decor (`.focus`, `.speed`, SFX, bursts, page numbers, grain, [P2] slot) `aria-hidden`. Lettering text stays real text.
- Focus ring 3px accent + 2px offset. Dialog: native focus handling, Esc. Rail: `aria-current`. Form: labels above inputs.
- `prefers-reduced-motion: reduce` gates everything in §8 (each row's last column).

## 11. 21st.dev
Comic Text → SFX only · Bento Grid → Ch.5 (radius 0, frame, no shadow) · Image Card → ProjectCard (hard shadow, halftone→color) · Button → CTAs · Typing effect → [P2] guide lines only (re-implement if the stack changes). Not used: Timeline, Dot Pattern, Halftone shader (WebGL).

## 12. CTA labels (one per intent)
"Resume" · "Contact" · "Contents" · "Live site" · form submit "Send".

## Appendix P2 — Parked: Phase 2 (character). Skipped now, NOT dropped
**Identity open:** R&D is evaluating a different character direction. Slots, keep-out, perches and choreography below hold for any character; poses, lines and art specifics are provisional (written for the self-portrait version).
**Art:** B&W ink masters are primary, plus `-color` variants for cover/Ch.5/Gaiden/Finale (art kit §2.2b). Never grayscale a color image. Poses `01-wave-hello`, `02-break-out` (1600²), `03-walk-a/b`, `04-point`, `05-think`, `06-wave-bye`, `07-bust` (512²); others 1200×1600, shared baseline; WebP ≤ 80 KB.
**[P2 slots] already in Phase 1:** cover `VolumeCover.slot` (`#slot`, bottom-right of the art column; today the ドン burst) · chapter perch gutters (§5) · Finale `[data-guide-target]` on Send · z-index 40 layer.
**Choreography** (cookbook §1 + §8; replaces the old `layoutId` hand-off):
1. Cover: `01-wave-hello` in the slot, bubble "Hello! This volume is my story so far."
2. Break-out: scrubbed over the cover's scroll range (cover top → cover 50% out). Lean, scale 1→1.15, torn border + cracks + バリッ, one ≤100ms impact frame.
3. Hand-off: ONE fixed character layer. On each chapter change (one shared chapter trigger) it **leaps on an arc** (≈600ms, `--ease-ink`) to that chapter's perch, with squash/stretch on take-off and landing and an ink-poof pose swap. Leaps are time-based, never scrubbed, so he never hangs mid-air. Scroll velocity only adds a ±6° lean.
4. Finale: flat walk to `[data-guide-target]`, `06-wave-bye`.
| Chapter | Perch (side/y/spot) | Pose → line |
|---|---|---|
| Ch.1 | left/mid/peek | `04-point` → "Nagpur, 2018. A diploma and my first Hello World." |
| Ch.2 | right/top/ledge | `05-think` → "Four years of B.Tech. Lots of late-night builds." |
| Ch.3 | left/bottom/free | `04-point` → "First real job. Production code hits different." |
| Ch.4 | right/mid/peek | `04-point` → "Softtronix is where my frontend got sharp." |
| Ch.5 | left/top/ledge | `03-walk`→`04-point`, B&W→color → "And then the world got color." |
| Gaiden | right/bottom/free | `04-point` → "Side stories. All live. Go poke them." |
| Status | left/mid/peek | `05-think` → "My stats. No fake percentages." |
| Finale | center/bottom/walk → Send | `06-wave-bye` → "To be continued… written with you." |
**Keep-out zone (testable):** the boxes of `h1`, the obi title band and the CTA group must have **zero intersection** (`getBoundingClientRect`) with (a) the cover slot / break-out art scaled **1.15× from bottom centre** at peak, and (b) the mobile dock (64px bust, bottom-left, 16px inset) at every scroll position. The tile ships `keepOut(scale=1.15)`: currently PASS at 1440×900 and 375×667. Engineering adds it as a Playwright check.
**Dock/mobile:** desktop = the traveling layer (≈200px tall). Mobile = 64px bust bottom-left, 16px hop per chapter, tap shows the bubble. Hidden over the footer, while a form field has focus, and when "Hide guide" is on (localStorage). One line per chapter, auto-hide 5s, guide `aria-hidden` (facts live in the copy).
**Reduced motion:** static torn composition, jump cut to each perch, 300ms pose fade, no poof/lean/flash.
