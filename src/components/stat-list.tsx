import type { Stat } from "@/types";

export function StatList({ stats }: { stats: Stat[] }) {
  return (
    <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col-reverse border border-current/20 p-4">
          <dt className="text-sm">{s.label}</dt>
          <dd className="font-mono text-2xl font-bold">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}
