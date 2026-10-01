# Tech Plan — "Vol. 1: Mayuresh Talewar" (ENG-004)
Status: DRAFT, UI build waits for client approval · Owner: Head of Engineering · 2026-10-02
Inputs: `03-design-spec.md` (DES-001), `02-research-report.md` §7, `04-motion-cookbook.md` (**not written yet: motion refs below are placeholders**).
Rules: Next 16 App Router (read `node_modules/next/dist/docs` before Next-specific code), RSC by default, `"use client"` only on leaves, `motion/react` only, no new deps beyond the shadcn/21st installs listed here.

## 1. Data (done, `src/data`, types in `src/types/index.ts`)
| File | Exports | Feeds |
|---|---|---|
| `site.ts` | `siteConfig` (name, title, description, location, email, url, resume, image, socials) | Cover, Finale, SEO |
| `chapters.ts` | `chapters: Chapter[]` (Ch.1–5: colorMode, guide {pose, line, enterPose?}, highlights, metrics, Ch.5 `products`), `stats`, `parts` (cover, breakOut, gaiden, status, finale: colorMode + guide) | Everything chapter-shaped, rail, TOC, guide |
| `projects.ts` | `projects: Project[]` (summary, stack, href, image, spread?, chapterId?) | Gaiden |
| `skills.ts` | `skills: SkillGroup[]` ({name, skills}, 9 resume groups) | Status Window, JSON-LD |
`ColorMode = "bw" | "duo" | "color" | "night"` → `data-mode` on `<section>`. Spec §9's `src/data/guide.ts` is **dropped**: guide lines live on each chapter/part, so one source.

## 2. Component tree (spec §7, 22 components → 19 files)
Page: `src/app/page.tsx` (RSC) maps `parts` + `chapters` in order: Cover → Ch.1–5 → Gaiden → Status → Finale. Chapter bodies differ per spec §6 layout, so each chapter body is a small RSC in `sections/`.
| Spec component | File | Kind | Props / notes |
|---|---|---|---|
| Panel | `components/manga/panel.tsx` | RSC | `span, tall?, tilt?, tone?, fill?, pageNo?, as?, reveal?` — `reveal` wraps children in PanelReveal |
| PanelReveal | `components/manga/panel-reveal.tsx` | client | **Replaces** existing `ui/fade-in.tsx` (delete it): `children, delay?`, clip-path wipe |
| ChapterSection | `components/manga/chapter-section.tsx` | RSC | `id, mode, labelledBy, children`; sets `data-mode`, `aria-labelledby` |
| ChapterTitle | `components/manga/chapter-title.tsx` | RSC | `chapter: Chapter, transition?`; transition anim via a client leaf `chapter-title-fx.tsx` |
| SpeechBubble | `components/manga/speech-bubble.tsx` | RSC shell | `variant, tail, text, typing?`; `typing` renders 21st TypingAnimation (client) |
| Screentone + FocusLines | `components/manga/tone.tsx` | RSC | **Merged**: `<Tone kind="dots" density fade/>`, `<Tone kind="focus" center clear/>`; pure CSS, aria-hidden |
| SFX | `components/manga/sfx.tsx` | RSC | `glyph: 'don'|'bari', size?`; inline SVG. 21st Comic Text only if SVG lettering looks worse |
| GuideCharacter + GuideDock | `components/guide/guide.tsx` | client | **Merged**: one instance owns pose state, `layoutId="guide"`, dock slot, "Hide guide" toggle (localStorage, try/catch). Reads active section id from context |
| BreakOutStage | `components/guide/break-out.tsx` | client | `heroRef`; torn mask, cracks, impact frame |
| ActiveSection context | `components/guide/active-section.tsx` | client | `useInView` per section → `activeId`; shared by guide + ChapterNav (no second observer) |
| ProfileCard | `components/sections/profile-card.tsx` | RSC | `siteConfig`, Ch.5 role/org, `stats`; CTAs via Button |
| ContentsList + ContentsDialog | `components/nav/contents.tsx` | client leaf | **Merged**: list RSC-renderable, dialog = native `<dialog>` + `showModal()` (native focus trap + Esc; return focus manually) |
| ChapterNav | `components/nav/chapter-nav.tsx` | client | `items`; rail desktop, pill mobile opens Contents dialog |
| ReadingProgress | `components/nav/reading-progress.tsx` | client | `useScroll` → `scaleX` |
| StatBurst | `components/manga/stat-burst.tsx` | RSC | `stat: Stat, sfx?` |
| BentoGrid | `components/ui/bento-grid.tsx` (21st) | RSC | re-skinned; `items: Product[]` |
| ProjectCard | `components/sections/project-card.tsx` | RSC + CSS | `project: Project`; B&W→color via CSS `:hover` + `@media (hover:none)` in-view class from PanelReveal. Wraps 21st image-card |
| StatusWindow | `components/sections/status-window.tsx` | RSC | `groups: SkillGroup[]` |
| Button | `components/ui/button.tsx` (21st neobrutalism) | RSC | `variant, href?, icon?`; renders `<a>` when `href` |
| ContactPanel | `components/sections/contact-panel.tsx` | client | EmailJS via `fetch` to `https://api.emailjs.com/api/v1.0/email/send` (no SDK dep); keys `NEXT_PUBLIC_EMAILJS_*` |
| Chapter bodies | `components/sections/{cover,ch1…ch5,gaiden,finale}.tsx` | RSC | Layout per spec §6; compose primitives above |
Merges/drops (ponytail): Screentone+FocusLines, GuideCharacter+GuideDock, ContentsList+ContentsDialog, `guide.ts` dropped, `fade-in.tsx` replaced, EmailJS SDK not installed. Theme toggle = tiny client leaf inside ChapterNav header (sets `data-theme` on `<html>`, localStorage).

