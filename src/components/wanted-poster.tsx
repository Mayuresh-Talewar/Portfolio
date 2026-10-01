import Image from "next/image";
import type { CoverPart, Stat } from "@/types";
import { StatList } from "./stat-list";

const INK = "#3b2a1a";

/** Hero bounty from the data: "Bounty: 3+ production apps shipped" → 3,000,000,000 (1 billion per shipped app). */
function bountyOf(label?: string) {
  const n = Number(label?.match(/(\d+)/)?.[1] ?? 1);
  return (n * 1_000_000_000).toLocaleString("en-US");
}

/**
 * Bounty poster, top to bottom: WANTED, photo window, DEAD OR ALIVE, name, bounty, epithet + issuer.
 * Lettering is SVG <text> with textLength so each line spans the sheet at any width. No seal or emblem.
 * The stats ride below on a pinned ledger slip so recruiters still get the numbers.
 */
export function WantedPoster({
  name,
  wanted,
  stats,
}: {
  name: string;
  wanted?: Partial<CoverPart["wanted"]>;
  stats: Stat[];
}) {
  const bounty = bountyOf(wanted?.bountyLabel);
  const why = wanted?.bountyLabel?.split(/:\s*/)[1];
  return (
    <figure data-poster aria-label={`Wanted poster: ${name}, bounty ${bounty}`} className="relative mx-auto w-full max-w-[23rem]">
      <svg aria-hidden className="absolute size-0">
        <filter id="wanted-wear">
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="1.4" result="d" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -6 4.6" result="holes" />
          <feComposite in="d" in2="holes" operator="in" />
        </filter>
      </svg>

      {/* The sheet: aged parchment, burnt edges, fibre grain, thin dark rule. */}
      <div
        className="relative flex aspect-[3/4.3] flex-col border-2 px-[6%] pt-[5%] pb-[4%]"
        style={{
          color: INK,
          borderColor: INK,
          backgroundColor: "#e8d5a9",
          backgroundImage: `radial-gradient(120% 95% at 50% 45%, transparent 52%, rgb(122 70 24 / 0.5) 100%),
            radial-gradient(28% 18% at 88% 8%, rgb(120 70 25 / 0.28), transparent 70%),
            radial-gradient(22% 16% at 8% 92%, rgb(120 70 25 / 0.3), transparent 70%),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.55 .04' numOctaves='3'/%3E%3CfeColorMatrix values='0 0 0 0 .45 0 0 0 0 .3 0 0 0 0 .15 0 0 0 .22 0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23f)'/%3E%3C/svg%3E")`,
          boxShadow: "inset 0 0 28px rgb(110 60 20 / 0.45), 10px 12px 0 rgb(26 22 18 / 0.85)",
        }}
      >
        <span aria-hidden className="absolute top-2 left-1/2 size-3 -translate-x-1/2 rounded-full bg-ink shadow-[inset_-2px_-2px_0_#6b5a40]" />

        <svg aria-hidden viewBox="0 0 300 62" className="w-full font-serif" style={{ filter: "url(#wanted-wear)" }}>
          <text x="0" y="56" textLength="300" lengthAdjust="spacingAndGlyphs" fontSize="70" fontWeight="900" fill={INK}>
            WANTED
          </text>
        </svg>

        {/* Photo window ≈55% of the sheet */}
        <div className="relative mt-[4%] h-[52%] overflow-hidden border-2" style={{ borderColor: INK, backgroundColor: "#dcc28b" }}>
          <Image
            src="/images/profile.webp"
            alt={`Portrait of ${name}`}
            fill
            preload
            sizes="(min-width: 768px) 320px, 80vw"
            className="scale-[1.08] object-cover object-[50%_14%] mix-blend-multiply contrast-[1.2] grayscale sepia-[0.7]"
          />
          <div aria-hidden className="tone pointer-events-none absolute inset-0 opacity-[0.22]" style={{ "--tone-ink": INK } as React.CSSProperties} />
        </div>

        <p className="mt-[3%] flex items-center gap-2 font-serif text-[0.8rem] font-bold tracking-[0.32em] uppercase">
          <span aria-hidden className="h-px flex-1" style={{ background: INK }} />
          Dead or alive
          <span aria-hidden className="h-px flex-1" style={{ background: INK }} />
        </p>

        <svg aria-hidden viewBox="0 0 300 34" className="mt-[2%] w-full font-serif">
          <text x="0" y="29" textLength="300" lengthAdjust="spacingAndGlyphs" fontSize="34" fontWeight="900" fill={INK}>
            {name.toUpperCase()}
          </text>
        </svg>
        <p className="sr-only">{name}</p>

        {/* Bounty: our own drawn currency mark (B + two strokes) and one big number with the trailing dash. */}
        <svg aria-hidden viewBox="0 0 300 44" className="mt-[3%] w-full font-serif">
          <g fill={INK}>
            <text x="0" y="38" fontSize="44" fontWeight="900">
              B
            </text>
            <rect x="9" y="0" width="3" height="44" />
            <rect x="17" y="0" width="3" height="44" />
          </g>
          <text x="40" y="38" textLength="260" lengthAdjust="spacingAndGlyphs" fontSize="40" fontWeight="900" fill={INK}>
            {bounty}-
          </text>
        </svg>
        <p className="sr-only">Bounty {bounty}{why ? `: ${why}` : ""}</p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-[2%] font-serif">
          {wanted?.epithet && <p className="text-sm leading-tight font-bold italic">&ldquo;{wanted.epithet}&rdquo;</p>}
          <p className="text-[0.75rem] font-bold tracking-[0.2em] [font-variant:small-caps]">Marine</p>
        </div>
      </div>

      {/* Ledger slip pinned under the sheet: what the bounty is for. */}
      <figcaption className="parchment relative z-10 mx-[6%] -mt-3 rotate-[-1.5deg] border-2 border-ink px-3 pt-2 pb-2 shadow-[5px_5px_0_var(--color-ink)]">
        {why && <p className="mb-1.5 text-center font-serif text-sm font-bold">For: {why}</p>}
        <StatList stats={stats} variant="poster" />
      </figcaption>
    </figure>
  );
}
