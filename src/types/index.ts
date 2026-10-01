export type SiteConfig = {
  name: string;
  title: string;
  description: string;
  location: string;
  email: string;
  url: string;
  resume: string;
  image: string;
  socials: { label: string; href: string }[];
};

export type Stat = { value: string; label: string };

/** Print mode per section (design spec §1), rendered as `data-mode` on `<section>`. */
export type ColorMode = "bw" | "duo" | "color" | "night";

/** Guide character pose ids (design spec §9); files live in public/guide/<id>.svg. */
export type PoseId =
  | "01-wave-hello"
  | "02-break-out"
  | "03-walk"
  | "04-point"
  | "05-think"
  | "06-wave-bye"
  | "07-bust";

export type Guide = {
  pose: PoseId;
  line: string;
  /** Pose shown while entering, before `pose` (e.g. walk → point). */
  enterPose?: PoseId;
};

/** A non-chapter part of the volume (cover, Gaiden, Status Window, Finale). */
export type Part = {
  id: string;
  title: string;
  colorMode: ColorMode;
  guide: Guide;
};

export type Product = { title: string; description: string };

export type Chapter = Part & {
  number: number;
  /** Plain label shown next to the flavor title, e.g. "Frontend Developer, Softtronix". */
  subtitle: string;
  period: string;
  role: string;
  org: string;
  location: string;
  highlights: string[];
  metrics?: Stat[];
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

export type SkillGroup = {
  name: string;
  skills: string[];
};