## 3. Tokens + fonts
- `src/app/globals.css`: drop the Geist/`prefers-color-scheme` scaffold. `@theme` holds spec §2 light values (`--color-paper`, `--color-ink`, `--color-ink-muted`, `--color-accent`, `--color-on-accent`, `--color-cyan`, `--color-yellow`, `--color-*-tint`), §4 spacing/shadows (`--shadow-panel`, `--shadow-press`), §8 `--ease-ink`, `--ease-snap`, breakpoints are Tailwind defaults (match spec §10).
- Dark: `[data-theme="dark"] { --color-paper:…; … }` overrides the same vars (never `prefers-color-scheme`). Night page: `[data-mode="night"]` swaps paper/ink + `#FF6B6B` accent in both themes. `[data-mode="duo"]` / `"bw"` restrict fills (no cyan/yellow utilities used inside).
- Screentone: `--tone-dots` custom property + `.tone-4/6/8` utilities via `@utility`.
- Fonts in `src/app/layout.tsx` (coordinate with Growth, they own that file today):
  `Dela_Gothic_One({ weight: "400", subsets: ["latin"], variable: "--font-display" })`, `Zen_Kaku_Gothic_New({ weight: ["400","500","700"], subsets: ["latin"], variable: "--font-body" })`, `JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" })` (variable font, no weight). Vars on `<html>`; `@theme inline { --font-display: var(--font-display); --font-sans: var(--font-body); --font-mono: var(--font-mono); }` → `font-display`, `font-sans`, `font-mono` utilities.

## 4. Installs (Sprint 1, ENG-101 only, one agent, to avoid lockfile races)
1. `npx shadcn@latest init` (Tailwind 4, no base color CSS: we keep our own tokens; `components.json` aliases `@/components`, `@/lib/utils` — `cn` already exists).
2. 21st.dev (slugs return 403 to curl; **verify each URL on 21st.dev before running**):
   `npx shadcn@latest add "https://21st.dev/r/magicui/bento-grid"` · `".../r/magicui/typing-animation"` · `".../r/ekmas/button"` · `".../r/ekmas/image-card"` · Comic Text (`.../r/magicui/comic-text`) only if SFX SVG is rejected.
3. Rewrite `framer-motion` → `motion/react` in every added file (`grep -rl "framer-motion" src | xargs sed -i 's#framer-motion#motion/react#'`); if the CLI adds `framer-motion`/`lucide-react` etc. to package.json, remove what we don't use. Re-skin to tokens: radius 0, 3px frame, hard shadow.

## 5. Motion
All per spec §8 tokens; recipes to come from `docs/04-motion-cookbook.md` — **TODO when it lands**: link each recipe → owning file: panel reveal → `panel-reveal.tsx`; ink-splash/page-turn → `chapter-title-fx.tsx`; break-out → `break-out.tsx`; dock swap/bob/finale landing → `guide.tsx`; progress → `reading-progress.tsx`. Every client motion leaf calls `useReducedMotion()`; no `window` scroll listeners.

