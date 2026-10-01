# Character Art Kit: "Mayuresh" guide character (DES-002)
Status: READY FOR CLIENT · Owner: Design Studio · 2026-10-02 · Refs: `02-research-report.md` §7.5, `03-design-spec.md` §1-2, §9
Until the art lands, the site and tile show a labelled placeholder box at the final size (no interim drawing). Target look (client ref `docs/references/client-style-ref-01.jpg`, traits only, never copy that character): raw G-pen shōnen manga ink, high contrast, solid blacks, flicked-strand hair, angular face, cocky grin, correct anatomy. Not chibi, clip-art or a cartoon avatar.

## 1. Character design sheet (from `public/images/portrait.webp`)
| Trait | Spec |
|---|---|
| Age / build | Early-to-mid 20s, medium build, broad shoulders. Shōnen protagonist proportions: **6.5 heads tall**, not chibi, not bishōnen-thin |
| Face | Oval face drawn **sharp and angular** (pointed chin, defined cheekbones and jaw). Confident **smirk/grin**, cool attitude. Dynamic 3/4 angles, close framing that leans into the camera |
| Hair | Very dark brown, near black. **His tall swept-up quiff/pompadour with short tapered sides**, rendered in the client-ref style: drawn mostly white/open with **many fine flicked ink strands** and a few spiky, messy loose locks, not a solid black helmet |
| Eyes / brows | Dark brown eyes, slightly almond-shaped, anime-sized but not huge. **Thick, straight, dark eyebrows** (a key likeness feature). **No glasses** |
| Facial hair | **Thin moustache + short chin beard/goatee**, light stubble along the jaw |
| Skin | Warm medium-brown. B&W: light screentone (fine dots), never left blank-white and never grey-filled. Color: `#C68A5C` base, `#9C6440` shadow |
| Outfit (dev casual) | **Dark zip jacket / black hoodie rendered as heavy SOLID BLACK fill** with rough dry-brush scratch hatching for folds, over a white tee. Over-ear headphones around the neck. Dark trousers, white sneakers. No logos or text (art gets mirrored). Optional accessory: **small round sunglasses** for the cool poses (01, 02, 06); without them the eyes follow the "Eyes" row |
| Optional props | Laptop under the arm (`04-point` alt), coffee mug (`05-think` alt) |
| Line style | **Raw, energetic G-pen ink**: loose, scratchy, confident strokes, strongly varied line weight, visible pen texture. Pure black `#1B1B1B` on pure white, no grey lines |
| Shading (B&W) | **High contrast**: pure white paper + pure ink, very little mid-tone. Solid blacks on clothing, scratch hatching for folds, sparse dot screentone only in backgrounds or small accents. Sharp, angular face shadows |
| Color version | Anime color-page style: **ink linework stays on top**, flat limited colors underneath (no rendering, no gradients): jacket near-black with `#0B6AA0` print-cyan accents, tee `#F4F4F1`, headphones Jump red `#D1172F`, skin `#C68A5C` / shadow `#9C6440`. **No purple, no neon, no glow** |

## 2. Prompt pack (ChatGPT image gen / Gemini "Nano Banana"): copy-paste ready
**Workflow**
1. New chat. Upload `portrait.webp` and paste **2.1 Master**. Regenerate until the face reads as you, then save that sheet as `ref-sheet.png`.
2. For each pose: new turn (new chat if the face starts drifting). Upload **`ref-sheet.png` + `portrait.webp`**, paste the pose line, then the **2.0 Style + Negative** block.
3. One pose per turn. If something is wrong, **regenerate**; don't ask the tool to "edit" more than once, because faces drift.
We describe the look instead of naming shows or artists; that's safer for licensing and gives the tools clearer instructions.

### 2.0 Style + Negative block (paste at the end of EVERY prompt)
```
ART STYLE: black-and-white Japanese shōnen action-manga page art. Raw, energetic G-pen ink linework: loose, scratchy, confident strokes with strongly varied line weight and visible pen texture. Very high contrast: pure white paper and pure black ink, very little mid-tone. Heavy SOLID BLACK fills on the dark jacket with rough dry-brush / scratch hatching for folds. Hair drawn with many fine flicked strands and a few messy spiky locks. Sharp, angular face with a confident smirk and cool attitude. Sparse dot screentone only in small background areas. Dynamic 3/4 camera angle, figure leaning toward the viewer. Correct adult anatomy, about 6.5-7 heads tall.
OUTPUT: single character, full figure unless stated, transparent background (PNG with alpha), no floor, no cast shadow, no panel border, no speech bubbles, no text, no logo, no watermark, no signature.
NEGATIVE (do NOT do): no chibi, no super-deformed, no big-head avatar, no cartoon/clip-art/flat vector avatar, no 3D render, no Pixar/Disney/CGI look, no semi-realistic painting, no soft airbrushed shading, no clean vector lines, no large flat grey areas, no photo filter look, no western comic style, no blurry or sketchy lines, no extra fingers or broken hands, no purple, no violet, no neon glow, no gradients on clothing, no lens flare.
```

