import type { Stat } from "@/types";
import { cn } from "@/lib/utils";

/** `poster` = the bounty ledger on the wanted poster; `burst` = impact stars inside a chapter. */
export function StatList({ stats, variant = "burst" }: { stats: Stat[]; variant?: "poster" | "burst" }) {
  if (variant === "poster")
    return (
      <dl className="grid grid-cols-2 border-t-2 border-ink">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={cn("flex flex-col-reverse px-2 py-2", i % 2 === 0 && "border-r-2 border-ink", i > 1 && "border-t-2 border-ink")}
          >
            <dt className="text-[0.8rem] leading-tight font-semibold">{s.label}</dt>
            <dd className="font-display text-2xl leading-none text-jolly-ink">{s.value}</dd>
          </div>
        ))}
      </dl>
    );

  return (
    <dl className="flex flex-wrap gap-4">
      {stats.map((s, i) => (
        <div key={s.label} data-burst className="flex min-w-[9.5rem] flex-1 flex-col-reverse items-center gap-2 text-center">
          <dt className="max-w-[18ch] text-sm leading-snug font-bold">{s.label}</dt>
          <dd
            className="grid aspect-square w-40 place-items-center bg-ink font-display text-[1.45rem] leading-none text-paper md:w-44 md:text-[1.7rem]"
            style={{
              clipPath:
                "polygon(50% 0,61% 22%,85% 9%,78% 34%,100% 42%,80% 57%,93% 80%,66% 75%,58% 100%,45% 78%,22% 94%,24% 69%,0 60%,20% 44%,6% 20%,32% 25%)",
              rotate: i % 2 ? "6deg" : "-5deg",
              background: "var(--spot)",
            }}
          >
            <span style={{ rotate: i % 2 ? "-6deg" : "5deg" }}>{s.value}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
