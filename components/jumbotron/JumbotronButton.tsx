import Link from "next/link";
import type { ReactNode } from "react";

const variantClasses = {
  gold: "border-gt-gold bg-gt-gold text-black",
  // Off-white per the GT brand guide, not navy — most buttons sit on
  // navy panels already, so a navy button just disappeared into it.
  // Text is gold, not black, per the owner.
  white: "border-gt-gold bg-gt-gray-light text-gt-gold",
  // For nav links sitting on the nav bar's own navy panel: a filled
  // navy or gold pill for every item would either vanish into the
  // background or turn the whole bar into a wall of gold, so inactive
  // links stay a dim, mostly-transparent outline and only light up
  // fully (via the `gold` variant, chosen by the caller) on the
  // current page.
  // Bumped from /30 to /55 (border /30 to /45) per the owner: every
  // button should read as more solid, not this transparent — while
  // still staying visibly dimmer than the filled gold/white variants,
  // since that contrast is what makes the active nav item read as
  // "lit up" against the rest.
  outline:
    "border-gt-gold/45 bg-black/55 text-gt-gray-light/70 hover:border-gt-gold hover:bg-black/70 hover:text-gt-gray-light",
} as const;

/**
 * A pill-shaped "scoreboard graphics" button matching the Mute/Replay
 * controls' shape and chrome: lifts on hover, presses down on click,
 * glossy CG-rendered look (see `.gt-jumbotron-btn` in globals.css).
 * Used for every button and nav link on the site so they all read as
 * the same family of on-screen graphic, not a mix of button styles.
 *
 * No continuous pulse on any variant, on purpose: an earlier pass
 * reserved a breathing animation for Sign-Up/Full Schedule as an
 * "act now" cue, but sitting next to the site's other static buttons
 * it just read as inconsistent — those two looked like a different
 * button style, not more urgent. Every button now stays still once
 * its one-time pop-in entrance settles.
 *
 * `iconOnly` swaps the horizontal pill padding for a square-ish
 * `w-9` box matching Mute's circular icon button, for a nav item
 * whose content is an icon rather than a text label.
 *
 * `chaseRing` adds the Chase Ring effect (`.gt-chase-ring` in
 * globals.css) — a point of light that sweeps continuously around
 * the button's own border. Not applied to Full Schedule (owner's
 * call, tested side by side with Sign-Up and preferred it off there),
 * so it's opt-in per call site rather than tied to a variant.
 * `chaseColor` picks which color it runs in — gold (default), white,
 * or navy (a brightened blue, not the literal `--gt-navy`, which is
 * nearly invisible against this site's own black/navy backgrounds) —
 * via the `.gt-chase-white`/`.gt-chase-navy` modifiers.
 */
const CHASE_COLOR_CLASS = {
  gold: "",
  white: "gt-chase-white",
  navy: "gt-chase-navy",
} as const;

export default function JumbotronButton({
  href,
  variant = "gold",
  iconOnly = false,
  chaseRing = false,
  chaseColor = "gold",
  ariaLabel,
  ariaCurrent,
  className = "",
  children,
}: {
  href: string;
  variant?: keyof typeof variantClasses;
  iconOnly?: boolean;
  chaseRing?: boolean;
  chaseColor?: keyof typeof CHASE_COLOR_CLASS;
  ariaLabel?: string;
  ariaCurrent?: "page";
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      aria-current={ariaCurrent}
      className={`gt-jumbotron-btn ${chaseRing ? "gt-chase-ring" : ""} ${chaseRing ? CHASE_COLOR_CLASS[chaseColor] : ""} inline-flex h-9 ${iconOnly ? "w-9" : "px-4"} items-center justify-center whitespace-nowrap rounded-full border-2 text-[10px] font-bold uppercase tracking-wider transition-colors sm:text-xs ${variantClasses[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
