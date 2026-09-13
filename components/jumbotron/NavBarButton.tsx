import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import {
  backgroundColorValue,
  backgroundImageValue,
  FLAT_VALUE,
} from "@/lib/navColorTokens";
import { useNavTheme } from "./NavThemeContext";

/**
 * One equal-width rectangle in the nav bar's six-segment "scoreboard
 * strip" (see `.gt-nav-scoreboard-btn` in globals.css), replacing the
 * site's usual pill-shaped `JumbotronButton` for the primary nav only
 * — everywhere else on the site still uses the pill. No Chase Ring
 * here, per the owner, for the moment.
 *
 * Rest-state colors (background/font/font-outline/border) come from
 * `NavThemeContext` — the owner's live settings screen at
 * `/nav-settings` — set here as CSS custom properties (not literal
 * inline styles) so Hover/Click/Current's own CSS rules, which set
 * literal values with higher specificity, can still override them
 * normally. An inline style itself would have permanently pinned
 * those properties regardless of hover/active state, breaking the
 * whole interaction system; a custom property is just a variable the
 * stylesheet's own rules choose whether to read.
 *
 * `icon` sizes the child for Home's badge image instead of the
 * metallic-gold gradient text treatment (which only makes sense for
 * actual glyphs, not a full-color raster logo) — see
 * `.gt-nav-scoreboard-icon` in globals.css. Background/border still
 * apply to Home like any other segment; only the font-related
 * variables go unused for it.
 *
 * `square` (Home, only) opts out of the `flex-1` equal-width sharing
 * every other segment uses — a fixed `w-12 sm:w-14` square (same as
 * the row's own height) instead, per the owner, so the remaining
 * segments split the strip's full width among themselves rather than
 * six ways.
 */
export default function NavBarButton({
  href,
  active,
  icon = false,
  square = false,
  ariaLabel,
  ariaCurrent,
  children,
}: {
  href: string;
  active: boolean;
  icon?: boolean;
  square?: boolean;
  ariaLabel?: string;
  ariaCurrent?: "page";
  children: ReactNode;
}) {
  const { theme } = useNavTheme();

  const themeVars = {
    "--gt-nav-btn-bg-color": backgroundColorValue(theme.buttonBackground),
    "--gt-nav-btn-bg-image": backgroundImageValue(theme.buttonBackground),
    "--gt-nav-btn-border-color": FLAT_VALUE[theme.buttonBorderColor],
    "--gt-nav-text-color": backgroundColorValue(theme.fontColor),
    "--gt-nav-text-fill-color": backgroundColorValue(theme.fontColor),
    "--gt-nav-text-bg-image": backgroundImageValue(theme.fontColor),
    "--gt-nav-text-stroke-color": FLAT_VALUE[theme.fontOutlineColor],
  } as CSSProperties;

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      aria-current={ariaCurrent}
      style={themeVars}
      className={`gt-nav-scoreboard-btn ${active ? "gt-nav-current" : ""} flex h-12 items-center justify-center border-2 px-1 text-center transition-colors sm:h-14 ${square ? "w-12 flex-none sm:w-14" : "flex-1"}`}
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
