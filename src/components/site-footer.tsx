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
            // TODO: final fan-art credit wording from Design.
            <p>One Piece fan art. One Piece © Eiichiro Oda / Shueisha. Not affiliated or endorsed.</p>
          )}
        </div>
      </div>
    </footer>
  );
}
