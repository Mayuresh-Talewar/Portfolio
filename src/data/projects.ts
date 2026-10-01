import type { Project } from "@/types";

// Gaiden (side stories). chapterId ties a project to the chapter it was built in.
export const projects: Project[] = [
  {
    id: "shadow-monarch",
    title: "Shadow Monarch - AI Code Review Tool",
    description:
      "LLM-powered code review tool on the OpenAI API that returns actionable suggestions in under 2 seconds as syntax-highlighted, diff-style changes, with Express.js rate limiting to prevent API overuse.",
    tech: ["React.js", "Node.js", "Express.js", "OpenAI API", "MongoDB"],
    href: "https://shadow-monarchs-code-review-frontend.onrender.com/",
    image: "/projects/shadow-monarch.webp",
  },
  {
    id: "techagri",
    title: "TechAgri - B2B Agricultural Marketplace",
    description:
      "Full-stack MERN marketplace connecting farmers with Common Service Centers across 3 user roles, with Razorpay payments and Fast2SMS OTP auth; deployed on Hostinger with SSL and 99%+ uptime.",
    tech: ["React.js", "Node.js", "Express.js", "MongoDB", "Razorpay", "Fast2SMS"],
    href: "https://technologyagriculturecreater.com/",
    image: "/projects/techagri.webp",
    chapterId: "first-quest",
  },
  {
    id: "sk-film",
    title: "SK Film Production",
    description:
      "Client website with EmailJS contact forms and Google Maps, tuned with lazy loading, memoization and image optimization; client inquiries increased by 60%.",
    tech: ["React.js", "EmailJS", "Google Maps API"],
    href: "https://www.skfilmproductions.co.uk/",
    image: "/projects/sk-film.webp",
    chapterId: "forging-the-blade",
  },
  {
    id: "urhan-treaders",
    title: "Urhan Treaders",
    description:
      "Business website for an import-export trading company, presenting its products, services and export destinations.",
    tech: ["React.js", "Vite", "Material Tailwind"],
    href: "https://import-export-mayuresh.netlify.app/",
    image: "/projects/urhan-treaders.webp",
  },
  {
    id: "robomeet",
    title: "RoboMeet",
    description:
      "Landing page for a virtual office product for remote teams, showcasing one-click audio calls, avatars and video/screen sharing.",
    tech: ["HTML5", "CSS3", "JavaScript"],
    href: "https://superlative-mayuresh-robomeet.netlify.app/",
    image: "/projects/robomeet.webp",
  },
];
