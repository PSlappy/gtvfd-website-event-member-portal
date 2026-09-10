"use client";

import { usePathname } from "next/navigation";
import JumbotronButton from "./JumbotronButton";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/schedule", label: "Schedule" },
  { href: "/about", label: "About" },
  { href: "/donations", label: "Donations" },
  { href: "/contact", label: "Contact" },
  { href: "/booking", label: "Book Us" },
  { href: "/signup", label: "Sign Up" },
] as const;

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
      {navItems.map((item) => {
        const active = pathname === item.href;
        return (
          <JumbotronButton
            key={item.href}
            href={item.href}
            variant={active ? "gold" : "outline"}
            pulse={false}
            ariaCurrent={active ? "page" : undefined}
          >
            {item.label}
          </JumbotronButton>
        );
      })}
    </nav>
  );
}
