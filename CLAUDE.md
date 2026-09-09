# Project: Georgia Tech Tailgate Website (Ramblin' Wreck Firetruck)

## What this is
A website for a Georgia Tech football tailgate crew that owns a converted
firetruck used as their tailgate vehicle. Styled to look like a football
stadium jumbotron/video display rather than a conventional scrolling
website. Includes a member portal for event signups and an admin panel.
Not an official Georgia Tech site — do not use official GT logos or imply
university affiliation.

## Current owners
Patrick Shea (younger brother of founder Christian Shea) and Harry
Rizvi (Patrick's best friend since age 5) bought the truck from
founder Sam Huffman for $1,000 in October 2021, taking over from the
original owners as they got older, started families, and had less
time for tailgate/truck upkeep. Full story lives on the About page
(`/about`) and in that stage's CLAUDE.md status note below. Founders:
Sam Huffman and Christian Shea, GT alumni who bought and converted the
truck in 2014.

## Build approach
Building page-by-page / section-by-section, not all at once. Each stage
should be reviewed via live preview before moving to the next. Sequence:

1. Foundation — JumbotronFrame shell (DONE — see status below)
2. NextEventTicker (persistent bottom bar) with placeholder data (DONE)
3. Home / Instagram carousel (manual arrows + scroll-to-advance) —
   ON HOLD, see status below
4. Nav + page-swap transitions (broadcast-style cut/wipe) (DONE)
5. Schedule page content (DONE — see status below)
6. About/History page + PlayerCard component (DONE — see status below)
7. Donations + Contact + Rental pages (DONE — see status below;
   Rental was renamed to "Book Us" partway through, see status)
8. Auth, event signup, admin panel (separate phase — see data model below)

**Status:** Stages 1–2 are built. JumbotronFrame now lives in the root
layout (not per-page) so the nav bar, brand strip, and NextEventTicker
stay mounted across page navigation. NextEventTicker pulls the next
upcoming home game from a placeholder 2026 schedule (`lib/schedule.ts`)
— kickoff/tailgate-start times show as TBD since the conference hasn't
announced them. Stage 2 also pulled forward minimal versions of the
Schedule page (`/schedule`) and a signup placeholder (`/signup`) so
the ticker's buttons have somewhere real to go.

Stage 3 (Home / Instagram carousel) is **on hold** — Graph API setup
(see the Recommended Stack note below for why the embed-widget
fallback doesn't work) was creating blockers, so by owner's call we
skipped ahead to stage 4 rather than wait on it. Once there's a
long-lived access token and Instagram Business Account ID
(`.env.example` documents what's needed), the carousel is ready to
build — home page currently just shows a status placeholder instead.

Stage 4 (nav + page-swap transitions) is done, out of sequence ahead
of stage 3. Real `NavBar` (`components/jumbotron/NavBar.tsx`) links to
all seven nav destinations; `PageTransition`
(`components/jumbotron/PageTransition.tsx`, needs Framer Motion —
added in this stage) plays a broadcast-style gold wipe across the
screen on every route change, wrapping `{children}` in the root
layout. About/Donations/Contact/Rental all got minimal `ComingSoon`
placeholder pages (`components/jumbotron/ComingSoon.tsx`) so every nav
link goes somewhere real instead of 404ing, matching the pattern
already used for `/schedule` and `/signup`.

Stage 6 (About/History) is done, also out of sequence — stages 5
(Schedule page content beyond the stage-2 pull-forward) and 7
(Donations/Contact/Rental, still ComingSoon placeholders) haven't
happened yet. `/about` has the full ownership history (see the
About/History page section below for the story), four real source
link-preview cards with outlet badges, and `PlayerCard`
(`components/jumbotron/PlayerCard.tsx`) redesigned as a football
roster tile (photo/monogram filling the card, dark name plate across
the bottom) per an owner-supplied reference image, used for both the
Current Owners and Founders/Previous Owners/Donors sections.

`/about` also has the first "jumbotron crawl": on arrival, the page
auto-scrolls itself top to bottom like a Star Wars opening or a
broadcast teleprompter (`components/jumbotron/JumbotronCrawl.tsx`).
Any real user scroll input (wheel, touch, pointer, keyboard) cancels
autoplay instantly and leaves the scroll wherever they left it — it
never fights the visitor. Mute and Replay controls float in the
bottom corner over a fade-to-black scrim so scrolling text doesn't
clip behind them. Mute doesn't do anything audible yet since there's
no narration audio built (that's a future addition: an announcer
voice reading the page, as if it came on the real jumbotron); the
toggle exists now so that feature just has to check `muted` /
subscribe via the `onMutedChange` prop rather than needing new UI
later. Respects `prefers-reduced-motion` by not auto-starting (Replay
still works if explicitly clicked). Built as a reusable wrapper
specifically so it can be applied to other pages later, per the
owner's request — not About-specific despite currently only being
used there.

Site copy avoids em dashes throughout (owner preference) — use commas,
periods, or colons instead when writing any user-facing page text.

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
  layout). Roster-tile visual confirmed against an owner-supplied GT
  All-ACC graphic — see `PlayerCard`.
- **Jumbotron crawl** (`JumbotronCrawl`, currently used on About only):
  auto-scrolls a page's content top to bottom like a Star Wars
  opening/teleprompter on arrival, cancels instantly on any real user
  scroll input, with Mute (reserved for future announcer-voice
  narration audio) and Replay controls. Built reusable since the owner
  wants it on other pages eventually, not just About.
- **Everything on screen should read as lit**, not just headings: the
  LED pixel-grid overlay (`gt-pixel-grid`) and `gt-led-text-gold` /
  `gt-led-text-white` (strong glow, headings and key labels) /
  `gt-led-text-dim` (soft glow, body copy and secondary text) /
  `gt-led-border-gold` (glowing card outlines) are the building blocks
  for it. Apply these to new text/graphics by default going forward —
  About and the nav got a full pass, other existing pages haven't been
  retrofitted yet.
- **Gold = physical bezel, not a screen.** The pixel grid is applied
  per-panel (nav bar, brand strip, main screen, and each of
  NextEventTicker's three columns each get their own `gt-pixel-grid`
  overlay scoped to just that panel), never as one overlay spanning
  the whole frame — the gold borders/dividers are the bezel material
  between separate physical displays, so LED texture must never touch
  or bleed across them. Dot spacing is tight (5px grid, ~1.8px dot
  radius) so the dots read as what's forming the content, not as
  separate decoration behind it.

Stage 5 (Schedule page content) is done. `/schedule` already covered
the literal spec since stage 2's pull-forward (Date, Opponent,
Location, Kickoff, Tailgate, Sign-Up on tailgate rows); this pass
brought it in line with the LED-glow visual language the rest of the
site has (glowing header/borders, `gt-led-text-dim` on body cells) and
added a highlighted row + "Next" badge for whichever game
`getNextHomeGame()` returns, tying the table back to the bottom
ticker instead of the two feeling disconnected.

Follow-up per the owner: `/schedule` now filters to **home games
only** (`schedule2026` itself still holds the full season, away games
included, as the source of truth — the page just filters it) and
dropped the Location column since every row is a home game by
definition now. Sign-Up visibility (here and on the bottom ticker)
already runs off the placeholder `game.tailgate` flag, which is meant
to stand in for "an admin created a tailgate event for this game" —
that's the intended real behavior once stage 8's admin panel exists,
not something that needs to change when it ships.

Stage 7 (Donations/Contact/Rental) is done, approved by the owner
after stage 5. Donations stays the `ComingSoon` placeholder per its
spec (payment method still undecided). Contact and the former Rental
page both got real forms (`app/contact/page.tsx`,
`app/booking/page.tsx`) — client components with controlled fields,
native HTML5 validation (`required`, `type="email"`), shared field
styling (`lib/formStyles.ts`).

**"Rental" was renamed to "Book Us"** (nav label, page heading, and
the route itself: `/rental` → `/booking`) shortly after this stage
shipped, per the owner: people want the crew to bring the truck to
their event, which reads more like booking a vendor than renting
equipment. Contact's reason dropdown also got a matching "Booking
Inquiry" option, which shows a hint pointing to `/booking` for the
fuller event-detail form when selected. If you're looking for the
rental page/form elsewhere in older context, this is it.

**Submission isn't wired to a real backend yet, on purpose.** There's
no email service or backend infra built (that's stage 8 territory),
so rather than fake a successful send, submitting shows an honest
"not connected yet, reach out via @ramblin_wrekd on Instagram in the
meantime" message instead of a fake success confirmation. The owner
is deciding between wiring these into a real backend later vs.
embedding a JotForm as a working stopgap — don't build either without
asking first, this was intentionally left as UI-only for now.

Contact fields: name, email, phone (optional), reason (dropdown:
General Inquiry / Sponsor-Partner Inquiry / Booking Inquiry / Other),
message. Book Us fields: name, email, phone, event type
(Wedding/Parade/Birthday/Other), event date, guest count (optional),
event location,
additional details — field set was owner's call to make per CLAUDE.md
("exact fields not yet decided"), not a fixed spec, revisit if it
turns out to be missing something.

**Known issue, not yet fixed:** `JumbotronButton` (Sign-Up, Full
Schedule, etc.) looks a little off with the pixel-grid overlay on
top of it — the panel's `gt-pixel-grid` sits above everything in that
panel including buttons, and `mix-blend-overlay` white dots on a
solid gold/navy button fill reads more like noise than the clean LED
sheen it gives the black/navy panel backgrounds. Revisit later:
likely fix is excluding the button's own footprint from the overlay
(e.g. a solid-fill mask, or moving the pixel-grid behind the button
in stacking order for that element specifically) rather than changing
the grid itself.

### Future: announcer narration audio (not started)
The jumbotron crawl's Mute button is wired up for this but there's no
audio yet. Concept: an announcer-style voice reading each page's
content aloud in sync with the crawl, like a stadium PA read straight
off the jumbotron.

**Blocked on:** finalizing the actual page copy first — re-generating
narration audio every time the text changes wastes effort (and, for
paid-per-character services, money), so don't record anything until a
page's content is considered done.

**Free/low-cost TTS options to generate the narration once ready**
(current as of this note; verify pricing/limits before committing to
one, they change):
- **ElevenLabs** — best voice quality/expressiveness for an
  "announcer" feel, easiest signup. Free tier is character-limited per
  month (small, but likely enough for a short page). Good first choice
  to prototype the tone.
- **Google Cloud Text-to-Speech** (WaveNet/Neural2 voices) — much
  larger free monthly character allowance, but needs a GCP account
  (billing info required even to stay in the free tier) and voices
  lean more "neutral newscaster" than "hype announcer."
- **Microsoft Azure AI Speech** — Neural voices, generous free tier,
  similar GCP-style setup friction (Azure account required).
  Amazon Polly — Neural voices, large free allowance but only for an
  account's first 12 months.
- **Murf.ai / PlayHT** — marketed specifically toward broadcast/
  announcer-style voices, closest out-of-the-box "sports hype" tone,
  but free tiers are small trial credits rather than an ongoing
  monthly allowance.

Recommendation: prototype the tone in ElevenLabs first since it needs
the least setup and sounds the most like an actual announcer; move to
Google/Azure/Amazon only if ongoing volume outgrows ElevenLabs' free
tier.
- Known risk: Framer couldn't reliably do the fixed-frame + inner-scroll +
  scroll-hijacked carousel behavior — that's why this moved to a custom
  build. Prioritize proving these interactions work early (stages 1–3).

## Site structure / nav
Home · Schedule/Events · About/History · Donations · Contact · Book Us
(bringing the firetruck to weddings/parades/other paid events —
separate page, was called "Rental" until stage 7) · Sign Up/Register/
Member Login (portal). Partnerships/Sponsors is a section on Home, not
a separate page.

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

### About/History page (DONE — see status above; `/about`)
- Background/history text, full story now confirmed by the owner:
  - 2008: the tailgate tradition itself starts.
  - 2014: GT alumni Sam Huffman and Christian Shea buy a 1977 Ford fire
    engine on eBay (Indiana) for $2,800, convert it (keg, sound system,
    deck), and start driving it to games as "the Grant Field Volunteer
    Fire Department." Make is a **Ford** — "Pierce" in some early press
    refers to the apparatus body builder, not a competing make claim,
    so the page doesn't need to explain that nuance, it just states
    Ford.
  - As the founders aged, started families, and had less time for
    tailgate/truck upkeep, they looked to pass it down. Patrick Shea
    (Christian's younger brother, grown up around the tailgate's GT
    alumni group) and Harry Rizvi (Patrick's best friend since age 5,
    attending since the tradition began) asked to take over "to keep
    it in the family." Sam sold them the truck for $1,000 in October
    2021; they prepped it that offseason for the 2022 season.
  - Since taking over: new stereo system, three TVs, turf on the upper
    deck, 1996 Atlanta Olympic Stadium seats (replacing the old bench
    seating), retractable awnings, ongoing mechanical maintenance.
- Link-preview cards (not reproduced text) for the ramblinwreck.com,
  AJC, and two WSJ source articles — real URLs, all four live on the
  page, each with a small monogram "logo" badge (RW / AJC / WSJ) since
  using the outlets' actual trademarked logo art wasn't pursued.
- Current Owners section (player-card style): Patrick Shea, Harry
  Rizvi. Founders/Previous Owners/Donors section: Sam Huffman,
  Christian Shea (both "for now" per the owner — a dedicated donors
  list may expand this later). `PlayerCard`
  (`components/jumbotron/PlayerCard.tsx`) is a roster-tile design
  (photo/initials-monogram fills the card, dark name plate across the
  bottom: first name small, last name bold, role beneath) modeled on
  an owner-supplied GT All-ACC roster graphic. No real photos yet;
  pass `photoSrc` once available.

### Donations page
Placeholder content — payment collection method not yet decided.

### Contact page
General inquiry form. Also handles sponsor/partner inquiries (from the
Home page "Become a Partner" button).

### Book Us page (`/booking`, separate from Contact — DONE, see status above)
Inquiries about bringing the firetruck to weddings, parades, birthdays,
and other paid events outside of tailgates. Called "Rental" until
stage 7; renamed since the crew brings the truck to the event, which
reads more like booking a vendor than renting equipment. Dedicated
inquiry form with its own field set (see status above).

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
