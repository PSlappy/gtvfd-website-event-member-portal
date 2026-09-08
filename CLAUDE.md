# Project: Georgia Tech Tailgate Website (Ramblin' Wreck Firetruck)

## What this is
A website for a Georgia Tech football tailgate crew that owns a converted
firetruck used as their tailgate vehicle. Styled to look like a football
stadium jumbotron/video display rather than a conventional scrolling
website. Includes a member portal for event signups and an admin panel.
Not an official Georgia Tech site — do not use official GT logos or imply
university affiliation.

## Current owners
Patrick Shea and Harry Rizvi. Original founders/owners are friends who
still attend the tailgate (names TBD for the site).

## Build approach
Building page-by-page / section-by-section, not all at once. Each stage
should be reviewed via live preview before moving to the next. Sequence:

1. Foundation — JumbotronFrame shell (DONE — see status below)
2. NextEventTicker (persistent bottom bar) with placeholder data (DONE)
3. Home / Instagram carousel (manual arrows + scroll-to-advance)
4. Nav + page-swap transitions (broadcast-style cut/wipe)
5. Schedule page content
6. About/History page + PlayerCard component
7. Donations + Contact + Rental pages
8. Auth, event signup, admin panel (separate phase — see data model below)

**Status:** Stages 1–2 are built. JumbotronFrame now lives in the root
layout (not per-page) so the nav bar, brand strip, and NextEventTicker
stay mounted across page navigation. NextEventTicker pulls the next
upcoming home game from a placeholder 2026 schedule (`lib/schedule.ts`)
— kickoff/tailgate-start times show as TBD since the conference hasn't
announced them. Stage 2 also pulled forward minimal versions of the
Schedule page (`/schedule`) and a signup placeholder (`/signup`) so
the ticker's buttons have somewhere real to go.

