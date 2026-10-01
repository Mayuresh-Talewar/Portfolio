# 10: Luffy commission brief (RND-007, restructured around the 5 Gears in RND-008)
Status: READY TO SEND · Owner: R&D · 2026-10-02 · Builds on `07-luffy-onepiece-research.md` (bible §2, mapping §3, legal §1)
Client decision: **real Luffy via commissioned original fan art, MEDIUM legal risk accepted knowingly.** Not legal advice.

## 1. Commission brief (paste as-is; fill `[ ]`)
```
Hi! I'd like to commission ORIGINAL FAN ART of Monkey D. Luffy (One Piece) for my personal portfolio website.

IMPORTANT: The art must be drawn by you, by hand. It must NOT be traced from official art, manga panels or anime screenshots, must NOT be AI-generated, and must NOT include any official logos, the Straw Hat Jolly Roger or any text. Please share a rough sketch and one work-in-progress layer screenshot per piece.

CHARACTER (post-timeskip, on-model):
- Messy, short, spiky black hair; round black eyes; STITCHED SCAR UNDER HIS LEFT EYE; X-SHAPED SCAR ON HIS CHEST
- Straw hat with a RED BAND
- Red open cardigan with 3/4 rolled sleeves and four gold buttons, worn open over his bare chest
- Yellow sash at the waist, with the tail hanging on his LEFT hip
- Blue knee-length shorts with fluffy white cuffs; straw sandals
- Lean but broad-shouldered, about 6 heads tall, rubbery cartoon energy, big toothy grin
- The series is LUFFY'S FIVE GEARS: one signature illustration per Gear, each with its iconic look and attack:
  Gear 1 base Gomu Gomu no Pistol · Gear 2 Jet Pistol (pink-flushed skin, steam) · Gear 3 Gigant Pistol (giant bone-balloon fist) · Gear 4 Boundman Kong Gun (inflated, haki-black arms with flame patterns, steam scarf) · Gear 5 Nika laughing (white flame-wave hair, white clothes and hat band, cloud "scarf", red-ringed eyes, rubber-hose cartoon squash-and-stretch). Gear 5 shadows: neutral cool grey, not purple.
- All five on the SAME canvas, scale and baseline, so one pose can swap into the next in place.

STYLE (two versions of every piece, same linework):
1. B&W: Oda-style manga ink. Brush/G-pen line with strong thick-thin variation, solid blacks, crosshatching, minimal screentone, pure black on white.
2. COLOR: anime cel color under the SAME ink lines. Flat 2-tone cel shading, no gradients, no glow.

USE / LICENCE: displayed on my personal portfolio website [URL] (no merch, no ads, not used in social preview images). You keep your copyright and may post the art on your socials. Credit will read "Fan art by [your name]" with a link to your page.

DELIVERABLES: layered parts for web animation. The technical specs and pose list are attached. Budget: [ ]. Deadline: [ ].
```

