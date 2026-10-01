import { chapters, parts, stats } from "@/data/chapters";
import { projects } from "@/data/projects";
import { siteConfig } from "@/data/site";
import { skills } from "@/data/skills";
import { ChapterHeader } from "@/components/chapter-header";
import { ChapterNav, type NavItem } from "@/components/chapter-nav";
import { ChapterSpread } from "@/components/chapter-spread";
import { ContactForm } from "@/components/contact-form";
import { GuideLayer } from "@/components/guide-layer";
import { GaidenStrip } from "@/components/motion/gaiden-strip";
import { RouteDraw } from "@/components/motion/route-draw";
import { WantedDrop } from "@/components/motion/wanted-drop";
import { ProjectCard } from "@/components/project-card";
import { Section } from "@/components/section";
import { SiteFooter } from "@/components/site-footer";
import { SkillGroup } from "@/components/skill-group";
import { WantedPoster } from "@/components/wanted-poster";
import { cn } from "@/lib/utils";

const current = chapters[chapters.length - 1];
const { cover, gaiden, status, finale } = parts;

// Volume order: Cover → Ch.1–5 → Gaiden → Status Window → Finale.
const contents: NavItem[] = [
  { id: cover.id, label: "Cover", short: "V1" },
  ...chapters.map((c) => ({ id: c.id, label: `Ch.${c.number} ${c.title}`, short: String(c.number), gear: c.gear })),
  { id: gaiden.id, label: gaiden.title, short: "SS" },
  { id: status.id, label: status.title, short: "ST" },
  { id: finale.id, label: finale.title, short: "TBC" },
];

// Islands on the contents chart (everything after the cover), zigzagging along one route.
const islands = [
  ...chapters.map((c) => ({ id: c.id, mark: `Ch.${c.number}`, title: c.title, meta: `${c.gearName}, ${c.period}`, gear: c.gear })),
  { id: gaiden.id, mark: "Gaiden", title: gaiden.title, meta: `${projects.length} live projects`, gear: 0 },
  { id: status.id, mark: "Status", title: status.title, meta: `${skills.length} skill groups`, gear: 0 },
  { id: finale.id, mark: "Finale", title: finale.title, meta: "Contact", gear: 0 },
];
const pts = islands.map((_, i) => [((i + 0.5) / islands.length) * 1000, i % 2 ? 160 : 40]);
const route = pts.map(([x, y], i) => (i ? `S${x - 1000 / islands.length / 2} ${y} ${x} ${y}` : `M${x} ${y}`)).join(" ");

