import type { ReactNode } from "react";
import type { Part } from "@/types";
import { cn } from "@/lib/utils";

/** Section contract (tech plan §6): id + data-chapter + data-mode, labelled by its heading. */
export function Section({
  part,
  labelledBy = `${part.id}-title`,
  className,
  children,
}: {
  part: Pick<Part, "id" | "colorMode">;
  labelledBy?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={part.id}
      data-chapter={part.id}
      data-mode={part.colorMode}
      aria-labelledby={labelledBy}
      className={cn("scroll-mt-16 border-t border-current/15 px-4 py-16 md:px-8", className)}
    >
      <div className="mx-auto max-w-5xl">{children}</div>
    </section>
  );
}
