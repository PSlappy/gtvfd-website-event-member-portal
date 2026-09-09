"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/schedule", label: "Schedule" },
  { href: "/about", label: "About" },
  { href: "/donations", label: "Donations" },
  { href: "/contact", label: "Contact" },
  { href: "/rental", label: "Rental" },
  { href: "/signup", label: "Sign Up" },
] as const;

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 sm:gap-x-6">
      {navItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-colors sm:text-xs ${
              active
                ? "gt-led-text-gold text-gt-gold"
                : "gt-led-text-dim text-gt-gray-light/70 hover:text-gt-gray-light"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
