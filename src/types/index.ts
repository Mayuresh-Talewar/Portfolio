export type SiteConfig = {
  name: string;
  title: string;
  description: string;
  location: string;
  email: string;
  url: string;
  resume: string;
  socials: { label: string; href: string }[];
};

export type Stat = { value: string; label: string };

/** Print mode per section (design spec §1), rendered as `data-mode` on `<section>`. */
export type ColorMode = "bw" | "duo" | "color" | "night";

/** A non-chapter part of the volume (cover, Gaiden, Status Window, Finale). */
export type Part = {
  id: string;
  title: string;
  colorMode: ColorMode;
  /** Short narrator intro line (Gaiden, Status Window). */
  intro?: string;
};

/** Cover extras: tagline + wanted-poster copy. */
export type CoverPart = Part & {
  tagline: string;
  wanted: { bountyLabel: string; epithet: string; notice: string };
};

/** Finale extras: closing line + contact CTA copy. */
export type FinalePart = Part & {
  toBeContinued: string;
  cta: { heading: string; body: string; label: string };
};

/** Manga sound effect: Latin text plus optional katakana. */
export type Sfx = { text: string; kana?: string };

/** Ch.5 bento tile. `metric` = the tile's hero numeral (resume figure only). */
export type Product = { title: string; description: string; metric?: Stat };

export type Chapter = Part & {
  number: number;
  /** Career power-up level (the Gears concept). */
  gear: 1 | 2 | 3 | 4 | 5;
  gearName: string;
  /** One Piece-style arc name, e.g. "Gear 2: The Academy Arc". */
  arcTitle: string;
  /** Two narrator caption-box lines. */
  narration: [string, string];
  /** What this Gear's power-up maps to in real skills. */
  gearCaption: string;
  /** SFX for the Gear-up moment. */
  sfx: Sfx[];
  /** Plain label shown next to the flavor title, e.g. "Frontend Developer, Softtronix". */
  subtitle: string;
  period: string;
  role: string;
  org: string;
  location: string;
  highlights: string[];
  metrics?: Stat[];
  /** Spread composition: splash = boxless title on rays, tiers = three vertical panels,
   *  versus = title + stats panel sharing one slash, classic (default) = title panel + offset captions. */
  layout?: "classic" | "splash" | "tiers" | "versus";
  /** Bento items (Ch.5 only). */
  products?: Product[];
};

export type Project = {
  id: string;
  title: string;
  summary: string;
  stack: string[];
  href: string;
  image: string;
  /** Rendered as a full-width color spread. */
  spread?: boolean;
  chapterId?: Chapter["id"];
};

/** Status Window headliner: a display word plus one line of proof from the resume. */
export type SignatureSkill = { name: string; proof: string };

export type SkillGroup = {
  name: string;
  skills: string[];
};
