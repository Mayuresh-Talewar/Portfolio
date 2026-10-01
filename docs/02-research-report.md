# Research Report: Manga-Volume Portfolio (RND-002)
Status: DONE (rev 2, includes client scope addition) · Owner: R&D · 2026-10-02 · Input: `01-project-brief.md`
Design read: developer portfolio for AI/full-stack recruiters, told as a B&W manga volume with selective color and a guide character (Mayuresh), built with native CSS/SVG + Tailwind 4 + `motion`. Dials: VARIANCE 7 · MOTION 7 · DENSITY 4.
Precedence: the client's vision (volume/chapters + guide character) overrides taste-skill defaults (numbered sections, mascots). All a11y/perf rules still apply.

## 1. Visual language: manga device → web UI (cheapest first)
| Manga device | Web mapping | Cheapest implementation |
|---|---|---|
| Panel grid + gutters | Sections and bento cells as panels; white gutters, black 2-3px frames | CSS Grid `gap` = gutter, `border` on cells. Tilted panel: `clip-path: polygon()`. Full-bleed "splash panel" for the hero |
| Screentone / halftone | Shading on panels, headers, image shadows | `radial-gradient(circle, ink 1px, transparent 1.5px)` + `background-size: 6px 6px`. Gradient tone: add `mask-image: linear-gradient()`. Zero JS |
| Ink line weights | Heavy outer frame, thin inner rules, hard offset shadow | `border-3` frames, `1px` dividers, `box-shadow: 6px 6px 0 ink` (no blur). SVG `feTurbulence` wobble only on static elements |
| Speed lines | Energy behind headings, CTA hover | `repeating-linear-gradient` + `mask-image` fade |
| Focus lines (集中線) | Hero backdrop converging on the character | `repeating-conic-gradient(from 0deg at 50% 50%, ink 0 1deg, transparent 1deg 6deg)` + `radial-gradient` mask to clear the center |
| Speech / thought / shout bubbles | Guide character's lines, hero greeting, contact prompt | Speech: `border-radius:50%` ellipse + `::after` tail via `clip-path`. Thought: 2-3 circles. Shout: starburst `clip-path: polygon()`. Real text, never images |
| SFX onomatopoeia | One decorative word per chapter max (ドン on stats, バリッ on the 4th-wall break) | Display font, `-webkit-text-stroke` + `paint-order: stroke fill`, `rotate(-8deg)`, `aria-hidden="true"` |
| Volume cover / chapter title pages | Hero = Vol. 1 cover; each section opens with a chapter title panel | See section 7. Plain `h2` inside a styled title panel |
| Reading flow | Z-pattern scan, big panel → small panels | Keep LTR (real manga is RTL; confuses recruiters and screen readers). Panel size carries hierarchy |
| Color pages (selective) | Manga is B&W with rare color pages. Map to: B&W site; color only on project screenshots, the CTA, one accent, and the Shadow Monarch "color spread" | `grayscale` default, color on hover/in-view. One accent token (ink red, Jump-style) locked page-wide |
| Dark mode | Manga "night/flashback" black pages | Swap paper/ink CSS vars. Tones use tokens so they invert for free |

## 2. Motion (all via `motion/react`, client leaf components only)
| Effect | How | Perf cost | Reduced-motion fallback |
|---|---|---|---|
| Panel reveal on scroll | `whileInView` `clip-path: inset(0 100% 0 0)` → `inset(0)`, `staggerChildren` | Low-med; cheaper alt: ink overlay `scaleX` 1→0 | Final state (`initial={false}`) |
| Ink-splash transition | Pre-made SVG blot mask, animate `scale` 0→20 at chapter title pages | Low (transform). Never animate SVG filters | Instant swap |
| Page turn | `rotateY` + `perspective` on chapter title panel or project modal. Real page curl needs WebGL: skip | Low | Fade |
| Impact frame | One ~100ms `invert(1)` + `x` shake on stats hit and on the 4th-wall break | Low. WCAG 2.3.1: never more than 1 flash, never loop | No flash, no shake |
| B&W → color | Stacked gray + color images, animate color layer `opacity`; hover desktop, `whileInView` touch | Low (opacity) | Color shown, no transition |
| Focus-line hero | CSS conic lines; one `scale` on load, or `useScroll` zoom | Low | Static |
| Typewriter bubble | Stagger char spans; full string in `aria-label`, spans `aria-hidden` | Low | Full text at once |
Rules: transform/opacity only; no `window` scroll listeners; every animation signals hierarchy, sequence or feedback.

