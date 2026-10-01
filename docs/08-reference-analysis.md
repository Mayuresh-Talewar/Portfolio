# 08 · Reference analysis (RND-006)

Evidence: 12 live sites screenshotted 2026-10-02, see `docs/references/board.html`.
7 are ONE PIECE properties (client preference). Screenshots are internal reference only.

## The honest headline

Most of the "real anime" feel on every site we captured comes from **key art drawn by the
studio or mangaka**. Strip the art out of Bounty Rush, Kaiju No. 8 or VIZ and you get a
generic template. The two exceptions (God Valley teaser, Chainsaw Man texture layer) prove
type and ink texture can carry *some* of it, but only when the lettering is rough and
confident. Our earlier direction failed because it tried to get the anime feel from layout
alone, with no character art in the frame.

## Recurring techniques, ranked by how much "anime feel" they deliver

| # | Technique | Seen on | Needs real art? |
|---|-----------|---------|-----------------|
| 1 | Full-bleed key-art hero, character close-up or action pose with extreme perspective | Card Game, Kaiju 8, Netflix, VIZ, ZZZ | **Yes** |
| 2 | Cut-out characters breaking out of panel edges and overlapping the next section | Bounty Rush, Persona 5, Card Game | **Yes** (transparent PNG cut-outs) |
| 3 | Diagonal panel cuts / shard sections with split-color fields | Bounty Rush, Persona 5, Chainsaw Man strip | No: pure CSS `clip-path` |
| 4 | Rough, ink-distressed or custom display lettering, often tilted, with "!!" energy | God Valley, Bounty Rush, Persona 5, Kaiju 8 | No: type + texture mask |
| 5 | Printed-material textures: ink splatter, parchment, washi, halftone dots | Chainsaw Man, Card Game, Kimetsu, Persona 5 | No: texture images we make |
| 6 | Speed lines / motion streaks / lightning cracks over static art | Kaiju 8, Bounty Rush | Partly: shapes are generic, they need art underneath to read |
| 7 | Bilingual type: katakana/kanji subtitle under Latin, vertical side text | God Valley, Kaiju 8, Chainsaw Man, Kimetsu | No |
| 8 | Sticker / name-plate UI: skewed labels, stamped badges, framed cartouches | Persona 5, ZZZ, Kimetsu, one-piece.com | No |

Rule of thumb: techniques 1, 2 (and 6 to a degree) are 70% of the effect and all require
artwork. Techniques 3, 4, 5, 7, 8 are the "frame" and are fully ours to build.

Motion we observed: auto-scrolling strips (Chainsaw Man, one-piece.com mosaic), hero
carousels with progress bars (Card Game), full-screen snap sections with dot nav (ZZZ).
None of the official sites rely on heavy scroll-hijack; the art does the work and motion
stays simple (slide, pan, reveal).

## The One Piece visual language

**Oda's art traits.** Thick confident ink outlines, flat saturated color, rubbery exaggerated
anatomy, huge open-mouth grins, crowded ensemble compositions where everyone is mid-cheer
(VIZ hero), coins and confetti flying. Joy and noise, not grit. Gear 5 art adds white
cloud-like curls and cartoon-ish distortion (Card Game hero).

**Logo / typography.** The ONE PIECE wordmark: chunky blue-outlined serif-ish caps, the "O"
replaced by the straw-hat Jolly Roger, a rope trailing off the "E", katakana ワンピース tucked
in. Film logos go rougher (God Valley: cracked, ink-distressed slab). Supporting type on the
official sites is plain: condensed sans (Anton on the film site) and bold Japanese gothic.

**Color energy.** Signature red (one-piece.com band), cream/parchment, sea blue, sun gold.
Bright, warm, daytime. The Netflix site adds a violet-to-orange sunset sea. Darker palettes
(Odyssey) feel least like One Piece.

**Recurring motifs.** Straw hat, Jolly Roger crest, wanted/bounty posters, Log Pose and
compass rose, nautical charts on aged parchment (Card Game section 2), the sea and ships
(Going Merry / Thousand Sunny), rope frames (birthday card), treasure gold coins
(Bounty Rush), ribbon banners (one-piece.com logo).

**How the official sites use key art and motion.** The art is always the hero and is never
cropped timidly: full-bleed or cut-out and overlapping. Promo tiles reuse the same art at
small size. Motion is carousel and auto-scroll, not scroll-telling.

### What we can use as ORIGINAL design elements (no copied art)

Safe, because these are genre/nautical conventions, not Oda's characters or logo:
- **Wanted-poster profile card**: our own portrait/photo, "WANTED" header, bounty-style
  stat line, aged paper, nail holes. Generic Western-poster form; do not copy the Marine
  seal or the exact One Piece poster layout/typeface.
- **Nautical-chart chapter navigation**: sections as islands on a parchment map with a
  dotted route and a compass rose that rotates on scroll. Draw our own map.
- **Parchment and aged-paper textures**, rope borders, ribbon banners, wax-seal stamps.
- **Log-Pose-like progress indicator**: a generic compass/needle that points to the
  current section (do not replicate the Log Pose design itself).
- **Bright adventure palette**: red / cream / sea blue / gold, daytime, high saturation.
- **Diagonal versus-panels, speed lines, "!!" tilted headlines** for energy.
- **Our own skull-and-crossbones crest** if wanted (a pirate flag is public-domain
  iconography; the straw hat on it is not).

Not allowed: Oda's characters, the ONE PIECE logo/wordmark, straw-hat Jolly Roger,
screenshots or traced poses from any captured site.

## What this means for our build

1. Decide the art source first: commissioned illustration or our own character art per
   `06-character-art-kit.md`. Without it, the site will again "not feel like real manga".
2. Then build the frame: diagonal panels, distressed display type, parchment + ink
   textures, wanted-poster cards, chart navigation.
3. Keep motion modest (reveal, pan, auto-scroll strip); let art carry the impact.

## Coverage notes

Captured: one-piece.com, ONE PIECE Card Game, Bounty Rush, ONE PIECE FILM GOD VALLEY,
Netflix ONE PIECE, VIZ One Piece, ONE PIECE ODYSSEY, Chainsaw Man, Kaiju No. 8,
Demon Slayer, Persona 5 Royal, Zenless Zone Zero. Mobile (390px): Bounty Rush, Card Game,
Chainsaw Man, Persona 5 Royal.
Skipped: Dandadan and Ponpon Mania (blank or stuck on loader after a retry), Treasure Cruise
(video modal covers the page), Film Red / Stampede (old film URLs now 404), JJK / Spy x
Family / Frieren (403 to non-browser clients). Toei's One Piece URL showed the same page as
one-piece.com. No genuinely manga-styled Awwwards SOTD was verified live; Persona 5 Royal
and ZZZ stand in as the "comic UI at production quality" references.
