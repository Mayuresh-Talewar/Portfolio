import type { Chapter, CoverPart, FinalePart, Part, Stat } from "@/types";

// Headline impact stats (Crestline Intelligence, per the resume).
export const stats: Stat[] = [
  { value: "~50%", label: "less post-meeting follow-up work" },
  { value: "~45%", label: "faster email handling" },
  { value: "~35%", label: "faster average API response" },
  { value: "10k+", label: "docs with sub-second retrieval" },
];

// Chronological, per R&D §7.1. colorMode + guide lines per design spec §1 / §6.
export const chapters: Chapter[] = [
  {
    id: "the-beginning",
    number: 1,
    gear: 1,
    gearName: "Gear 1",
    arcTitle: "Gear 1: The Hometown Arc",
    narration: [
      "Nagpur, 2018. I picked computer engineering and never looked back.",
      "Three years later: a diploma, a 75% score, and an itch to build.",
    ],
    gearCaption: "Gear 1, rubber basics: I stretched into programming fundamentals.",
    sfx: [{ text: "BOING", kana: "ビヨーン" }],
    title: "The Beginning",
    subtitle: "Diploma, Anjuman Polytechnic",
    period: "2018 – 2021",
    colorMode: "bw",
    guide: { pose: "04-point", line: "Nagpur, 2018. A diploma and my first Hello World." },
    role: "Diploma in Computer Engineering",
    org: "Anjuman Polytechnic",
    location: "Nagpur, Maharashtra",
    highlights: ["Completed Mar 2021 with a score of 75%."],
  },
  {
    id: "academy-arc",
    number: 2,
    gear: 2,
    gearName: "Gear 2",
    arcTitle: "Gear 2: The Academy Arc",
    narration: [
      "Four years of B.Tech CSE at G H Raisoni. Late nights, real builds.",
      "I graduated in 2024 with a 7.89 CGPA and a full toolbox.",
    ],
    gearCaption: "Gear 2, pure speed: CS fundamentals that let me ship fast.",
    sfx: [{ text: "SHUUU", kana: "シュー" }],
    title: "Academy Arc",
    subtitle: "B.Tech CSE, G H Raisoni University",
    period: "2021 – 2024",
    colorMode: "bw",
    guide: { pose: "05-think", line: "Four years of B.Tech. Lots of late-night builds." },
    role: "B.Tech in Computer Science Engineering",
    org: "G H Raisoni University",
    location: "Borgaon, Madhya Pradesh",
    highlights: ["Graduated Mar 2024 with a CGPA of 7.89/10."],
  },
  {
    id: "first-quest",
    number: 3,
    gear: 3,
    gearName: "Gear 3",
    arcTitle: "Gear 3: The First Quest Arc",
    narration: [
      "Pune, 2024. My first crew and my first production MERN codebase.",
      "I secured 15+ routes and guided 4 juniors, all as an intern.",
    ],
    gearCaption: "Gear 3, giant scale: I went from components to full-stack modules.",
    sfx: [{ text: "BOOOM", kana: "ドーン" }],
    title: "First Quest",
    subtitle: "Full Stack Developer Intern, Technology World Creater",
    period: "Mar 2024 – Aug 2024",
    colorMode: "duo",
    guide: { pose: "04-point", line: "First real job. Production code hits different." },
    role: "Full Stack Developer Intern",
    org: "Technology World Creater Pvt. Ltd.",
    location: "Pune, Maharashtra",
    highlights: [
      "Developed full-stack MERN (MongoDB, Express.js, React.js, Node.js) modules with reusable, modular components to speed up feature development, along with interactive React.js and Redux UI components that boosted user engagement and session time.",
      "Implemented JWT authentication with role-based access control (RBAC), securing 15+ protected routes and backend services.",
      "Designed and tested RESTful APIs with Node.js and Express.js for reliable frontend integration.",
      "Automated billing and customer communication by integrating Razorpay payments and Twilio SMS/email notifications.",
      "Guided 4 junior contributors on Git workflows and modular code while participating in Agile sprints and peer code reviews via GitHub Projects.",
    ],
    metrics: [
      { value: "15+", label: "protected routes secured" },
      { value: "4", label: "junior contributors guided" },
    ],
  },
  {
    id: "forging-the-blade",
    number: 4,
    gear: 4,
    gearName: "Gear 4",
    arcTitle: "Gear 4: The Blade Forge Arc",
    narration: [
      "Back in Nagpur at Softtronix, I sharpened my frontend edge.",
      "4+ client projects, ~25% faster pages, 60% more inquiries for one client.",
    ],
    gearCaption: "Gear 4, bounce and power: polished React that loads fast and lands hard.",
    sfx: [{ text: "BOYOYON", kana: "ボヨヨン" }],
    title: "Forging the Blade",
    subtitle: "Frontend Developer, Softtronix",
    period: "Sep 2024 – Jul 2025",
    colorMode: "duo",
    guide: { pose: "04-point", line: "Softtronix is where my frontend got sharp." },
    role: "Frontend Developer",
    org: "Softtronix Software Solution Pvt. Ltd.",
    location: "Nagpur, Maharashtra",
    highlights: [
      "Crafted responsive, cross-browser web interfaces with React.js, TypeScript and Tailwind CSS for 4+ client projects.",
      "Integrated 10+ REST API endpoints in collaboration with backend developers, ensuring reliable frontend–backend data flow.",
      "Standardized reusable UI components and UI/UX patterns across projects; improved page load performance by ~25% through rendering and cross-browser optimizations.",
      "Delivered the SK Film Production website with EmailJS contact forms and Google Maps API, using lazy loading, memoization and image optimization; client inquiries increased by 60%.",
    ],
    metrics: [
      { value: "~25%", label: "faster page loads" },
      { value: "60%", label: "more client inquiries (SK Film)" },
    ],
  },
  {
    id: "the-ai-arc",
    number: 5,
    gear: 5,
    gearName: "Gear 5",
    arcTitle: "Gear 5: The AI Awakening Arc",
    narration: [
      "Then the panels burst into color. I started building AI products.",
      "Agents, RAG and real platforms at Crestline. Follow-up work cut ~50%.",
    ],
    gearCaption: "Gear 5, total freedom: turning LLMs into products people actually use.",
    sfx: [{ text: "DON DON", kana: "ドンドン" }, { text: "BA-DUM" }],
    title: "The AI Arc",
    subtitle: "Full Stack Developer, Crestline Intelligence",
    period: "Aug 2025 – Present",
    colorMode: "color",
    guide: { pose: "04-point", enterPose: "03-walk", line: "And then the world got color. This is what I build now." },
    role: "Full Stack Developer",
    org: "Crestline Intelligence Pvt. Ltd.",
    location: "Pune, Maharashtra",
    highlights: [
      "Optimized API performance by designing REST APIs with Express.js and FastAPI and adding Redis caching, decreasing average API response time by ~35%; contributed to code reviews and production deployments.",
      "Shipped 3+ production web applications and 3+ business websites and maintain 2 live platforms; currently developing an AI-powered Project Management platform end-to-end (React.js, Next.js, Node.js, FastAPI, PostgreSQL).",
    ],
    // Bento items (design spec §6), resume wording.
    products: [
      {
        title: "AI Meeting Assistant",
        description:
          "Built an AI Meeting Assistant: an organization-aware AI agent that joins live meetings, provides real-time guidance, auto-generates action items and recommends assignees using RAG over company knowledge, reducing post-meeting follow-up work by ~50%.",
      },
      {
        title: "Smart Email",
        description:
          "Engineered an agentic AI Smart Email platform with OAuth 2.0 inbox integration that classifies incoming mail by sender type (vendor vs. client) and drafts context-aware replies from past conversations, supporting manual, human-in-the-loop (AI draft-and-route) and fully autonomous modes; cut email handling time by ~45%.",
      },
      {
        title: "RAG Pipelines",
        description:
          "Architected Retrieval-Augmented Generation (RAG) pipelines on PostgreSQL/pgvector (Supabase) with OpenAI and Google Gemini APIs, covering embeddings, semantic search and prompt orchestration, with sub-second retrieval across 10,000+ documents.",
      },
      {
        title: "Material Management System",
        description:
          "Created a Material Management System for the full procurement lifecycle, from purchase order (PO) creation and approval to warehouse stock-in, with AI-assisted document drafting and automated approval routing, lowering manual processing time by ~40%.",
      },
    ],
  },
];

