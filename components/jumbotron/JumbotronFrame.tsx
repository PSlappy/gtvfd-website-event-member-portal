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
        {/* nav bar */}
        <div className="flex shrink-0 items-center justify-center border-b-[3px] border-gt-gold bg-gt-navy px-4 py-3 sm:border-b-4 sm:py-4">
          {nav}
        </div>

        {/* home-team brand strip */}
        <div className="flex shrink-0 items-center justify-center border-b-[3px] border-gt-gold bg-black px-4 py-4 sm:border-b-4 sm:py-6">
          {brand}
        </div>

        {/* main screen */}
        <div className="relative flex-1 overflow-hidden bg-black">
          <div className="h-full overflow-y-auto overflow-x-hidden">
            {main}
          </div>
          {/* slow scanning light sweep, like a video signal refreshing */}
          <div
            aria-hidden
            className="gt-scan-sweep pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-transparent via-white/[0.05] to-transparent mix-blend-screen"
          />
        </div>

        {/* bottom info bar */}
        <div className="shrink-0 border-t-[3px] border-gt-gold sm:border-t-4">
          {bottomBar}
        </div>

        {/* LED pixel grid, over the whole board so every panel reads as one screen */}
        <div
          aria-hidden
          className="gt-pixel-grid pointer-events-none absolute inset-0 z-10 mix-blend-overlay"
        />
      </div>
    </div>
  );
}
