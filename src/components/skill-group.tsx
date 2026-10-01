import type { SignatureSkill, SkillGroup as SkillGroupData } from "@/types";

/** One resume group as a status line: straw label + slash-separated skills. No levels, no percentages, no chip boxes. */
export function SkillGroup({ group }: { group: SkillGroupData }) {
  return (
    <div className="status-row border-t-2 border-paper/20 py-4">
      <h3 className="flex items-baseline justify-between gap-3 font-sfx text-xl tracking-wide text-straw">
        {group.name}
        <span className="font-sans text-xs font-bold tracking-normal text-paper/70">{group.skills.length}</span>
      </h3>
      <ul className="skill-line mt-1.5 text-[0.95rem] leading-relaxed text-paper/90">
        {group.skills.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </div>
  );
}

/** Status Window body: three signature skills as display words, then every resume group as a compact line. */
export function StatusBoard({ signatures, groups }: { signatures: SignatureSkill[]; groups: SkillGroupData[] }) {
  return (
    <>
      <ol className="mb-10 grid gap-6 md:grid-cols-3 md:gap-0">
        {signatures.map((s) => (
          <li key={s.name} className="status-row border-l-[3px] border-straw pl-4 md:pr-6">
            <h3 className="font-display text-[clamp(2rem,3.6vw,3.25rem)] leading-[0.95] text-straw uppercase">{s.name}</h3>
            <p className="mt-3 max-w-[34ch] text-base leading-snug text-paper/90">{s.proof}</p>
          </li>
        ))}
      </ol>
      <div className="grid gap-x-10 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((g) => (
          <SkillGroup key={g.name} group={g} />
        ))}
      </div>
    </>
  );
}
