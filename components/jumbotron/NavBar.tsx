"use client";

import { usePathname } from "next/navigation";
import NavBarButton from "./NavBarButton";

// Home is a fixed square (not a flex-1 segment like the rest), back
// on the left end where it originally was — a brief move to the right
// end was a mistake, per the owner, corrected here. Squareness itself
// stays: frees up the remaining five to split the nav strip's full
// width among themselves instead of sharing it six ways, so each gets
// more room (and more room for its text) on wider screens. Order
// otherwise unchanged: About before Schedule, Book Us before Contact.
const navItems = [
  { href: "/", label: "Home", icon: true, square: true },
  { href: "/about", label: "About", icon: false, square: false },
  { href: "/schedule", label: "Schedule", icon: false, square: false },
  { href: "/donations", label: "Donations", icon: false, square: false },
  { href: "/booking", label: "Book Us", icon: false, square: false },
  { href: "/contact", label: "Contact", icon: false, square: false },
] as const;

// The crew's own "Grant Field VFD" badge — a full-color logo, not a
// single-color glyph, so it can't use the currentColor trick the old
// hand-drawn firetruck icon used to pick up the button's state color.
// It renders exactly as-is across every state instead (see
// NavBarButton's `icon` prop). Source: owner-supplied EPS, decoded
// locally (its embedded preview was a palette+alpha TIFF that both
// `sips` and Preview misread as plain RGB, producing a garbled image —
// reading the actual TIFF tags and looking values up through the real
// color map fixed it) and cropped to the badge's own bounding box.
function IconGrantFieldBadge() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/grant-field-vfd-badge.png"
      alt="Home"
      className="h-full w-full object-contain"
    />
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
            square={item.square}
            ariaLabel={item.icon ? item.label : undefined}
            ariaCurrent={active ? "page" : undefined}
          >
            {item.icon ? <IconGrantFieldBadge /> : item.label}
          </NavBarButton>
        );
      })}
    </nav>
  );
}
