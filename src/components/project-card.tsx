import Image from "next/image";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";

const CUTS = ["cut-a", "cut-b", "cut-d", "cut-c"];

/** A Gaiden (side story) panel. Screenshots print as ink + sea duotone and ink in on hover/focus. */
export function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  const spread = project.spread;
  return (
    <article
      data-panel
      className={cn("cut group flex h-full flex-col p-[var(--bw)]", CUTS[index % CUTS.length], spread && "md:grid md:grid-cols-12")}
      style={{ "--panel-bg": spread ? "var(--color-straw)" : "var(--color-paper)" } as React.CSSProperties}
    >
      <div
        className={cn(
          "relative aspect-[16/10] overflow-hidden border-b-[3px] border-ink bg-foam",
          spread && "md:col-span-7 md:aspect-auto md:min-h-[24rem] md:border-r-[3px] md:border-b-0",
        )}
      >
        <Image
          src={project.image}
          alt={`Screenshot of the ${project.title} website`}
          fill
          sizes={spread ? "(min-width: 768px) 60vw, 100vw" : "(min-width: 768px) 50vw, 100vw"}
          className="object-cover object-top mix-blend-multiply contrast-125 grayscale transition-[filter] duration-500 group-focus-within:mix-blend-normal group-focus-within:grayscale-0 group-hover:mix-blend-normal group-hover:grayscale-0"
        />
        <div aria-hidden className="tone pointer-events-none absolute inset-0 opacity-25 transition-opacity duration-500 group-hover:opacity-0" />
      </div>
      <div className={cn("flex flex-1 flex-col gap-3 p-5 pb-10 md:p-6 md:pb-12", spread && "md:col-span-5 md:justify-center md:pb-14")}>
        {spread && <p className="ribbon self-start text-xs">Lead story</p>}
        <h3 className={cn("font-display uppercase", spread ? "text-3xl md:text-[2.6rem]" : "text-2xl", "leading-[1.02]")}>
          {project.title}
        </h3>
        <p className="max-w-[60ch] leading-relaxed">{project.summary}</p>
        <ul className="flex flex-wrap gap-1.5 text-sm" aria-label="Tech stack">
          {project.stack.map((t) => (
            <li key={t} className="border-2 border-ink bg-paper px-2 py-0.5 font-semibold">
              {t}
            </li>
          ))}
        </ul>
        <a href={project.href} target="_blank" rel="noopener noreferrer" className="btn btn-ink btn-sm mt-auto self-start">
          Visit live site<span className="sr-only"> for {project.title} (opens in a new tab)</span>
        </a>
      </div>
    </article>
  );
}