## 2. Pose/asset list: the 5 Gears = the client's 5 career power-ups (each piece in B&W + COLOR)
Core concept: each chapter is a power-up. The chapter-change "Gear-up" beat (cookbook `04` §9d) swaps the previous Gear's body for the next one under its effect. Layers named `body`/`fx`/… are exactly what `GearArt` and `PistolArm` load.
| ID | Gear · attack (chapter) | Iconic look to nail | Separate layers | Web interaction (GSAP, cookbook §) |
|---|---|---|---|---|
| G1 | **Gear 1 · Gomu Gomu no Pistol** (Ch.1 Diploma) | Base post-timeskip; side view punching to screen-right, arm straight at shoulder height | `body` · `shoulder` · `upper-arm` · **`stretch`** (straight tube, constant width and line weight, ends cut square) · `forearm` · `fist` · `fx` (motion lines) | Gear-up "GOMU GOMU NO…" (§9d), then the pinned scrub: `stretch` `scaleX` from its left joint, forearm+fist ride the end, fist reaches into Ch.2, snaps back (§9f) |
| G2 | **Gear 2 · Jet Pistol** (Ch.2 B.Tech) | Low pump stance, pink-flushed skin (colour), steam venting from the body, blurred jet fist | `body` · `fx` (steam + fist blur, one layer) | Steam-burst Gear-up: G1→G2 swap under 8 flying puffs + pink flush (§9d) |
| G3 | **Gear 3 · Gigant Pistol** (Ch.3 Internship) | Normal body, ONE gigantic bone-balloon fist (fills about half the canvas) | `body` · `fx` (the giant fist/arm) | Inflate Gear-up: the fist layer scales 0.6→1 with `back.out`, the balloon pops (§9d) |
| G4 | **Gear 4 · Boundman, Kong Gun** (Ch.4 Softtronix) | Inflated upper body, haki-black arms and legs with flame patterns, steam "scarf", bouncing stance, fist pulled back into the arm | `body` · `fx` (haki forearm/fist + steam scarf) | Haki-ink-coat Gear-up: ink rises, text flips to paper, haki fx pops (§9d) |
| G5 | **Gear 5 · Nika, laughing** (Ch.5 Crestline AI Arc, the B&W→FULL COLOR climax) | White flame-wave hair, white clothes, cloud scarf, red-ringed eyes, huge grin, rubber-hose pose | `body` · `hair` · `cloud` · `mouth-a` + `mouth-b` (open laugh frames over the closed grin in `body`) | White flash hides the G4→G5 swap, elastic wobble, colour flood; then hair/cloud wobble + "shishishi" frame swap ≈3 s (§9d, §9f `laugh`) |
| X1 | Extra · **Wanted-poster bust** (Contact) | Front bust, grin, hat on | bust only (our own original frame) | Paper drop-in + swing (`WantedDrop`, §9b) |
| X2 | Extra · **Wave goodbye** (Finale) | 3/4 back-turn, waving over his shoulder | `body` · `arm` (pivot at the shoulder) | Arm `rotation` yoyo ×2 when the footer enters |

**Optional crew (after Luffy is approved; 1 half-body each, B&W + colour, single layer)**
| Chapter | Crewmate |
|---|---|
| Diploma | Zoro |
| B.Tech | Franky |
| Internship | Usopp |
| Softtronix | Nami |
| Crestline AI Arc | Robin |
| Gaiden | Brook |

## 3. Technical specs (attach to the brief)
- **Source:** layered PSD or CSP (Clip Studio), one file per pose, every part on its own named layer/group, **ink and colour on separate layers** (B&W version = ink layer only plus a white fill).
- **Canvas:** G1–G5 and X2 are **3000×4000 px**, all on the **same canvas size, same character scale (head ≈ 600 px tall) and same baseline (soles at y = 3800)**, so Gears swap in place. Effects may run off-canvas; crop them at the edge. Bust X1 is **3000×3000**. Optional crew: 3000×4000, same scale and baseline.
- **Background:** transparent. No floor, cast shadow, frame, text or signature on the art layers (signature on a separate layer, which we can place in the credit instead).
- **Rig alignment:** parts must align **pixel-perfectly** at their rest pose when stacked; joints overlap by ≥40 px (round ends under the next part) so rotation and stretch never show gaps. Add a `pivots` layer with a small cross at each rotation point (shoulder, elbow, hat brim, wave shoulder).
- **Exports per part:** `SVG` (vector ink, preferred; we run SVGO) **or** `PNG` at full canvas size with transparency. We convert to WebP **without cropping**: the code stacks full-canvas layers with `fill`, so the same canvas offset for every part means no manual re-alignment.
- **Naming** (the code loads exactly these from `public/art/luffy/`): `luffy-g<1-5>-<part>-<bw|color>.webp`, parts as in the §2 table, e.g. `luffy-g1-stretch-bw.webp`, `luffy-g3-fx-bw.webp`, `luffy-g5-mouth-a-color.webp`. Extras: `luffy-x1-bust-<bw|color>`, `luffy-x2-<body|arm>-<bw|color>`. Crew: `crew-<name>-<bw|color>.webp`.
- **Budgets (shipped):** ≤150 KB per layer per version after WebP (transparent areas compress to almost nothing). ≤1.5 MB of Luffy art across the whole site. Each Gear's layers load lazily as its chapter nears; nothing Luffy is in the initial load. Rough ink exported as vector can bloat; if an SVG exceeds 150 KB, ship WebP @2x of its display size instead.

