---
name: luffy-art
description: How to build, fix, review or extend post-timeskip Monkey D. Luffy (Gear 1-5) as layered, rig-ready SVG with a real manga/anime construction pipeline. It covers gesture, skeleton, forms, head-unit proportions, features on guides, tapered ink, flats, cel shading, highlights and effects, plus an on-model checklist, Oda line rules and a mistakes-to-fixes log. Use it for anything in public/art/luffy, a new Gear variant, the stretch-arm rig, or a render-vs-reference comparison, even when the request only says "the pirate guide", "straw hat character" or "fix his face".
---

# Luffy art (layered SVG, construction-first)

Generator: `scripts/build.py <out_dir> g1 g2 g3 g4 g5` writes `luffy-<gear>-color.svg` and `-bw.svg` from ONE rig.
Edit `build.py`. Never hand-edit the output SVGs, because the next build overwrites them.
Loop: build, then screenshot [reference | color | bw] at equal height in headless Edge, then Read the PNG and score it
against the checklist. Fix the top 5 differences and log them below. Also render the construction view
(remove `display="none"` from `construct-*` and set the art to 35% opacity) whenever proportions or placement look off.
Reference images are for comparison only. Keep them in the scratchpad, never in the repo, and never trace them.

## How pro anime/manga characters are built (and how build.py mirrors it)
Model-sheet practice (Toei/Clip Studio guides): stick-figure gesture first, a skeleton of joints, then simple volumes
(spheres, boxes, cylinders), proportions in head units shared across views, features placed on construction guides,
clean ink, flat base colours, then a 2-tone cel shadow from one light source, a few highlights, and effects last.
| Step | In build.py | Why it matters |
|---|---|---|
| 1 Gesture | `construct-gesture` (head to pelvis to weight foot) | Pose energy. A straight line here means a stiff pose. |
| 2 Skeleton + pivots | `SKEL` joints, `BONES`, `construct-skeleton` | Rig pivots come from these joints (`data-pivot`, `transform-origin`) |
| 3 Forms | `construct-forms`: cranium circle + jaw wedge, ribcage ellipse, pelvis box, limb tubes | Volumes keep parts consistent between poses |
| 4 Proportions | `construct-proportions` head-unit ruler (crown to sole) | Catches chibi drift. Currently ~5.7 heads, target 5.8-6 |
| 5 Features on guides | `EYE_Y`, `EYE_DX`, `NOSE_Y`, `MOUTH_Y` on the head centre line; brim ellipse follows head tilt | Change a guide and every feature follows |
| 6 Ink | `taper()` brush strokes (thick middle, pointed ends) for inner lines; `#contour` dilate filter for a heavier outer silhouette per rig group | Oda thick-thin weight without hand-drawing every stroke |
| 7 Flats | palette tokens (`COLOR` / `BW`) | One geometry, two versions |
| 8 Cel shade | `cel()`: shadow = shape minus itself shifted toward the light (upper-left), hard edge, one tone | Consistent light for free. In B&W the shadow tone becomes hatch or dot screentone |
| 9 Highlights | `hatH`, `blueH`, `sashH`, button glints (colour only) | Upper-left lit side |
| 10 Effects | `fx_back` / `fx_front` per Gear | Steam, clouds, impact lines sit outside the rig |

## On-model checklist (score each 0-100)
- **Proportions**: about 6 heads post-skip (crown to sole), lanky limbs, knees at about 4.3 heads, fists hanging at the crotch.
  Low-angle references exaggerate the legs, so check against the ruler and not against one photo.
- **Face**: wide cheekbones tapering to a small rounded chin (soft V). Ears stick out at eye level.
- **Eyes**: big round whites (rx 13, ry 15 in the head frame), small centred dot pupils (r 3.7), a thin outline with a
  slightly thicker top lid that hugs the eye (control point about 22 above the eye-line). A heavy lid reads sleepy or angry.
