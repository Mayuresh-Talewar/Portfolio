# Tech Plan — "Vol. 1: Mayuresh Talewar" (ENG-004/005)
Status: DRAFT, UI build waits for client approval · Owner: Head of Engineering · 2026-10-02
Inputs: `03-design-spec.md` (DES-001), `02-research-report.md` §7, `04-motion-cookbook.md` (RND-003/004), `06-character-art-kit.md` (DES-002).
Rules: Next 16 App Router (read `node_modules/next/dist/docs` before Next-specific code), RSC by default, `"use client"` only on leaves, `motion/react` only, no new deps beyond the shadcn/21st installs listed here.
**Character = skipped now, ships later (client, 2026-10-02).** Sprints 1–4 contain no character UI and the cover works on its own; they leave hook points (§6) so Sprint 5 is a drop-in.

## 1. Data (done, `src/data`, types in `src/types/index.ts`)
| File | Exports | Feeds |
|---|---|---|
| `site.ts` | `siteConfig` (name, title, description, location, email, url, resume, image, socials) | Cover, Finale, SEO |
| `chapters.ts` | `chapters: Chapter[]` (Ch.1–5: colorMode, highlights, metrics, Ch.5 `products`), `stats`, `parts` (cover, breakOut, gaiden, status, finale) | Sections, rail, TOC |
| `projects.ts` | `projects: Project[]` (summary, stack, href, image, spread?, chapterId?) | Gaiden |
| `skills.ts` | `skills: SkillGroup[]` ({name, skills}, 9 resume groups) | Status Window, JSON-LD |
`ColorMode = "bw" | "duo" | "color" | "night"` → `data-mode` on `<section>`. Dormant until Sprint 5: each chapter/part's `guide {pose, line, enterPose?}` and the placeholders in `public/guide/*.webp`. No `src/data/guide.ts` (cookbook §2b agrees).

## 2. Component tree (spec §7, Sprints 1–4)
Page: `src/app/page.tsx` (RSC) renders Cover → Ch.1–5 → Gaiden → Status → Finale from `parts` + `chapters`. Section contract (cookbook §0): `<section id={x.id} data-chapter={x.id} data-mode={x.colorMode} aria-labelledby>`. Motion leaves live in `src/components/motion/*` per cookbook §0.
| Spec component | File | Kind | Props / notes |
|---|---|---|---|
| Providers | `components/motion/providers.tsx` | client | `MotionConfig reducedMotion="user"` (cookbook §0) |
| Panel | `components/manga/panel.tsx` | RSC | `span, tall?, tilt?, tone?, fill?, pageNo?, as?, index?`; `.panel-in` + `--i` |
| PanelReveal | — | **dropped** | Pure CSS scroll-driven stagger (cookbook §3b). Delete `ui/fade-in.tsx` |
| ChapterSection | `components/manga/chapter-section.tsx` | RSC | `part: Part, children`; applies the section contract |
| ChapterTitle | `components/manga/chapter-title.tsx` | RSC | `chapter: Chapter`; contains `InkWipe` (cookbook §3a) |
| SpeechBubble | `components/manga/speech-bubble.tsx` | RSC | `variant, tail, text`; used by Finale shout now; `typing` via `Typewriter` (cookbook §2d) added in Sprint 5 |
| Screentone + FocusLines | `components/manga/tone.tsx` | RSC | **Merged**: `<Tone kind="dots" density fade/>` + `<FocusLines/>` (cookbook §5); CSS only, aria-hidden |
| SFX | `components/manga/sfx.tsx` | RSC | `glyph: 'don'|'bari', size?`; inline SVG |
| StatBurst | `components/manga/stat-burst.tsx` | RSC | `stat: Stat, sfx?` |
| ProfileCard | `components/sections/profile-card.tsx` | RSC | `siteConfig`, Ch.5 role/org, `stats`; CTAs |
| ContentsList + ContentsDialog | `components/nav/contents.tsx` | client leaf | **Merged**: native `<dialog>` `showModal()` (focus trap + Esc native; return focus manually); also mobile nav |
| useActiveChapter | `components/motion/use-active-chapter.ts` | client | One observer on `[data-chapter]` (cookbook §2a); reused by Sprint 5's guide |
| ChapterNav | `components/nav/chapter-rail.tsx` | client | Rail + mobile pill (cookbook §6b); theme toggle lives here |
| ReadingProgress | `components/motion/reading-progress.tsx` | client | cookbook §6a |
| ColorReveal | `components/motion/color-reveal.tsx` | client | Gaiden screenshots B&W→color (cookbook §4); screenshots only, never character art |
| BentoGrid | `components/ui/bento-grid.tsx` (21st) | RSC | re-skinned; `items: Product[]` |
| ProjectCard | `components/sections/project-card.tsx` | RSC | `project: Project`; wraps 21st image-card + ColorReveal |
| StatusWindow | `components/sections/status-window.tsx` | RSC | `groups: SkillGroup[]` |
| Button | `components/ui/button.tsx` (21st neobrutalism) | RSC | `variant, href?, icon?`; `<a>` when `href` |
| ContactPanel | `components/sections/contact-panel.tsx` | client | EmailJS via `fetch` to its REST endpoint (no SDK dep); `NEXT_PUBLIC_EMAILJS_*`; CTA carries `data-guide-target` |
| Chapter bodies | `components/sections/{cover,ch1…ch5,gaiden,finale}.tsx` | RSC | Layout per spec §6 |
Merges/drops (ponytail): PanelReveal → CSS, Screentone+FocusLines, ContentsList+ContentsDialog, `guide.ts`, EmailJS SDK. Parked to Sprint 5: GuideCharacter, GuideDock, BreakOutStage.