### 2.1 Master: character reference sheet (upload `portrait.webp`)
```
Create a professional anime CHARACTER REFERENCE SHEET of the man in the uploaded photo, keeping a strong likeness.
CHARACTER: early-20s South Asian man, warm medium-brown skin, very dark brown hair in a tall voluminous swept-up quiff (pompadour) with short tapered sides, thick straight dark eyebrows, dark brown almond-shaped eyes, NO glasses, thin moustache and short chin beard with light jaw stubble, oval face with a softly squared jaw, calm confident expression.
OUTFIT: dark zip jacket / black hoodie drawn as heavy solid black with scratch-hatched folds, over a plain white t-shirt, over-ear headphones resting around the neck, dark slim trousers, white sneakers. No logos or text on clothing. Also show one head close-up wearing small round sunglasses (optional accessory).
LAYOUT: one wide 2400x1600 canvas, plain white background (this sheet only).
- Row 1: full-body turnaround (front, 3/4, side, back), neutral standing, same height, same baseline. Raw black-and-white G-pen manga ink, solid blacks, high contrast.
- Row 2: three head close-ups (neutral, big friendly grin, thinking), plus ONE full-body COLOR version in anime color-page style (ink lines on top, flat limited colors underneath): near-black jacket with print-cyan #0B6AA0 accents, white tee, headphones red #D1172F, hair near-black #1B1B1B, skin #C68A5C (shadow #9C6440).
Keep face, hair and proportions identical in every view.
[paste 2.0 Style + Negative block]
```

### 2.2 Pose prompts (upload `ref-sheet.png` + `portrait.webp` each time)
Start every pose prompt with this line, add the pose line from the table, then paste the 2.0 block:
```
Draw the SAME character from the uploaded reference sheet (same face, quiff hairstyle, eyebrows, beard, outfit, proportions). Raw black-and-white G-pen manga ink, solid blacks, high contrast. Canvas 1200x1600 px (3:4), transparent background, full body, centered horizontally, feet on a baseline 60 px above the bottom edge, top of hair about 120 px below the top edge.
```
| File | Pose line |
|---|---|
| `01-wave-hello` | `POSE: standing relaxed, facing the viewer, right hand raised in a friendly wave at head height, big open grin, small motion lines by the hand.` |
| `02-break-out` | `POSE: close, dramatic 3/4 angle: he leans out of the picture into the camera wearing small round sunglasses with a cocky smirk, lunging forward, one foot stepping forward, one open hand reaching toward the camera with strong foreshortening, other hand waving, excited grin, hair and hoodie blown back by the motion. Canvas 1600x1600 for this pose only. Do NOT draw the panel or torn paper.` |
| `03-walk` | `POSE: walking to the left in 3/4 view, mid-stride, natural arm swing, relaxed smile. Then generate the opposite step of the same cycle on the same canvas and baseline.` |
| `04-point` | `POSE: 3/4 view turned slightly left, pointing with his right index finger toward the LEFT edge of the canvas, other hand in hoodie pocket, confident smile.` |
| `05-think` | `POSE: standing, one hand on chin, other arm folded under it, eyes looking up and to the side, small thoughtful smile.` |
| `06-wave-bye` | `POSE: warm goodbye wave with the right hand, thumbs-up with the left, eyes closed in a happy smile. Then the same image as a COLOR version: keep the ink lines on top, flat limited colors underneath in the reference-sheet colors.` |
| `07-bust` | `POSE: head-and-shoulders bust, facing the viewer, friendly closed-mouth smile. Canvas 512x512, head centered, shoulders cut by the bottom edge.` |

### 2.2b Color versions (decision by Garvis, 2026-10-02)
B&W ink masters are the PRIMARY art. Grayscaling a color image does not look like raw manga ink, so we do NOT derive B&W from color. For every pose, right after you get a good B&W result, send in the SAME chat: `Same image, same pose and linework, now as a COLOR version: keep the ink lines on top, flat limited colors underneath: jacket #1B1B1B with #0B6AA0 accents, tee #F4F4F1, headphones #D1172F, skin #C68A5C / shadow #9C6440. No gradients, no purple.` Save it as `<pose>-color.webp`. Color is used on the cover, Ch.5, Gaiden and the Finale.

