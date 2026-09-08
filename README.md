# Ramblin' Wreck Firetruck

The website for a Georgia Tech football tailgate crew that owns a
converted firetruck as their tailgate vehicle — a 1977 fire engine bought
on eBay in 2014 for $2,800 and turned into a full tailgate setup. The
site itself is styled like a stadium jumbotron/video board rather than a
conventional scrolling page, and includes a member portal for event
signups plus an admin panel for the crew running it.

This is **not** an official Georgia Tech site and doesn't use official GT
logos or imply university affiliation.

Started September 2026. Actively being built out stage by stage — see
status below.

## Status

Building page-by-page / section-by-section rather than all at once, with
each stage reviewed via live preview before moving on:

1. ✅ Foundation — `JumbotronFrame` shell
2. ⬜ `NextEventTicker` (persistent bottom bar) with placeholder data
3. ⬜ Home / Instagram carousel
4. ⬜ Nav + page-swap transitions
5. ⬜ Schedule page content
6. ⬜ About/History page + player-card component
7. ⬜ Donations + Contact + Rental pages
8. ⬜ Auth, event signup, admin panel

## How it's built

- **Next.js** (App Router, TypeScript) + **Tailwind CSS** for the front
  end, with **Framer Motion** planned for the broadcast-style page
  transitions
- **Supabase** (Postgres + auth) planned for the member portal — event
  signups, guest management, admin panel
- **Vercel** for hosting
- Gmail + Google Apps Script planned for email/calendar-invite automation
  (reminders, newsletter, admin broadcasts)
- Instagram Basic Display API (or an embed fallback) planned for the
  home page video carousel

The outer page never scrolls — it's a fixed full-viewport frame styled
like a video board bezel. Page content swaps inside that frame with
broadcast-style transitions, and scrolls internally only if it doesn't
fit the visible display.

## References

Source material used in building this site:

- [ramblinwreck.com](https://ramblinwreck.com) — background on the crew
  and the truck
- Atlanta Journal-Constitution (AJC) coverage of the tailgate firetruck
- Wall Street Journal coverage of the tailgate firetruck
- [@ramblin_wrekd](https://www.instagram.com/ramblin_wrekd) on Instagram
  — source for the home page video carousel

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it.

---

This README is a living document and gets updated as the project
evolves, not just at launch.
