import type { Chapter, Project } from "@/types";
import { cn } from "@/lib/utils";
import { ChapterHeader } from "./chapter-header";
import { Section } from "./section";
import { ArrivalFx } from "./motion/arrival-fx";
import { GearFive } from "./motion/gear-five";
import { StatList } from "./stat-list";

const PRODUCT_LAYOUT = [
  { span: "md:col-span-4", bg: "var(--color-straw)", fg: "var(--color-ink)", num: "var(--color-jolly)" },
  { span: "md:col-span-2", bg: "var(--color-jolly)", fg: "var(--color-paper)", num: "var(--color-straw)" },
  { span: "md:col-span-2", bg: "var(--color-paper)", fg: "var(--color-ink)", num: "var(--color-jolly)" },
  { span: "md:col-span-4", bg: "var(--color-sea)", fg: "var(--color-paper)", num: "var(--color-straw)" },
];

/*
 * Composition per `chapter.layout` (one component, class variants only):
 * classic = title panel (8) + offset captions (4) + record/bursts, mirrored on even chapters.
 * splash  = boxless title on rays across the full width, record panel overlapping its bottom edge.
 * tiers   = three vertical panels 2fr/1fr/1fr (title, narration, record) stepping down like stairs.
 * versus  = title panel and a red stats panel sharing one diagonal slash, captions + record below.
 */
const TITLE = {
  classic: "cut col-span-12 md:col-span-8",
  splash: "col-span-12 min-h-[24rem] md:min-h-[36rem]",
  tiers: "cut cut-sq col-span-12 md:col-span-6",
  versus: "cut vs-l col-span-12 md:col-span-7",
};
const NARRATION = {
  classic: "-mt-10 px-3 md:col-span-4 md:mt-10 md:px-0",
  splash: "-mt-4 px-3 md:col-span-6 md:px-0",
  tiers: "panel tone-panel justify-between p-4 md:col-span-3 md:mt-12 md:p-5",
  versus: "-mt-8 px-3 md:col-span-4 md:-mt-12 md:px-0",
};
const RECORD = {
  classic: "col-span-12",
  splash: "col-span-12 md:col-span-5 md:col-start-8 md:-mt-44 shadow-[8px_8px_0_var(--color-ink)]",
  tiers: "col-span-12 flex flex-col md:col-span-3 md:mt-24",
  versus: "col-span-12 md:col-span-8",
};

