import type { SkillGroup as SkillGroupData } from "@/types";

export function SkillGroup({ group }: { group: SkillGroupData }) {
  return (
    <div className="border border-current/20 p-4">
      <h3 className="mb-2 font-mono text-sm font-bold uppercase">{group.name}</h3>
      <ul className="flex flex-wrap gap-x-3 gap-y-1">
        {group.skills.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </div>
  );
}
