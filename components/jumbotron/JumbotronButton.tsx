import Link from "next/link";
import type { ReactNode } from "react";

const variantClasses = {
  gold: "border-gt-gold bg-gt-gold text-black",
  navy: "border-gt-gold bg-gt-navy text-gt-gray-light",
} as const;

/**
 * A chunky, beveled "scoreboard graphics" button — lifts on hover and
 * presses down on click. Used for on-screen calls to action like
 * Sign-Up and Full Schedule.
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
      className={`gt-jumbotron-btn inline-block whitespace-nowrap rounded border-2 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] sm:text-xs ${variantClasses[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