/** One chapter = one spread: a dominant "island arrival" title panel, narration, and the record. */
export function ChapterSpread({ chapter: c, projects }: { chapter: Chapter; projects: Project[] }) {
  const climax = c.gear === 5;
  const layout = c.layout ?? "classic";
  const classic = layout === "classic";
  const flip = classic && !climax && c.number % 2 === 0;
  const wide = classic && !c.metrics;
  const titleId = `${c.id}-title`;

  const record = (
    <article
      data-panel
      className={cn("panel relative z-10 p-5 md:p-7", RECORD[layout], classic && (c.metrics ? "md:col-span-8" : "md:col-span-12"), flip && "md:col-start-5")}
      style={layout === "tiers" ? ({ "--panel-bg": "var(--color-ink)", "--panel-fg": "var(--color-paper)", "--spot-text": "var(--color-paper)", "--spot": "var(--color-paper)" } as React.CSSProperties) : undefined}
    >
      <h3 className="font-display text-h3 leading-[1.05] uppercase text-balance">{c.role}</h3>
      <p className="mt-2 font-bold [font-stretch:85%]" style={{ color: "var(--spot-text)" }}>
        {c.org}, {c.location}
      </p>
      <ul
        className={cn(
          "mt-5 max-w-[62ch] space-y-3",
          c.highlights.length > 3 ? "md:max-w-none md:columns-2 md:gap-x-10" : wide && "md:grid md:max-w-none md:grid-cols-2 md:gap-x-10 md:gap-y-3 md:space-y-0",
          layout === "tiers" && "mt-auto pt-6",
        )}
      >
        {c.highlights.map((h) => (
          <li key={h} className="relative break-inside-avoid pl-6">
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
        ) : layout === "splash" ? (
          <div aria-hidden className="splash-rays absolute inset-0 -z-10">
            <div className="rays absolute inset-0" style={{ "--ray-a": "var(--color-paper)", "--ray-b": "var(--color-newsprint)", "--sx": "34%", "--sy": "42%" } as React.CSSProperties} />
            <div className="tone tone-fade absolute inset-x-0 top-0 h-1/2 opacity-[0.12]" />
          </div>
        ) : undefined
      }
    >
      {climax && (
        <GearFive>
          <div className="flex flex-col items-center">
            <p aria-hidden className="gear-prev sfx absolute text-[clamp(4rem,14vw,10rem)]">GEAR {c.gear - 1}</p>
            <p aria-hidden className="ribbon text-sm md:text-base" style={{ "--ribbon-bg": "var(--color-ink)" } as React.CSSProperties}>
              Ch.{c.number}: the climax
            </p>
            <p
              aria-hidden
              className="gear-call sfx mt-3 text-[clamp(5.5rem,22vw,17rem)]"
              style={{ "--sfx-fill": "var(--color-paper)", textShadow: "0.05em 0.06em 0 var(--color-jolly)" } as React.CSSProperties}
            >
              GEAR {c.gear}
            </p>
            {c.gearCaption && <p className="gear-line caption mt-6 max-w-[min(34ch,calc(100vw-2rem))] text-base md:text-lg">{c.gearCaption}</p>}
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
            "flood-ink relative flex flex-col justify-end p-6 pb-12 md:p-10 md:pb-16",
            "min-h-[29rem] md:min-h-[37rem]",
            TITLE[layout],
            climax && "cut-b",
            flip ? "cut-d md:col-start-5 md:row-start-1" : classic && !climax && "cut-a",
            layout === "splash" && "md:px-0",
          )}
          style={{ "--panel-bg": climax ? "var(--color-straw)" : "var(--color-paper)" } as React.CSSProperties}
        >
          <ArrivalFx gear={c.gear} />
          {/* Object splash (no figure): a halftone gradient and speedlines that converge on the SFX word. */}
          <div aria-hidden className={cn("pointer-events-none absolute overflow-hidden", layout === "splash" ? "inset-0" : "inset-[3px]")}>
            <div
              data-lines
              className="speedlines absolute -inset-1/4 opacity-[0.22]"
              style={{ "--sx": flip ? "22%" : "78%", "--sy": "26%", "--lines": climax ? "var(--color-jolly)" : "var(--spot)" } as React.CSSProperties}
            />
            <div className="tone splash-tone absolute inset-0 opacity-[0.2]" style={{ "--tone-at": flip ? "15% 20%" : "85% 20%" } as React.CSSProperties} />
          </div>

          {climax ? (
            // Ch.5 already gets its SFX in the Gear 5 splash above; its title panel keeps the outlined numeral.
            <span
              aria-hidden
              className="pointer-events-none absolute -top-[0.12em] -left-[0.04em] font-display text-[clamp(14rem,34vw,30rem)] leading-none text-transparent opacity-[0.13] [-webkit-text-stroke:3px_var(--color-ink)]"
            >
              {c.number}
            </span>
          ) : (
            c.sfx[0] && (
              <div
                aria-hidden
                data-sfx
                className={cn(
                  // Static tilt on the wrapper only: GSAP transforms the .sfx inside (skill lesson 4).
                  // Bleeds off the top and outer edge so the panel crops it like a splash.
                  "pointer-events-none absolute -top-[0.06em] flex items-start gap-[0.06em] text-[clamp(7.5rem,19vw,16rem)]",
                  flip ? "-left-[0.18em] rotate-[8deg]" : "-right-[0.18em] flex-row-reverse -rotate-[8deg]",
                )}
              >
                <span
                  className="sfx block"
                  style={{ "--sfx-fill": c.gear >= 3 ? "var(--color-jolly)" : "var(--color-paper)", textShadow: "0.04em 0.05em 0 var(--color-ink)" } as React.CSSProperties}
                >
                  {c.sfx[0].text}
                </span>
                {c.sfx[0].kana && <span className="kana mt-[0.85em] text-[0.2em] leading-none">{c.sfx[0].kana}</span>}
                {/* steam puffs for the gear-up */}
                {[0, 1, 2, 3].map((n) => (
                  <span
                    key={n}
                    data-puff
                    className="absolute size-10 rounded-full border-[3px] border-ink bg-paper opacity-0"
                    style={{ left: `${30 + n * 12}%`, top: `${40 + (n % 2) * 18}%` }}
                  />
                ))}
              </div>
            )
          )}

          <ChapterHeader
            id={titleId}
            eyebrow={c.arcTitle ?? `Ch.${c.number}: ${c.gearName}`}
            title={c.title}
            label={`${c.subtitle}, ${c.period}`}
            className="relative"
          />
          <p data-landfall className="relative mt-4 inline-flex items-center gap-2 self-start border-2 border-ink bg-paper px-2.5 py-1 text-sm font-bold">
            <svg aria-hidden viewBox="0 0 16 16" className="size-4">
              <path d="M8 1l2 6 6 1-6 1-2 6-2-6-6-1 6-1z" fill="var(--spot)" stroke="#1a1612" strokeWidth="1" />
            </svg>
            Landfall: {c.location}
          </p>
        </div>

        {/* Versus: the red half shares the title panel's slash and carries the bursts. */}
        {layout === "versus" && c.metrics && (
          <div
            className="cut vs-r col-span-12 grid place-items-center px-3 py-12 md:col-span-5 md:py-10"
            style={{ "--panel-bg": "var(--spot)", "--panel-fg": "var(--color-paper)" } as React.CSSProperties}
          >
            <div aria-hidden className="pointer-events-none absolute inset-[3px] overflow-hidden">
              <div className="speedlines absolute -inset-1/4 opacity-25" style={{ "--lines": "var(--color-ink)", "--sx": "55%", "--sy": "50%" } as React.CSSProperties} />
            </div>
            <div className="relative" style={{ "--spot": "var(--color-ink)" } as React.CSSProperties}>
              <StatList stats={c.metrics} />
            </div>
          </div>
        )}

        {/* Narration column */}
        <div
          className={cn(
            // Captions break the panel edge (manga lettering overlaps the art, reset note 3).
            "relative z-10 col-span-12 flex flex-col gap-4",
            NARRATION[layout],
            flip && "md:col-start-1 md:row-start-1",
          )}
        >
          {c.narration?.map((line, i) => (
            <p
              key={line}
              data-caption
              className={cn(
                "caption",
                layout !== "tiers" && (i % 2 ? "md:rotate-[0.8deg]" : "md:-rotate-[0.8deg]"),
                classic && (flip ? (i % 2 ? "md:-mr-6" : "md:-mr-16") : i % 2 ? "md:-ml-6" : "md:-ml-16"),
                layout === "splash" && i % 2 && "md:ml-16",
              )}
            >
              {line}
            </p>
          ))}
          {c.gearCaption && !climax && (
            <div data-caption className="mt-2 flex flex-wrap items-end gap-3">
              <p className="bubble min-w-0 flex-[1_1_10rem]">{c.gearCaption}</p>
              <span
                aria-hidden
                className="shrink-0 font-display text-[3.4rem] leading-[0.8] uppercase [-webkit-text-stroke:2px_var(--color-ink)] [paint-order:stroke_fill]"
                style={{ color: climax ? "var(--color-straw)" : "var(--spot)" }}
              >
                G{c.gear}
              </span>
            </div>
          )}
        </div>

        {record}
        {c.metrics && classic && (
          <div className={cn("col-span-12 grid place-items-center md:col-span-4", flip && "md:col-start-1 md:row-start-2")}>
            <StatList stats={c.metrics} />
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
                  className={cn("panel flex flex-col gap-3 overflow-hidden p-5 md:p-7", l.span)}
                  style={{ "--panel-bg": l.bg, "--panel-fg": l.fg } as React.CSSProperties}
                >
                  <span aria-hidden className="bento-tone tone absolute top-0 right-0 -z-10 size-40 opacity-30" />
                  <h3 className="font-display text-h3 leading-none uppercase">{p.title}</h3>
                  <p className="max-w-[62ch]">{p.description}</p>
                  {p.metric && (
                    <p className="mt-auto flex flex-wrap items-end justify-end gap-x-3 pt-4 text-right">
                      <span className="max-w-[20ch] pb-1 text-sm leading-tight font-bold uppercase [font-stretch:85%]">{p.metric.label}</span>
                      <span className="bento-num font-display text-[clamp(3rem,6vw,5.5rem)] leading-[0.85]" style={{ color: l.num }}>
                        {p.metric.value}
                      </span>
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Section>
  );
}