## 3. Tokens + fonts
- `src/app/globals.css`: drop the Geist/`prefers-color-scheme` scaffold. `@theme` holds spec §2 light values (`--color-paper`, `--color-ink`, `--color-ink-muted`, `--color-accent`, `--color-on-accent`, `--color-cyan`, `--color-yellow`, `--color-*-tint`), §4 shadows, §8 `--ease-ink`/`--ease-snap`. Cookbook assumes `--ink`/`--paper`, `bg-ink`, `text-paper`: Tailwind generates `bg-ink` from `--color-ink`; rename the cookbook's raw `var(--ink)` to `var(--color-ink)` when pasting.
- Dark: `[data-theme="dark"]` overrides the same vars (never `prefers-color-scheme`). `[data-mode="night"]` swaps paper/ink + `#FF6B6B` in both themes.
- CSS from the cookbook goes into `globals.css`: `.panel-in` (§3b), `.focus-lines` (§5), `.color-reveal` reduced-motion rule (§4).
- Fonts in `src/app/layout.tsx` (Growth owns it today; coordinate): `Dela_Gothic_One({ weight: "400", subsets: ["latin"], variable: "--font-display" })`, `Zen_Kaku_Gothic_New({ weight: ["400","500","700"], subsets: ["latin"], variable: "--font-body" })`, `JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" })`. Then `@theme inline { --font-display: var(--font-display); --font-sans: var(--font-body); --font-mono: var(--font-mono); }`.

## 4. Installs (ENG-101 only, one agent, avoids lockfile races)
1. `npx shadcn@latest init` (Tailwind 4; keep our tokens; `cn` in `@/lib/utils` already exists).
2. 21st.dev (slugs return 403 to curl; **verify each URL on 21st.dev first**): `npx shadcn@latest add "https://21st.dev/r/magicui/bento-grid"` · `".../r/ekmas/button"` · `".../r/ekmas/image-card"`. Typing Animation is replaced by cookbook §2d `Typewriter` (Sprint 5); Comic Text only if SFX SVG is rejected.
3. Rewrite `framer-motion` → `motion/react` in every added file; remove any deps the CLI adds that we don't import. Re-skin: radius 0, 3px frame, hard shadow.

## 5. Motion (cookbook = source; Sprints 1–4 use only the non-character recipes)
§0 Providers, boundaries, Next 16 `next/image` (`loading="eager" fetchPriority="high"`, not `priority`) · §2a `useActiveChapter` · §3a `InkWipe` · §3b `.panel-in` CSS · §4 `ColorReveal` · §5 `FocusLines` · §6a `ReadingProgress` · §6b `ChapterRail`. Character recipes §1, §2b–2d, §7, §8 belong to Sprint 5. No `layoutId` hand-off anywhere: the guide is one fixed layer (cookbook §8).

## 6. Hook points Sprints 1–4 must leave (so Sprint 5 adds, never rewrites)
- **Layout slot**: `layout.tsx` body renders `<Providers>{children}<GuideLayer /></Providers>`; `components/guide/guide-layer.tsx` is an RSC that returns `null` (z-index 40 reserved).
- **Cover slot**: cover section is `relative isolate`, `major` art panel holds `<FocusLines/>` + an empty `<div data-slot="break-out" aria-hidden />` sized to the art box; without a character the panel shows the portrait-free cover composition (focus lines, SFX, title).
- **Sections**: every section carries `id`, `data-chapter`, `data-mode` (needed for the rail anyway). Finale CTA carries `data-guide-target`.
- **Data**: `guide` fields stay in `chapters.ts`, unused by UI.

## 7. Sprints (parallel agents never touch the same file)
Every ticket: lint + build green, 375px + 1280px checked, reduced motion checked, tokens only (no hex in components).

