import type { SiteConfig } from "@/types";

/** Server component: the year renders on the server, so no hydration mismatch. Back cover of the volume. */
export function SiteFooter({ site }: { site: SiteConfig }) {
  return (
    <footer className="bg-ink px-4 py-10 text-sm text-paper md:px-8">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <p className="font-display text-2xl leading-none uppercase">
          {site.name}
          <span className="mt-2 block font-sans text-sm font-semibold normal-case text-paper/80">{site.title}</span>
        </p>
        <div className="flex flex-col gap-1 md:text-right">
          <p>
            © {new Date().getFullYear()} {site.name}. Vol. 1, printed in Pune.
          </p>
          {site.features.luffy && (
            // Credit + disclaimer (docs/10 §5).
            <p className="max-w-[62ch] text-paper/80">
              Monkey D. Luffy and ONE PIECE © Eiichiro Oda / Shueisha, Toei Animation. The character art is original fan
              art made as a personal tribute. This site is not affiliated with or endorsed by the rights holders.
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
