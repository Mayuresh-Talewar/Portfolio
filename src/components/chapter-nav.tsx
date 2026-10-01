"use client";

import { useEffect, useState } from "react";

export type NavItem = { id: string; label: string; gear?: number };

/** Sticky anchor nav + Gear meter; one IntersectionObserver marks the section crossing mid-viewport. */
export function ChapterNav({ items, maxGear = 5 }: { items: NavItem[]; maxGear?: number }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    for (const { id } of items) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [items]);

  // Gear = highest gear reached up to the active section (Gaiden/Status/Finale keep Gear 5).
  const idx = items.findIndex((i) => i.id === active);
  const gear = Math.max(0, ...items.slice(0, idx + 1).map((i) => i.gear ?? 0));

  return (
    <nav aria-label="Chapters" className="sticky top-0 z-30 border-b border-current/15 bg-white/95 px-4 md:px-8">
      <div className="mx-auto flex max-w-5xl items-center gap-4 overflow-x-auto py-2">
        <ol className="flex gap-3 text-sm whitespace-nowrap">
          {items.map((i) => (
            <li key={i.id}>
              <a
                href={`#${i.id}`}
                aria-current={i.id === active ? "true" : undefined}
                className="block px-1 py-2 aria-[current=true]:font-bold aria-[current=true]:underline"
              >
                {i.label}
              </a>
            </li>
          ))}
        </ol>
        <div className="ml-auto flex shrink-0 items-center gap-2 text-sm">
          <span id="gear-meter-label">Gear</span>
          <meter
            aria-labelledby="gear-meter-label"
            min={0}
            max={maxGear}
            value={gear}
            className="w-20"
          />
          <span aria-hidden>{gear}/{maxGear}</span>
        </div>
      </div>
    </nav>
  );
}
