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
            // TEST ONLY, per the owner: preview a gold-bg/navy-text/
            // white-outline combo on About specifically. Remove once
            // they've seen it — see NavBarButton's doc comment.
            colorPreview={item.href === "/about"}
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
