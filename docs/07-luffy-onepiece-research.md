# 07: Luffy / One Piece research (RND-005)
Status: FOR CLIENT DECISION · Owner: R&D · 2026-10-02 · Inputs: `01-project-brief.md`, `03-design-spec.md`, `04-motion-cookbook.md`, `05-tech-plan.md`, `06-character-art-kit.md`
Web claims were checked on 2026-10-02. Fandom wiki pages returned HTTP 402 to our fetcher, so the character facts come from Wikipedia, press articles and series knowledge. Design should confirm them against the client's own volumes.

## 0. TL;DR
- **"100% the same as the anime" and "safe on a public, career-promoting site" can't both be true.** Anything that is visibly *Luffy* copies a protected character (© Eiichiro Oda/Shueisha; anime © Toei Animation). The closer it gets to the real thing, the higher the risk.
- **An AI agent writing SVG/Three.js by hand can't produce on-model Luffy.** At best you get an "obviously Luffy-ish" mascot. On-model art needs a human artist (or official assets, which we rule out).
- **Recommended route: "Straw Hat homage."** The client's own character from `06` wears a straw hat with a red band, red open shirt and yellow sash (a cosplay of himself), and the site uses original One-Piece-*flavoured* mechanics: a stretching arm, a Gear-5 cartoon transition, a Grand Line chapter map and a bounty-poster contact section. **No Luffy face, no official art, no logo, no Jolly Roger.** Legal risk: **Low.**
- **Stack:** GSAP 3.15 + `@gsap/react` 2.1 (all plugins free on public npm) and `three` 0.186 lazy-loaded. **Remove `motion`** (it's imported in one file, `ui/fade-in.tsx`, which the tech plan already deletes).

## 1. LEGAL (not legal advice; talk to a lawyer before launch if real Luffy art ships)
**Facts**
| Fact | Source |
|---|---|
| Manga © 1997 Eiichiro Oda/SHUEISHA Inc.; anime © Toei Animation | https://onepiece.fandom.com/wiki/One_Piece_Wiki:Copyrights (title page via search) |
| "ONE PIECE" is a US registered trademark of Shueisha (Reg. 3743349) | https://trademarks.justia.com/785/33/one-78533105.html |
| Toei's site: content "shall [not] be copied, reproduced, modified"; infringement treated "as a counterfeiting" | https://www.toei-animation.com/copyrights/ |
| Jan 2021: Shueisha DMCA'd **non-commercial** fan uses on Twitter (avatars, banners, screencaps, GIFs) incl. One Piece | https://boundingintocomics.com/anime/shonen-jump-publisher-shueisha-begins-issuing-dmca-strikes-over-images-from-various-anime-series-including-dragon-ball-and-one-piece |
| Toei struck ~150 review/drawing-tutorial videos (One Piece, DB); Japan has no US-style fair use | https://www.cbr.com/toei-animation-copyright-youtube-totally-not-mark/ |
| Toei took down fan edits and struck Uncle Roger's One Piece video (later withdrawn) | https://www.dexerto.com/anime/one-piece-toei-animation-fan-edit-taken-down-2779287/ · https://animecorner.me/toei-drops-copyright-claim-on-uncle-rogers-one-piece-video/ |
| Oda's one fan-art waiver (LINE stamps, 2020) was **1 year only**, original art only, and Oda said "ordinarily this is something you can't do" | https://soranews24.com/2020/06/17/one-piece-creator-waives-copyright-for-line-stamps-allows-fans-to-post-profit-from-fan-art/ |
| Vercel: a valid DMCA notice disables the **whole deployment** if the whole site infringes, or specific pages; counter-notice restore takes 10–14 business days | https://vercel.com/kb/guide/how-does-vercel-handle-copyright-infringement-claims · https://vercel.com/legal/dmca-policy |
| Sketchfab uploaders can't grant rights in characters they don't own; licensee "solely responsible" for permissions | https://sketchfab.com/licenses |

**What this means**
- A portfolio that promotes paid work is **commercial-adjacent**, so "it's just fan art" weakens. US fair use is unlikely for decorative use, and Japan has no fair use.
- Enforcement in practice is **opportunistic** (bots plus mass strikes on platforms). A small personal site is rarely targeted, but when it is, the result is a takedown of the deployment *during a job search*. Being sued is unlikely; being taken down is the realistic worst case.
- Copyright protects the **character's expression**: the face, scar, X-scar and hat-and-outfit combo together. A plain straw hat or a red shirt alone is not protectable. A *named* "Luffy", the logo, the Straw Hat Jolly Roger or the Den Den Mushi design all pull the work toward infringement and trademark.
- An AI-generated "Luffy" counts the same as drawn fan art (it is still a derivative of the character) and doesn't reduce risk.

**Risk per route**
| Route | Risk | Why |
|---|---|---|
| Official art, manga scans, anime screenshots/GIFs, official logo | **HIGH** | Direct copying of the exact assets that get bot-struck |
| Downloaded fan 3D model (Sketchfab CC-BY etc.) | **HIGH** | Two rights holders (modeler + Shueisha); the CC licence covers neither the character nor commercial safety |
| Commissioned original fan art of Luffy/crew, credited "unofficial fan tribute" | **MEDIUM** | Still a derivative; tolerated at conventions/socials but not licensed; a notice would pull the page |
| AI-agent SVG/3D "Luffy" | **MEDIUM** | Same derivative problem, and lower quality |
| Homage: client's own character + straw hat/red band/outfit cues, original mechanics, no names | **LOW** | No copied expression; reads as cosplay or homage, which is the safest way to get the One Piece feel |
| Generic pirate/adventure motifs (compass, map, bounty poster in our own layout) | **VERY LOW** | Unprotectable ideas |

## 2. Luffy character bible
**Eras** (height per series databooks: ~172 cm pre / ~174 cm post; head:body ≈ 1:5.5 pre, ≈ 1:6 post, approx.)
| Era | Look |
|---|---|
| Pre-timeskip (ch. 1–597) | Lanky teen; red **sleeveless** vest with buttons; blue shorts rolled at the knee; straw sandals; hat on head or hanging on his back by its string |
| Post-timeskip (ch. 598+) | Broader shoulders; **X-scar on the chest** (from Akainu's magma fist at Marineford); red **open cardigan, 3/4 rolled sleeves, four gold buttons**; **yellow sash** at the waist with the tail on his left hip; blue shorts with **fluffy white cuffs**; sandals ([gamerant](https://gamerant.com/one-piece-cool-details-you-might-have-missed-about-luffy-clothes/)) |
| Wano (ch. 909–1057) | "Luffytaro": red patchwork kimono/yukata with a blue pattern, hat on his back; early on a topknot ([animeanime](https://animeanime.global/2020/08/21/55707.html)) |
| Gear 5 (ch. 1044, anime ep. 1071, 6 Aug 2023) | Hair, clothes and hat band turn **white**; flame-like wavy hair; a cloud/steam "scarf" around his shoulders; red-ringed eyes; huge grin; rubber-hose cartoon physics (Tom & Jerry homage) ([Wikipedia](https://en.wikipedia.org/wiki/Luffy's_Peak_-_Attained!_Fifth_Gear), [CBR](https://www.cbr.com/one-piece-episode-1071-1072-classic-western-cartoon-reference/)) |

**Constants:** black, messy, short spiky hair; round black eyes; **stitched scar under the LEFT eye** (self-inflicted as a child to prove his courage to Shanks); straw hat with a **red band**, a gift from Shanks ([Wikipedia](https://en.wikipedia.org/wiki/Monkey_D._Luffy)).

**Colors.** *Toei and Shueisha publish no official HEX/model-sheet values.* Every public "Luffy palette" is fan-sampled. Use these only as a starting point; Design should resample from licensed color pages the client owns (Color Walk artbooks, tankōbon covers).
| Part | Fan-sampled HEX | Source |
|---|---|---|
| Vest/cardigan red | `#ED1C24` / `#BB353B` (anime cel, darker) | https://fandomcolors.com/one-piece-monkey-d-luffy-color-codes/ · https://www.anime-colors.com/one-piece-series/monkey-d-luffy |
| Straw hat | `#FFC72C` / `#EBCF59` / `#DEBC6E` (shadow) | same |
| Shorts blue | `#2E3192` (vivid) / `#506CB5` (anime cel) | same |
| Skin | `#FFD1A4` / `#EEC2A1` | same |
| Hair/ink | `#1A1A1A` / `#1C1C1C` | same |
| Sash yellow, hat band red | not published, sample from art (band ≈ vest red) | — |

**Line style**
- **Oda manga:** a rubbery, exaggerated cartoon anatomy (long noodle limbs, huge mouth and teeth when grinning, tiny dot pupils when shocked), brush/G-pen line with strong thick-thin variation, dense panels, heavy blacks, crosshatching rather than lots of screentone.
- **Toei anime:** cleaner, more uniform lines and 2-tone cel shading. From Wano onward (observed) the lines get thicker and more variable, with ukiyo-e style color grading. Gear 5 episodes use deliberate rubber-hose, Western-cartoon timing.
- The site's B&W manga base (`03`) suits Oda's ink look better than Toei's cel look.

**Personality and voice:** simple, hungry (meat), fearless, fiercely loyal and intuitive in a fight; hates being called a hero; a free spirit. Laugh: **"Shishishi!"** Lines: **"I'm gonna be King of the Pirates!"**, "Gomu Gomu no…!" before attacks. Signature poses: hand holding the hat down with a shadowed grin, the open-arm shout, the cocked-back stretching punch, crouched on the Sunny's figurehead.

**Abilities → visuals → web interaction**
| Ability | Looks like | Web idea (GSAP) |
|---|---|---|
| Gomu Gomu no **Pistol** | Arm stretches straight out, motion lines, then snaps back | **Stretching arm across a section**: an SVG path whose `scaleX`/length is scrubbed to scroll, with a fist "punching" the next chapter title (DrawSVG plus a transform on the fist group) |
| **Gatling** | Many blurred fists, afterimages | Stagger-in for skill chips or project cards (one timeline, `stagger`) |
| **Bazooka** | Both palms thrust together | Hero CTA hover "push" |
| **Gear 2** | Pink-flushed skin, steam venting, crouched pump stance | Section "power-up": steam SVG puffs plus a hue flush on scroll enter |
| **Gear 3** | Bone-balloon giant fist/leg | Scroll-scrubbed giant fist scale-up that wipes the screen |
| **Gear 4** (Boundman) | Inflated, haki-black arms with flame patterns, steam scarf, constant bouncing | An idle "bounce" loop on the guide (off under reduced motion) |
| **Gear 5** | White hair/clothes, cloud scarf, cartoon squash-and-stretch, eyes popping | **Page/chapter transition**: the page goes white, panel borders wobble (MorphSVG), with squash-and-stretch on the next chapter title |
| **Haki** (Armament/Observation/Conqueror's) | Black-metal coating / foresight / red-black lightning | Armament = ink-fill wipe on headings; Conqueror's = black-red lightning flash (≤1 flash, ≤100 ms, per `05` ENG-502) |

## 3. The crew (one line each)
| Character | Signature visual | Palette |
|---|---|---|
| Zoro (swordsman) | Green hair, three katana, haramaki, eye scar post-skip | green, black, white |
| Nami (navigator) | Orange hair, Clima-Tact, tattoo on her left shoulder | orange, blue, white |
| Usopp (sniper) | Long nose, curly hair, goggles, Kabuto slingshot | brown, yellow, green |
| Sanji (cook) | Blond hair covering one eye, curly brow, black suit, kicks only | black, blond, blue |
| Chopper (doctor) | Small reindeer, pink top hat with an X | pink, brown, blue |
| Robin (archaeologist) | Black hair, sprouting extra arms (Hana Hana), reads Poneglyphs | purple, black |
| Franky (shipwright) | Blue pompadour, cyborg forearms, star tattoo, speedo | cyan, red, skin |
| Brook (musician) | Skeleton with an afro, top hat, cane sword, violin | black, white |
| Jinbe (helmsman) | Large whale-shark fishman, kimono | blue, orange |

**Proposed mapping (life chapters → arc + crewmate, as metaphor; under the LOW-risk route use names in copy only, never their likeness)**
| Client chapter | Arc metaphor | Crewmate | Why |
|---|---|---|---|
| Diploma 2018–21 | Romance Dawn / East Blue | Zoro | The first recruit and the foundation; discipline |
| B.Tech CSE 2021–24 | Water 7 | Franky | Engineering: building the ship |
| Internship (TWC, 2024) | The two-year timeskip | Usopp | Apprentice-to-pro training arc |
| Softtronix (Frontend) | Dressrosa | Nami | Navigator = UI/UX; a colorful arc |
| **Crestline AI Arc** (2025–) | Wano → Gear 5 awakening | Robin | Reading Poneglyphs = RAG over 10k docs; the "awakening" peak |
| Gaiden projects | Oda's cover-page serials | Brook | Literally side stories; SK Film = music/performance |
| Skills | The crew roster | All | Each skill group gets a role: Nami FE, Sanji BE ("serves"), Robin GenAI, Chopper testing, Jinbe DevOps (helm), Franky infra |
| Contact | Bounty poster plus "call me" snail-phone *idea* | Luffy (hat only) | Our own original bounty layout; do not copy the Marine WANTED design or the Den Den Mushi likeness |

## 4. "100% same as anime": honest route assessment
| Route | Accuracy | Effort | Cost | Size/perf | Legal |
|---|---|---|---|---|---|
| **(a) 2D layered SVG rig + GSAP** | Depends only on the illustrator. **AI-agent hand-coded SVG: ~40–60%** (recognisable costume, off-model face/anatomy). Pro illustrator: 90%+ in a fixed style | Artist draws parts (head, torso, 2-segment arms, hat, mouth set) in Illustrator/Figma; Dev rigs pivots and an arm-stretch path | Freelance $300–1,500+ (market estimate, unverified) | Tiny: 30–150 KB SVG, GPU transforms, crisp at any DPI | MEDIUM if Luffy; **LOW if it's the client's homage character** |
| **(b) Three.js 3D** | Fan models vary: the free Sketchfab Gear 5 by Cloud Runner is CC-BY, **376.6k tris**, rig status not stated ([link](https://sketchfab.com/3d-models/luffy-gear-5-71ad795568244190beb124a124cd0fd1)); others are CC-NC or paid "royalty-free" ([search](https://sketchfab.com/3d-models/luffy-gear-5-one-piece-5a3c373287764709a62fd15234ed4e59)). Toon look: 70–85% at best; 3D anime faces read "figurine", not anime | High: decimate to ≤30k tris, rig, retarget, shader work | Model free–$100; days of Dev/3D work | Heavy: `three` ~150 KB gz + GLB 1–5 MB; GPU cost on mobile | **HIGH**: modeler licence ≠ character rights ([Sketchfab licence](https://sketchfab.com/licenses)) |
| **(c) Commissioned fan art** | 90–98% (a good OP fan artist nails the model) | Brief + 1–2 revision rounds | $100–600 per illustration (estimate) | WebP/AVIF stills, small | MEDIUM |
| **(d) Official art/screenshots** | 100% | Low | Free to grab | Small | **HIGH**: the exact thing that gets struck |

**3D details (if ever chosen; best used with an original/homage model)**
- **Toon look:** `MeshToonMaterial` + a 3–4 step `gradientMap` (texture `minFilter/magFilter = NearestFilter`) ([docs](https://threejs.org/docs/pages/MeshToonMaterial.html)). Outlines: **inverted hull** (a back-face, normal-extruded black copy: cheap, works on any mesh) or `OutlineEffect` (`defaultThickness` 0.003) ([docs](https://threejs.org/docs/pages/OutlineEffect.html)). Add a post-process edge pass only if needed (costs a full-screen pass).
- **Rigging:** Mixamo auto-rig expects human proportions; it fails on big hair, hats and cartoon bodies, and exports FBX/DAE, so convert to GLB in Blender ([Adobe FAQ](https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html), [guide](https://app.cinevva.com/guides/free-character-animations-rigging)). Rubber stretch needs extra bones or shape keys, which Mixamo can't do.
- **Budget:** ≤30k tris, 1 material atlas, KTX2 or 1k WebP textures, `gltf-transform` + meshopt/Draco → **GLB ≤1.5 MB**, `three` loaded only on demand.
- **Scroll-driving:** one `gsap.timeline({scrollTrigger:{trigger, pin:true, scrub:1}})` tweening `camera.position` and `model.rotation`; render on `gsap.ticker` (one RAF); scrub a clip with `mixer.setTime(progress * clip.duration)` in `onUpdate`.

**Verdict:** "100% same" is only reachable with (d) official assets (HIGH risk) or (c) a skilled human artist (MEDIUM). **The best realistic route is (a) with a human illustrator, applied to the client's own homage character (LOW).** It's the cheapest to run, the sharpest on screen, and the easiest to scrub with GSAP.

## 5. GSAP + ScrollTrigger in Next 16 / React 19
**Licence (verified):** Webflow acquired GreenSock (Oct 2024). GSAP 3.13+ made **all plugins free, including commercial use**, on the public npm `gsap` package, with no Club token/registry ([3.13 blog](https://gsap.com/blog/3-13/), [CSS-Tricks](https://css-tricks.com/gsap-is-now-completely-free-even-for-commercial-use/), [Installation](https://gsap.com/docs/v3/Installation/)). Standard "no charge" licence: the only restriction is building a visual animation builder that competes with Webflow ([licence](https://gsap.com/standard-license)). npm on 2026-10-02: `gsap@3.15.0`, `@gsap/react@2.1.2`, `three@0.186.1`.

**Imports:** `gsap/ScrollTrigger`, `gsap/ScrollSmoother`, `gsap/SplitText`, `gsap/DrawSVGPlugin`, `gsap/MorphSVGPlugin`, `gsap/MotionPathPlugin` ([Installation](https://gsap.com/docs/v3/Installation/)).

**Patterns** ([React guide](https://gsap.com/resources/React/))
```tsx
"use client"; // leaf only; page stays RSC
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(useGSAP, ScrollTrigger); // module scope, client file

export function StretchArm() {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "+=150%", pin: true, scrub: 1 } })
        .fromTo(".arm", { scaleX: 0.1 }, { scaleX: 1, transformOrigin: "left center", ease: "none" })
        .to(".fist", { x: "60vw" }, "<");
    }); // reduced motion: nothing registers, static final pose in CSS
  }, { scope: root });
  return <div ref={root}>…</div>;
}
```
- **Cleanup/route change:** `useGSAP` wraps `gsap.context()`, so on unmount every tween/ScrollTrigger is reverted (Strict Mode safe). Use `contextSafe` for click handlers. After fonts/images change layout, call `ScrollTrigger.refresh()` once.
- **Responsive and a11y:** `gsap.matchMedia()` for breakpoints plus `prefers-reduced-motion` ([docs](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/)). Under reduced motion: no pin, no scrub, final state visible.
- **Plugins worth using:** ScrollTrigger (pin/scrub), SplitText (chapter titles, SFX), DrawSVG (ink strokes, the arm path), MorphSVG (Gear 5 wobble panels), MotionPath (fist/ship along a Grand Line path). **Skip ScrollSmoother**: it hijacks native scroll, fights `position:sticky`, and is an a11y and perf cost. Add it only if the client insists.
- **Remove `motion`: YES.** One engine means one mental model, one RAF, one reduced-motion path, and a smaller bundle. `motion` is used in one file slated for deletion. Rewrite the `04` cookbook's `motion/react` recipes (15 references) and update `01`/`05` "motion only" rules → GSAP. Keep the pure-CSS recipes (`.panel-in` etc.) as CSS.

**Three.js + ScrollTrigger**
- Load `three` only near the 3D section: an `IntersectionObserver` (rootMargin `200%`) mounts `dynamic(() => import("./scene"), { ssr: false })` inside a client leaf. Reserve the box size (no CLS) and show a poster image until it's ready.
- One loop: `gsap.ticker.add(render)`. Pause when off-screen (`ScrollTrigger` `onToggle`) and on `visibilitychange`. Cap DPR at `Math.min(devicePixelRatio, 2)`.
- **Mobile/low-power fallback:** under 768px, `saveData`, or no WebGL2 → a static poster or 2D SVG version. Under reduced motion → the poster only.
- Budget: Lighthouse ≥90 (per `05`). JS for the 3D chunk ≤200 KB gz, GLB ≤1.5 MB, nothing 3D in the initial route bundle.

## 6. Live reference sites (all HTTP 200 on 2026-10-02; stacks per the cited write-ups)
| Site | Why look | Stack |
|---|---|---|
| https://ponpon-mania.com | Illustrated **character story**; SOTD/SOTM Oct 2025 | Nuxt, OGL (WebGL), GSAP, Lenis ([utsubo](https://www.utsubo.com/blog/immersive-storytelling-websites-guide)) |
| https://sleep-well-creatives.com | Scroll-paced illustrated 3D narrative | Three.js, scroll-driven ([utsubo](https://www.utsubo.com/blog/best-threejs-websites-2026)) |
| https://www.shopify.com/editions/spring2026 | Scroll-sequenced 3D chapters | Three.js + GSAP choreography (same) |
| https://brand.ivress.co.jp | Japanese "short film" scroll story | Three.js WebGPU + fallback (same) |
| https://santionispirits.com | **Comic-book** illustrated storytelling | (stack unstated) (storytelling guide) |
| https://bruno-simon.com | Character-driven Three.js portfolio classic | Three.js |
No live *licensed* One Piece fan-portfolio reference was found, which is consistent with the legal picture.

## 7. Recommendation (plan)
1. **Route = Homage (LOW risk).** The client's guide character from `06` gets a "Straw Hat" variant: straw hat with a red band, red open shirt, yellow sash, blue cuffed shorts, sandals, and a "shishishi"-style grin. **No** Luffy face, scars, name, logo, Jolly Roger or Den Den Mushi likeness. Copy may say "inspired by my favourite manga" without naming it (or name it in an About line, which is lower risk than imagery).
2. **Art = human illustrator** (route a), delivering layered SVG/PNG parts: body, 2-segment stretch arm, hat, 4 mouth shapes, Gear-5 "white" variant. Update the `06` prompt pack: AI images are fine for concepts, but final parts are clean vectors.
3. **Motion = GSAP only.** Signature moments: (i) the Gomu-Gomu arm reaching across Ch.1→Ch.2; (ii) a Gatling stagger on skills; (iii) a **Gear-5 white wobble transition** into the Crestline AI Arc; (iv) an armament-ink wipe on chapter titles; (v) a bounty-poster contact.
4. **3D = optional, one section only** (e.g. a toon straw hat or a ship on a scroll path, built from an original model), lazy-loaded with the poster fallback. Skip it if Lighthouse drops below 90.
5. **Tickets:** `npm rm motion && npm i gsap @gsap/react` (+ `three` only if step 4 goes ahead); rewrite the cookbook (`04`) to GSAP; amend the `01` requirement "motion only".

**Client must decide/provide**
- [ ] Accept the Homage route, or knowingly accept MEDIUM risk for commissioned Luffy fan art (then: credit "One Piece © Eiichiro Oda/Shueisha, Toei Animation; unofficial fan tribute" and keep it off the hero).
- [ ] Budget and an illustrator for the layered rig (or the existing art-kit artist).
- [ ] Whether to name One Piece/crew in copy, and whether the chapter↔crew mapping (§3) is wanted.
- [ ] 3D: yes/no.
- [ ] Licensed color references they own (artbook/tankōbon) if exact colors matter.
