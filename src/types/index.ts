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

export type Chapter = {
  id: string;
  number: number;
  title: string;
  /** Plain label shown next to the flavor title, e.g. "Frontend Developer, Softtronix". */
  subtitle: string;
  period: string;
  colorMode: "bw" | "color";
  role: string;
  org: string;
  location: string;
  highlights: string[];
  metrics?: Stat[];
};

export type Project = {
  id: string;
  title: string;
  description: string;
  tech: string[];
  href: string;
  image: string;
  chapterId?: Chapter["id"];
};

export type SkillGroup = {
  category: string;
  skills: string[];
};
