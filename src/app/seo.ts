import { siteConfig } from "@/data/site";
import { skills } from "@/data/skills";

const skillsIn = (group: string) => skills.find((g) => g.name === group)?.skills ?? [];

export const seo = {
  url: siteConfig.url,
  name: siteConfig.name,
  title: siteConfig.title,
  description: siteConfig.description,
  sameAs: siteConfig.socials
    .map((s) => s.href)
    .filter((h) => h.startsWith("http")),
  keywords: [
    "Mayuresh Talewar",
    "Full Stack Engineer AI LLM Pune",
    "Next.js RAG developer",
    "AI agents developer India",
    ...skillsIn("Generative AI / LLM"),
    ...skillsIn("Frontend"),
  ],
  knowsAbout: skills.flatMap((g) => g.skills),
};
