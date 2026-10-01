import Image from "next/image";
import type { CoverPart, Stat } from "@/types";
import { StatList } from "./stat-list";

/** Our own Western-style bounty poster (not the Marine layout): parchment, nails, sepia portrait, stats as the bounty ledger. */
export function WantedPoster({
  name,
  wanted,
  stats,
}: {
  name: string;
  wanted?: Partial<CoverPart["wanted"]>;
  stats: Stat[];
}) {
  const [bountyKey, bountyValue] = wanted?.bountyLabel?.includes(":")
    ? wanted.bountyLabel.split(/:\s*/, 2)
    : ["Bounty", wanted?.bountyLabel];
  return (
    <figure
      data-poster
      aria-label={`Wanted poster: ${name}`}
      className="parchment relative mx-auto w-full max-w-[22rem] border-[3px] border-ink p-4 pb-3 shadow-[10px_12px_0_rgb(26_22_18_/_0.85)] md:p-5 md:pb-4"
    >
      {/* nails */}
      <span aria-hidden className="absolute top-2 left-1/2 size-3 -translate-x-1/2 rounded-full bg-ink shadow-[inset_-2px_-2px_0_#6b5a40]" />
      <p aria-hidden className="text-center font-display text-[3.3rem] leading-[0.85] tracking-[0.03em] md:text-[3.45rem]">
        WANTED
      </p>
      <p className="mt-1 mb-3 text-center text-xs font-extrabold tracking-[0.3em] uppercase [font-stretch:80%]">
        On your team. Alive.
      </p>
      <div className="relative aspect-[4/3] overflow-hidden border-[3px] border-ink bg-[#e9d19a]">
        <Image
          src="/images/portrait.webp"
          alt={`Portrait of ${name}`}
          fill
          preload
          sizes="(min-width: 768px) 380px, 90vw"
          className="scale-[1.35] object-cover object-[50%_18%] mix-blend-multiply contrast-[1.15] grayscale sepia-[0.55]"
        />
        <div aria-hidden className="tone pointer-events-none absolute inset-0 opacity-20" />
      </div>
      <figcaption className="mt-3 text-center">
        <span className="block font-display text-[1.9rem] leading-none uppercase md:text-[2.2rem]">{name}</span>
        {wanted?.epithet && (
          <span className="mt-1 block font-letter text-lg font-bold">&ldquo;{wanted.epithet}&rdquo;</span>
        )}
        {bountyValue && (
          <span className="mt-2 flex items-center justify-center gap-2 border-y-[3px] border-double border-ink py-1.5">
            <span className="font-sfx text-xl tracking-wide text-jolly-ink">{bountyKey}</span>
            <span className="font-display text-lg leading-tight uppercase">{bountyValue}</span>
          </span>
        )}
      </figcaption>
      <div className="mt-3">
        <StatList stats={stats} variant="poster" />
      </div>
      {wanted?.notice && <p className="mt-2 text-center text-[0.8rem] leading-snug font-semibold">{wanted.notice}</p>}
    </figure>
  );
}
