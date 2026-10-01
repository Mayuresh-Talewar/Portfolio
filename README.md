# Portfolio

Next.js (App Router) + TypeScript + Tailwind CSS.

```bash
npm run dev    # http://localhost:3000
npm run build
npm run lint
```

## Structure

```
src/
  app/                  routes only (layout, page, globals.css)
  components/ui/        reusable primitives (Button, ...)
  components/layout/    Navbar, Footer
  components/sections/  page sections (Hero, About, Projects, Experience, Contact)
  data/                 typed content: site config, projects, experience, skills
  lib/                  utilities (cn() = clsx + tailwind-merge)
  types/                shared types used by src/data
public/
  images/               static images (resume PDF goes in public/ later)
```

Content is data-driven: edit `src/data/*`, not components. Empty folders hold a `.gitkeep` until their first file lands.
