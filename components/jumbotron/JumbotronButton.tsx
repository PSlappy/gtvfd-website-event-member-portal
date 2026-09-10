import Link from "next/link";
import type { ReactNode } from "react";

const variantClasses = {
  gold: "border-gt-gold bg-gt-gold text-black",
  // Off-white per the GT brand guide, not navy — most buttons sit on
  // navy panels already, so a navy button just disappeared into it.
  white: "border-gt-gold bg-gt-gray-light text-black",
  // For nav links sitting on the nav bar's own navy panel: a filled
  // navy or gold pill for every item would either vanish into the
  // background or turn the whole bar into a wall of gold, so inactive
  // links stay a dim, mostly-transparent outline and only light up
  // fully (via the `gold` variant, chosen by the caller) on the
  // current page.
  outline:
    "border-gt-gold/30 bg-black/30 text-gt-gray-light/70 hover:border-gt-gold hover:bg-black/50 hover:text-gt-gray-light",
} as const;

/**
 * A pill-shaped "scoreboard graphics" button matching the Mute/Replay
 * controls' shape and chrome: lifts on hover, presses down on click,
 * glossy CG-rendered look (see `.gt-jumbotron-btn` in globals.css).
 * Used for every button and nav link on the site so they all read as
 * the same family of on-screen graphic, not a mix of button styles.
 *
 * `pulse` (default on) adds the continuous "act now" breathing
 * animation (`.gt-jumbotron-btn-cta`) — reserved for actual calls to
 * action (Sign-Up, Full Schedule, form submit buttons). Pass `false`
 * for anything that shouldn't pulse forever, like nav links.
 */
export default function JumbotronButton({
  href,
  variant = "gold",
  pulse = true,
  ariaCurrent,
  className = "",
  children,
}: {
  href: string;
  variant?: keyof typeof variantClasses;
  pulse?: boolean;
  ariaCurrent?: "page";
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={ariaCurrent}
      className={`gt-jumbotron-btn ${pulse ? "gt-jumbotron-btn-cta" : ""} inline-flex h-9 items-center justify-center whitespace-nowrap rounded-full border-2 px-4 text-[10px] font-bold uppercase tracking-wider transition-colors sm:text-xs ${variantClasses[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
