import Link from "next/link";
import type { ReactNode } from "react";

// Which of the two default-state border colors an item gets, per the
// owner: Home/Schedule/Book Us are gold, About/Donations/Contact are
// white. Only applies at rest — hover, click, and current-page all
// standardize the border to navy instead (see globals.css).
const BORDER_FAMILY_CLASS = {
  gold: "border-gt-gold",
  white: "border-white",
} as const;

/**
 * One equal-width rectangle in the nav bar's six-segment "scoreboard
 * strip" (see `.gt-nav-scoreboard-btn` in globals.css), replacing the
 * site's usual pill-shaped `JumbotronButton` for the primary nav only
 * — everywhere else on the site still uses the pill. No Chase Ring
 * here, per the owner, for the moment.
 *
 * `icon` swaps the metallic-gold gradient text treatment (which only
 * makes sense for actual glyphs) for a flat-color icon treatment —
 * see `.gt-nav-scoreboard-icon` in globals.css — for Home's firetruck
 * icon.
 */
export default function NavBarButton({
  href,
  active,
  borderFamily,
  icon = false,
  ariaLabel,
  ariaCurrent,
  children,
}: {
  href: string;
  active: boolean;
  borderFamily: keyof typeof BORDER_FAMILY_CLASS;
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
      className={`gt-nav-scoreboard-btn ${active ? "gt-nav-current" : ""} flex h-12 flex-1 items-center justify-center border-2 px-1 text-center transition-colors sm:h-14 ${
        active ? "border-gt-navy" : BORDER_FAMILY_CLASS[borderFamily]
      }`}
    >
      {icon ? (
        <span className="gt-nav-scoreboard-icon pointer-events-none flex h-5 w-5 items-center justify-center sm:h-6 sm:w-6">
          {children}
        </span>
      ) : (
        <span className="gt-nav-scoreboard-text pointer-events-none text-[9px] font-black uppercase leading-none tracking-wider sm:text-[11px]">
          {children}
        </span>
      )}
    </Link>
  );
}
