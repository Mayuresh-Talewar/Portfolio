import type { SkillGroup as SkillGroupData } from "@/types";

/** One entry in the Status Window (night page): no levels, no percentages. */
export function SkillGroup({ group }: { group: SkillGroupData }) {
  return (
    <div data-panel className="mb-4 break-inside-avoid border-2 border-paper/70 bg-sea-deep p-4 shadow-[5px_5px_0_var(--color-straw)]">
      <h3 className="mb-3 flex items-baseline justify-between gap-3 border-b-2 border-dashed border-paper/40 pb-2 font-sfx text-2xl tracking-wide text-straw">
        {group.name}
        <span className="font-sans text-xs font-bold tracking-normal text-paper/80">{group.skills.length} skills</span>
      </h3>
      <ul className="flex flex-wrap gap-1.5">
        {group.skills.map((s) => (
          <li key={s} className="border border-paper/45 bg-paper/5 px-2 py-1 text-sm leading-tight text-paper">
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}
