export type SiteConfig = {
  name: string;
  title: string;
  description: string;
  url: string;
  socials: { label: string; href: string }[];
};

export type Project = {
  title: string;
  description: string;
  tech: string[];
  href?: string;
  repo?: string;
};

export type Experience = {
  company: string;
  role: string;
  start: string;
  end?: string;
  highlights: string[];
};

export type SkillGroup = {
  category: string;
  skills: string[];
};
