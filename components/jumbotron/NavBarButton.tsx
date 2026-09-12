import Link from "next/link";
import type { ReactNode } from "react";

/**
 * One equal-width rectangle in the nav bar's six-segment "scoreboard
 * strip" (see `.gt-nav-scoreboard-btn` in globals.css), replacing the
 * site's usual pill-shaped `JumbotronButton` for the primary nav only
 * — everywhere else on the site still uses the pill. No Chase Ring
 * here, per the owner, for the moment.
 *
 * Border color is entirely CSS-driven now (white at rest, gold on
 * hover, navy for click/current — see globals.css) — an earlier
 * version split the rest-state border gold/white per item, which the
 * owner later asked to unify to white across the board, so there's no
 * longer any per-item border prop to pass here.
 *
 * `icon` swaps the metallic-gold gradient text treatment (which only
 * makes sense for actual glyphs) for a flat-color icon treatment —
 * see `.gt-nav-scoreboard-icon` in globals.css — for Home's firetruck
 * icon.
 */
export default function NavBarButton({
  href,
  active,
  icon = false,
  ariaLabel,
  ariaCurrent,
  children,
}: {
  href: string;
  active: boolean;
  icon?: boolean;
  ariaLabel?: string;
  ariaCurrent?: "page";
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      aria-current={ariaCurrent}
      className={`gt-nav-scoreboard-btn ${active ? "gt-nav-current" : ""} flex h-12 flex-1 items-center justify-center border-2 px-1 text-center transition-colors sm:h-14`}
    >
      {icon ? (
        <span className="gt-nav-scoreboard-icon pointer-events-none flex h-5 w-5 items-center justify-center sm:h-6 sm:w-6">
          {children}
        </span>
      ) : (
        <span className="gt-nav-scoreboard-text pointer-events-none text-[10px] font-black uppercase leading-none tracking-widest sm:text-xs">
          {children}
        </span>
      )}
    </Link>
  );
}
