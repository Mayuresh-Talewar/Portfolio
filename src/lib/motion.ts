/**
 * The one easing language for the whole volume. Every tween picks from here; no ad-hoc eases.
 * move = things travelling into place · reveal = panels/ink uncovering · impact = SFX/bursts landing with overshoot
 * exit = things leaving · swing = a two-sided motion (doors, wipes that start and stop on screen).
 * Gear-specific character eases (G1 elastic, G4 bounce, the G5 rubber wobble) stay local: they ARE the gear.
 */
export const EASE = {
  move: "power3.out",
  reveal: "expo.out",
  impact: "back.out(2)",
  exit: "power2.in",
  swing: "power3.inOut",
} as const;

/** Seconds. */
export const DUR = { fast: 0.3, move: 0.45, reveal: 0.8 } as const;

/** Seconds between siblings: panels in reading order, and letters inside a word. */
export const STAGGER = { panel: 0.08, char: 0.03 } as const;
