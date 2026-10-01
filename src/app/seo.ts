import { siteConfig } from "@/data/site";

// siteConfig may still hold "TODO: ..." placeholders; fall back to known client facts.
const pick = (v: string | undefined, fallback: string) =>
  !v || v.startsWith("TODO") ? fallback : v;

export const seo = {
  url: siteConfig.url,
  name: pick(siteConfig.name, "Mayuresh Talewar"),
  title: pick(siteConfig.title, "Full Stack Engineer (AI/LLM)"),
  description: pick(
    siteConfig.description,
    "Mayuresh Talewar is a Full Stack Engineer in Pune, India, building AI agents, RAG systems and LLM products with Next.js.",
  ),
  sameAs: siteConfig.socials
    .map((s) => s.href)
    .filter((h) => h.startsWith("http")),
  keywords: [
    "Mayuresh Talewar",
    "Full Stack Engineer",
    "AI Engineer",
    "LLM",
    "Next.js RAG developer",
    "AI agents developer India",
    "Full Stack Engineer AI LLM Pune",
    "Pune",
  ],
  knowsAbout: [
    "Next.js",
    "React",
    "TypeScript",
    "Node.js",
    "Python",
    "Large Language Models",
    "Retrieval-Augmented Generation",
    "AI Agents",
  ],
};