## 3. References: manga look (all HTTP 200 on 2026-10-02)
| Site | Good | Bad / avoid |
|---|---|---|
| [sololeveling-anime.net](https://sololeveling-anime.net/) | Dark "shadow" mood. Direct fit for the Shadow Monarch hook | Video-heavy, anime stills not manga devices |
| [chainsawman.dog](https://chainsawman.dog/) | Titles as stacked full-width "pages", restrained nav | Image-only typography (a11y/SEO) |
| [anime-dandadan.com](https://anime-dandadan.com/) | Bold bilingual type, energetic hero | Loader gate + carousel delay first content |
| [mangaplus.shueisha.co.jp](https://mangaplus.shueisha.co.jp/) | Real chapter lists and volume-cover cards | App UI, reference for TOC/covers only |
| [spider-verse-portfolio](https://spider-verse-portfolio-ochre.vercel.app) | Dev portfolio fully committed to a comic theme | Anti-reference: WebGL loader, custom cursor, GSAP+Lenis+Howler |
| [fatma-mourad.vercel.app](https://fatma-mourad.vercel.app) | Professional portfolio inside a comic world, reduced-motion support | Pastel western-comic, not manga |
| [neobrutalism.dev](https://www.neobrutalism.dev/) | Hard borders + offset shadows = panel look in Tailwind | Generic unless re-skinned |

## 4. 21st.dev shortlist (titles verified live)
| Component | URL | Use |
|---|---|---|
| Comic Text (Magic UI) | https://21st.dev/magicui/comic-text/default | Cover title / SFX lettering, uses `motion` |
| Bento Grid (Magic UI) | https://21st.dev/magicui/bento-grid/default | Ch.5 The AI Arc as a manga page (4 products = 4 panels) |
| Typing Animation (Magic UI) | https://21st.dev/magicui/typing-animation/default | Guide character's speech bubbles |
| Dot Pattern (Magic UI) | https://21st.dev/magicui/dot-pattern/default | SVG screentone if CSS gradient falls short |
| Timeline (Aceternity) | https://21st.dev/aceternity/timeline/default | Optional spine for Ch.1-5 years; scroll line = ink stroke. Confirm `motion/react` import |
| Image Card (neobrutalism) | https://21st.dev/@ekmas/components/image-card/image-card-demo | Project cards: panel frame + hard shadow + B&W→color |
| Button (neobrutalism) | https://21st.dev/@ekmas/components/button/button-demo | CTAs with offset-shadow press |
| Halftone Dots shader | https://21st.dev/community/shaders/halftone-dots-8180425b-5d39-4b9b-bf47-ea5bb17f08e3 | Optional; WebGL cost. CSS screentone covers 90% |
Nothing on 21st.dev for "comic"/"manga", speech bubbles, focus lines or mascots: hand-build in CSS (~10-20 lines each).

## 5. Fonts (Google Fonts, all SIL OFL 1.1, confirmed in google/fonts `ofl/`; `next/font`, `latin` subset)
| Pairing | Display / SFX | Body | Mono (stats) | Feel |
|---|---|---|---|---|
| A (pick) | Dela Gothic One | Zen Kaku Gothic New | JetBrains Mono | Japanese print, clean |
| B | Anton + Rampart One (SFX only) | Geist | Geist Mono | Most corporate |
| C | Bangers (SFX only) | Space Grotesk | JetBrains Mono | Loud western comic, costume risk |
JP fonts are large: `latin` subset only; render the 2-3 katakana SFX as SVG. Never set body text in a display face.

## 6. Risks
- **Legibility**: text sits on solid paper/ink only; screentone behind non-text areas. Bubbles and SFX never carry essential info.
- **Contrast**: accent must hit 4.5:1 for text on both paper and ink. No gray-tone text.
- **Motion**: one flash max, everything gated by `useReducedMotion()`, no infinite loops (idle character bob stops after a few cycles).
- **Screen readers**: SFX and the guide character `aria-hidden`; guide comments are flavor, the same facts live in section copy; one `h1`.
- **Costume vs professional**: "Full Stack Engineer (AI/LLM)" must read in 3s on the cover, next to the character, not behind him. Chapter names are flavor; each chapter also shows the plain label (e.g. "Ch.4 Forging the Blade / Frontend Developer, Softtronix"). Chronological order buries the current AI work at Ch.5: solved by the cover profile card + TOC (section 7.1). No custom cursor, no loaders, no fake Japanese.
- **Character fatigue**: a guide that talks every screen gets annoying. One line per chapter, auto-hide after ~5s, a visible "Hide guide" toggle (remembered in localStorage).
- **Performance**: no WebGL, no filters on scrolling elements, no extra animation libs. Character poses ≤ 80 KB each, lazy except the cover pose.

## 7. Guide Character & Volume Structure (client core vision)
### 7.1 Volume structure: "a manga of my life" (chronological)
| Book part | Chapter title | Life event (resume facts) | What lives inside |
|---|---|---|---|
| Volume cover | "Vol. 1: Mayuresh Talewar" | Today | `h1`, title, pitch, CTAs, **character profile card**, TOC. Character says "Hello!" |
| Ch.1 | The Beginning | Diploma, Anjuman Polytechnic, Nagpur (2018-21) | Short origin beat, first code |
| Ch.2 | Academy Arc | B.Tech CSE, GH Raisoni (2021-24, 7.89) | Academic projects if any |
| Ch.3 | First Quest | Full Stack Dev Intern, Technology World Creater, Pune (Mar-Aug 2024) | What he shipped as intern |
| Ch.4 | Forging the Blade | Frontend Developer, Softtronix, Nagpur (Sep 2024-Jul 2025) | Frontend work, related client projects |
| Ch.5 | The AI Arc (current, in color) | Full Stack Dev, Crestline Intelligence, Pune (Aug 2025-now) | AI Meeting Assistant, Smart Email, RAG, MMS bento + impact stats (impact frame + ドン). The volume's color pages |
| Side Stories (外伝) | Gaiden | Personal/freelance projects | Shadow Monarch (color spread), TechAgri, SK Film, Urhan Treaders, RoboMeet. Each placed after the chapter of its year once the client confirms dates; default: one Side Stories spread after Ch.5 |
| Status Window | Skills | Resume skill groups | Solo Leveling "System window" panel: Frontend, Backend, GenAI/LLM, Databases, DevOps as stat blocks. Plain text, no fake levels/percentages |
| Finale | To Be Continued... | The next chapter | Contact form "the next chapter is written with you", farewell, socials, resume |
- **Recruiter fast path (fixes chronological order burying the AI work at Ch.5)**: the cover holds a **character profile card** panel (manga character-intro style): name, "Full Stack Engineer (AI/LLM)", current role @ Crestline Intelligence, Pune, the 4 real impact stats, Resume + Contact CTAs. Below it the chapter TOC, with "The AI Arc" marked "current arc" so a recruiter jumps there in one click. Everything a recruiter needs is above the fold; the story is for those who stay.
- **Chapter title page**: a ~50vh title panel per chapter (big "Ch.4", chapter name, plain label + years, one line), not full-viewport, so the story stays quick. Ink-splash or page-turn on enter.
- **TOC**: cover has a "Contents" link opening a modal TOC (`dialog`, keyboard-trapped, Esc closes) listing chapters with page numbers like a real volume. Same TOC is the mobile nav.
- **Chapter markers**: desktop right-edge rail `<nav aria-label="Chapters">` with chapter tabs (1-5, Gaiden, Status, Finale), active via `useInView`, `aria-current="true"`. Mobile: sticky "Ch.4 / 5" pill that opens the TOC.
- **Page numbers**: small "p. 12" in panel corners, `aria-hidden` decoration.
- **Reading progress**: `useScroll()` → `scaleX` on a 3px ink bar at top (transform only).

### 7.2 Character choreography
1. **Entry**: character inside the cover panel, wave-hello pose, "Hello!" bubble types in.
2. **4th-wall break**: as the hero scrolls (`useScroll({ target: hero, offset: ["start start","end start"] })` → `useTransform`), swap to break-out pose, scale up and translate so he overflows the panel border toward the viewer; a torn hole and crack lines appear at the border; one impact frame + バリッ.
3. **Companion**: past the hero he moves (shared `layoutId`) into a fixed side dock (desktop bottom-right, ~200px tall). Per chapter (`useInView` on each chapter) pose + bubble text come from `src/data/guide.ts`. Point pose aims at the content; think pose on Skills; a subtle `y` bob while scrolling stands in for walking.
4. **Finale**: in "To Be Continued..." he leaves the dock and lands in the final panel (wave-bye pose) with a CTA bubble pointing at the contact form.

### 7.3 Build options compared
| Option | Quality | Effort | Bundle (gzip, measured from unpkg) | Perf | Mobile | Reduced motion |
|---|---|---|---|---|---|---|
| **a) Pose images + `motion`** (pick) | High if art is good; pose swaps read as manga "panels" | Low-med (art is the cost) | 0 KB extra JS (`motion` already in) + ~6 × 40-80 KB WebP | Best: transforms on one fixed element | Easy: swap to head bust | Static poses, instant swaps |
| b) Rive state machine | Highest (smooth tweens, blinking, lip-flap) | High: rigged `.riv` needs a Rive animator (~$500-2,000) | `@rive-app/canvas-lite`: JS ~107 KB + WASM ~368 KB, plus `.riv` | Good, but a canvas runs per frame | OK, canvas resize | Pause state machine on a pose |
| c) Lottie / dotLottie | Good for vector loops, weak for a likeness | High: After Effects artist | `lottie_light` ~46 KB JS (SVG renderer is CPU heavy); dotLottie WASM ~496 KB | Med-poor with many vectors | OK | Show first frame |
| d) 3D VRM (three.js + @pixiv/three-vrm) | Cel-shaded 3D; reads "VTuber", not manga | Very high: VRoid model + posing + lighting | three ~150-180 KB + three-vrm ~37 KB + model 2-10 MB | Worst; Lighthouse 90+ at risk | Poor (battery, GPU) | Static render |
Verdict: (a). Manga is about drawn still poses, which is exactly (a); (b) is only worth ~475 KB if the client wants continuous animation later; (c)/(d) are not justified.

### 7.4 Building the 4th-wall break (option a)
- **Layering**: the panel border is its own absolutely positioned element (`z-1`); the character image sits at `z-2` inside a container with `overflow: visible`, so he renders over the border. Content behind uses `isolation: isolate` to keep stacking local.
- **Pop-out**: lower body clipped to the panel (`clip-path: inset()` on a duplicate layer) while head/arm overflow, the classic image pop-out ([CSS-Tricks technique](https://css-tricks.com/lets-create-an-image-pop-out-effect-with-svg-clip-path/)). Animate `scale`/`y` only.
- **Torn paper**: one SVG jagged-hole path used as `mask-image` on the border layer; reveal by animating the mask scale (or `clip-path` polygon) 0→1 at break progress ~0.4.
- **Crack**: 4-6 SVG lines from the hole, drawn with `pathLength` 0→1 (`motion.path`).
- **Mobile**: same break at smaller scale, then the dock collapses to a 64px head bubble bottom-left (clear of CTAs and the progress pill); tap to show the bubble; bubbles auto-hide; dock hides while a form field is focused and over the footer.
- **Reduced motion**: static composition with the character already overflowing the torn border (the break is still "seen"), poses switch without movement, no bob, no flash.

### 7.5 CRITICAL PATH: the artwork (we cannot generate it)
| Route | Consistency | Cost / time | Notes |
|---|---|---|---|
| Commission an artist ([VGen](https://vgen.co/), [Skeb](https://skeb.jp/) for JP manga artists, [Fiverr](https://www.fiverr.com/)) | Best | VGen listings: character sheet from ~$75, full-body from ~$36; 6 manga poses + sheet realistically $250-900, 1-4 weeks | Ask for commercial-use rights in writing + layered source (PSD/CSP). Recommended |
| Client photos → artist traces | Best + exact poses | Cheaper/faster than freehand | Client shoots 6 phone photos of himself in the poses on a plain wall |
| AI, client-run: Gemini image ("Nano Banana"), ChatGPT image, Midjourney V7 Omni Reference, Leonardo Character Reference | ~70-85% across poses, needs cleanup (hands, line weight) | $0-30, 1-3 days | Best AI workflow: same 6 pose photos + one style reference per call. Check each tool's commercial terms; never prompt "in the style of [named artist]" |
| Photo-to-manga filters | Low (looks filtered, not drawn) | Free | Not recommended |
| Rive / LottieFiles marketplace bases ([Rive community](https://rive.app/community/files)) | Not his likeness | Free-$ | Only useful if option (b) is chosen |
**Specs for Engineering (deliverables)**
- Poses (6 + 1): `01-wave-hello`, `02-break-out` (stepping/leaning through the frame toward the viewer), `03-walk` (optional 2-frame cycle), `04-point` (pointing left, toward content), `05-think`, `06-wave-bye` (or thumbs-up), `07-bust` head-and-shoulders for the mobile dock.
- Canvas: identical 1200 × 1600 px (3:4) for poses 01-06, same scale, feet on the same baseline, body centered on the same x; `02-break-out` may use a 1600 × 1600 canvas. Bust: 512 × 512.
- Format: transparent PNG-32 masters (or layered PSD/CSP), exported by us to WebP + AVIF with alpha, ≤ 80 KB each.
- Style: black ink + screentone only, consistent line weight, clean alpha edges (no white halo), no text or logos on clothing (we mirror with `scaleX(-1)`). Optional: one color version of `06` for the finale color page.
- We build in code: bubbles, torn hole, cracks, SFX, panel borders.

### 7.6 References: guide character / break-out (HTTP 200 on 2026-10-02)
| Site | What to take | Watch out |
|---|---|---|
| [rleonardi.com/interactive-resume](http://www.rleonardi.com/interactive-resume/) | Classic: an illustrated self walks through resume sections as you scroll | Old, HTTP only, scroll-hijacked; take the idea, not the build |
| [netfox.app](https://netfox.app) | Fox mascot rides bottom-right after the hero, walks while scrolling, stops when you stop, appears at the footer CTA | Exactly our companion pattern, small and polite |
| [adhamdannaway.com](https://www.adhamdannaway.com/) | Illustrated self-portrait as the hero identity of a designer/developer | Static only |
| [CSS-Tricks pop-out](https://css-tricks.com/lets-create-an-image-pop-out-effect-with-svg-clip-path/) | Working demo of a figure breaking out of its frame with clip-path | Tech demo, not a site |

## Recommendation
**Option 1: Clean editorial manga volume (PICK).** White paper, black ink, CSS screentone, one accent. Life-story volume (Ch.1 The Beginning → Ch.5 The AI Arc, Gaiden side stories, Status Window skills, "To Be Continued..." contact), cover profile card + TOC for recruiters, compact title panels, TOC modal, side chapter rail, reading-progress ink bar, "To be continued..." finale. Guide character via option (a): "Hello!" on the cover, one strong 4th-wall break, then a quiet side dock with one bubble per chapter and a hide toggle, farewell at the contact form. Color only on project screenshots, CTA, and the Shadow Monarch color spread. Fonts: pairing A. Motion 6-7. ~0 KB extra JS beyond `motion`.

**Option 2: Full shōnen action volume.** Every chapter opens on a full-viewport title spread with page-turn; tilted panels and speed lines everywhere; SFX per chapter; the character is animated in Rive (option b) with blinks, walk cycle and reactions to hover; rank-up framing (E-rank intern → S-rank engineer, Solo Leveling nod) across Ch.3-5. Fonts: Dela Gothic One + Bangers SFX. Motion 8-9. Most memorable, but +~475 KB runtime, a Rive animator budget, higher costume risk and harder AA.

Why Option 1: it delivers 100% of the client's vision (volume, chapters, his own character, 4th-wall break, guide to the end) while keeping the 3-second "Full Stack Engineer (AI/LLM)" read, Lighthouse 90+ and reduced-motion compliance. It is also upgradeable: the same 6 poses and `guide.ts` data can later be swapped for a Rive character without layout changes. Blocker: artwork. Client should start the commission (or photo + AI route) now; Engineering can build with placeholder silhouettes on the same 1200 × 1600 canvas spec.