### Sprint 1 — Foundation
| Ticket | Files (owned) | Acceptance |
|---|---|---|
| ENG-101 Installs | `components.json`, `package*.json`, `components/ui/{bento-grid,button,image-card}.tsx` | shadcn init + 21st adds; zero `framer-motion` imports; no unused deps |
| ENG-102 Tokens + fonts + shell | `globals.css`, `layout.tsx` (after Growth hands over), `motion/providers.tsx`, `guide/guide-layer.tsx` | All spec §2/§4/§8 tokens; 3 fonts via `next/font`; light default with OS dark; `data-theme`/`data-mode` swaps work; `GuideLayer` returns null; cookbook CSS (§3b, §5, §4) in place |
| ENG-103 Primitives | `manga/{panel,tone,sfx,stat-burst,speech-bubble}.tsx`; delete `ui/fade-in.tsx` | Every span/tone/fill/tilt renders; tilt off <768; `.panel-in` static without scroll-timeline or with reduced motion; decor `aria-hidden`; bubble text is real text |
| ENG-104 Sections + nav | `manga/{chapter-section,chapter-title}.tsx`, `nav/*`, `motion/{use-active-chapter,reading-progress}.ts(x)` | Section contract applied; one observer; rail `aria-current`; pill opens `<dialog>`, Esc closes, focus returns; skip link; progress uses `scaleX` |

### Sprint 2 — Cover (no character)
| Ticket | Files | Acceptance |
|---|---|---|
| ENG-201 Cover | `sections/{cover,profile-card}.tsx`, `page.tsx` | One `h1`; name, title, Resume/Contact CTAs and 4 stats above the fold at 375×667; Contents with Ch.5 "Current arc"; FocusLines once on load; empty `data-slot="break-out"` present; looks complete with no character |

### Sprint 3 — Chapters (one agent per row)
| Ticket | Files | Acceptance |
|---|---|---|
| ENG-301 Ch.1–2 | `sections/{ch1,ch2}.tsx` | `bw`; spec §6 layouts; copy from `chapters` only |
| ENG-302 Ch.3–4 | `sections/{ch3,ch4}.tsx` | `duo` (red spot only); max one tilted panel; bullets + metrics from data |
| ENG-303 Ch.5 | `sections/ch5.tsx` | `color`; Bento from `products` (major tall / minor / minor / wide); StatBurst row from `stats`, one ドン; InkWipe title |

### Sprint 4 — Gaiden, Status, Finale
| Ticket | Files | Acceptance |
|---|---|---|
| ENG-401 Gaiden | `sections/{gaiden,project-card}.tsx`, `motion/color-reveal.tsx` | Shadow Monarch `spread` splash + 4 half cards; `next/image` real alt + `sizes`; ColorReveal once; "Live site" new tab, `rel="noopener"` |
| ENG-402 Status Window | `sections/status-window.tsx` | `night` in both themes; 9 groups, 2-col md / 1-col mobile; no levels/percentages |
| ENG-403 Finale + contact | `sections/{finale,contact-panel}.tsx`, `.env.example` | Labels above inputs, `aria-describedby` errors, "Chapter received" success; keys from env; socials + Resume; `data-guide-target` on CTA |
| ENG-404 QA | report only | Lighthouse ≥90 ×4, axe clean, one h1, keyboard + reduced-motion walkthroughs |

## 8. Parked: Phase 2 (character) = Sprint 5, ready to run when the art lands
Prereqs: real pose art per art kit §4 dropped into `public/guide/` (B&W masters + `<pose>-color.webp` per kit §2.2b, walk as `03-walk-a`/`03-walk-b`); then extend types: `Guide.perch` (cookbook §8.2 shape + values), `overlays?: boolean` (blink/talk files exist; no runtime 404 probing), and a `poseSrc(pose, mode)` helper that picks `-color` for `color`/`night` sections, else B&W (never grayscale color art).
| Ticket | Files | Acceptance |
|---|---|---|
| ENG-501 Data + assets | `src/types`, `src/data/chapters.ts`, `src/lib/pose.ts`, `public/guide/*` | `perch` on every part/chapter per §8.2; `poseSrc` with one assert check; walk split; all files at kit canvases |
| ENG-502 Entry + break-out | `guide/{guide-entry,break-out,tear}.tsx` into the cover `data-slot` | Cookbook §1a–1c; one ≤100ms flash; reduced motion = static torn frame, no flash/shake |
| ENG-503 Traveler | `guide/{traveler,use-leap,perch}.ts(x)`, `GuideLayer` renders it | Cookbook §7 + §8.3–8.5; one fixed layer, no `layoutId`; perch math check passes; 60fps budget §8.7 on mid-range Android |
| ENG-504 Dock + bubble | `guide/guide-dock.tsx`, `motion/typewriter.tsx` | Cookbook §8.6 + §2d; mobile 64px head; "Hide guide" persisted (try/catch); line facts also in section copy; guide `aria-hidden`; hides on form focus |
| ENG-505 QA | report only | No CLS from the layer, Lighthouse still ≥90, reduced-motion walkthrough |
