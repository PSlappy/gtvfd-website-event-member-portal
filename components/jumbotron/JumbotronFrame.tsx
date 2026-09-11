import type { ReactNode } from "react";

/**
 * Full-viewport shell styled like a stadium video board: a nav bar strip,
 * a persistent home-team brand strip (like the school name across the
 * top of a real scoreboard), the main screen, and a bottom info bar. The
 * outer page never scrolls — if a page's content overflows, only the
 * main screen scrolls internally, while the frame, nav bar, brand
 * strip, and bottom bar stay fixed. `bottomBar` is expected to be
 * `NextEventTicker`, which owns its own three-panel layout.
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
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black p-2 sm:p-4">
      {/* ambient light bleeding off the video board onto the dark room */}
      <div
        aria-hidden
        className="gt-glow pointer-events-none absolute inset-2 -z-10 rounded-md bg-gt-gold/35 blur-[90px] sm:inset-4"
      />

      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-md border-[3px] border-gt-gold bg-black sm:border-4">
        {/* nav bar — its own screen behind the gold bezel, not shared
            with its neighbors */}
        <div className="relative flex shrink-0 items-center justify-center border-b-[3px] border-gt-gold bg-gt-navy px-4 py-3 sm:border-b-4 sm:py-4">
          {nav}
          <div
            aria-hidden
            className="gt-pixel-grid pointer-events-none absolute inset-0 z-10 mix-blend-overlay"
          />
        </div>

        {/* home-team brand strip */}
        <div className="relative flex shrink-0 items-center justify-center border-b-[3px] border-gt-gold bg-black px-4 py-4 sm:border-b-4 sm:py-6">
          {brand}
          <div
            aria-hidden
            className="gt-pixel-grid-screen pointer-events-none absolute inset-0 z-10 mix-blend-screen"
          />
        </div>

        {/* main screen */}
        <div className="relative flex-1 overflow-hidden bg-black">
          <div className="gt-no-scrollbar h-full overflow-y-auto overflow-x-hidden">
            {main}
          </div>
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
        </div>

        {/* bottom info bar — NextEventTicker applies its own per-panel
            pixel grid, since it owns three separate columns */}
        <div className="shrink-0 border-t-[3px] border-gt-gold sm:border-t-4">
          {bottomBar}
        </div>
      </div>
    </div>
  );
}