## 6. Guide placeholders (done)
`public/guide/{01-wave-hello,02-break-out,03-walk,04-point,05-think,06-wave-bye,07-bust}.webp`, transparent, flat ink silhouettes labeled with the pose id, at spec §9 canvases (1200×1600, break-out 1600×1600, bust 512×512), shared baseline (y≈1580) and center x. Real art = same filenames, same canvas → zero code change. Path rule: `/guide/${pose}.webp`.

## 7. Sprints (tickets sized so parallel agents never touch the same file)
Each ticket: lint + build green, works at 375px and 1280px, reduced-motion checked, no hardcoded colors (tokens only).

### Sprint 1 — Foundation
| Ticket | Files (owned) | Acceptance |
|---|---|---|
| ENG-101 Installs | `components.json`, `package*.json`, `components/ui/{bento-grid,button,image-card,typing-animation}.tsx` | shadcn init + 21st adds done; zero `framer-motion` imports; no unused deps added; components compile unstyled |
| ENG-102 Tokens + fonts | `globals.css`, `layout.tsx` (fonts only, after Growth hands it over) | All §2/§4/§8 tokens in `@theme`; 3 fonts via `next/font`; light default even with OS dark; `data-theme="dark"` + `data-mode` swaps verified on a scratch page; contrast pairs from §2 hold |
| ENG-103 Panel primitives | `manga/{panel,panel-reveal,tone,sfx,stat-burst,speech-bubble}.tsx`; delete `ui/fade-in.tsx` | Every span/tone/fill/tilt renders; tilt off <768; reveal = clip-path wipe, `once`, shown instantly with reduced motion; decor is `aria-hidden`; bubble text is real text |
| ENG-104 Sections + nav | `manga/{chapter-section,chapter-title}.tsx`, `nav/*`, `guide/active-section.tsx` | `<section aria-labelledby>` + `h2`; rail `aria-current`; mobile pill opens `<dialog>`; Esc closes, focus returns; skip link to Contents; progress bar uses `scaleX` only |

### Sprint 2 — Cover + 4th-wall break + guide
| Ticket | Files | Acceptance |
|---|---|---|
| ENG-201 Cover | `sections/{cover,profile-card}.tsx`, `page.tsx` | One `h1`; name, title, CTAs (Resume/Contact) and 4 stats above the fold at 375×667; Contents list with Ch.5 "Current arc" |
| ENG-202 Break-out | `guide/break-out.tsx`, `chapter-title-fx.tsx` | Scroll-linked phases per §8; exactly one ≤100ms flash; reduced motion = static torn frame, no flash/shake |
| ENG-203 Guide dock | `guide/guide.tsx` | One instance, `layoutId` hand-off from cover; pose + line from data per active section; auto-hide 5s; hides over footer, on input focus, via toggle (persisted); 200px desktop, 64px bust mobile |

### Sprint 3 — Chapters (one agent per file)
| Ticket | Files | Acceptance |
|---|---|---|
| ENG-301 Ch.1–2 | `sections/{ch1,ch2}.tsx` | `bw` mode; layouts per §6; all copy from `chapters` |
| ENG-302 Ch.3–4 | `sections/{ch3,ch4}.tsx` | `duo` mode (red spot only); one tilted panel max; bullets + metrics from data |
| ENG-303 Ch.5 | `sections/ch5.tsx` | `color` mode; Bento from `products` (major tall / minor / minor / wide); StatBurst row from `stats` with one ドン; ink-splash title |

### Sprint 4 — Gaiden, Status, Finale
| Ticket | Files | Acceptance |
|---|---|---|
| ENG-401 Gaiden | `sections/{gaiden,project-card}.tsx` | Shadow Monarch `spread` splash + 4 half cards; `next/image` with real alt + `sizes`; B&W→color on hover / in view on touch; "Live site" opens new tab with `rel="noopener"` |
| ENG-402 Status Window | `sections/status-window.tsx` | `night` in both themes; 9 groups from `skills`, 2-col md / 1-col mobile; no levels or percentages |
| ENG-403 Finale + contact | `sections/{finale,contact-panel}.tsx`, `.env.example` | Labels above inputs, `aria-describedby` errors, success "Chapter received"; EmailJS keys from env only; guide lands (wave-bye); socials + Resume |
| ENG-404 QA pass | none (report only) | Lighthouse ≥90 all four, axe clean, one h1, keyboard-only walkthrough, reduced-motion walkthrough |
