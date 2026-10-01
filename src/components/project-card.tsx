import Image from "next/image";
import type { Project } from "@/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="flex h-full flex-col border border-current/20">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={project.image}
          alt={`Screenshot of the ${project.title} website`}
          fill
          sizes={project.spread ? "(min-width: 1024px) 1024px, 100vw" : "(min-width: 768px) 50vw, 100vw"}
          className="object-cover object-top"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="text-xl font-bold">{project.title}</h3>
        <p>{project.summary}</p>
        <ul className="flex flex-wrap gap-2 text-sm" aria-label="Tech stack">
          {project.stack.map((t) => (
            <li key={t} className="border border-current/20 px-2 py-0.5">
              {t}
            </li>
          ))}
        </ul>
        <a href={project.href} target="_blank" rel="noopener noreferrer" className="mt-auto font-semibold underline">
          Live site<span className="sr-only"> for {project.title} (opens in a new tab)</span>
        </a>
      </div>
    </article>
  );
}
