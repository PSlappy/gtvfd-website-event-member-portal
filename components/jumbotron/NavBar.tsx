"use client";

import { usePathname } from "next/navigation";
import NavBarButton from "./NavBarButton";

// Six equal segments, edge to edge, per the owner — Home included as
// one of the six rather than pinned off to the side like the old pill
// nav. Order: About before Schedule, Book Us before Contact.
const navItems = [
  { href: "/", label: "Home", icon: true },
  { href: "/about", label: "About", icon: false },
  { href: "/schedule", label: "Schedule", icon: false },
  { href: "/donations", label: "Donations", icon: false },
  { href: "/booking", label: "Book Us", icon: false },
  { href: "/contact", label: "Contact", icon: false },
] as const;

function IconFiretruck() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
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

  return (
    <nav className="flex w-full items-stretch">
      {navItems.map((item) => {
        const active = pathname === item.href;
        return (
          <NavBarButton
            key={item.href}
            href={item.href}
            active={active}
            icon={item.icon}
            ariaLabel={item.icon ? item.label : undefined}
            ariaCurrent={active ? "page" : undefined}
          >
            {item.icon ? <IconFiretruck /> : item.label}
          </NavBarButton>
        );
      })}
    </nav>
  );
}
