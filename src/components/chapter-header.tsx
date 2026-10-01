/** h2 block for any section. `eyebrow` = e.g. "Ch.4 · Gear 4", `label` = plain role/years line. */
export function ChapterHeader({
  id,
  title,
  eyebrow,
  label,
}: {
  id: string;
  title: string;
  eyebrow?: string;
  label?: string;
}) {
  return (
    <header className="mb-8">
      {eyebrow && <p className="text-sm font-semibold uppercase tracking-wide opacity-70">{eyebrow}</p>}
      <h2 id={id} className="text-3xl font-bold md:text-4xl">
        {title}
      </h2>
      {label && <p className="mt-2 font-medium">{label}</p>}
    </header>
  );
}
