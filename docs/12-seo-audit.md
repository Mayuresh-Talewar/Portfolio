# 12 · SEO audit (SEO-003)

Audited the working tree on 2026-10-02, read-only. The setup is mostly sound: one h1, a clean h2/h3 outline, decorative lettering hidden from screen readers, and good alt text. **The 3 fixes that matter most:** (1) 1.2 MB of fan art is still served at `/art/luffy/`, and the robots rule that blocked it was removed; (2) "Pune", "India" and "AI agents" never appear together in the title, the description or the opening cover copy; (3) it's a single URL, so the only query it can really win is his name.

## P0: fix now
| # | Where | Issue | Fix |
|---|---|---|---|
| 1 | `public/art/luffy/` (10 SVGs, 1.2 MB) + `src/app/robots.ts:6` (uncommitted) | The fan art is still served and indexable, because the disallow rule was dropped while the folder stayed. | `git rm -r public/art/luffy public/guide`; nothing in `src` references either folder. Then the plain `allow: "/"` rule is correct. If the folder stays, restore `disallow: "/art/luffy/"`. |
| 2 | `src/data/site.ts:6-7` description | It has no location and no "AI agents", so the target queries miss the snippet. | Use: "Mayuresh Talewar, Full Stack Engineer (AI/LLM) in Pune, India. I build AI agents, RAG pipelines and LLM products with Next.js, Node.js and FastAPI." (about 150 characters) |
| 3 | `src/app/page.tsx:85-88` cover copy | Above the fold the only readable text is the name, the title ribbon and the tagline "Five chapters, five Gears…". There's no plain sentence with the keywords. | After L85, add `<p className="mt-3 max-w-[44ch] text-base font-semibold">{siteConfig.description}</p>` (or a shorter one-liner), so the keywords sit in the first 100 words. |

## P1: on-page
- **h1** `page.tsx:71`: exactly one, and it's his name. Good. Wrap L71-84 in `<hgroup>` so the role ribbon (L79) is tied to the h1; this costs nothing visually.
- **Heading outline:** OK. Nav "The route so far" is h2. Each chapter has an h2 (`chapter-header.tsx:24`) with the role and products as h3 (`chapter-spread.tsx:25,237`). Gaiden: h2, then each project h3. Status: h2, then each skill group h3. Finale: h2, then the CTA as h3. The chapter h2s are story names ("Forging the Blade"); the eyebrow ribbon and the h3 hold the real roles. Fine as is.
- **Decorative text:** cover kana (`page.tsx:67`), chapter SFX/kana (`chapter-spread.tsx:76,87,134,204`), numerals (`:112` wrapper), "To be continued" (`page.tsx:259`), and the WANTED/name/bounty SVGs (`wanted-poster.tsx:106,131,139`, with sr-only copies) are all `aria-hidden`. Gap: `chapter-spread.tsx:71` `.gear-prev` "GEAR 4" isn't marked; it's `visibility:hidden` at rest, so it only matters during the flash. Add `aria-hidden` anyway.
- **Alt text:** portrait (`wanted-poster.tsx:116`) and project screenshots (`project-card.tsx:24`) are descriptive. No decorative `<img>` without alt.
- **Link text:** "Visit live site" carries sr-only project context. Socials, email and "Resume (PDF)" are descriptive. OK.
- **Keywords in real text** (data files, rendered as HTML): RAG ×7, LLM ×9, Next.js ×3, Pune ×4, "Full Stack Engineer" ×2, "AI agent" ×2. None depend on SVG or canvas. "India" appears only in the finale location line. The cover says "Full Stack **Developer**" (`page.tsx:87`, from the chapter role) next to "Full Stack **Engineer**"; pick one, Engineer.

## P1: metadata, OG, JSON-LD, sitemap
- `layout.tsx:14-61` (pending edit only adds the Playfair font): title (47 characters), canonical, OG profile, Twitter and Person JSON-LD are all still correct. **No Luffy, One Piece or fan-art text** in metadata, the OG image or JSON-LD. On-page, "Marine" (`wanted-poster.tsx:155`) and "Gear" arcs are genre nods, not trademarks, and are kept out of metadata.
- Stale: `types/index.ts:10-11` `features.luffy` and `:19` guide poses are dead code once #1 is done (Senior Dev).
- Title: add the city, giving `Mayuresh Talewar | Full Stack Engineer (AI/LLM), Pune` (54 characters). Growth can change this in `seo.ts` once src is unlocked.
- JSON-LD: add `image: new URL("/images/portrait.png", seo.url).href` and `email` (`layout.tsx:45`; Growth's file). Sitemap: single URL, fine until there are more routes.

## P2: Core Web Vitals risks
- **LCP:** most likely the h1 (`page.tsx:71`, 12.2vw on mobile). The `.slam` animation (`globals.css:345-355`) keeps it at opacity 0 until about 0.19 s + 0.55 s. That's OK. The portrait is `preload`. Good.
- **Upcoming intro animation:** it must not render the h1 or the poster at `opacity:0` or `visibility:hidden` for more than about 1 s. Animate an overlay above the h1 (transform or clip-path on a separate `aria-hidden` layer), keep the h1 text in the server-rendered HTML, skip it under reduced motion and on repeat visits, and don't SplitText the h1.
- **CLS:** next/font gives size-matched fallbacks, and GSAP `from()` uses transform/autoAlpha only, so layout doesn't shift. `WantedDrop` (`wanted-drop.tsx:14`) hides the poster for 0.35-0.8 s: no CLS, but it delays the portrait's paint. Fine.
- **Fonts:** 5 families are preloaded (`layout.tsx:7-12`). Bangers (`--font-sfx`) only appears below the fold, so add `preload: false` at L8.
- **JS weight:** gsap core + ScrollTrigger + SplitText + MotionPathPlugin is about 120 KB min. MotionPath only moves the nav ship (`chapter-nav.tsx:47`). Load it with dynamic `import()` after idle, or drop the ship on mobile. `src/lib/gsap.ts:4,11`.
- **Images:** everything is WebP and under 75 KB, served through next/image with `sizes`. OK.

## Content gaps vs the target queries
A single page can rank for **his name**. "Next.js RAG developer", "AI agents developer India" and "Full Stack Engineer AI LLM Pune" are competitive, and portfolios usually rank for them through case-study pages. Gap: no `/work/[slug]` pages. Add 2-3 (AI Meeting Assistant, RAG Pipelines, Smart Email), each with an h1 like "RAG pipeline for … (Next.js, pgvector)", 400+ words, the stack and the outcome, linked from the Gaiden cards and listed in the sitemap.

## 5 quick wins (each under 1 h)
1. `git rm -r public/art/luffy public/guide` (P0 #1).
2. New description in `site.ts:6-7` and the title with "Pune" (`seo.ts`).
3. A plain one-line keyword summary under the cover tagline (`page.tsx:85`).
4. "Developer" to "Engineer" consistency on the cover (`page.tsx:87`), plus `aria-hidden` on `chapter-spread.tsx:71`.
5. `preload: false` on Bangers (`layout.tsx:8`), and lazy-load MotionPathPlugin (`lib/gsap.ts`).