export default function Home() {
  return (
    <>
      <a
        href="#contents"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-paper focus:p-3 focus:font-bold"
      >
        Skip to contents
      </a>
      <ChapterNav items={contents} resume={siteConfig.resume} />

      <main className="flex-1">
        {/* ───────── COVER ───────── */}
        <Section
          part={cover}
          labelledBy="cover-title"
          className="pt-6 pb-24 md:min-h-[calc(100svh-59px)] md:pt-10 md:pb-28"
          backdrop={<CoverArt />}
        >
          {/* Hook point: break-out slot for the Sprint 5 character (tech plan §6). */}
          <div data-slot="break-out" aria-hidden />
          <div className="grid items-center gap-x-8 gap-y-12 md:grid-cols-12">
            <div className="md:col-span-7">
              <p className="flex items-center gap-3">
                <span className="grid size-14 place-items-center rounded-full border-[3px] border-ink bg-jolly font-display text-[0.7rem] leading-[0.95] text-paper text-center">
                  VOL
                  <br />1
                </span>
                <span aria-hidden className="font-display text-xl tracking-tight text-jolly-ink md:text-2xl">
                  マユレシュ・タレワル
                </span>
              </p>
              <h1 id="cover-title" className="logotype mt-3 text-[12.2vw] md:text-[6.6vw] min-[1440px]:text-[6rem]">
                <span className="slam block" style={{ "--i": 0 } as React.CSSProperties}>
                  Mayuresh
                </span>
                <span className="slam block pl-[0.5em]" style={{ "--i": 1 } as React.CSSProperties}>
                  Talewar
                </span>
              </h1>
              <p
                className="slam ribbon mt-6 text-[1.05rem] md:mt-8 md:text-2xl"
                style={{ "--i": 2, "--ribbon-bg": "var(--color-jolly)" } as React.CSSProperties}
              >
                {siteConfig.title}
              </p>
              <p className="mt-5 max-w-[34ch] font-letter text-lg leading-snug font-bold md:text-xl">{cover.tagline}</p>
              <p className="mt-2 text-sm font-semibold md:text-base">
                Now: {current.role} at {current.org.replace(/ Pvt\. Ltd\.$/, "")}, {siteConfig.location.split(",")[0]}
              </p>
              <div className="mt-7 flex flex-wrap gap-4">
                <a href={siteConfig.resume} download className="btn btn-straw">
                  Resume
                </a>
                <a href={`#${finale.id}`} className="btn btn-ink">
                  Contact
                </a>
              </div>
            </div>
            <div className="md:col-span-5">
              <div className="rotate-[2.5deg]">
                <WantedDrop>
                  <WantedPoster name={siteConfig.name} wanted={cover.wanted} stats={stats} />
                </WantedDrop>
              </div>
            </div>
          </div>
        </Section>

        {/* ───────── CONTENTS: the Grand Line chart ───────── */}
        <nav
          id="contents"
          aria-labelledby="contents-title"
          className="parchment relative scroll-mt-28 overflow-hidden border-b-[3px] border-ink px-3 py-14 md:scroll-mt-16 md:px-8 md:py-20"
        >
          <div aria-hidden className="chart-grid absolute inset-0" />
          <Compass className="absolute -right-16 -bottom-20 w-72 opacity-25 md:right-10 md:bottom-6 md:w-80" />
          <div className="relative mx-auto max-w-[1320px]">
            <h2 id="contents-title" className="font-display text-[clamp(2.4rem,6vw,4.6rem)] leading-none uppercase">
              The route so far
            </h2>
            <p className="mt-3 max-w-[50ch] font-letter text-lg font-bold">
              Five chapters, five Gears. Each island is a stop on the voyage; tap one to sail there.
            </p>
            <div className="relative mt-10 md:mt-14">
              <RouteDraw d={route} className="absolute inset-x-0 top-[3.25rem] hidden h-[12.5rem] w-full md:block" />
              <ol className="relative grid gap-4 border-l-[3px] border-dashed border-sea/60 pl-5 md:grid-cols-8 md:gap-3 md:border-0 md:pl-0">
                {islands.map((isl, i) => (
                  <li key={isl.id} className={cn("relative", i % 2 && "md:mt-[7.5rem]")}>
                    <a
                      href={`#${isl.id}`}
                      className="group flex flex-col border-[3px] border-ink bg-paper p-3 transition-transform duration-200 hover:-translate-y-1 md:items-center md:text-center"
                      style={{ borderRadius: i % 2 ? "28px 10px 30px 8px" : "10px 30px 8px 28px" }}
                    >
                      <span
                        className={cn(
                          "self-start px-2 py-0.5 font-display text-xs uppercase md:self-center",
                          isl.gear >= 5 ? "bg-straw text-ink" : isl.gear >= 3 ? "bg-jolly text-paper" : "bg-ink text-paper",
                        )}
                      >
                        {isl.mark}
                      </span>
                      <span className="mt-2 font-display text-lg leading-[1.05] uppercase md:text-[1.05rem]">{isl.title}</span>
                      <span className="mt-1 text-sm font-semibold">{isl.meta}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </nav>

        {/* ───────── CH.1–5 ───────── */}
        {chapters.map((c) => (
          <ChapterSpread key={c.id} chapter={c} projects={projects.filter((p) => p.chapterId === c.id)} />
        ))}

        {/* ───────── GAIDEN ───────── */}
        <Section
          part={gaiden}
          backdrop={
            <div aria-hidden className="parchment absolute inset-0 -z-10">
              <div className="chart-grid absolute inset-0" />
            </div>
          }
        >
          <div className="mb-8 grid gap-6 md:mb-10 md:grid-cols-12 md:items-end">
            <ChapterHeader id={`${gaiden.id}-title`} eyebrow="Gaiden" title={gaiden.title} className="md:col-span-7" />
            {gaiden.intro && <p className="caption md:col-span-5 md:mb-3">{gaiden.intro}</p>}
          </div>
          <GaidenStrip>
            {projects.map((p, i) => (
              <div
                key={p.id}
                id={`project-${p.id}`}
                className={cn("gaiden-card w-full shrink-0 scroll-mt-28 md:snap-start", p.spread ? "md:w-[min(84vw,1000px)]" : "md:w-[min(74vw,480px)]")}
              >
                <ProjectCard project={p} index={i} />
              </div>
            ))}
          </GaidenStrip>
        </Section>

        {/* ───────── STATUS WINDOW ───────── */}
        <Section
          part={status}
          backdrop={
            <div aria-hidden className="absolute inset-0 -z-10">
              <div className="tone absolute inset-0 opacity-[0.07]" style={{ "--tone-ink": "#fbf7ee" } as React.CSSProperties} />
            </div>
          }
        >
          <div className="border-[3px] border-straw p-1">
            <div className="border-2 border-straw/60 p-4 md:p-8">
              <div className="mb-8 flex flex-col gap-4 border-b-2 border-straw/50 pb-6 md:flex-row md:items-end md:justify-between">
                <h2 id={`${status.id}-title`} className="font-display text-[clamp(2.4rem,6.5vw,5rem)] leading-none text-paper uppercase">
                  {status.title}
                </h2>
                <p className="font-sfx text-2xl tracking-wide text-straw">
                  {siteConfig.name}, {current.gearName}
                </p>
              </div>
              {status.intro && <p className="mb-8 max-w-[60ch] text-lg text-paper/90">{status.intro}</p>}
              <div className="columns-1 gap-4 md:columns-2 lg:columns-3">
                {skills.map((g) => (
                  <SkillGroup key={g.name} group={g} />
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ───────── FINALE ───────── */}
        <Section
          part={finale}
          className="border-b-0 bg-jolly! text-paper [&_:focus-visible]:outline-straw"
          backdrop={
            <div aria-hidden className="absolute inset-0 -z-10">
              <div className="speedlines absolute -inset-1/4 opacity-20" style={{ "--lines": "#fbf7ee", "--sx": "30%", "--sy": "30%" } as React.CSSProperties} />
            </div>
          }
        >
          <h2 id={`${finale.id}-title`} className="logotype text-[10.5vw] md:text-[6.4vw] min-[1440px]:text-[5.8rem] [text-shadow:0.06em_0.06em_0_var(--color-ink)]">
            {finale.title}
          </h2>
          <div className="mt-8 grid gap-10 md:mt-12 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-6">
              {finale.toBeContinued && <p className="caption max-w-[36ch] text-lg">{finale.toBeContinued}</p>}
              <h3 className="mt-10 font-display text-3xl leading-tight uppercase md:text-4xl">{finale.cta?.heading}</h3>
              {finale.cta?.body && <p className="mt-3 max-w-[44ch] text-lg font-semibold">{finale.cta.body}</p>}
              <ul className="mt-8 flex flex-col gap-3 text-lg font-bold">
                <li>
                  <a href={`mailto:${siteConfig.email}`} className="underline decoration-2 underline-offset-4 hover:decoration-straw">
                    {siteConfig.email}
                  </a>
                </li>
                {siteConfig.socials.map((s) => (
                  <li key={s.href}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="underline decoration-2 underline-offset-4 hover:decoration-straw">
                      {s.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
                <li>
                  <a href={siteConfig.resume} download className="underline decoration-2 underline-offset-4 hover:decoration-straw">
                    Resume (PDF)
                  </a>
                </li>
                <li className="font-semibold">{siteConfig.location}</li>
              </ul>
            </div>
            <div className="md:col-span-6">
              <div className="parchment border-[3px] border-ink p-5 text-ink shadow-[10px_10px_0_var(--color-ink)] md:-rotate-1 md:p-8">
                <p className="mb-5 font-display text-2xl uppercase">Message in a bottle</p>
                <ContactForm email={siteConfig.email} label={finale.cta?.label} />
              </div>
            </div>
          </div>
          <p aria-hidden className="mt-16 flex justify-end">
            <span className="sfx inline-flex items-center bg-ink px-6 py-3 text-[clamp(1.6rem,4vw,2.6rem)] [--sfx-fill:var(--color-straw)] [clip-path:polygon(0_0,calc(100%-1.4em)_0,100%_50%,calc(100%-1.4em)_100%,0_100%)] pr-[1.8em]">
              To be continued
            </span>
          </p>
        </Section>
      </main>

      <SiteFooter site={siteConfig} />
      <GuideLayer />
    </>
  );
}

/** Cover backdrop: sun rays from the poster, a faint chart, and the sea along the bottom edge. */
function CoverArt() {
  return (
    <div aria-hidden className="absolute inset-0 -z-10 bg-paper">
      <div className="rays absolute inset-0" style={{ "--ray-a": "#f8e4a6", "--ray-b": "#fbf3dc", "--sx": "76%", "--sy": "42%" } as React.CSSProperties} />
      <div className="chart-grid absolute inset-0 opacity-60" />
      <Compass className="absolute -top-10 -left-24 w-[26rem] opacity-[0.12]" />
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-16 w-full md:h-24">
        <path d="M0 50 Q90 15 180 50 T360 50 T540 50 T720 50 T900 50 T1080 50 T1260 50 T1440 50 V120 H0Z" fill="#0f5c93" stroke="#1a1612" strokeWidth="4" />
        <path d="M0 80 Q90 55 180 80 T360 80 T540 80 T720 80 T900 80 T1080 80 T1260 80 T1440 80" fill="none" stroke="#9fd8f2" strokeWidth="3" strokeDasharray="30 22" />
      </svg>
    </div>
  );
}

/** Our own compass rose (generic nautical motif). */
function Compass({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="-100 -100 200 200" className={className}>
      <circle r="92" fill="none" stroke="#1a1612" strokeWidth="2" />
      <circle r="80" fill="none" stroke="#1a1612" strokeWidth="1" strokeDasharray="2 4" />
      <path d="M0 -96 L10 -10 L0 0 L-10 -10Z M0 96 L10 10 L0 0 L-10 10Z M-96 0 L-10 -10 L0 0 L-10 10Z M96 0 L10 -10 L0 0 L10 10Z" fill="#1a1612" />
      <path d="M0 -96 L-10 -10 L0 0Z M0 96 L-10 10 L0 0Z M-96 0 L-10 10 L0 0Z M96 0 L10 10 L0 0Z" fill="#d62718" />
      <path d="M50 -50 L6 -6 L0 0Z M-50 50 L-6 6 L0 0Z M-50 -50 L-6 -6 L0 0Z M50 50 L6 6 L0 0Z" fill="none" stroke="#1a1612" strokeWidth="3" />
      <text y="-70" textAnchor="middle" fontSize="16" fontWeight="900" fill="#1a1612" dy="-28">
        N
      </text>
    </svg>
  );
}
