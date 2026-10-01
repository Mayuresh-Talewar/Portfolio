import type { Chapter, Project } from "@/types";
import { cn } from "@/lib/utils";
import { ChapterHeader } from "./chapter-header";
import { Section } from "./section";
import { LuffyArt, luffySrc } from "./luffy/luffy-art";
import { LuffyRig } from "./luffy/luffy-rig";
import { PistolArm } from "./luffy/pistol-arm";
import { ArrivalFx } from "./motion/arrival-fx";
import { GearFive } from "./motion/gear-five";
import { StatList } from "./stat-list";

const PRODUCT_LAYOUT = [
  { span: "md:col-span-4", bg: "var(--color-straw)", fg: "var(--color-ink)" },
  { span: "md:col-span-2", bg: "var(--color-jolly)", fg: "var(--color-paper)" },
  { span: "md:col-span-2", bg: "var(--color-paper)", fg: "var(--color-ink)" },
  { span: "md:col-span-4", bg: "var(--color-sea)", fg: "var(--color-paper)" },
];

/** One chapter = one spread: a dominant "island arrival" title panel, narration, and the record. */
export function ChapterSpread({ chapter: c, projects, luffy = false }: { chapter: Chapter; projects: Project[]; luffy?: boolean }) {
  const climax = c.gear === 5;
  const flip = !climax && c.number % 2 === 0;
  const thin = !c.metrics && !c.products;
  const titleId = `${c.id}-title`;
  // Gear art (features.luffy). B&W ink until Gear 5; a missing file falls back to the SFX-only Gear-up.
  // One Luffy per moment: Gear 1's moment is the Gomu Gomu panel, Gear 5's is the climax splash.
  const artSrc = luffy && c.gear > 1 && !climax ? luffySrc(c.gear, "bw") : null;
  const art = !!artSrc;
  const pistol = luffy && c.gear === 1 ? luffySrc(1, "bw") : null;

  const record = (
    <article data-panel className={cn("panel p-5 md:p-7", !thin && "col-span-12", !thin && (c.metrics ? "md:col-span-8" : "md:col-span-12"), flip && !thin && "md:col-start-5")}>
      <h3 className="font-display text-xl leading-tight uppercase md:text-2xl">{c.role}</h3>
      <p className="mt-1 font-bold [font-stretch:85%]" style={{ color: "var(--spot-text)" }}>
        {c.org}, {c.location}
      </p>
      <ul className="mt-4 flex max-w-[72ch] flex-col gap-3">
        {c.highlights.map((h) => (
          <li key={h} className="relative pl-6 leading-relaxed">
            <span aria-hidden className="absolute top-[0.55em] left-0 size-2.5 rotate-45" style={{ background: "var(--spot)" }} />
            {h}
          </li>
        ))}
      </ul>
      {projects.length > 0 && (
        <p className="mt-5 border-t-2 border-dashed border-ink/40 pt-3 font-semibold">
          Side story from this chapter:{" "}
          {projects.map((p, i) => (
            <span key={p.id}>
              {i > 0 && ", "}
              <a href={`#project-${p.id}`} className="underline decoration-2 underline-offset-4 hover:decoration-jolly">
                {p.title}
              </a>
            </span>
          ))}
        </p>
      )}
    </article>
  );

  return (
    <Section
      part={c}
      className={cn(climax && "pt-0 md:pt-0")}
      data-flood={climax ? "" : undefined}
      data-flooded={climax ? "true" : undefined}
      backdrop={
        climax ? (
          <div aria-hidden className="flood-layer absolute inset-0 -z-10 bg-sea">
            <div className="rays absolute inset-0 opacity-90" style={{ "--ray-a": "#13679f", "--ray-b": "#0f5c93", "--sx": "50%", "--sy": "16%" } as React.CSSProperties} />
            <div className="tone absolute inset-0 opacity-20" style={{ "--tone-ink": "#9fd8f2" } as React.CSSProperties} />
          </div>
        ) : undefined
      }
    >
      {climax && (
        <GearFive>
          {luffy && (
            // Art panel inside the splash: G4 (ink) is swapped for G5 (color) under the white flash.
            <div className="absolute top-[5%] left-1/2 aspect-[3/4] h-[52%] -translate-x-1/2 -rotate-2 overflow-hidden border-[4px] border-ink bg-paper shadow-[8px_8px_0_var(--color-ink)] md:top-[6%] md:h-[58%]">
              <LuffyArt gear={4} mode="bw" alt="" data-art="prev" className="absolute inset-0 size-full object-contain" />
              <LuffyArt
                gear={5}
                mode="color"
                alt="Fan art: a laughing cartoon pirate in white, fist raised, at full power"
                data-art="body"
                className="absolute inset-0 size-full object-cover"
              />
            </div>
          )}
          <div className={cn("flex flex-col items-center", luffy && "self-end pb-[7%]")}>
            <p className="gear-prev sfx absolute text-[clamp(4rem,14vw,10rem)]">GEAR {c.gear - 1}</p>
            <p aria-hidden className="ribbon text-sm md:text-base" style={{ "--ribbon-bg": "var(--color-ink)" } as React.CSSProperties}>
              Ch.{c.number}: the climax
            </p>
            <p
              aria-hidden
              className={cn("gear-call sfx mt-3", luffy ? "text-[clamp(5rem,16vw,11rem)]" : "text-[clamp(5.5rem,22vw,17rem)]")}
              style={{ "--sfx-fill": "var(--color-paper)", textShadow: "0.05em 0.06em 0 var(--color-jolly)" } as React.CSSProperties}
            >
              GEAR {c.gear}
            </p>
            {c.gearCaption && <p className="gear-line caption mt-6 max-w-[34ch] text-base md:text-lg">{c.gearCaption}</p>}
          </div>
          {c.sfx?.map((s, i) => (
            <span
              key={s.text}
              aria-hidden
              className={cn("gear-beat sfx absolute text-[clamp(2.6rem,7vw,6rem)]", i ? "right-[5%] bottom-[12%]" : "top-[10%] left-[5%]")}
              style={{ "--sfx-fill": "var(--color-jolly)" } as React.CSSProperties}
            >
              {s.text}
              {s.kana && <span className="mt-1 block font-display text-[0.35em] tracking-tight">{s.kana}</span>}
            </span>
          ))}
        </GearFive>
      )}
      <div className="grid grid-cols-12 gap-3 md:gap-5">
        {/* Dominant panel: island arrival */}
        <div
          data-arrival
          data-gear={c.gear}
          className={cn(
            "cut flood-ink col-span-12 flex flex-col justify-end p-6 pb-12 md:p-10 md:pb-16",
            art ? "min-h-[36rem]" : "min-h-[29rem]",
            "md:col-span-8 md:min-h-[37rem]",
            climax && "cut-b",
            flip ? "cut-d md:col-start-5 md:row-start-1" : !climax && "cut-a",
          )}
          style={{ "--panel-bg": climax ? "var(--color-straw)" : "var(--color-paper)" } as React.CSSProperties}
        >
          <ArrivalFx gear={c.gear} />
          {artSrc && (
            <LuffyRig
              src={artSrc}
              prev={c.gear > 1 ? luffySrc((c.gear - 1) as Chapter["gear"], "bw") : null}
              enter="gearup"
              label={`Fan art: a cartoon pirate transforming into Gear ${c.gear}`}
              className="pointer-events-none absolute top-[4%] right-[2%] aspect-[3/4] h-[46%] md:top-auto md:right-[1%] md:bottom-[calc(var(--cut)+6px)] md:h-[80%]"
            >
              <LuffyArt gear={c.gear} mode="bw" alt="" className="size-full object-contain" />
            </LuffyRig>
          )}
          <div aria-hidden className="pointer-events-none absolute inset-[3px] overflow-hidden">
            <div
              data-lines
              className="speedlines absolute -inset-1/4 opacity-[0.16]"
              style={{ "--sx": flip ? "28%" : "72%", "--sy": "30%", "--lines": climax ? "var(--color-jolly)" : "var(--spot)" } as React.CSSProperties}
            />
            <div className="tone tone-fade absolute inset-x-0 top-0 h-2/3 opacity-[0.14]" />
            <span
              data-numeral
              className={cn(
                "absolute -top-[0.12em] font-display text-[clamp(14rem,34vw,30rem)] leading-none text-transparent [-webkit-text-stroke:3px_var(--color-ink)]",
                "-left-[0.04em]",
              )}
              style={{ opacity: 0.13 }}
            >
              {c.number}
            </span>
          </div>

          {!climax && c.sfx && c.sfx.length > 0 && (
            <div
              aria-hidden
              data-sfx
              className={cn(
                cn("pointer-events-none absolute flex items-start gap-2", art ? "top-[3%]" : "top-[7%]"),
                art ? "left-[5%] -rotate-[6deg]" : flip ? "right-[6%] -rotate-[7deg]" : "right-[5%] rotate-[8deg]",
              )}
            >
              <div className="flex flex-col items-end gap-1">
                {c.sfx.map((s) => (
                  <span
                    key={s.text}
                    className={cn("sfx block", art ? "text-[clamp(3.2rem,8vw,6.2rem)]" : "text-[clamp(3.6rem,10vw,7.5rem)]")}
                    style={{ "--sfx-fill": c.gear >= 3 ? "var(--color-jolly)" : climax ? "var(--color-jolly)" : "var(--color-paper)" } as React.CSSProperties}
                  >
                    {s.text}
                  </span>
                ))}
              </div>
              {c.sfx[0]?.kana && <span className="kana text-[clamp(1.6rem,3.6vw,2.8rem)] leading-none">{c.sfx.map((s) => s.kana).join("")}</span>}
              {/* steam puffs for the gear-up */}
              {[0, 1, 2, 3].map((n) => (
                <span
                  key={n}
                  data-puff
                  className="absolute size-10 rounded-full border-[3px] border-ink bg-paper opacity-0"
                  style={{ left: `${10 + n * 22}%`, top: `${60 + (n % 2) * 18}%` }}
                />
              ))}
            </div>
          )}

          <ChapterHeader
            id={titleId}
            eyebrow={c.arcTitle ?? `Ch.${c.number}: ${c.gearName}`}
            title={c.title}
            label={`${c.subtitle}, ${c.period}`}
            className="relative"
            compact={art}
          />
          <p data-landfall className="relative mt-4 inline-flex items-center gap-2 self-start border-2 border-ink bg-paper px-2.5 py-1 text-sm font-bold">
            <svg aria-hidden viewBox="0 0 16 16" className="size-4">
              <path d="M8 1l2 6 6 1-6 1-2 6-2-6-6-1 6-1z" fill="var(--spot)" stroke="#1a1612" strokeWidth="1" />
            </svg>
            Landfall: {c.location}
          </p>
        </div>

        {/* Narration column */}
        <div
          className={cn(
            // Captions break the panel edge (manga lettering overlaps the art, reset note 3).
            "relative z-10 col-span-12 -mt-10 flex flex-col gap-4 px-3 md:col-span-4 md:mt-10 md:px-0",
            flip && "md:col-start-1 md:row-start-1",
          )}
        >
          {c.narration?.map((line, i) => (
            <p
              key={line}
              data-caption
              className={cn(
                "caption text-[0.95rem] md:text-base",
                i % 2 ? "md:rotate-[0.8deg]" : "md:-rotate-[0.8deg]",
                flip ? (i % 2 ? "md:-mr-6" : "md:-mr-16") : i % 2 ? "md:-ml-6" : "md:-ml-16",
              )}
            >
              {line}
            </p>
          ))}
          {c.gearCaption && !climax && (
            <div data-caption className="mt-2 flex items-end gap-3">
              <p className="bubble flex-1 text-[0.95rem]">{c.gearCaption}</p>
              <span
                aria-hidden
                className="shrink-0 font-display text-[3.4rem] leading-[0.8] uppercase [-webkit-text-stroke:2px_var(--color-ink)] [paint-order:stroke_fill]"
                style={{ color: climax ? "var(--color-straw)" : "var(--spot)" }}
              >
                G{c.gear}
              </span>
            </div>
          )}
          {thin && record}
        </div>

        {!thin && (
          <>
            {record}
            {c.metrics && (
              <div className={cn("col-span-12 grid place-items-center md:col-span-4", flip && "md:col-start-1 md:row-start-2")}>
                <StatList stats={c.metrics} />
              </div>
            )}
          </>
        )}

        {pistol && (
          <div className="panel col-span-12 overflow-visible p-0" style={{ "--panel-bg": "var(--color-paper)" } as React.CSSProperties}>
            <div aria-hidden className="speedlines pointer-events-none absolute inset-0 opacity-10" style={{ "--sx": "20%", "--sy": "45%" } as React.CSSProperties} />
            <PistolArm src={pistol} />
          </div>
        )}

        {c.products && (
          <ul className="col-span-12 grid grid-cols-1 gap-3 md:grid-cols-6 md:gap-5">
            {c.products.map((p, i) => {
              const l = PRODUCT_LAYOUT[i % PRODUCT_LAYOUT.length];
              return (
                <li
                  key={p.title}
                  data-panel
                  className={cn("panel flex flex-col gap-3 p-5 md:p-7", l.span)}
                  style={{ "--panel-bg": l.bg, "--panel-fg": l.fg } as React.CSSProperties}
                >
                  <h3 className="font-display text-2xl leading-none uppercase md:text-3xl">{p.title}</h3>
                  <p className="leading-relaxed">{p.description}</p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Section>
  );
}