Stage 3 (Home / Instagram carousel) is **blocked on Instagram Graph
API credentials** — see the Recommended Stack note below for why the
embed-widget fallback doesn't work. Once there's a long-lived access
token and Instagram Business Account ID (`.env.example` documents
what's needed), the carousel itself is ready to build.

## Project organization

This is one project, one repo — the jumbotron front end, member portal,
and admin panel all live in the same Next.js app (see folder structure
under "Recommended stack" / data model sections below), not separate
Claude Code projects. This root CLAUDE.md stays the high-level brief.

Once stage 8 (auth/signup/admin) work actually starts, add nested
CLAUDE.md files that Claude Code will auto-load when working in those
subdirectories, so implementation detail doesn't bloat this root file:
- `/app/(portal)/CLAUDE.md` — portal-specific detail (signup flow, guest-
  merge logic, cutoff handling, etc.)
- `/app/(admin)/CLAUDE.md` — admin-panel-specific detail

Don't create these yet — add them when that phase of work begins.

## Design concept: the jumbotron

- Full-viewport fixed frame; the outer page never scrolls. Dark
  background, bezel/frame styling suggesting a real video board, bold
  broadcast-style type.
- **Bottom info bar** (persistent across all pages): shows the next
  upcoming tailgate event — Opponent, Date, Kickoff Time, Tailgate Start
  Time, Address. Only updates when the actual next event changes, not
  based on navigation.
- **Main display** (rest of frame): content swaps based on nav selection,
  with a broadcast-style transition. If a page's content doesn't fit the
  visible frame, scrolling reveals more content *inside* the frame — the
  outer viewport itself never scrolls.
- **Home / default state:** Instagram video carousel (pulled from
  @ramblin_wrekd). Left/right arrow buttons for manual navigation. Also
  advances on scroll while on this view. Does NOT auto-play/auto-advance
  on a timer.
- **Owner/team info** (About/History page): styled like football
  broadcast "player cards" (photo, name, key info in a graphic card
  layout). Exact visual TBD pending example images from the user.
- Known risk: Framer couldn't reliably do the fixed-frame + inner-scroll +
  scroll-hijacked carousel behavior — that's why this moved to a custom
  build. Prioritize proving these interactions work early (stages 1–3).

## Site structure / nav
Home · Schedule/Events · About/History · Donations · Contact · Rental
(firetruck rental — separate page) · Sign Up/Register/Member Login
(portal). Partnerships/Sponsors is a section on Home, not a separate page.

### Home page sections
1. Landing / high-level intro
2. Next/Upcoming Event teaser → button to full Schedule page
3. Instagram gallery/carousel (see jumbotron behavior above)
4. Partners/Sponsors → "Become a Partner" button → Contact

### Schedule/Events page
Full 2026 GT football schedule. Per game: Date, Opponent, Location
(Home/Away), Kickoff Time, Tailgate Status, and — only on tailgate rows —
a Sign Up button linking into the portal.

2026 schedule (kickoff times not yet announced — treat as TBD until
updated closer to each game):

| Date | Opponent | Location |
|---|---|---|
| Sept. 5 | Colorado | Home |
| Sept. 12 | Tennessee | Home |
| Sept. 19 | Mercer | Home |
| Sept. 26 | Stanford | Away |
| Oct. 10 | Duke | Home |
| Oct. 17 | Virginia Tech | Away |
| Oct. 21 | Pitt | Away |
| Oct. 24 | Boston College | Home |
| Nov. 7 | Louisville | Home |
| Nov. 14 | Clemson | Away |
| Nov. 21 | Wake Forest | Home |
| Nov. 28 | Georgia | Away |

### About/History page
- Background/history text (see draft copy in prior chat — 1977 fire
  engine, bought on eBay in 2014 for $2,800, converted into the tailgate
  vehicle; confirm make — sources conflict between "Ford" and "Pierce")
- Link-preview cards (not reproduced text) for the ramblinwreck.com, AJC,
  and WSJ source articles
- Current Owners section (player-card style): Patrick Shea, Harry Rizvi
- Previous Owners/Founders section (player-card style): placeholder

### Donations page
Placeholder content — payment collection method not yet decided.

### Contact page
General inquiry form. Also handles sponsor/partner inquiries (from the
Home page "Become a Partner" button).

### Rental page (separate from Contact)
Inquiries about renting the firetruck for weddings, parades, birthdays,
and other paid events outside of tailgates. Dedicated rental-specific
inquiry form — exact fields not yet decided.

## Member portal (phase 2, after jumbotron front end is approved)

### Registration
First name, last name, phone (required), email (required), Venmo
(optional), profile picture (optional). Manual signup or Google SSO.
Registering auto-enrolls in the newsletter. Invites to register can be
sent via phone number as well as email.

### Event signup
Member picks event from dropdown. Can add guests one at a time (guest
info — first/last name, email — all optional, no cap on guest count).
Member and each guest indicate yes/no on partaking in amenities
(food/drink, $25 each). Optional diet/food-restriction field per person
(member and each guest). Running total of headcount and amenities cost
displayed.

**Responsibility language required at signup and in reminder emails:**
the person signing up is responsible for paying for themselves plus all
guests they registered, since food/drink is purchased based on signup
counts, unless they edit their signup before the cutoff date.

### Member dashboard
View/edit own signups (add/remove guests, cancel). Cutoff date for edits/
cancellations: default 1–2 days before the event, ideally overridable
per-event by an admin (not a hard requirement for v1).

### Duplicate guest/member handling
If a guest was added (with email) by a member and later registers their
own account, and tries to sign up for an event they're already registered
for via that guest record: either block the duplicate signup, or transfer/
merge the guest signup to their new account. Guests who register should
also be able to add their own additional guests afterward.

### Admin panel
Multi-admin access (permission tiers not needed for v1 — every admin has
equal access). Event creation: name, date, event time, tailgate start
time, address, catering provider. View/edit events and signups. Draft and
send an email notification/update (event changes, cancellations, weather)
from the Gmail account to registered members/guests for a given event.

### Notifications
Reminder emails before the signup cutoff (include the responsibility
language above). Google Calendar invite generation for people who sign
up. Sent via a Gmail account + automation (Apps Script or similar) —
newsletter, reminders, and admin broadcast emails should share this same
sending mechanism.

## Data model (initial pass)

- `members`: id, first_name, last_name, phone, email, venmo (optional),
  profile_photo (optional), created_at
- `events`: id, opponent, date, kickoff_time, tailgate_start_time,
  address, catering_provider, signup_cutoff (nullable override of
  default), created_by
- `signups`: id, event_id, member_id, amenities_opt_in, diet_notes,
  created_at, edited_at
- `guests`: id, signup_id, first_name (optional), last_name (optional),
  email (optional), amenities_opt_in, diet_notes, converted_to_member_id
  (nullable)
- `admins`: id, member_id, role (single role for v1)

## Recommended stack
Next.js (App Router, TypeScript) + Tailwind CSS + Framer Motion
(animation library — unrelated to the Framer website builder) for the
front end. Supabase for auth + Postgres database (member accounts,
events, signups). Vercel for hosting. Gmail + Google Apps Script for
email/calendar-invite automation. Instagram Graph API for the carousel
content — not Basic Display API (deprecated) and not the public embed
widget (tested during stage 3: only the profile card embed works,
individual post embeds return 503, so it can't power a real per-post
carousel). Requires a Meta developer app + a Business/Creator Instagram
account linked to a Facebook Page; see the stage 3 status note above
and `.env.example` for the credentials needed.

## Payments (not yet built)
Amenities fee ($25/person) and donations are currently collected
manually via Venmo request, as the crew has traditionally done. No
in-site payment collection is being built yet — revisit once the rest of
the app is functional.

## Privacy
Site collects phone numbers, emails, and photos — needs a Privacy Policy
page (static content) plus a required agreement checkbox at portal
registration.

## Cost priorities
Keep ongoing subscriptions minimal — favor free tiers (Supabase, Vercel)
where reasonable. Open to paying for hosting/tools where it's clearly
worth it, just not the default assumption.

## Version control & GitHub workflow

This repo is public-facing and will be part of the owner's portfolio —
treat commit history as a visible record, not just internal bookkeeping.

- Initialize a git repo and create it on the owner's GitHub account at
  the start of the project (ask for the GitHub username/org if not
  already known, and confirm public visibility before creating it).
- Commit early, commit often — standard practice: small, logically
  scoped commits rather than large batched ones. Commit at the end of
  each meaningful step, not just at the end of a whole stage.
- Commit messages: concise but specific about what changed and why.
  Write them in plain, natural language — how a person would actually
  describe the change, not generic AI-generated phrasing (avoid things
  like "Implement feature X" with no detail, or overly formal/verbose
  boilerplate). Should read like the owner's own commit log.
- Push regularly so the GitHub history reflects real, incremental
  progress over time — this history is itself part of the portfolio
  value, showing the project being built and iterated on.

## README (public-facing)

Maintain a README.md that works as a portfolio piece for anyone landing
on the repo — not just setup instructions. Keep it current as the project
evolves rather than writing it once and letting it go stale. Include:

- What the project is, who it's for, and why it was built (the tailgate/
  firetruck backstory belongs here in brief)
- When it was started and a sense of its ongoing status (actively
  maintained/improved over time)
- How it's built (stack, architecture at a high level)
- References and sources used in building it — the ramblinwreck.com/AJC/
  WSJ articles, the @ramblin_wrekd Instagram account, and any other
  source material provided now or added later. Keep this list updated
  as new references get added over the life of the project, not just at
  launch.
- Screenshots or a link to the live site once there's something to show
- This should be treated as a living document — update it as the project
  changes, not just once at the start.
