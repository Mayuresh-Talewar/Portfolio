import { chapters, parts, stats } from "@/data/chapters";
import { projects } from "@/data/projects";
import { siteConfig } from "@/data/site";
import { skills } from "@/data/skills";
import { ChapterHeader } from "@/components/chapter-header";
import { ChapterNav, type NavItem } from "@/components/chapter-nav";
import { ContactForm } from "@/components/contact-form";
import { GuideLayer } from "@/components/guide-layer";
import { ProjectCard } from "@/components/project-card";
import { Section } from "@/components/section";
import { SiteFooter } from "@/components/site-footer";
import { SkillGroup } from "@/components/skill-group";
import { StatList } from "@/components/stat-list";

const current = chapters[chapters.length - 1];

// Volume order: Cover → Ch.1–5 → Gaiden → Status Window → Finale.
const contents: NavItem[] = [
  { id: parts.cover.id, label: "Cover" },
  ...chapters.map((c) => ({ id: c.id, label: `Ch.${c.number} ${c.title}`, gear: c.gear })),
  { id: parts.gaiden.id, label: parts.gaiden.title },
  { id: parts.status.id, label: parts.status.title },
  { id: parts.finale.id, label: parts.finale.title },
];

const button = "inline-block border-2 border-current px-5 py-2 font-bold";

export default function Home() {
  return (
    <>
      <a
        href="#contents"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:p-2"
      >
        Skip to contents
      </a>
      <ChapterNav items={contents} />

      <main className="flex-1">
        <Section part={parts.cover} labelledBy="cover-title" className="border-t-0">
          {/* Hook point: break-out slot for the Sprint 5 character (tech plan §6). */}
          <div data-slot="break-out" aria-hidden />
          <p className="text-sm font-semibold uppercase tracking-wide opacity-70">{parts.cover.title}</p>
          <h1 id="cover-title" className="mt-2 text-4xl font-bold md:text-6xl">
            {siteConfig.name}
          </h1>
          <p className="mt-3 text-xl font-semibold md:text-2xl">{siteConfig.title}</p>
          <p className="mt-2">
            {current.role} @ {current.org} · {siteConfig.location}
          </p>
          <p className="mt-4 max-w-prose">{siteConfig.description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={siteConfig.resume} download className={button}>
              Resume
            </a>
            <a href={`#${parts.finale.id}`} className={button}>
              Contact
            </a>
          </div>
          <div className="mt-10">
            <StatList stats={stats} />
          </div>
          <nav id="contents" aria-labelledby="contents-title" className="mt-10 scroll-mt-16">
            <h2 id="contents-title" className="text-xl font-bold">
              Contents
            </h2>
            <ol className="mt-3 flex flex-col gap-1">
              {contents.slice(1).map((i) => (
                <li key={i.id}>
                  <a href={`#${i.id}`} className="underline">
                    {i.label}
                  </a>
                  {i.id === current.id && <span className="ml-2 text-sm font-semibold">(Current arc)</span>}
                </li>
              ))}
            </ol>
          </nav>
        </Section>

        {chapters.map((c) => {
          const linked = projects.filter((p) => p.chapterId === c.id);
          return (
            <Section key={c.id} part={c}>
              <ChapterHeader
                id={`${c.id}-title`}
                eyebrow={`Ch.${c.number} · ${c.gearName}`}
                title={c.title}
                label={`${c.subtitle} · ${c.period}`}
              />
              <p className="mb-4">
                {c.role}, {c.org}, {c.location}
              </p>
              {c.products && (
                <div className="mb-8 grid gap-4 md:grid-cols-2">
                  {c.products.map((p) => (
                    <article key={p.title} className="border border-current/20 p-4">
                      <h3 className="text-xl font-bold">{p.title}</h3>
                      <p className="mt-2">{p.description}</p>
                    </article>
                  ))}
                </div>
              )}
              <ul className="flex max-w-prose list-disc flex-col gap-2 pl-5">
                {c.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
              {c.metrics && (
                <div className="mt-8">
                  <StatList stats={c.metrics} />
                </div>
              )}
              {linked.length > 0 && (
                <p className="mt-6">
                  Built in this chapter:{" "}
                  {linked.map((p, i) => (
                    <span key={p.id}>
                      {i > 0 && ", "}
                      <a href={`#project-${p.id}`} className="font-semibold underline">
                        {p.title}
                      </a>
                    </span>
                  ))}
                </p>
              )}
            </Section>
          );
        })}

        <Section part={parts.gaiden}>
          <ChapterHeader id={`${parts.gaiden.id}-title`} eyebrow="Gaiden" title={parts.gaiden.title} />
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((p) => (
              <div key={p.id} id={`project-${p.id}`} className={p.spread ? "scroll-mt-16 md:col-span-2" : "scroll-mt-16"}>
                <ProjectCard project={p} />
              </div>
            ))}
          </div>
        </Section>

        <Section part={parts.status}>
          <ChapterHeader id={`${parts.status.id}-title`} title={parts.status.title} />
          <div className="grid gap-4 md:grid-cols-2">
            {skills.map((g) => (
              <SkillGroup key={g.name} group={g} />
            ))}
          </div>
        </Section>

        <Section part={parts.finale}>
          <ChapterHeader id={`${parts.finale.id}-title`} title={parts.finale.title} />
          <div className="grid gap-10 md:grid-cols-2">
            <ContactForm email={siteConfig.email} />
            <ul className="flex flex-col gap-2">
              <li>
                <a href={`mailto:${siteConfig.email}`} className="underline">
                  {siteConfig.email}
                </a>
              </li>
              {siteConfig.socials.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="underline">
                    {s.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={siteConfig.resume} download className="underline">
                  Resume (PDF)
                </a>
              </li>
              <li>{siteConfig.location}</li>
            </ul>
          </div>
        </Section>
      </main>

      <SiteFooter site={siteConfig} />
      <GuideLayer />
    </>
  );
}