// Non-chapter parts of the volume (design spec §1 / §6).
export const parts = {
  cover: {
    tagline: "Five chapters, five Gears. From first Hello World to shipping AI.",
    wanted: {
      bountyLabel: "Bounty: 3+ production apps shipped",
      epithet: "The AI Shipwright",
      notice: "Wanted on your team. Brings agents, RAG and clean code.",
    },
    id: "cover",
    title: "Vol. 1: Mayuresh Talewar",
    colorMode: "color",
    guide: { pose: "01-wave-hello", line: "Hello! I'm Mayuresh. This volume is my story so far." },
  },
  breakOut: {
    id: "break-out",
    title: "Break-out",
    colorMode: "color",
    guide: { pose: "02-break-out", line: "Mind if I step out of the panel?" },
  },
  gaiden: {
    id: "gaiden",
    title: "Side Stories",
    colorMode: "color",
    guide: { pose: "04-point", line: "Side stories. All live. Go poke them." },
    intro: "Side quests from the voyage. Every one is live, so take a look.",
  },
  status: {
    id: "status-window",
    title: "Status Window",
    colorMode: "night",
    guide: { pose: "05-think", line: "My stats. No fake percentages, just what I use." },
    intro: "The status screen. Real skills from real projects, no power-level guesses.",
  },
  finale: {
    id: "finale",
    title: "To Be Continued...",
    colorMode: "color",
    guide: { pose: "06-wave-bye", line: "To be continued… the next chapter is written with you." },
    toBeContinued: "To be continued… The next arc needs an island.",
    cta: {
      heading: "Looking for your next crewmate?",
      body: "Building with AI or full stack? Let's set sail together.",
      label: "Send me a message",
    },
  },
} satisfies {
  cover: CoverPart;
  breakOut: Part;
  gaiden: Part;
  status: Part;
  finale: FinalePart;
};
