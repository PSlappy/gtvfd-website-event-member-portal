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
added in this stage) wraps `{children}` in the root layout and plays a
transition on every route change. About/Donations/Contact/Book Us all
got minimal `ComingSoon` placeholder pages (some later replaced with
real content/forms — see their own stage notes) so every nav link goes
somewhere real instead of 404ing, matching the pattern already used
for `/schedule` and `/signup`.

**`PageTransition` was later rebuilt with four randomized transition
variants** instead of the original single gold-wipe effect, per the
owner: side **swipe** (slides left, like a billboard panel change),
**iris** (circular reveal from center, like a broadcast graphics
package cueing in), **vertical** wipe (same idea as swipe, top-to-
bottom), and a hard **flash** cut (quick fade/scale plus a brief gold
flash). One is picked at random on every route change, excluding
whichever one played last so the same transition never repeats back
to back. Falls back to a plain instant swap (no animation) for
`prefers-reduced-motion`.

**Real bug caught and fixed while building this:** the first version
picked the random transition via `Math.random()` inside a `useMemo`
that ran during render, which is unsafe for a component that gets
server-rendered on first load — the server and the client's hydration
pass each call `Math.random()` independently and get different
results, producing mismatched inline styles and a genuine React
hydration-mismatch console error (confirmed, not assumed). Fixed by
giving the first render a fixed, non-random default transition
(`DEFAULT_TRANSITION = "swipe"`, safe since `AnimatePresence`'s
`initial={false}` means it isn't animated on first paint anyway) and
only starting to randomize inside a `useEffect` — which only ever
runs client-side, after hydration, once a real navigation has
happened — rather than during the render itself. If this component
grows more client-only randomness later, keep that pattern: pick
inside an effect, never inside render, for anything server-rendered.

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
  based on navigation. **No longer has a Full Schedule button** — it
  used to sit next to Sign-Up here, but per the owner it was a
  redundant way to reach `/schedule` once Schedule became a real nav
  link. Sign-Up stays, since it isn't in the nav.
- **Main display** (rest of frame): content swaps based on nav selection,
  with a broadcast-style transition. If a page's content doesn't fit the
  visible frame, scrolling reveals more content *inside* the frame — the
  outer viewport itself never scrolls. Its scroll container (and
  `JumbotronCrawl`'s) has the native scrollbar hidden via `.gt-no-scrollbar`
  (`scrollbar-width: none` + the `-webkit-scrollbar` equivalent) per
  the owner, so the board reads as a sealed video panel instead of a
  webpage with a visible OS scrollbar — scrolling itself still works
  identically, only the visible track/thumb is gone.
- **Home / default state:** Instagram video carousel (pulled from
  @ramblin_wrekd). Left/right arrow buttons for manual navigation. Also
  advances on scroll while on this view. Does NOT auto-play/auto-advance
  on a timer.
- **Owner/team info** (About/History page): styled like football
  broadcast "player cards" (photo, name, key info in a graphic card
  layout). Roster-tile visual confirmed against an owner-supplied GT
  All-ACC graphic — see `PlayerCard`.
- **Jumbotron crawl** (`JumbotronCrawl`, now used on every page —
  originally About-only, extended everywhere per the owner so the
  autoscroll and the typewriter effect always run together, not just
  there): auto-scrolls a page's content top to bottom like a Star Wars
  opening/teleprompter on arrival, cancels instantly on any real user
  scroll input, with Mute (reserved for future announcer-voice
  narration audio) and Replay controls. Already no-ops gracefully when
  a page's content is short enough not to need scrolling, so wrapping
  every page was safe. Scroll speed is 48px/s (was 40, +20% per the
  owner). `ComingSoon` applies it once at the shared-component level
  so Donations and Signup both picked it up for free.
- **Typewriter effect** (`Typewriter`, used site-wide on headings and
  paragraph copy): types text out character by character the first
  time it scrolls into view, like a caption being typed live on the
  board, per the owner. Deliberately not applied to nav links,
  buttons, form fields, table data, or PlayerCard/source-card content
  — only prose. Works together with two small pieces of shared state:
  `TypeSequenceContext` (provided once per page by `PageTransition`,
  reset on every navigation) makes blocks type one at a time in DOM
  order instead of a heading and the paragraph under it both typing at
  once just because both are already on screen; `TypingCoordinationContext`
  lets a block tell the nearest `JumbotronCrawl` to pause its
  autoscroll while the block is actively typing (a no-op outside a
  crawl), so the crawl can never scroll a caption away mid-type.
  Real bug hit while building this, worth remembering: the per-block
  sequence id was first assigned inside a `useState` lazy initializer,
  which React's dev StrictMode double-invokes — that silently burned
  ids off the shared counter and permanently desynced every block
  after the first from its turn. Any similar "assign a stable id from
  a shared counter" pattern needs to live in a ref-guarded `useEffect`,
  not a lazy initializer or the render body itself.
  Default typing speed is 42ms/character now (every page's explicit
  `speed` override scaled the same way each time) after three rounds
  of "still too fast" from the owner — went 22 -> 33 -> 55 -> 42 (the
  55 -> 42 step was a 30%-faster request, not another slowdown, so
  don't assume the trend only ever goes slower). **Text alignment,
  settled after going back and forth:** body paragraphs are
  left-aligned (the block itself stays centered on screen via the
  existing flex containers) — an earlier request for "centered"
  typewriter text had made paragraphs `text-align: center` for a
  stretch, which read as uneven ragged-left prose; headings and short
  uppercase labels ("Current Owners", the Home page's eyebrow, etc.)
  stay center-aligned throughout.
  **Real layout bug fixed, also worth remembering:** it originally
  rendered `text.slice(0, visibleChars)`, so the paragraph's own word
  wrap recalculated on every character as the string grew, visibly
  shifting words to different lines mid-type instead of each line
  holding a fixed set of words. Fixed by always rendering the full
  string and making only the untyped tail `invisible` (not `display:
  none` — `visibility: hidden` still occupies its layout space), so
  line breaks are fixed from the very first render and typing only
  ever reveals characters within them.
- **Everything on screen should read as lit**, not just headings: the
  LED pixel-grid overlay (`gt-pixel-grid`) and `gt-led-text-gold` /
  `gt-led-text-white` (strong glow, headings and key labels) /
  `gt-led-text-dim` (soft glow, body copy and secondary text) /
  `gt-led-border-gold` (glowing card outlines) are the building blocks
  for it. All three `gt-led-text-*` classes also carry one crisp,
  unblurred offset shadow layer for depth (on top of the blurred glow
  layers) — a soft dark blur alone has nothing to contrast against on
  the site's black/navy backgrounds, but a hard offset lands inside
  the glow halo the other layers already threw outward, reading as
  the character catching a shadow on the panel behind it rather than
  a flat printed letter. Apply these to new text/graphics by default
  going forward — About and the nav got a full pass, other existing
  pages haven't been
  retrofitted yet.
- **Gold = physical bezel, not a screen.** The pixel grid is applied
  per-panel (nav bar, brand strip, main screen, and each of
  NextEventTicker's three columns each get their own `gt-pixel-grid`
  overlay scoped to just that panel), never as one overlay spanning
  the whole frame — the gold borders/dividers are the bezel material
  between separate physical displays, so LED texture must never touch
  or bleed across them. Dot spacing is tight (5px grid) so the dots
  read as what's forming the content, not as separate decoration
  behind it.
- **Every LED emits its own light, not just lit-up text.** Per the
  owner: a real panel this size glows across its whole surface, blank
  areas included, not just behind whatever text happens to be on
  screen. `.gt-pixel-grid`'s dots use a soft multi-stop radial-gradient
  falloff (bright core, faded halo) plus a slight `filter: blur(0.4px)`
  instead of a hard-edged circle, so the grid itself blooms uniformly
  across black and navy backgrounds alike — text-shadow-based glow
  (`gt-led-text-*`) is additive on top of this, not the only source of
  light anymore. The flicker itself (`gt-led-flicker`) was made more
  pronounced per the owner: quick irregular brightness dips (3.5s
  cycle) instead of a slow smooth sine fade (was 5s), so it actually
  reads as a flicker rather than a gentle breathe.
- **Ambient glow orbs** on the main screen (`JumbotronFrame.tsx`, four
  blurred slowly-pulsing color blobs behind the pixel grid) — per the
  owner, copied from a reference site's hero-section glow blobs and
  adapted to the GT gold/off-white palette. Real bug hit while
  building these, same failure mode as anything else absolutely
  positioned in this frame: with no explicit z-index they painted
  above the (non-positioned) page content regardless of DOM order,
  and without a blend mode they sat as solid-ish color patches
  directly over text — confirmed by finding a heading's text fully
  present and correctly styled in the DOM while completely invisible
  on screen. `mix-blend-screen` fixed it (additive light only, content
  underneath stays legible), same pattern as `.gt-pixel-grid-screen`
  below — and needed the same much-lower-than-you'd-guess alpha
  tuning to avoid a wash-out, for the same "screen blend has no
  threshold" reason.
  **Fixed properly, later:** the main screen's actual content wrapper
  got an explicit `relative z-10` (matching the pixel grid's own
  `z-10`, which still wins on top since it's declared later in the
  DOM). This is the real root-cause fix for the bug above — any
  future decorative absolutely-positioned sibling added to this panel
  with no z-index of its own now reliably paints *underneath* real
  content by default, rather than needing every single one to
  independently get the blend-mode treatment right.
- **"Spark Float"** (`.gt-spark` in globals.css): small gold/white
  glyphs (`+`, `·`, `✦`) drifting up and fading, an ambient background
  layer behind whatever's on the main screen — per the owner, also
  adapted from that reference site (there: green symbols tied to one
  specific badge; here: not tied to any element, just atmosphere for
  the whole screen). Eight fixed position/size/delay instances in
  `JumbotronFrame.tsx`, CSS-only (`animation: gt-spark-float ...
  infinite`), so the whole set repeats forever with no JS driving it.
- **"Chase Ring"** (`.gt-chase-ring`): a bright point of light that
  sweeps continuously around an element's own border, fading into a
  short comet-tail behind it — per the owner, the third effect
  adapted from that reference site (there: a green ring around one
  pill badge; here: gold, and applied broadly — see the "own review"
  reference name below). Standard CSS "gradient border" technique: a
  `conic-gradient` on a `::before`, animated by rotating a
  **registered** custom property (`@property --gt-chase-angle`) —
  `@property` is what makes a value *inside* a gradient animatable via
  keyframes at all; a plain (unregistered) custom property here would
  just silently not animate, no error. `padding` + a two-layer
  `mask`/`mask-composite: exclude` clips that filled gradient down to
  a thin ring matching the padding thickness, instead of a filled
  shape. `border-radius: inherit` on the pseudo-element is what lets
  *one* class work on a pill, a card, or anything else without
  per-shape variants.
  **Needs a non-clipping wrapper wherever the target has
  `overflow-hidden` or a scroll container** (PlayerCard, the schedule
  table, the About source cards partly needed this) — the ring's
  `::before` extends outside the element's own box by design (that's
  how it traces the border from the outside), so anything that clips
  its own overflow will clip the ring away too. The pattern used each
  time: an outer `<div className="gt-chase-ring relative ... rounded-*">`
  with no overflow rule of its own, wrapping the original element
  (which keeps its own `overflow-hidden`/`rounded-*` unchanged).
  Currently applied to: whichever nav item is the current page (well,
  currently the nav color test below overrides this — see there),
  Sign-Up (the ticker button and every schedule table row), both
  `PlayerCard`s, the schedule table, and all four About page source
  cards — the owner's ask was "essentially anything displayed on the
  video monitors," scoped in practice to buttons and card-shaped
  content rather than literally every element, since a border-chase
  effect needs a defined box to trace. **Not** on Full Schedule
  anymore — the owner tested it side by side with Sign-Up and
  preferred it off there; Full Schedule's text was changed to gold
  (was black) before the button was removed from the ticker entirely,
  see the bottom-bar note further down.
  Color is a CSS custom property (`--gt-chase-color`, gold by
  default) rather than hardcoded into the gradient, with a
  `.gt-chase-white` modifier — added for the nav color test below, so
  the ring can run in either color per call site via
  `JumbotronButton`'s `chaseColor` prop.
  **Fixed: the first version was too subtle to actually notice**
  ("I do not see the Chase Ring anywhere") despite rendering
  correctly — confirmed it really was there (computed styles checked
  again from scratch, and watched the bright arc visibly sweep across
  several screenshots on `PlayerCard`), the comet was just only
  bright for the last ~20% of a 2.5s rotation on a 2px ring. Added a
  **second, static** ring via `::after` (a plain glowing `box-shadow`
  on the pseudo-element, always visible regardless of where the
  animated comet currently is) and made the comet itself thicker
  (3px), brighter, a bigger share of the arc (~45%), and slower
  (3.5s) so it lingers longer per pass. The static ring lives on
  `::after` rather than as a `box-shadow` directly on `.gt-chase-ring`
  on purpose: that class combines with `.gt-jumbotron-btn` (and, on
  the About cards, `.gt-depth-panel` too) on the same element, both of
  which already set `box-shadow` outright — the exact silent-collision
  bug documented throughout this file. A second pseudo-element can't
  collide with the host's own box-shadow since it isn't touching that
  property.
  **Now also on the site's entire outer frame border**, per the owner
  — `JumbotronFrame.tsx`'s outermost bordered box (`overflow-hidden`,
  which Chase Ring's `::before` can't tolerate — its ring extends
  outside the element's own box by design) gets the usual non-
  overflow-hidden wrapper (same pattern as PlayerCard/the schedule
  table) rather than a new technique. Default gold, unmodified —
  same class, same ring, just traced around the whole viewport now
  instead of one button or card.
- **"Snake Trail"** (`SnakeTrail.tsx`, on the main screen only): a
  handful of short dot-trails crawling across the LED grid on a
  discrete tick loop, game-of-Snake style — bright head, fading tail,
  turns randomly, respawns elsewhere on hitting an edge. The fourth
  effect adapted from the reference site (there: a `<canvas>` layered
  over a static dot-grid background; same idea here). Built as a
  canvas rather than DOM nodes per dot since it's genuinely a step
  interval (140ms ticks), not a smooth CSS animation — canvas is the
  natural fit for that. Deliberately left with no explicit z-index so
  it inherits the main screen content wrapper's `z-10` guarantee (see
  the glow-orb entry above) and can never paint over real text.
  **Retuned per the owner** ("smaller dots, closer together, more
  transparent"): step size 20px -> 10px (still a multiple of
  `.gt-pixel-grid`'s own 5px spacing, so positions still land on real
  grid dots), dot radius and peak alpha both roughly halved. Also
  gained a color per snake (gold / white / a brightened navy blue,
  chosen at spawn) instead of one fixed gold — and dropped
  `mix-blend-screen` to make that work: screen blend can only add
  brightness, it can't make a dark navy dot read as a distinct hue
  against this panel's black background. Verified after tuning that
  all three colors were actually present by sampling the canvas's own
  pixel data directly (`getImageData`), not just eyeballing a
  screenshot. Count later doubled (4 -> 8 trails) per the owner, once
  the color mix was already confirmed working.

**"Chase Ring," "Spark Float," and "Snake Trail" are the owner's own
reference names for these three effects going forward** (not the
reference site's internal class/variable names, which were
`beam-pill`/`beam-spin`, `heal-float`, and an unnamed `<canvas>`) —
use these names, not a re-description, when any of them comes up
again in later conversations.

**Nav color A/B test moved off the real nav, onto its own page.** The
first pass put the test combos directly on `NavBar` (About through
Book Us always showing their assigned color regardless of the actual
current page); the owner then asked for that reverted and the
comparison done on a dedicated page instead. `NavBar` is back to
exactly its normal state — current-page-is-gold, everything else
`outline` — with no trace of the test left in it, and the temporary
`navyWhite`/`navyGold` variants that only existed to support it were
removed from `JumbotronButton`.
**The comparison itself lives at `/nav-color-test`**
(`app/nav-color-test/page.tsx`) — **not linked from the real nav,
visit it directly by URL. This whole route is temporary — delete it
once the owner picks a direction**, along with reverting the note
above the moment `NavBar` actually changes for real. (Explicitly
confirmed still wanted as of a later round of feedback — don't delete
unprompted just because some time has passed.) The original comparison
needed one real, permanent addition to `JumbotronButton` that's stayed
regardless of what this page currently shows: a third Chase Ring
color, `.gt-chase-navy` (a brightened blue — the literal `--gt-navy`
is nearly invisible against this site's own black/navy backgrounds —
same color `SnakeTrail` uses for its navy dots), alongside the
existing gold default and `.gt-chase-white`.

**Rebuilt from scratch more than once since, per the owner — most
recently, entirely replacing every prior row.** Earlier versions of
this page carried, in order: the original navy/white/gold Chase-Ring
comparison (a local `Swatch` component), a Shine/Refresh-Sweep preview
row, a Tech Gold brand-guide reference row (real values fetched from
ramblinwreck.com/georgia-tech-athletics-brand-guidelines — PMS 118C,
its CMYK equivalent, and the digital HEX all convert to RGB 179, 144,
81; Metallic Tech Gold PMS 10126 C has no official digital value at
all, offset-print-only), and a current-vs-metallic fill comparison
(`.gt-solid-fill` in globals.css, still there, strips the button
gloss overlay for a clean comparison). **All of that is gone now** —
the owner asked for every button removed and replaced with exactly
three rows of four color-combo swatches (see the file for the live
spec), styled as exact copies of the real nav bar's `NavBarButton` box
model/text treatment rather than the old pill-shaped `Swatch`.
`.gt-shine`/`.gt-refresh-sweep` in globals.css and the
`showRefreshSweepTest` route gate in `JumbotronFrame.tsx` are left in
place but currently unused by this page — nothing renders them right
now; remove them too if this route's purpose keeps changing and they
stay unused.

**The Metallic Tech Gold site-wide replacement question is still
genuinely open** — the comparison UI that supported that decision no
longer exists on this page, but `.gt-metallic-gold`/`-navy`/`-white`
in globals.css are untouched and the actual site-wide swap still
hasn't happened. Revisit once the owner wants to look at that again.

**Follow-up fixes to the rebuilt three-row page, per the owner:**
- Row 1's Donations swatch had the wrong border — Metallic Gold in the
  original spec table, corrected to Navy (an error in the table
  itself, not a build mistake).
- Couldn't scroll far enough to see Row 3 fully: the page's own
  `py-10` bottom padding wasn't enough clearance for the persistent
  media-controls row + fade (`MusicPlayer`, fixed/absolute at the
  bottom of the main screen, so it doesn't add to document-flow
  height) — the crawl's max-scroll stopped short of the last row,
  leaving it stuck partly hidden underneath. Fixed with `pb-32`.
- Each row now sits inside a wrapper matching the real nav bar's own
  chrome exactly — navy background, thin light-gray border (`border-y`
  here since this is a standalone strip, not the real nav's `border-b`
  nested inside the outer frame), and the same `.gt-pixel-grid`
  overlay — instead of floating directly on the plain black main-
  screen background. Per the owner: "I need to see what the buttons
  look like on a nav bar."
- Added a temporary "Button Test" quick-link (small pill,
  `JumbotronFrame.tsx`, bottom-right of the main screen, hidden on
  `/nav-color-test` itself) so this page is reachable from anywhere on
  the site without typing the URL. **Real bug caught building it:**
  `.gt-jumbotron-btn` hardcodes `position: relative` (needed elsewhere
  to lift buttons above the pixel-grid overlay), and since it's
  defined later in globals.css than Tailwind's utilities, it silently
  won over an `absolute` class on the same element at equal
  specificity — the link rendered inline and 642px wide instead of
  pinned to the corner. Fixed by moving `absolute`/`bottom-3`/`right-3`
  to a plain wrapper div around the link instead, the same pattern
  `MusicPlayer`'s own row already uses for the identical reason.
  **Briefly removed, then restored the same turn it was flagged** — a
  follow-up message ("I dont need a temp button to navigate to the
  test button page anywhere?") was misread as a removal request, but
  the owner meant the opposite: it was needed and hadn't actually been
  visible/working for them yet. Back in `JumbotronFrame.tsx`
  unchanged from the original description above.

**Two more follow-up fixes on this page, per the owner:**
- **Real bug:** the swatches read as washed-out/translucent instead of
  solid right after the nav-bar-matching wrapper (with its
  `.gt-pixel-grid` overlay) was added — the overlay is
  `position: absolute` with its own `z-10`, which paints above any
  non-positioned sibling regardless of DOM order, the exact bug
  documented repeatedly elsewhere in this codebase
  (`.gt-jumbotron-btn`'s own `z-index: 20` exists for the same
  reason). Fixed the same way: `relative z-20` on `TestNavButton`.
- Row 1's Schedule swatch removed entirely ("I don't like that
  design") — that row is three buttons now, not four.

**Row 1 corrected again, then duplicated across four backgrounds, per
the owner.** Contact's swatch was still wrong: Metallic Gold font,
Navy font outline, White button border (was Navy font / Metallic Gold
outline / Metallic Gold border) — the `row1Buttons` array is now
shared/reused rather than redefined per row, so this fix (and any
future one to Row 1's three buttons) automatically applies everywhere
Row 1 appears. Four more rows were added directly under the original,
each an exact duplicate of Row 1's three buttons, differing only in
the *panel* (strip) background behind them: Grey, Metallic Gold, Navy,
Black, in that order — not the individual buttons' own `background`
field, which stays grey for all five. Required pulling the panel
background out of the hardcoded `bg-gt-navy` class on the row wrapper
into a new `panelBackground` field on `TestRow`, applied via
`backgroundStyle()` (the same helper the buttons already use) as an
inline style. A new `"black"` `ColorToken` was added for the last
duplicate — pure `#000000`, matching the main screen's own background.

**Real bug caught right after: the four duplicate rows' panel colors
were set correctly but never actually visible** — the buttons are
`flex-1` with zero gap between them (matching the real nav bar
exactly), so they tile the strip completely and there's no gap left
for the panel background to show through no matter what it's set to;
every row just looked white/grey regardless. Fixed with a new
`showPanelPadding` flag on `TestRow` (`gap-2 p-3` on the wrapper),
applied only to the four duplicate rows, whose whole point is
comparing panel colors — Row 1/2/3 themselves stay flush edge-to-edge,
unchanged, since they're still meant to match the real nav bar's own
look exactly.

**Then replaced entirely with the owner's exact five backgrounds, in
this order: White, Grey, Metallic Gold, Navy Blue, Black.** Supersedes
the "four duplicates on Grey/Metallic Gold/Navy/Black" set above —
White is new, and there's only one Navy row now (not an original-plus-
duplicate). Row 1's three buttons stay identical across all five;
`showPanelPadding` carries over unchanged. Also added a `noOverlay`
flag ("All of these Nav Bar Tests should have NO transparency to
them") that skips the `.gt-pixel-grid` overlay on these five rows
specifically — the dot-texture `mix-blend-overlay` was diluting the
requested solid color even though each color value itself had no
alpha. Row 2/3 keep the overlay, since they weren't part of this
complaint and are still meant to match the real nav bar exactly.
**"Grey" and "Navy Blue" are now standing color definitions, per the
owner** — Grey always means Light Gray (`#E5E5E5`, RGB 229/229/229,
already this page's existing `grey` token, unchanged), Navy Blue is
the literal `--gt-navy` (`#051E39`, RGB 5/30/57). Worth remembering
for any future request that just says "Grey" or "Navy Blue" without
restating the values.

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

**Fixed:** the button pixelation issue above is resolved.
`.gt-jumbotron-btn` gets `position: relative; z-index: 20; isolation:
isolate; mix-blend-mode: normal;`, which lifts every jumbotron button
into its own stacking context above the panel's `gt-pixel-grid`
overlay (with an explicit blend-mode reset as extra insurance), so the
`mix-blend-overlay` dots no longer paint over button fills. Buttons
also got a genuine visual upgrade per the owner: a top-to-bottom
glossy `background-image` gradient so they read as a rendered CG 3D
object rather than a flat colored rectangle, matching "like you'd see
at a football game" jumbotron graphics. They pop in from small with a
3D perspective flip on mount (`gt-btn-pop-in`) and **pulse** gently in
place afterward (`gt-btn-pulse`, a scale breathe — this replaced an
earlier floating/bobbing version per owner feedback that
"floating" wasn't what they meant), pausing on hover/active so
transition doesn't fight the infinite pulse animation over the same
properties. While in there, also fixed a second silent-collision bug
in the same family as the `gt-display-in`/LED-glow one documented
above: `.gt-jumbotron-btn` and `.gt-led-border-gold` both set
`box-shadow`, and were combined on the About page's Featured In cards
— whichever rule came later in the stylesheet was winning outright
and dropping the other's shadow. Folded the gold glow directly into
`.gt-jumbotron-btn`'s box-shadow (rest/hover/active) instead, so any
button reads as lit by default without needing to correctly combine
two classes at each call site.

**Full Schedule button is now the "white" variant, not "navy".**
`JumbotronButton`'s navy variant was replaced with `white` (off-white
per the GT brand guide's Light Gray/White, `bg-gt-gray-light`) — the
Full Schedule button sits on an already-navy ticker panel, so a navy
button just disappeared into its own background. Sign-Up stays the
gold variant. If a "navy" variant is needed again later, re-add it
rather than assuming it still exists.

**All buttons now share one pill-shaped design (Mute/Replay's), and
the continuous pulse is reserved for Sign-Up/Full Schedule only.**
Per the owner, every button should look like the `JumbotronCrawl`
Mute/Replay controls (`rounded-full`, not the old slightly-rounded
rectangle) — `JumbotronButton` and the Contact/Book Us submit buttons
were switched to `rounded-full`. The About page's Featured In cards
were deliberately left as `rounded-lg`: they're multi-line content
cards sharing `.gt-jumbotron-btn` for the hover/press/glow mechanics,
not literal buttons, and a full pill shape would look wrong on
wrapped text.

The pulse itself is now split out into `.gt-jumbotron-btn-cta`, a
compound-selector modifier (`.gt-jumbotron-btn.gt-jumbotron-btn-cta`)
so it reliably overrides the base animation regardless of rule order.
Only `JumbotronButton` (Sign-Up, Full Schedule) applies it — Mute,
Replay, the Featured In cards, and the form submit buttons all keep
the one-time pop-in entrance but stay still once settled, so the
pulse reads as "act now" on the two actual calls to action instead of
every button on the page pulsing forever.

**Later still, per the owner: every button on the site, including nav
links, needed to match.** `NavBar` used to be plain text links; it now
renders each item through `JumbotronButton` too. `JumbotronButton`
gained an `outline` variant (dim, mostly-transparent border/fill) for
inactive nav links — a filled gold or navy pill per item would either
turn the whole bar gold or vanish into the nav bar's own navy
background. Contact and Book Us's submit buttons were resized to match
the same text size/tracking as everything else.

**Then the continuous pulse was removed from every button entirely,
also per the owner** ("Sign-Up and Full Schedule still don't look like
all the other buttons"): it had been reserved for Sign-Up/Full
Schedule/submit buttons as an "act now" cue, but next to the site's
other static buttons it just read as a different, inconsistent button
style rather than more urgent — diffing Sign-Up's and a static nav
button's computed styles showed the pulse's live scale transform was
the *only* difference. `.gt-btn-pulse` and `.gt-jumbotron-btn-cta`
(and `JumbotronButton`'s `pulse` prop) were removed outright rather
than left unused, since nothing calls for them anymore.

**Nav bar overhaul, also per the owner:** Home is now a hand-drawn SVG
firetruck icon (`iconOnly` prop on `JumbotronButton`, no icon library
is installed) pinned to the nav bar's left edge via its own flex item
outside the centered group of the rest, rather than a text label that
wrapped in with everything else. Sign Up was dropped from the nav
entirely — it's already reachable from the bottom ticker and every
tailgate row on the schedule table, so a nav link for it was
redundant (the route itself, `/signup`, still exists and those links
still point to it). The remaining items are now ordered About,
Schedule, Donations, Book Us, Contact.

**Buttons made more solid, per the owner:** the nav's `outline`
(inactive) variant went from `bg-black/30 border-gt-gold/30` to
`bg-black/55 border-gt-gold/45`, and the About page's source cards
from `bg-black/60` to `bg-black/80` — still visibly dimmer than the
filled gold/white variants (that contrast is still how "this is the
current page" reads), just less transparent than before.

**Persistent 3D depth was added on top of all this, per the owner:
"everything on the [main and bottom] screens" should read as a
rendered graphic sitting in front of the screen, not a flat color
fill** — the same idea `.gt-jumbotron-btn`'s glossy gradient already
sold for buttons, extended everywhere else. Two new classes in
`globals.css`: `.gt-depth-panel` (inset top highlight + inset bottom
shadow + outer drop shadow, for anything raised — PlayerCard, the
About page's source cards, the schedule table, all three
`NextEventTicker` panels) and `.gt-depth-recessed` (the inverse, for
form inputs — reads as pressed *into* the screen, which fits "typing
into the display" better than a raised panel would). Combining
`.gt-depth-panel` with `.gt-led-border-gold` or `.gt-jumbotron-btn` —
both of which already set `box-shadow` outright — hits the exact
silent-collision failure mode documented above (the LED-glow classes,
and again for `.gt-jumbotron-btn`'s own box-shadow): whichever
single-class rule sits later in the file wins and drops the other's
shadow. Fixed the same way as before, with compound-selector overrides
(`.gt-depth-panel.gt-led-border-gold`, `.gt-depth-panel.gt-jumbotron-btn`)
that fold both into one value, placed before `.gt-jumbotron-btn`'s own
`:hover`/`:active` rules so those still win on interaction as they
already did for the plain base class.

**Resolved: the LED grid used to be invisible on pure-black panels
(main screen, brand strip), visible only on navy.** `mix-blend-mode:
overlay` mathematically cannot lighten a pure black backdrop —
`overlay(0, x) = 0` for any blend value — so `.gt-pixel-grid` never
actually lit up `bg-black` panels. Two earlier attempts: reverting to
overlay everywhere and accepting it as a known limitation (a straight
swap to `mix-blend-screen`, which *can* lighten black, had reused
overlay's dot alpha values and washed the whole site out into a
milky haze). The eventual fix, once the owner asked for this again:
a **second** class, `.gt-pixel-grid-screen`, with alpha tuned much
lower specifically for screen blend (confirmed by testing — even a
core alpha of 0.22 was still too strong at 5px dot spacing, since
screen blend has no threshold the way overlay does; settled on 0.09).
Used with `mix-blend-screen` only at the two black-panel call sites in
`JumbotronFrame.tsx`; navy panels (nav bar, `NextEventTicker`'s three
columns) keep `.gt-pixel-grid` + `mix-blend-overlay` untouched, since
that already looked right there. So: **the grid now blooms on both
black and navy panels, tuned differently for each** — the "blooms
uniformly across black and navy alike" line earlier in this section
was aspirational when written and is accurate now.

**Nav bar rebuilt again, per the owner: it's no longer the pill-button
row described above — it's a six-segment "scoreboard strip."** The
nav bar (only the nav bar — every other button on the site still uses
the pill-shaped `JumbotronButton` unchanged) now divides its full
width into six equal rectangles, edge to edge, no gaps, closer to a
real stadium video board's divided panels than a row of floating
buttons. Home is one of the six segments now instead of a separately
pinned icon button off to the left. New component,
`components/jumbotron/NavBarButton.tsx`, not a `JumbotronButton`
variant — the shape, text treatment, and state colors are different
enough that folding it into the shared component would've meant more
branching than shared code. No Chase Ring on these, for the moment.

Four states, per the owner's exact spec:
- **Rest:** navy background (`--gt-navy`). Text fill is a "metallic
  gold" banded gradient (reuses the exact gradient from
  `.gt-jumbotron-btn.gt-metallic-gold` above) clipped to the glyphs
  via `background-clip: text` rather than filling a box, with a white
  `-webkit-text-stroke` outline for bold scoreboard-style lettering.
  Border is gold for Home/Schedule/Book Us, white for
  About/Donations/Contact — the owner's exact split, not alternating
  or alphabetical.
- **Hover:** background goes white, text stays the same metallic
  gold, the stroke *and* the button's own border both switch to navy
  (the owner's spec grouped "text outline/border color" as one value
  for this state, unlike Rest where they're independently colored).
- **Click (`:active`):** background goes light gray (`#e5e5e5`,
  `--gt-gray-light`) rather than white, otherwise the same metallic
  gold text and navy outline/border as hover, plus a brief
  brightness-flash keyframe on the text/icon specifically as the
  "click effect" the owner asked for.
- **Current page:** a completely different treatment, not a variant
  of the other three — the button itself fills with the metallic gold
  gradient, text goes solid white (no gradient), outline/border goes
  navy. Held static through hover and active via compound-selector
  overrides (`.gt-nav-current:hover`, `.gt-nav-current:active`) rather
  than also switching to the hover/click look on top of being current
  — a judgment call, not explicitly spec'd either way: you don't need
  rollover feedback on the page you're already on, and the old nav's
  gold "current" variant never had a distinct hover treatment either.
  Revisit if the owner wants the current segment to still visibly
  react to hover/click.

**Real bug caught while building this:** the first pass never passed
an `icon` prop down from `NavBar.tsx` to `NavBarButton`, so Home's
firetruck SVG got wrapped in the same `background-clip: text` span as
the text labels — which sets `color: transparent`, and the icon's own
paths use `fill="currentColor"`, so the truck body rendered fully
invisible (only the wheels stayed visible, since their circles have a
hardcoded `fill="#000"` and only their *ring* used `currentColor`).
Confirmed via the DOM (`className` showed `gt-nav-scoreboard-text`
instead of `gt-nav-scoreboard-icon` on the Home link) before fixing it
by actually passing `icon={item.icon}` through. The icon itself uses a
flat gold via `currentColor` rather than the gradient-clip trick,
since that trick only applies to real text glyphs — same "no official
digital metallic value, so flat gold is the honest approximation"
reasoning used everywhere else metallic gold shows up on this site.

**Colors verified via computed styles, not just a screenshot** (the
metallic-gold text against a white hover background in particular is
subtle in a screenshot) — `getComputedStyle` on the button
(`backgroundColor`, `borderColor`) and the text span
(`backgroundImage`, `webkitTextStrokeColor`) for Rest, Hover, and
Current on every segment; Click was confirmed the same way via a
temporary debug-only inline-style stand-in (a live `:active` press
can't be held for a screenshot, and a synthetic `mousedown` doesn't
trigger `:active` in this browser tool), then reverted immediately
after confirming the color values.

**Follow-up, per the owner: legibility fixes, border unified to white,
and Hover's colors flipped — supersedes some of the Rest/Hover bullets
above.**
- Text bumped 9px/11px → 10px/12px, tracking `wider` → `widest`, and
  the `-webkit-text-stroke` outline thinned 1px → 0.5px — the owner
  offered "larger font, more letter-spacing, or a thinner outline,"
  and rather than guess which single lever would fix it, all three
  landed together. Applies to every state (Rest/Hover/Click/Current)
  for consistency.
- **Rest border is now white for every segment**, not the gold-for-
  Home/Schedule/Book-Us split described above — the owner asked to
  unify it. `NavBarButton` no longer takes a `borderFamily` prop at
  all; `border-color` is set once in the base `.gt-nav-scoreboard-btn`
  rule instead of per-item via an inline Tailwind class.
- **Hover now inverts the text treatment instead of just re-coloring
  the outline:** fill goes solid navy (previously stayed the metallic
  gradient), outline/border go gold (previously navy) — the reverse of
  Rest's gold-fill/white-outline. "Metallic gold" for the hover
  outline and the hover/Rest border is the flat `--gt-gold`, same
  reasoning as Home's icon: a sub-1px stroke or a 2px border is too
  thin a surface for gradient banding to read as metallic, unlike the
  text *fill*, which has a whole glyph's area for it.
- **Real bug caught while wiring the flip up:** a real mouse click is
  also a hover the whole time it's held down, and `:hover`/`:active`
  carry equal CSS specificity — so the new `:hover` rule's navy fill
  would have silently overridden Click's own metallic-gold fill on
  every actual click (Click's rule never used to need to touch fill at
  all, since Hover used to leave it alone). Fixed by having
  `:active .gt-nav-scoreboard-text` explicitly restore the gradient
  fill, so Click's look stays correct regardless of Hover also being
  true underneath it. Worth remembering for any future state that adds
  `:hover` styling to a property another interaction state relies on
  cascading past untouched.

**Follow-up, per the owner: colors flipped again.** Rest is now what
used to be Click-only — light gray background, metallic-gold text,
**white** outline/border (not navy — a genuine new value for Rest, not
inherited from the old Click state, which had a navy border). Hover:
navy background, and this time the text *fill* goes navy too (not just
the outline), so the glyphs read as hollow letters carried entirely by
a metallic-gold outline against the navy panel — a deliberate look,
confirmed intentional by the phrasing ("switch font color to Navy...
outline to Metallic Gold" as its own explicit pair), not a legibility
regression. Border goes gold on hover to match the outline. Click's
own rule still explicitly restores its gray-background/gold-fill/
navy-outline look rather than relying on inheriting it from Rest (which
now happens to match) — the one thing still making a click feel
distinct from resting is the brightness-flash keyframe. Home's icon
color rules were deleted outright (see the badge-logo note below —
nothing consumes `currentColor` there anymore).

**One-off color test added, per the owner: the About segment is locked
into gold-background/navy-text/white-outline regardless of route or
hover/click**, via a new `colorPreview` prop on `NavBarButton` and a
`.gt-nav-color-preview` class in globals.css (compounded with
`.gt-nav-current` too, so it still wins if About is ever the active
route while this is in place) — purely so the owner can see the
combination in context next to the real nav. **Not a real variant —
remove the prop usage in `NavBar.tsx` and the CSS block once the owner
has seen it and decided.**

**Home's icon is now the crew's real "Grant Field VFD" badge**, per
the owner — the hand-drawn SVG firetruck is gone.
`public/grant-field-vfd-badge.png` (real transparent-background logo:
a fire-department badge shape in gold/white with a GT Yellow Jacket
mascot wearing a firefighter helmet, reading "GRANT FIELD VFD /
GEORGIA TECH / EST. 2008" — matching the site's own founding-year lore
exactly). Source was an owner-supplied EPS file.
**Real bug worth remembering:** the EPS's embedded legacy preview
image was a palette-color TIFF with an alpha channel (2 samples per
pixel: a palette index + alpha, per its own IFD tags), but both
`sips -s format png/jpeg` and macOS's own TIFF handling read it as if
it were plain 3-channel RGB — producing a systematically garbled,
venetian-blind-striped image (confirmed by decoding the IFD tags
manually: `PhotometricInterpretation` was `3` = palette color,
`SamplesPerPixel` was `2`, not the `3`/`RGB` sips itself reported back
when asked). Fixed by manually parsing the TIFF's IFD tags (Python,
`struct`), reading the actual index+alpha byte pairs, and resolving
each index through the embedded 256-entry ColorMap to get real RGB —
at that point the image was a clean, correctly-transparent 1500x1500
PNG. If a similar embedded-preview situation comes up again (another
raw EPS/PSD without a clean export), don't trust an image tool's own
metadata report (`samplesPerPixel`, `space`) at face value if the
output looks wrong — check the source format's own internal tags
directly. `IconGrantFieldBadge` in `NavBar.tsx` renders it as a plain
`<img>` (matching the established convention elsewhere on the site —
see `PlayerCard`'s `photoSrc` — rather than introducing `next/image`
for the first time just for this one icon) at `h-8 w-8 sm:h-10
sm:w-10`, sized up from the old icon's `h-5 w-5 sm:h-6 sm:w-6` since a
detailed badge reads better a bit larger than a simple line icon did.

**Follow-up, per the owner: Home is a fixed square now.** Was the
leftmost segment, `flex-1` like every other item; now it's
`flex-none` at a fixed `w-12 sm:w-14` (matching the row's own height,
so it's always literally square) via a new `square` prop on
`NavBarButton`. The remaining five (About/Schedule/Donations/Book Us/
Contact) split the strip's full width among themselves via `flex-1`,
instead of sharing it six ways with Home — more room each, especially
on wider screens. **Briefly moved to the right end of the strip, then
moved back to the left — the right-end move was a mistake ("I meant
the home page button should be on the left side"), corrected the same
turn it was flagged.** `navItems` in `NavBar.tsx` has Home first
again, matching where it's always been; only the squareness (not the
position) was the actual lasting change here.

**Nav bar now fills its strip completely, per the owner.** The
padding that used to wrap `{nav}` in `JumbotronFrame.tsx`
(`px-4 py-3 sm:py-4`) is gone — the six scoreboard segments now sit
flush against the frame's own border on all sides instead of being
inset within it. Verified via `getComputedStyle` (`padding: 0px` on
the nav panel, and the Home button's own bounding box sitting exactly
at the panel's edge, offset only by the *outer frame's* border width,
not any nav-specific inset).

**Structural "bezel" borders switched from gold to light gray
(`#e5e5e5`) and thinned down, per the owner** — scoped specifically to
the borders that separate the jumbotron's physical panels from each
other, not every border on the site: the outer frame border, the
nav-bar/brand-strip and brand-strip/main-screen dividers, the bottom
bar's top border (all in `JumbotronFrame.tsx`), and
`NextEventTicker`'s two column dividers. Went from `3px`/`4px` (base/
`sm`) to `1px`/`2px`. Button borders, card borders (`PlayerCard`, the
About page's source cards), and the schedule table's border all stay
gold, untouched — those read as content sitting *on* a screen, not as
the bezel *between* screens, so the owner's "borders between
sections" phrasing didn't extend to them. Revisit if the owner meant
it more broadly than that.

**`NextEventTicker`'s center column restructured, per the owner.**
Was three stacked rows (date, "Kickoff {time}", "Tailgate {time}" or
"No Tailgate") plus Sign-Up. Now: the date spans its own top row: a
new two-column row underneath (`grid-cols-2`) shows Tailgate and
Kickoff side by side, each with its label above its value instead of
inline; then Sign-Up stays as its own row below that, same conditional
(`game.tailgate`) as before. When there's no tailgate for the game,
the Tailgate column's value reads "N/A" now instead of the old row's
"No Tailgate" sentence, to fit the label-above-value shape of the new
layout.

**Follow-up, per the owner: simplified back to three rows, supersedes
the two-column layout above.** Row 1 is now date and kickoff time
combined on one line ("Sat, Sep 12 • Kickoff TBD"), in a larger font
than before; Row 2 is "Tailgate: {time or N/A}" as one inline label:
value line, not the stacked label-above-value tile from the two-column
version; Row 3 stays Sign-Up, same conditional. Row 1 and Row 2 share
the exact same font size on purpose ("equal size fonts," per the
owner) — Sign-Up's own text size wasn't touched, since that's
`JumbotronButton`'s fixed sizing shared by every button on the site,
not something to change just for this one panel. The column switched
from `justify-center` to `justify-between` so the three rows spread
across the panel's full height instead of clustering together in the
middle, matching the owner's "should essentially fill the center
section vertically."

**Follow-up, per the owner: separator and label tweaks, plus real
placeholder times.** Row 2's "Tailgate: {time}" colon became a bullet
("Tailgate • {time}"), matching Row 1's own date/kickoff separator.
Row 1 now drops the "Kickoff" label entirely when there's no real time
yet — "Kickoff TBD" read redundant, so an unspecified kickoff just
shows a bare "TBD" now; once a real time is set it shows normally
("Kickoff 7:00 PM"). `lib/schedule.ts` got placeholder kickoff/tailgate
times for the Tennessee game specifically (7:00 PM / 3:00 PM, clearly
commented as placeholder, not a real announced time) so there was
actual non-TBD data to check the formatting against — every other game
stays TBD. Time format is `"7:00 PM"` (space before, uppercase AM/PM)
— the owner offered three options and left the choice to Claude; this
one matches the uppercase-tracking-wide style already used for labels
throughout the site.

**Follow-up, per the owner: "Kickoff" never appears at all now, not
even conditionally.** The previous pass still showed "Kickoff 7:00 PM"
once a real time existed — the owner clarified the word itself should
never be on screen, only the time. Row 1 is just `{date} • {kickoff}`
unconditionally now. Also added `mt-3` to the Sign-Up row specifically
(on top of the column's existing `justify-between` spacing) for more
clearance between it and the tailgate time above it.

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
Home (firetruck icon, pinned to the nav bar's left edge, not a text
label) · About/History · Schedule/Events · Donations · Book Us
(bringing the firetruck to weddings/parades/other paid events —
separate page, was called "Rental" until stage 7) · Contact ·
Sign Up/Register/Member Login (portal — reachable from the bottom
ticker and the schedule table, deliberately not its own nav link).
Partnerships/Sponsors is a section on Home, not a separate page. This
is the actual `NavBar` order (About before Schedule, Book Us before
Contact) per the owner — don't assume alphabetical or "build order"
matches nav order elsewhere in this doc.

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

## Typography — TODO: source the real GT Athletics fonts
Per GT Athletics' brand guide: **Proxima Nova** is the digital body-copy
typeface, **Zuume Cut** is the header/call-out typeface. Both are
commercial fonts (not on Google Fonts) and there's no license or font
files for either one yet. Per the owner's call, the site ships with free
Google Fonts standing in for now rather than blocking on licensing:
**Work Sans** for Proxima Nova, **Bebas Neue** for Zuume Cut. See the
layout/globals.css note in the "Design concept" section above for how
this is wired.

**Owner TODO, revisit when ready:** source actual Proxima Nova + Zuume
Cut font files (a purchased license from the foundry — Mark Simonson
Studio for Proxima Nova, Yellow Design Studio for Zuume — or an Adobe
Fonts/Typekit kit if Proxima Nova specifically is covered by an existing
Creative Cloud subscription). Once real files are self-hosted (or an
Adobe Fonts kit embedded) under the exact family names `"Proxima Nova"`
and `"Zuume Cut"`, the whole site picks them up automatically — the
`--font-body`/`--font-header` CSS variables in `globals.css` already
name those families first in their stacks, so no other code needs to
change when this happens.

Also worth a follow-up decision once the real fonts are in: right now
`.gt-font-header` (the header typeface) only applies to actual page
headings (the brand strip title, each page's top `<h2>`) — nav links,
buttons, and card text all still use the body typeface. The brand guide
allows Zuume Cut as a header/call-out font more broadly than that; ask
the owner whether it should extend to those too before doing it
unprompted.

## Music & Voiceover — TODO: source real audio
Two independent audio systems (separate state, separate purpose — music
keeps playing regardless of whether a voiceover is also active) that
now share **one persistent button row, bottom-center of the main
screen**, per the owner — this was two separate rows in two positions
for a stretch (top-right music, bottom-center-ish voice) before landing
here; if older context mentions that layout, it's superseded.

- **Site-wide background music** (`components/jumbotron/MusicPlayer.tsx`):
  Back/Play-Pause/Forward/Mute, icon-only, no text. Mounted once inside
  `JumbotronFrame`'s main screen rather than inside any individual page,
  so its React state and the underlying `<audio>` element never remount
  or restart on navigation — same reasoning `NavBar`/`NextEventTicker`
  already live in the root layout for.
- **Per-page voiceover narration** (still driven by `JumbotronCrawl`,
  gated behind its `showVoiceControls` prop, default `false`, wired on
  for `/about` only "for now" — the autoscroll itself still runs on
  every page unchanged, only these controls are opt-in): Voice-mute (a
  hand-drawn "person speaking" icon — head/shoulders + sound-wave arcs
  — distinct from the music player's plain speaker-cone icon, since
  these two mutes control unrelated things) and Replay, which restarts
  the page's typewriter/scroll now and will also restart the voiceover
  once that exists.

**Real architecture problem solved to combine them:** `JumbotronCrawl`
is nested deep inside `main` (page-scoped, remounts every navigation);
`MusicPlayer` is a sibling of `main` inside `JumbotronFrame` (frame-
scoped, must never remount). Neither is an ancestor of the other, so
they can't share state via ordinary props. Fixed with a small context,
`components/jumbotron/VoiceControlsContext.tsx`, provided once around
both `{main}` and `<MusicPlayer />` inside `JumbotronFrame`: when a page
has `showVoiceControls` on, its `JumbotronCrawl` registers
`{muted, toggleMuted, replay}` into the context (re-registering on every
`muted` change, so the registered value doesn't go stale) instead of
rendering its own buttons, and unregisters on unmount or the moment
`showVoiceControls` goes false. `MusicPlayer` reads whatever's
currently registered and renders those two buttons itself — right after
its own four, in the owner's exact order (Back, Play, Forward, Mute,
Voice, Replay) — only when something's actually there, so pages
without voiceover just show four buttons, not six with two dead ones.
The fade-to-black gradient behind the row lives in `JumbotronFrame` now
(was inside `JumbotronCrawl`, gated to voice pages) and is
unconditional, since the row itself is universal.

**All six buttons are 50% smaller, per the owner** — `h-7 w-7 sm:h-8
sm:w-8` → `h-3.5 w-3.5 sm:h-4 sm:w-4` (verified 16px at the `sm`
breakpoint via `getBoundingClientRect`, exactly half the old 32px),
icons scaled down to match.

**Follow-up, per the owner: landed on a size between the two.** The
50%-smaller pass read too small, the original read too big —
`h-3.5 w-3.5 sm:h-4 sm:w-4` → `h-5 w-5 sm:h-6 sm:w-6`, icons bumped to
match (`h-[10px]`/`h-3` for the two icon sizes, up from `h-[7px]`/`h-2`).

**Owner TODO, revisit when ready — there's no actual audio for either
system yet:**
- Background music: `MusicPlayer.tsx`'s `TRACKS` array points at
  `/audio/music/track-1.mp3`, `-2.mp3`, `-3.mp3` — none of which exist.
  Real music is copyrighted intellectual property the same way the real
  fonts above are licensed property, so rather than pull in something
  without knowing it's cleared to use, this ships fully wired up and
  silent (`play()` rejections are caught so a missing file doesn't
  throw) until real files land. Drop 2-3 royalty-free or licensed mp3s
  into `public/audio/music/` with matching names (or edit `TRACKS` to
  point wherever they end up) and playback works with no other changes.
- Voiceover narration: still the same situation already noted in the
  "Future: announcer narration audio" section above (blocked on page
  copy being finalized, then generating audio via ElevenLabs or
  similar) — the Voice-mute toggle is real UI now, it just has nothing
  to actually mute yet.

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