### 2.2c Optional "alive" overlays (nice-to-have, artist route recommended)
For blinking and talking, the cookbook §7 can use per-pose face overlays: `<pose>.blink.webp` (eyes closed) and `<pose>.talk.webp` (mouth open), on the same canvas and aligned pixel-perfect. AI tools usually drift on these edits, so skip them if they don't line up exactly; the site works without them (breathing + squash/stretch still run).

### 2.3 Fixing drift and bad results
| Problem | Fix |
|---|---|
| Face doesn't look like you / changes between poses | Start a **new chat**, re-upload `ref-sheet.png` + portrait, regenerate. Add: `Match the reference sheet face exactly.` |
| Hair loses his shape | Add: `Hairstyle exactly as reference: tall swept-up quiff with short sides, drawn with many fine flicked ink strands.` |
| Wrong glasses, missing beard, thin eyebrows | Add: `No regular glasses (small round sunglasses only where asked). Thin moustache + short chin beard. Thick straight eyebrows.` |
| Too clean, soft or "digital" (not raw ink) | Add: `scratchy G-pen ink, dry-brush hatching, solid blacks, high contrast, visible pen texture`. Regenerate |
| Looks chibi, cartoon or 3D | Regenerate and move the NEGATIVE line to the **top** of the prompt |
| Bad hands | Regenerate that pose. Simpler hand: an open palm or closed fist |
| Background not transparent | Add: `isolated on transparent background, PNG alpha`, or remove it later in Photoshop/remove.bg and check the edges for a white halo |
| Purple or neon creeps into color | Add: `Only these colors: #1B1B1B, #F4F4F1, #0B6AA0, #08507A, #D1172F, #C68A5C, #9C6440.` |
Pick the 7 finals side by side and check the same face, hair height and line weight. Redo any odd one out.
Licensing: check the tool's current commercial-use terms and keep the chats as provenance.

## 3. Artist commission brief (premium route: VGen / Skeb / Fiverr)
```
Hi! I'm commissioning a manga-style version of myself for my developer portfolio (commercial use on my own website and social previews).
- Style: black-and-white shōnen action manga, raw G-pen ink (loose, scratchy, varied weight), very high contrast with solid blacks and dry-brush hatching, sparse screentone; sharp angular face, cocky grin. Style reference attached (traits only, not that character). Plus 1 color version of one pose (ink on top, flat limited colors under it, palette provided).
- Deliverables: 1 character sheet (front/side/back) + 7 poses: wave-hello, break-out (leaning out toward the viewer), walk (2 frames), point left, think, wave-bye (+ color version), head-and-shoulders bust.
- Specs: poses on identical 1200x1600 canvases (break-out 1600x1600, bust 512x512), same scale, feet on the same baseline, transparent background, no text/logos on clothes, clean alpha edges (no white halo).
- Files: layered PSD or CSP + PNG-32 exports.
- Rights: written commercial-use license for my personal portfolio/brand; you keep credit and may show it in your portfolio.
- References attached: my photos (incl. phone photos of each pose), the design sheet, and palette hex codes (#1B1B1B ink, #0B6AA0 cyan, #D1172F red, #C68A5C skin).
Budget: USD 250-900 depending on your rates; timeline 1-4 weeks. Happy to pay a deposit.
```
Tip: shoot 7 phone photos of yourself in the poses against a plain wall and attach them. Artists work faster and more accurately from these.

## 4. Export checklist (for Engineering hand-off)
- [ ] Masters: PNG-32 with transparent alpha, canvases exactly as in §2.2, same scale and baseline across 01-06.
- [ ] Clean edges: no white halo (check on `#1B1B1B` and `#F4F4F1` backgrounds), no stray pixels, no text, no watermark.
- [ ] Export to **WebP (alpha, q≈80) ≤ 80 KB each** + AVIF; downscale if over budget (rendered max ≈ 600px tall, so 1200px masters are 2x).
- [ ] Filenames, lowercase, into `public/guide/` (replacing the placeholders of the same name): `01-wave-hello.webp`, `02-break-out.webp`, `03-walk-a.webp`, `03-walk-b.webp`, `04-point.webp`, `05-think.webp`, `06-wave-bye.webp`, `06-wave-bye-color.webp`, `07-bust.webp` (+ `.avif` twins).
- [ ] Facing: 04-point points LEFT (we mirror with `scaleX(-1)` when needed).
- [ ] Keep the PSD/CSP sources and the license (or AI-tool terms snapshot) in `docs/character/source/` (not deployed).
- [ ] Drop-in check: poses swap via `guide.pose` in `src/data/chapters.ts` with no layout shift (same canvas = same box).
