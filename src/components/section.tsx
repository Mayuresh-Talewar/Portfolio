import type { ReactNode } from "react";
import type { Part } from "@/types";
import { cn } from "@/lib/utils";

/** Section contract (tech plan §6): id + data-chapter + data-mode, labelled by its heading. One section = one manga spread. */
export function Section({
  part,
  labelledBy = `${part.id}-title`,
  className,
  children,
  backdrop,
  ...data
}: {
  part: Pick<Part, "id" | "colorMode">;
  labelledBy?: string;
  className?: string;
  children: ReactNode;
  /** Full-bleed art layer behind the page content (textures, flood). */
  backdrop?: ReactNode;
} & { [k: `data-${string}`]: string | undefined }) {
  return (
    <section
      id={part.id}
      data-chapter={part.id}
      data-mode={part.colorMode}
      aria-labelledby={labelledBy}
      className={cn("relative isolate scroll-mt-16 overflow-hidden border-b-[3px] border-ink px-3 py-10 md:px-8 md:py-20", className)}
      {...data}
    >
      {backdrop}
      <div className="relative mx-auto max-w-[1320px]">{children}</div>
    </section>
  );
}
