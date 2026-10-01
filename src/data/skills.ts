import type { SignatureSkill, SkillGroup } from "@/types";

// Status Window headliners. Proof lines are resume figures only.
export const signatures: SignatureSkill[] = [
  { name: "LLMs + RAG", proof: "RAG over 10,000+ docs with sub-second retrieval, plus agents that join live meetings." },
  { name: "Full stack", proof: "3+ production apps shipped, React and Next.js through FastAPI to PostgreSQL." },
  { name: "System design", proof: "REST APIs with Redis caching that cut average response time ~35%." },
];

// Grouped exactly as on the resume.
export const skills: SkillGroup[] = [
  {
    name: "Core Competencies",
    skills: ["Full Stack Development", "Generative AI Application Development", "LLM Integration", "System Design", "Real-Time Systems", "Performance Optimization", "SaaS Product Development"],
  },
  {
    name: "Languages",
    skills: ["JavaScript (ES6+)", "TypeScript", "Python", "SQL", "HTML5", "CSS3"],
  },
  {
    name: "Frontend",
    skills: ["React.js", "Next.js", "React Native (Expo)", "Redux", "Context API", "Tailwind CSS", "Responsive Web Design"],
  },
  {
    name: "Backend",
    skills: ["Node.js", "Express.js", "FastAPI", "REST APIs", "WebSockets", "Server-Sent Events (SSE)", "API Testing", "JWT Authentication", "OAuth 2.0", "Role-Based Access Control (RBAC)", "Rate Limiting", "Caching"],
  },
  {
    name: "Generative AI / LLM",
    skills: ["Large Language Models (LLMs)", "Retrieval-Augmented Generation (RAG)", "AI Agents", "Agentic Workflows", "Tool Calling / Function Calling", "LLM Response Streaming", "Human-in-the-Loop AI", "LLM-based Text Classification", "OpenAI API", "Google Gemini API", "LangChain", "Embeddings", "Semantic Search", "Prompt Engineering"],
  },
  {
    name: "Databases",
    skills: ["PostgreSQL", "MongoDB", "Supabase", "Redis", "Vector Databases (pgvector, Pinecone)"],
  },
  {
    name: "Cloud & DevOps",
    skills: ["Vercel (Cloud Deployment)", "Docker", "CI/CD (GitHub Actions)", "Linux", "Hostinger"],
  },
  {
    name: "Tools & Practices",
    skills: ["Git", "GitHub", "Agile/Scrum", "Code Reviews"],
  },
  {
    name: "Integrations",
    skills: ["Razorpay (Payment Gateway)", "Twilio", "Fast2SMS", "EmailJS", "Google Maps API"],
  },
];
