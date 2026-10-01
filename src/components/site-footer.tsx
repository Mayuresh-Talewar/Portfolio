import type { SiteConfig } from "@/types";

/** Server component: the year renders on the server, so no hydration mismatch. */
export function SiteFooter({ site }: { site: SiteConfig }) {
  return (
    <footer className="border-t border-current/15 px-4 py-8 text-sm md:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-2">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        {site.features.luffy && (
          // TODO: final fan-art credit wording from Design.
          <p>One Piece fan art. One Piece © Eiichiro Oda / Shueisha. Not affiliated or endorsed.</p>
        )}
      </div>
    </footer>
  );
}
