import { cn } from "@/lib/utils";

/** h2 block for any spread. `eyebrow` = arc ribbon (e.g. "Gear 4: The Blade Forge Arc"), `label` = plain role/years line. */
export function ChapterHeader({
  id,
  title,
  eyebrow,
  label,
  className,
}: {
  id: string;
  title: string;
  eyebrow?: string;
  label?: string;
  className?: string;
}) {
  return (
    <header className={cn("relative", className)}>
      {eyebrow && (
        <p data-ribbon className="ribbon origin-left text-sm whitespace-nowrap md:text-base">
          {eyebrow}
        </p>
      )}
      <h2
        id={id}
        data-title
        className={cn(
          "mt-3 font-display tracking-[-0.01em] uppercase text-balance",
          "max-w-[13ch] text-[clamp(2.4rem,6.4vw,5.6rem)]",
          "leading-[0.92]", // after the size: tailwind-merge drops an earlier leading-* when a text-* follows
        )}
      >
        {title}
      </h2>
      {label && (
        <p className="mt-4 max-w-[46ch] text-base font-bold [font-stretch:85%] md:text-lg">{label}</p>
      )}
    </header>
  );
}
