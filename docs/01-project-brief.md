# Project Brief — Mayuresh Talewar Portfolio
Status: DRAFT (awaiting client approval) · Owner: Garvis · 2026-10-02

## Goal
Position Mayuresh as a **Full Stack Engineer (AI/LLM)**, not a generic web developer. A recruiter should understand that within 3 seconds.

## Source of truth
The **resume** (confirmed by the client), especially for experience. The old site is used only for assets and project links.

## Audience
Recruiters and hiring managers for AI/full-stack roles; startup founders and clients.

## Sections (in order)
1. **Hero**: name, title "Full Stack Engineer (AI/LLM)", one-line pitch, CTAs (Resume, Contact), socials
2. **AI work**: Crestline products: AI Meeting Assistant, Smart Email platform, RAG pipelines, Material Management System
3. **Impact stats**: ~50% less follow-up work · ~45% faster email handling · ~35% faster APIs · 10k+ docs with sub-second retrieval
4. **Experience timeline** (from the resume only):
   - Full Stack Developer, Crestline Intelligence, Pune: Aug 2025 to present
   - Frontend Developer, Softtronix Software Solution, Nagpur: Sep 2024 to Jul 2025
   - Full Stack Developer Intern, Technology World Creater, Pune: Mar 2024 to Aug 2024
5. **Projects** (live check 2026-10-02): Shadow Monarch ✅, TechAgri ✅, SK Film ✅, Urhan Treaders ✅, RoboMeet ✅, GetEpoxy ❌ unreachable (keep only if the client confirms it is live)
6. **Skills**: grouped by category as on the resume (Frontend, Backend, GenAI/LLM, Databases, DevOps)
7. **Education**: B.Tech CSE (GH Raisoni, 2024, 7.89), Diploma (Anjuman Polytechnic, 2021)
8. **Contact**: EmailJS form with keys in env vars, email, LinkedIn, GitHub. Location: Pune, India

## Requirements
- All content lives in `src/data/*` (data-driven); components are reusable
- Mobile-first with real mobile navigation
- Animation: GSAP + ScrollTrigger (`useGSAP`, `gsap.matchMedia` for reduced motion); Three.js lazy-loaded via `dynamic(ssr:false)` only for 3D sections; respects reduced motion (client, 2026-10-02)
- Accessibility: WCAG AA, one h1, keyboard-friendly modal
- SEO: OpenGraph, sitemap, robots, Person JSON-LD
- Performance: Lighthouse 90+, all images optimized (old ones were 18MB and 3.9MB)

## Reused from the old site
6 project screenshots, portrait, resume PDF, EmailJS contact flow.

## Open questions
- [x] Projects: keep all those with working URLs (client, 2026-10-02)
- [x] Vibe: **anime/manga theme**, black & white manga base with color manga accents (client, 2026-10-02)
- [ ] Portrait on the site?

## Assumptions (Garvis, no need to ask the client; correct if wrong)
- Diploma: 2018–2021 (resume shows completion in Mar 2021; the old site shows a 2018 start)
- TechAgri goes in Ch.3 (internship, 2024), SK Film in Ch.4 (Softtronix, per the resume)
- Shadow Monarch, Urhan Treaders and RoboMeet are Gaiden (side stories) that sit outside the timeline, so they need no dates
- Character art: build with placeholder silhouettes to the R&D specs and swap in the real art later
