"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import {
  backgroundColorValue,
  backgroundImageValue,
} from "@/lib/navColorTokens";
import MusicPlayer from "./MusicPlayer";
import { useNavTheme } from "./NavThemeContext";
import SnakeTrail from "./SnakeTrail";
import { VoiceControlsProvider } from "./VoiceControlsContext";

/**
 * Full-viewport shell styled like a stadium video board: a nav bar strip,
 * a persistent home-team brand strip (like the school name across the
 * top of a real scoreboard), the main screen, and a bottom info bar. The
 * outer page never scrolls — if a page's content overflows, only the
 * main screen scrolls internally, while the frame, nav bar, brand
 * strip, and bottom bar stay fixed. `bottomBar` is expected to be
 * `NextEventTicker`, which owns its own three-panel layout.
 *
 * "use client" + `usePathname` gate the "Nav Settings" quick-link
 * (hidden on `/nav-settings` itself) and read the live nav-bar-
 * background color from `NavThemeContext` — this component has to be
 * rendered inside `<NavThemeProvider>` (see `app/layout.tsx`), not the
 * one creating it, since it needs to consume the same theme its own
 * `nav` prop's `NavBarButton`s do.
 */
export default function JumbotronFrame({
  nav,
  brand,
  main,
  bottomBar,
}: {
  nav: ReactNode;
  brand: ReactNode;
  main: ReactNode;
  bottomBar: ReactNode;
}) {
  const pathname = usePathname();
  const { theme } = useNavTheme();
  const navBarBackgroundStyle: CSSProperties = {
    backgroundColor: backgroundColorValue(theme.navBarBackground),
    backgroundImage: backgroundImageValue(theme.navBarBackground),
  };

  return (
    <VoiceControlsProvider>
      <div className="fixed inset-0 flex items-center justify-center bg-black p-2 sm:p-4">
        {/* ambient light bleeding off the video board onto the dark room */}
        <div
          aria-hidden
          className="gt-glow pointer-events-none absolute inset-2 -z-10 rounded-md bg-gt-gold/35 blur-[90px] sm:inset-4"
        />

        {/* Chase Ring on the site's entire outer border, per the owner
            — the same sweeping-comet effect used on buttons/cards
            elsewhere, just traced around the whole frame this time.
            Needs this non-overflow-hidden wrapper since the ring's
            ::before/::after extend outside the element's own box by
            design (that's how it traces the border from the outside)
            — same pattern as PlayerCard/the schedule table, not a new
            technique. The actual bordered/overflow-hidden frame keeps
            its own rounded-md unchanged inside it. */}
        <div className="gt-chase-ring h-full w-full rounded-md">
          <div className="relative flex h-full w-full flex-col overflow-hidden rounded-md border-[1px] border-gt-gray-light bg-black sm:border-2">
            {/* nav bar — its own screen behind the bezel, not shared with
            its neighbors. No padding here on purpose, per the owner —
            the six nav segments should fill this strip edge to edge,
            not sit inset within it. Background is the live
            "Nav Bar Background Color" setting from /nav-settings now
            (was a hardcoded bg-gt-navy class) — note this is
            practically invisible in the current edge-to-edge layout,
            since the segments cover the strip completely with no gap
            for it to show through; it's still wired up correctly for
            if that layout ever changes. */}
            <div
              className="relative flex shrink-0 items-stretch border-b-[1px] border-gt-gray-light sm:border-b-2"
              style={navBarBackgroundStyle}
            >
              {nav}
              <div
                aria-hidden
                className="gt-pixel-grid pointer-events-none absolute inset-0 z-10 mix-blend-overlay"
              />
            </div>

            {/* home-team brand strip */}
            <div className="relative flex shrink-0 items-center justify-center border-b-[1px] border-gt-gray-light bg-black px-4 py-4 sm:border-b-2 sm:py-6">
              {brand}
              <div
                aria-hidden
                className="gt-pixel-grid-screen pointer-events-none absolute inset-0 z-10 mix-blend-screen"
              />
            </div>

            {/* main screen */}
            <div className="relative flex-1 overflow-hidden bg-black">
              {/* Explicit z-10 here (matching the pixel grid's own z-10,
              which still wins on top since it's declared later in the
              DOM) is the real fix for the glow-orb bug noted below:
              any future decorative absolutely-positioned sibling
              added to this panel without its own z-index now reliably
              paints underneath actual page content, not above it. */}
              <div className="gt-no-scrollbar relative z-10 h-full overflow-y-auto overflow-x-hidden">
                {main}
              </div>
              {/* Spark Float — small gold/white glyphs drifting up and
              fading, an ambient background layer behind whatever's
              displayed here. Per the owner, adapted from the same
              reference site (there: green symbols tied to one badge;
              here: not tied to any element, just atmosphere for the
              whole screen). Fixed position/size/delay per particle so
              the set repeats forever with no JS driving it. */}
              <span
                aria-hidden
                className="gt-spark pointer-events-none text-lg text-gt-gold"
                style={{ left: "8%", bottom: "10%", animationDuration: "6s" }}
              >
                +
              </span>
              <span
                aria-hidden
                className="gt-spark pointer-events-none text-sm text-gt-gray-light"
                style={{
                  left: "22%",
                  bottom: "35%",
                  animationDuration: "5s",
                  animationDelay: "1.2s",
                }}
              >
                ·
              </span>
              <span
                aria-hidden
                className="gt-spark pointer-events-none text-base text-gt-gold"
                style={{
                  left: "38%",
                  bottom: "5%",
                  animationDuration: "7s",
                  animationDelay: "2.4s",
                }}
              >
                ✦
              </span>
              <span
                aria-hidden
                className="gt-spark pointer-events-none text-sm text-gt-gray-light"
                style={{
                  left: "55%",
                  bottom: "50%",
                  animationDuration: "5.5s",
                  animationDelay: "0.6s",
                }}
              >
                ·
              </span>
              <span
                aria-hidden
                className="gt-spark pointer-events-none text-lg text-gt-gold"
                style={{
                  left: "68%",
                  bottom: "18%",
                  animationDuration: "6.5s",
                  animationDelay: "3.1s",
                }}
              >
                +
              </span>
              <span
                aria-hidden
                className="gt-spark pointer-events-none text-sm text-gt-gray-light"
                style={{
                  left: "80%",
                  bottom: "40%",
                  animationDuration: "5s",
                  animationDelay: "1.8s",
                }}
              >
                ·
              </span>
              <span
                aria-hidden
                className="gt-spark pointer-events-none text-base text-gt-gold"
                style={{
                  left: "92%",
                  bottom: "8%",
                  animationDuration: "7.5s",
                  animationDelay: "4s",
                }}
              >
                ✦
              </span>
              <span
                aria-hidden
                className="gt-spark pointer-events-none text-sm text-gt-gray-light"
                style={{
                  left: "14%",
                  bottom: "60%",
                  animationDuration: "6s",
                  animationDelay: "2.9s",
                }}
              >
                ·
              </span>
              {/* Ambient glow orbs, behind the pixel grid — see gt-orb-glow
              in globals.css for why these exist. mix-blend-screen is
              load-bearing, not just stylistic: without it these paint
              as solid-ish colored panels stacked above the (non-
              positioned) content div — position:absolute content
              always paints above non-positioned siblings regardless
              of DOM order — and can fully obscure text depending on
              where it happens to sit on a given page (confirmed: it
              did exactly this on Contact's heading). Screen blend
              keeps them additive light only, same as the scan-sweep
              below, which never had this problem for the same
              reason. */}
              <div
                aria-hidden
                className="gt-orb-a pointer-events-none absolute -top-10 -right-10 h-56 w-56 rounded-full bg-gt-gold/10 blur-3xl mix-blend-screen"
              />
              <div
                aria-hidden
                className="gt-orb-b pointer-events-none absolute -bottom-12 -left-10 h-52 w-52 rounded-full bg-gt-gray-light/[0.07] blur-3xl mix-blend-screen"
              />
              <div
                aria-hidden
                className="gt-orb-c pointer-events-none absolute left-[-15%] top-1/3 h-36 w-36 rounded-full bg-gt-gold/[0.07] blur-3xl mix-blend-screen"
              />
              <div
                aria-hidden
                className="gt-orb-d pointer-events-none absolute bottom-1/4 right-[-12%] h-44 w-44 rounded-full bg-gt-gray-light/[0.06] blur-3xl mix-blend-screen"
              />
              {/* slow scanning light sweep, like a video signal refreshing */}
              <div
                aria-hidden
                className="gt-scan-sweep pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-transparent via-white/[0.05] to-transparent mix-blend-screen"
              />
              <div
                aria-hidden
                className="gt-pixel-grid-screen pointer-events-none absolute inset-0 z-10 mix-blend-screen"
              />
              {/* Snake Trail — bright dot-trails crawling across the LED
              grid, game-of-Snake style. See SnakeTrail.tsx for why
              it's a canvas rather than DOM nodes, and why it's
              deliberately left without a z-index. */}
              <SnakeTrail />
              {/* Fade the screen to black behind the media-controls row, so
              a page's own scrolling content doesn't clip abruptly
              behind the buttons — unconditional now (was gated to
              voiceover pages only, inside JumbotronCrawl) since
              MusicPlayer's row is universal. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-20 bg-gradient-to-t from-black via-black/70 to-transparent"
              />
              {/* Site-wide media controls — mounted here (not inside a
              page) so the music state and the underlying <audio>
              element never remount/restart on navigation, same
              reasoning as NavBar/NextEventTicker living in the root
              layout. Also renders the current page's Voice/Replay
              controls, if any, via VoiceControlsContext — see
              MusicPlayer.tsx. */}
              <MusicPlayer />
              {/* Quick jump to the nav bar's live theme settings from
              anywhere on the site, bottom-right so it doesn't collide
              with MusicPlayer's centered row. Hidden on /nav-settings
              itself (no point linking to where you already are).
              Replaces the old /nav-color-test quick-link now that
              that whole test page is gone — the settings screen is
              its replacement, per the owner, so this isn't temporary
              scaffolding the way that link was. Positioning lives on
              this plain wrapper, not the Link itself —
              `.gt-jumbotron-btn` hardcodes `position: relative`
              (needed elsewhere to lift buttons above the pixel-grid
              overlay) and, since it's defined later in globals.css
              than Tailwind's utilities, silently wins over an
              `absolute` class on the same element at equal
              specificity. Same reason MusicPlayer's row above keeps
              its own positioning on an outer div too. */}
              {pathname !== "/nav-settings" && (
                <div className="pointer-events-none absolute bottom-3 right-3 z-40">
                  <Link
                    href="/nav-settings"
                    className="gt-jumbotron-btn pointer-events-auto flex h-6 items-center rounded-full border-2 border-gt-gold bg-gt-navy px-2.5 text-[8px] font-bold uppercase tracking-wider text-gt-gold sm:h-7 sm:px-3 sm:text-[9px]"
                  >
                    Nav Settings
                  </Link>
                </div>
              )}
            </div>

            {/* bottom info bar — NextEventTicker applies its own per-panel
            pixel grid, since it owns three separate columns */}
            <div className="shrink-0 border-t-[1px] border-gt-gray-light sm:border-t-2">
              {bottomBar}
            </div>
          </div>
        </div>
      </div>
    </VoiceControlsProvider>
  );
}
