import Link from "next/link";
import type { ReactNode } from "react";

/**
 * One equal-width rectangle in the nav bar's six-segment "scoreboard
 * strip" (see `.gt-nav-scoreboard-btn` in globals.css), replacing the
 * site's usual pill-shaped `JumbotronButton` for the primary nav only
 * — everywhere else on the site still uses the pill. No Chase Ring
 * here, per the owner, for the moment.
 *
 * Border color is entirely CSS-driven (see globals.css) — an earlier
 * version split the rest-state border gold/white per item, which the
 * owner later asked to unify, so there's no per-item border prop here.
 *
 * `icon` sizes the child for Home's badge image instead of the
 * metallic-gold gradient text treatment (which only makes sense for
 * actual glyphs, not a full-color raster logo) — see
 * `.gt-nav-scoreboard-icon` in globals.css.
 *
 * `colorPreview` is a one-off, per the owner: locks this single
 * segment into a fixed gold-background/navy-text/white-outline combo
 * regardless of route or hover/click, purely so the owner can see what
 * it looks like in place next to the real nav — not a real variant.
 * See `.gt-nav-color-preview` in globals.css. Remove the prop (and the
 * CSS) once the owner has seen it and decided whether to keep it.
 */
export default function NavBarButton({
  href,
  active,
  icon = false,
  colorPreview = false,
  ariaLabel,
  ariaCurrent,
  children,
}: {
  href: string;
  active: boolean;
  icon?: boolean;
  colorPreview?: boolean;
  ariaLabel?: string;
  ariaCurrent?: "page";
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      aria-current={ariaCurrent}
      className={`gt-nav-scoreboard-btn ${active ? "gt-nav-current" : ""} ${colorPreview ? "gt-nav-color-preview" : ""} flex h-12 flex-1 items-center justify-center border-2 px-1 text-center transition-colors sm:h-14`}
    >
      {icon ? (
        <span className="gt-nav-scoreboard-icon pointer-events-none flex h-8 w-8 items-center justify-center sm:h-10 sm:w-10">
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
