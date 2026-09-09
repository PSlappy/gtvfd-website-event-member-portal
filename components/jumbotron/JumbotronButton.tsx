import Link from "next/link";
import type { ReactNode } from "react";

const variantClasses = {
  gold: "border-gt-gold bg-gt-gold text-black",
  // Off-white per the GT brand guide, not navy — most buttons sit on
  // navy panels already, so a navy button just disappeared into it.
  white: "border-gt-gold bg-gt-gray-light text-black",
} as const;

/**
 * The site's only two calls to action (Sign-Up, Full Schedule) — a
 * pill-shaped "scoreboard graphics" button matching the Mute/Replay
 * controls' shape, lifts on hover and presses down on click, pulses
 * continuously to read as "act now" (see `.gt-jumbotron-btn-cta` in
 * globals.css — that pulse is deliberately reserved for just these
 * two buttons, not every button on the page).
 */
export default function JumbotronButton({
  href,
  variant = "gold",
  className = "",
  children,
}: {
  href: string;
  variant?: keyof typeof variantClasses;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`gt-jumbotron-btn gt-jumbotron-btn-cta inline-block whitespace-nowrap rounded-full border-2 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] sm:text-xs ${variantClasses[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