## 4. Where to hire (prices and timeline are ESTIMATES, unverified market ranges)
| Platform | Search terms | Notes |
|---|---|---|
| **VGen** (vgen.co) | `One Piece`, `Luffy`, `manga lineart`, `Live2D model art` (Live2D artists already deliver separated, rig-ready parts) | Licence tiers Personal / Commercial: Content / Merchandising ([VGen](https://help.vgen.co/hc/en-us/articles/29122353993495-Standard-Usage-Licenses)). Pick **Personal**, adding "displayed on my portfolio site" in the request (or Commercial: Content if the artist requires it). 5% fee is charged to the artist ([VGen fees](https://help.vgen.co/hc/en-us/articles/12820094917655-What-are-VGen-s-fees)) |
| **Skeb** (skeb.jp) | Japanese artists tagged ONE PIECE / ルフィ | The most on-model OP artists. Default is **personal use only**, and any other use must be written in the request ([Skeb client guide](https://lp.skeb.jp/client?locale=en)). Requests are short and auto-translated, so it is poor for layered rigs; use it for X1 + crew, not the Gears |
| **Fiverr** | `one piece fan art`, `manga style illustration`, `layered character for animation` | Filter Level 2+/Pro. Demand WIP layers (screens out AI and tracing) |
| X/Twitter, r/HungryArtists | `#ONEPIECE fanart` + `commissions open`, `[Hiring]` post | Check their portfolio for hand-drawn OP pieces with visible line variation |

**Budget (estimate):** 5 Gear full-body pieces (Gears 3–5 are effect-heavy) + 2 extras, each in B&W + colour with separated layers ≈ **US$900–3,200**. That's base full-body $80–250 per Gear piece, +30–50% for separated parts, colour version +30–60%, commercial-content licence +0–100% if required. Extras ≈ $60–200 each. Optional crew ≈ **$50–150 each**.
**Timeline (estimate):** shortlist plus quotes 1 week → G1 paid test (the hardest rig) 1–2 weeks → G2–G5 sketches 1–2 weeks → finals 3–5 weeks → Dev rig check plus fixes 1 week = **7–11 weeks**. The site ships tonight without art (`features.luffy=false`: every Gear-up is a typographic/FX moment), and the art drops in Gear by Gear.
**Vetting checklist:** on-model OP samples · hand-drawn WIPs · agrees to the no-trace/no-AI clause · has delivered layered files before · will do one alignment fix round.

## 5. Risk mitigation (Engineering + Growth)
**Credit/disclaimer**: shown in the footer on every page that displays the art, plus once at the end of the cover:
> Monkey D. Luffy and ONE PIECE © Eiichiro Oda / Shueisha, Toei Animation. Original fan art by [Artist] ([link]), commissioned as a personal tribute. This site is not affiliated with or endorsed by the rights holders.

**Rules**
- No official assets anywhere: no logo, title font, Jolly Roger, screenshots, scans, Den Den Mushi or Marine "WANTED" layout (our poster frame is original). Repo grep/PR checklist item: `one piece logo|toei|screenshot` assets = reject.
- **One kill switch:** `siteConfig.features.luffy: boolean` in `src/data/site.ts`. Every Luffy render goes through it (`features.luffy ? <LuffyPose/> : <GuideFallback/>`, where the fallback is the `06` placeholder/homage). Assets live only in `public/art/luffy/`. No Luffy import outside `src/components/luffy/*`.
- **Takedown runbook:** (1) set `features.luffy=false`; (2) delete `public/art/luffy/`; (3) redeploy; (4) **delete old Vercel deployments**, because their immutable URLs still serve the art; (5) reply to the notice. Don't counter-notify (we'd lose).
- **Low discovery surface:** no Luffy in `opengraph-image.tsx`, `<title>`, meta description, keywords, JSON-LD or sitemap image entries. `robots.ts` gets `Disallow: /art/luffy/` (keeps the art out of image search, where bots match images). Alt text describes the action ("Cartoon pirate stretching his arm toward chapter 2"), not trademarks. Growth: don't post the art as the site's social card or tag official accounts.
- Store the commission chat/invoice (proof of original, licensed-from-artist work) in the client's records, not the repo.
