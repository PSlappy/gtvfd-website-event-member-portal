"use client";

import { usePathname } from "next/navigation";
import JumbotronButton from "./JumbotronButton";

// About before Schedule, Book Us before Contact — order per the
// owner. Sign Up is deliberately not a nav item: it's already
// reachable from the bottom ticker and every tailgate row on the
// schedule table, so a nav link for it was redundant. The route
// itself (`/signup`) stays, those links still point to it.
const navItems = [
  { href: "/about", label: "About" },
  { href: "/schedule", label: "Schedule" },
  { href: "/donations", label: "Donations" },
  { href: "/booking", label: "Book Us" },
  { href: "/contact", label: "Contact" },
] as const;

function IconFiretruck() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4">
      <path
        fill="currentColor"
        d="M2 8.5a1 1 0 0 1 1-1h9v6.5H2.8a.8.8 0 0 1-.8-.8V8.5Z"
      />
      <path
        fill="currentColor"
        d="M13 9h4.8a1 1 0 0 1 .8.4l2 2.6a1 1 0 0 1 .2.6v1.4a.8.8 0 0 1-.8.8H13V9Z"
      />
      <circle
        cx="6.5"
        cy="16"
        r="1.9"
        fill="#000"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle
        cx="17.5"
        cy="16"
        r="1.9"
        fill="#000"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}

export default function NavBar() {
  const pathname = usePathname();
  const homeActive = pathname === "/";

  return (
    <nav className="flex w-full items-center gap-2 sm:gap-3">
      {/* Home stays pinned to the left edge, independent of however
          the rest of the items wrap/center, and reads as a firetruck
          icon instead of a text label. */}
      <JumbotronButton
        href="/"
        variant={homeActive ? "gold" : "outline"}
        iconOnly
        ariaLabel="Home"
        ariaCurrent={homeActive ? "page" : undefined}
      >
        <IconFiretruck />
      </JumbotronButton>

      <div className="flex flex-1 flex-wrap items-center justify-center gap-2 sm:gap-3">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <JumbotronButton
              key={item.href}
              href={item.href}
              variant={active ? "gold" : "outline"}
              ariaCurrent={active ? "page" : undefined}
            >
              {item.label}
            </JumbotronButton>
          );
        })}
      </div>
    </nav>
  );
}