- **Mouth**: calm = long thin upturned line with corner ticks. Grin = wide D with an upper row of teeth.
- **Scar**: stitched curve under HIS LEFT eye (VIEWER'S RIGHT) with 3 stitch ticks. X-scar: jagged pink bands crossing at the sternum.
- **Hair**: black, varied-length curved spikes from under the brim to eye level, one long lock between the eyes, side
  locks in front of the ears. Nothing below the jaw, or it reads as a beard.
- **Hat**: wide frayed brim seen slightly from above with drooping sides, tall round crown, thick red band (black in
  B&W). It sits low on the brow, tilted about 3 degrees.
- **Outfit**: red open cardigan with long bell sleeves and ruffled hems to mid-forearm, 4 gold buttons on the viewer-left
  panel, panels flaring at the hem; yellow sash knotted at HIS LEFT hip with a wide tail to the knee; baggy blue
  shorts with fluffy white cuffs; straw sandals.
- **Line quality**: one ink colour #1B1B1B, heavier outer contour, tapered inner lines, solid blacks.

## Oda line rules
- Outer contour: stroke 2.6 plus a 1.1 px dilate contour filter (viewBox 600x800). Inner folds: tapered 1.4-1.8. Texture: 1.
- Solid black for hair, pupils, the B&W hat band and the B&W mouth interior. B&W shadows use 45-degree hatch on cloth and dot tone on skin.
- Colour: flat 2-tone cel (base plus one shadow), no gradients.

## SVG construction that works
- Mirror parts in DATA with `mx(d)` (absolute M/L/Q/C only), not with `scale(-1,1)`. That keeps real global pivots, so
  rotation directions are the same on both sides.
- Rig: `arm-r` (his right, viewer left) and `arm-l`, each with `-shoulder`, `-upper`, `-forearm` and `-fist`; `head-stack`, `body`, `legs`.
- Never put a `transform` attribute and CSS `transform-origin` on the same `<g>`, because the origin shifts the attribute
  transform. Put the pivot on an outer group and the placement transform on an inner one (`head-frame`).
- A clip-path on an element that has its own `transform` moves with it, so wrap the moved element in a clipped `<g>` (see `cel()`).
- Draw order: fx_back, neck, arms, body (torso, x-scar, shorts, sash, cardigan, sash-knot), sandals, head-stack, fx_front.
- Gear variants are a dict in `GEARS` with palette overrides, part swaps (`hair`, `torso`, `grin`), rig transforms
  (`arm-r: {upper: ' transform="rotate(..)"'}`, which rotate about the joint pivot) and fx functions.

## Mistakes -> Fixes log
- (G1 iter 1) Back hair below the jaw read as a beard. Fix: keep back hair above the ear bottom.
- (G1 iter 1) The figure was 5.2 heads, which looked chibi. Fix: scale the head stack (now 0.84) and check the ruler.
- (G1 iter 1-3) A thin brim ellipse looked like a sombrero side view. Fix: ry 36, frayed polygon edge, drooping sides, tall crown.
- (G1 iter 1-2) Tube sleeves and boxy panels. Fix: bell sleeves with deep ruffle hems and panels that flare at the hem.
- (G1 iter 2) The face was too long with a sharp V and a huge mouth. Fix: rounder lower face; calm smile as the G1 default.
- (G1 iter 3-6) Black lid crescents made him look worried or sleepy, and inward pupils looked cross-eyed. Fix: thin lid, centred small pupils.
- (G1 iter 4) Fists drawn as mittens were too big. Fix: fist about 0.35 head width with a thumb stroke.
- (G1 iter 5, construction) Rebuilding from the skeleton exposed a transform-origin bug that shifted the head, and the
  ruler showed 5.7 heads. Auto cel shading fixed the inconsistent light: before, both mirrored panels had shadows on opposite sides.
- (G1 iter 5) A 1.6 px contour filter looked like a sticker. Fix: 1.1 px.
- (G1 iter 7) Uniform zigzag hair looked like a crown of spikes. Fix: curved Q-spikes with varied lengths.
- (G1 iter 8) The hat sat too high and showed a tall band of hair. Fix: lower the hat 7 and tilt it 3 degrees.
- Remaining G1 gaps: brush-like line variation, hair strand rhythm, cardigan drape and fold design, knuckle detail.
